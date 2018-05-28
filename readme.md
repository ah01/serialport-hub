# Serial Port Hub

![status](https://img.shields.io/badge/Developer_Status-PoC-orange.png?longCache=true&style=flat)

*Aplikace pro přeposílání zpráv mezi několika sériovými porty.*

Aplikace otevře zadaný seznam sériových portů a přeposílá *zprávy*, které přijdou na libovolném z nich na všechny ostatní. 

*Zpráva* je libovolný text oddělený znakem `\n`, tzn. co zpráva to jeden řádek textu. Pokud zpráva začíná na znak `#` považuje se za log a nepřeposílá se (pouze se vypíše).

Aplikací je možné spustit s parametrem  `--tcp <port>`, kdy se pak chová zároveň jako TCP server a přeposílá zprávy rovněž od všech TCP klientů, kteří se připojí.

## Motivace

V rámci [bastlírny](http://macgyver.sh.cvut.cz/) čas od času pořádáme kurzy programování **Arduina** a poslední dobou k tomu používáme [EduShiled](https://www.edushield.cz/cs/). Pro pokročilejší témata by se nám hodil nějaký pěkný komplexnější příklad. Něco víc než "*blikání LEDovou diodou*" nebo *semafor se třemi LED*. Protože EduShiledů máme větší množství, nabízí se myšlenka propojit je dohromady. 

Ideální by bylo použít Ethernet Shield (se kterým je EduShiled kompatibilní) - jenže těch už věští množství nemáme. Další možnost je využít I2C nebo SPI. To by bylo sicel hezké (a náš HW duch by zajásal), jenže to vyžaduje buď úpravu EduShiledu nebo netriviální drátování (rozuměj, není to blbuvzdorné). Zbývá USB resp. **seriový port**. 

## Příklady

### Schodišťový spínač

Připojíme 3 a více Arduin. Cílem je ovládat *světlo* (bílou kombinaci RGB LED) pomocí tlačítek. Pokud stisknu tlačítko na libovolném EduShiledu musí se rozsvítit/zhasnout světlo na všech.

Pokročilejší varianta může řešit automatické zhasnutí a prodloužení času při opětovném stisku tlačítka.

### Semafor pro chodce 

Připojíme 3 Arduina. Jedno bude semafor  pro chodce s tlačítkem (červená, zelená), druhé semafor pro vozidla (červená, oranžová, zelená) a třetí je bude řídit. Stiskem tlačítka na řídícím Arduinu se bude přepínat mezi řízením provozu a blikáním oranžové. Stisk tlačítka pro chodce asi není třeba popisovat.

## Příklad komunikačního protokolu

*Serial Port Hub* se chová jako skutečný [síťový hub](https://cs.wikipedia.org/wiki/Hub). Rozumí tomu, co je zpráva (~ řádek textu), ale co je uvnitř ho už nezajímá. 

To nám stačí pokud nepotřebujeme komunikovat s konkrétním Arduinem v naší "síti" a zprávu vždy posíláme všem. Příklad *schodišťového spínače* s touto funkcionalitou naprogramujeme, ale na *semafor pro chodce* nám to stačit nebude. Pro něj už budeme potřebovat podporu adresování.

Zpráva tak jak jí vidí HUB:

```
<zprava> \n
```

Zavedeme si do sítě adresování. Každé zařízení bude mít přiřazené jedinečné číslo jako adresu (můžeme je například uložit do EEPROM). Pak každá zpráva bude mít následující formát:

```
<zdroj> <cíl> <tělo> \n
```

Kde `<zdroj>` je adresa odesílatele zprávy, `<cíl>` je adresát zprávy a `<tělo>` je už samotné tělo zprávy. Občas se hodí mít možnost poslat zprávu všem (broadcast), v takovém případě použijeme jako *cíl* znak `*`.

Protože naše síť nebude moc velká, řekněme že adresa bude vždy jeden znak (0 - F), tzn. maximálně 16 zařízení. A adresu `0` necháme vyhrazenou pro HUB.

> V současnosti HUB sám žádné zprávy posílat neumí, ale řekněme, že by mohl posílat třeba boradcast zprávy o tom, že zařízení bylo odpojeno. Nebo by se mohl jednoho dne chovat jako switch nebo dokonce router a adresa `0` by mohla fungovat jako výchozí GW :)

Každé Arduino dostává všechny zprávy v síti. Musí při přijetí zprávy zkontrolovat, že je adresát a pokud ne, zprávu zahodit.

### Příklady

Arduino `1` posílá arduinu `2` zprávu `ON`.

```
1 2 ON \n
```

Protože arduino `2` ví, že zprávu mu poslalo arduino `1`, může mu odpovědět:

```
2 1 DONE \n
```

Arduino `1` posílá broadcast (= všem) zprávu `OFF`.

```
1 * OFF \n
```

