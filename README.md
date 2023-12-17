# Slutexamination - DE-VE-DE

I denna slutexamination ska du skapa en sida åt det fiktiva företaget **DE-VE-DE** där man kan lägga till filmer man vill se, ta bort filmer man sett och se alla filmer man har sparat. Allt detta ska sedan sparas i Firebase databas.
## Funktionalitet

* Det ska gå och mata in i inputfält: `titel`, `genre`, `utgivningsdatum`.
* Kunna lägga till en film som sparas i din Firebase-databas.
* Kunna ta bort en film från din Firebase-databas.
* Kunna se alla filmer på sidan som hämtas från din Firebase-databas.
* Det ska inte kunna gå och lägga upp en film som redan finns alltså titeln får inte förekomma mer än en gång i din databas.
* Man ska kunna trycka på en film och välja att man sett den då ska egenskapen `watched` sättas till true i din databas på den filmen.

**Film**
|Fält|Datatyp|Beskrivning|
|---|---|---|
|title|Sträng|Filmens titel|
|genre|Sträng|Filmens genre|
|releaseDate|Sträng|Filmens utgivningsår|
|watched|Boolean|Om filmen setts eller ej, kan vara true eller false|

## Betygskriterier

### Godkänt
* All funktionalitet finns med.
* Att du använder Firebase.
* Sidan fungerar med inga fel i konsolen i developer tools.
* Vettiga namn på variabler etc på engelska.

### Väl godkänt
* Allt i godkänt.
* Att din kod är uppdelad i moduler där du har skrivit en kommentar i varje modul om varför du har delat upp som du gjort.
* Att det går att söka efter en specifik film via ett inputfält på titel. Sökningen ska göras mot din databas i Firebase.

## Inlämning
Inlämning sker senast **fredag 15/12 23.59** via en länk till ditt githubrepo på Learnpoint.
