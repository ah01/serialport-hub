# Serial Port Hub

![status](https://img.shields.io/badge/Developer_Status-PoC-orange.png?longCache=true&style=flat)

*Aplikace pro přeposílání zpráv mezi nekolika seriovými porty.*

Aplikace otevře zadaný seznam seriových portů a přeposílá zprávy, které přijdou na libovolném z nich na všechny ostatní. Zpráva je libovolný text oddělený znakem `\n` (`\r` se ignoruje), tzn. co zpráva to řádek textu. Pokud zpráva začíná na znak `#` považuje se za log a nepřeposílá se (pouze se vypíše do stdout).

Aplikací je možné spustit s parameterem `--tcp <port>`, kdy se pak chová zároveň jako TCP server a přeposílá zprávy rovňež od všech TCP klientů, kteří se připojí.
