# pacman_online
**pacman_online** is a multiplayer game inspired by the video game of the same name.

Randomly a player is chosen to become PacMan. The other players will be Ghosts and will compete against PacMan

The player who plays Pac-Man must eat all the numerous dots scattered neatly inside the maze and, in doing so, must avoid being touched by the other players (who play ghosts), in order not to lose one of the 3 lives. To help PacMan, there are four special "power pills", which turn the situation around by making the ghosts vulnerable, which turn blue for exactly 7 seconds; The PacMan player to earn points can in this phase go hunting for ghosts, to eat them.

After being eaten, they return to base (the rectangle in the center of the screen), to regenerate and attack Pac-Man again.
 
The game ends when PacMan:
 * collects all balls (both normal and special);
 * loses his 3 lives;
 * leaves the party.
 
In the first case the game is won by PacMan, in the other two cases by the Ghosts.

### Requisiti
Prima di proseguire, è necessario installare **nodejs**, che è possibile scaricare dal [sito ufficiale](https://nodejs.org/).

### Requirements
Before continuing, you need to install **Node.js**, which you can download from the *[official site](https://nodejs.org/)*.

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
