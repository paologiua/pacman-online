# pacman_online
**pacman_online** è un gioco in più giocatori ispirato dallo storico gioco PacMan. I giocatori possono essere sia PacMan, sia un Ghost. In ogni caso l'obbiettivo del gioco è fare il punteggio maggiore. Il punteggio di un giocatore aumenta:
 * raccogliendo le palline (+1 punto);
 * raccogliendo le ciliegie che appaiono in un punto casuale della mappa (+10 punti).
 
La partita termina quando tutte le palline sono state raccolte.

### Requisiti
Prima di proseguire, è necessario installare **nodejs**, che è possibile scaricare dal [sito ufficiale](https://nodejs.org/).

## Come eseguire il progetto
Il primo passo è clonare l'intero progetto.
```
$ git clone https://github.com/paologiua/pacman_online.git
```
Quindi spostarsi nella cartella pacman_online
```
$ cd pacman_online
```
e da qui avviare il server
```
$ node server.js
```

Quest'ultimo sarà in ascolto sulla porta 5000.
Quindi è possibile visualizzare il client da un browser installato nello stesso host che esegue il server, andando all'indirizzo **localhost:5000**, 
oppure da un browser di un host nella stessa rete locale del server.

In questo caso è necessario visualizzare l'indirizzo ip del server.
Su linux è possibile usare
```
$ hostname -I | cut -d' ' -f1
```
ottenendo un indirizzo del tipo 192.168.x.x.

E' quindi possibile visualizzare il client da un browser installato in un secondo host, andando all'indirizzo **192.168.x.x:5000**.
## Front-end
In generale per il front-end sono stati utilizzati JavaScript, CSS e HTML. Inoltre Bootstrap è stato utile per implementare il sistema a colonne e NES.css per alcuni elementi grafici in stile retro-game.
#### Responsive
Tutta l'interfaccia è stata pensata per essere pienamente funzionante su qualsiasi risoluzione. E' possibile giocare a pacman_online sia da computer, ma anche da dispositivi mobili, come smartphone e tablet.
#### Smartphone:
![alt text](https://imgur.com/download/0Hc68Aq/) ![alt text](https://imgur.com/download/EcT8qXI/)

![alt text](assets/img/mobile_game_page) ![alt text](https://imgur.com/download/EcT8qXI/)
## Back-end
Come già accennato, il back-end è basato su nodejs

**Tutta la comunicazione tra client e server avviene sfruttando Socket.IO, una libreria Javascript per applicazioni web in tempo reale. Comprende una comunicazione bidirezionale realtime tra i web client e i server. È formata da due parti: una libreria lato client che gira sul browser e una libreria lato server per Node.js.**
