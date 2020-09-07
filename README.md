# pacman_online
**pacman_online** è un gioco multiplayer ispirato dall'omonimo videogame. 

In maniera casuale un giocatore viene scelto per diventare PacMan. Gli altri giocatori saranno dei Ghost e concorreranno contro PacMan

Il giocatore che interpreta Pac-Man deve mangiare tutti i numerosi puntini disseminati ordinatamente all'interno del labirinto e, nel far questo, deve evitare di farsi toccare dagli altri giocatori (che interpretano i fantasmi), pena la perdita immediata di una delle 3 vite a disposizione. Per facilitare il compito a PacMan sono presenti, presso gli angoli dello schermo di gioco, quattro "pillole" speciali ("power pills"), che rovesciano la situazione rendendo vulnerabili i fantasmi, che diventano blu per 7 secondi esatti; Il giocatore PacMan per guadagnare punti può in questa fase andare a caccia dei fantasmi, per mangiarli.

Una volta fagocitati, però, questi tornano alla base (il rettangolo al centro dello schermo), per rigenerarsi e attaccare di nuovo Pac-Man.
 
La partita termina quando PacMan:
 * raccoglie tutte le palline (sia normali che potenziate);
 * perde le sue 3 vite;
 * esce dalla partia.
 
Nel primo caso la partita è vinta da PacMan, negli altri due casi dai Ghost.

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
In generale per il front-end sono stati utilizzati JavaScript, CSS e HTML. Inoltre Bootstrap è stato utile per implementare il sistema a colonne, NES.css per alcuni elementi grafici in stile retro-game e JQuery per manipolare il DOM.
#### Responsive
Tutta l'interfaccia è stata pensata per essere pienamente funzionante su qualsiasi risoluzione. E' possibile giocare a pacman_online sia da computer, ma anche da dispositivi mobili, come smartphone e tablet.
#### Smartphone:
![alt text](assets/img/mobile_main_page.png) ![alt text](assets/img/mobile_game_page.png)
#### PC:
![alt text](assets/img/computer_main_page.png) ![alt text](assets/img/computer_game_page.png)
## Back-end
Come già accennato, il back-end è basato su nodejs

**Tutta la comunicazione tra client e server avviene sfruttando Socket.IO, una libreria Javascript per applicazioni web in tempo reale. Comprende una comunicazione bidirezionale realtime tra i web client e i server. È formata da due parti: una libreria lato client che gira sul browser e una libreria lato server per Node.js.**

## Come avviare una nuova partita e giocare con gli amici
Tramite il pulsante New Game è possibile creare una nuova partita. A questo punto sarà visibile un codice tramite il quale altri giocatori potranno accedere alla stessa partita e divertirsi insieme, cliccando il tasto Join Game.
