# Serial Port Hub

![status](https://img.shields.io/badge/Status-PoC-orange.png?longCache=true&style=flat)

Aplikace otevře *N* sériových portů a přeposílá *zprávy*, které přijdou z libovolného portu na všechny ostatní. 
*Zpráva* je libovolný text oddělený znakem `\n`, tzn. co zpráva to jeden řádek textu.

## Motivace

V rámci [bastlírny](http://macgyver.sh.cvut.cz/) čas od času pořádáme kurzy programování **Arduina** a poslední dobou k tomu používáme [EduShiled](https://www.edushield.cz/cs/). Pro pokročilejší témata by se nám hodil nějaký pěkný komplexnější příklad. Něco víc než "*blikání LEDovou diodou*" nebo *semafor se třemi LED*. Protože EduShiledů máme větší množství, nabízí se myšlenka propojit je dohromady. 

Ideální by bylo použít Ethernet Shield (se kterým je EduShiled kompatibilní) - jenže těch už věští množství nemáme. Další možnost je využít I2C nebo SPI. To by bylo sicel hezké (a náš HW duch by zajásal), jenže to vyžaduje buď úpravu EduShiledu nebo netriviální drátování (rozuměj, není to blbuvzdorné). Zbývá USB resp. **seriový port**. 

## Použití

### Instalace

Potřebujete mít na počítači [node.js](https://nodejs.org/)

```bash
got clone https://github.com/ah01/serialport-hub.git
cd serialport-hub
npm install
```

### Použití

```bash
node index.js COM1 COM2 COM3 ...
```

## Příklady

### Schodišťový spínač

Připojíme 3 a více Arduin. Cílem je ovládat *světlo* (libovolnou LED) pomocí tlačítek. Pokud stisknu tlačítko na libovolném EduShiledu musí se rozsvítit/zhasnout světlo na všech. Pokročilejší varianta může řešit automatické zhasnutí a prodloužení času při opětovném stisku tlačítka.

**[examples/staircase-switch](examples/staircase-switch/staircase-switch.ino)**

### Semafor pro chodce 

Připojíme 3 Arduina. Jedno bude semafor  pro chodce s tlačítkem (červená, zelená), druhé semafor pro vozidla (červená, oranžová, zelená) a třetí je bude řídit. Stiskem tlačítka na řídícím Arduinu se bude přepínat mezi řízením provozu a blikáním oranžové. Stisk tlačítka pro chodce asi není třeba popisovat.

## Tipy

- Aplikací je možné spustit s parametrem  `--tcp <port>`, kdy se pak chová zároveň jako TCP server a přeposílá zprávy rovněž od všech TCP klientů, kteří se připojí. Hodí se pro debugování z PC.
- Pokud zpráva začíná na znak `#` považuje se za log a nepřeposílá se (pouze se vypíše). Hosí de pro debugování.
