# SerialNet

**Příklad komunikačního protokolu**

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

## Příklady

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

