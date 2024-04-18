
// Dependencies
let Games = require('./games').Games;
let GameMap = require('./map').Map;

var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');


var app = express();
var server = http.Server(app);
var io = socketIO(server);

app.set('port', 5000);
app.use('/', express.static(path.join(__dirname, '../client/build/')));

// Routing
app.get('/', function (request, response) {
  response.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// Starts the server.
server.listen(5000, function () {
  console.log('Starting server on port 5000');
});

// Questo oggetto permette la gestione di tutte le stanze di gioco
var games = new Games;

/*
* Gestione di una nuova connessione
*/
io.on('connection', function (socket) {
  console.log('User [', socket.id, '] connected');
  /*
  * Crea una nuova stanza quando un utente lo richiede
  */
  socket.on('new game', function () {
    let game_number = games.generateGame(socket.id);
    io.emit('get games list', games.getGamesAvailable());
    socket.emit('game number', game_number);
    socket.join(game_number);
    console.log('Game #' + game_number + ' created');
  });

  /*
  * Controlla la validità di un numero di stanza
  */
  socket.on('check game number', function (game_number) {
    let error = games.checkGameNumber(game_number, socket.id);
    socket.emit('valid game number', error);
    if(!error) {
      io.emit('get games list', games.getGamesAvailable());
      socket.join(game_number);
      io.to(game_number).emit('connected users', { 'game_number' : game_number, 'participants' : games.getUsersInAGameSession(game_number) });
    }
  });
  
  /*
  * Controlla la validità di un nickname
  */
  socket.on('check nickname', function (nickname) {
    let game_number = games.getUserGameNumber(socket.id);
    let error = games.checkNickname(game_number, nickname);

    if(!error) {
      games.setUserNickname(game_number, socket.id, nickname);
      
      io.to(game_number).emit('connected users', { 'game_number' : game_number, 'participants' : games.getUsersInAGameSession(game_number) });
    }

    socket.emit('valid nickname', error);
  });

  socket.on('request games list', function () {
    socket.emit('get games list', games.getGamesAvailable());
  });

  /*
  * Carica i dati della mappa e imposta una sessione di gioco
  * come iniziata
  */
  socket.on('start game', function (game_number) {
    if(games.has(game_number) && !games.game_session[game_number].started) {
      games.setGameStarted(game_number, true);
      console.log('Game #' + game_number + ' started');
      io.emit('get games list', games.getGamesAvailable());
      games.get(game_number).map = new GameMap;
      io.to(game_number).emit('running', games.get(game_number).map.matrix);
    }
  });
  
  /*
  * Rende un utente un giocatore di una sessione di gioco
  */
  socket.on('new player', function () {
    let game_number = games.getUserGameNumber(socket.id);
    if(game_number) {
      games.get(game_number).userPlays(socket.id);
      console.log('Player [', socket.id, '] in game #' + game_number);
    }
  });

  /*
  * Riceve da un client i suoi spostamenti e li applica a una 
  * sessionde di gioco in corso
  */
  socket.on('movement', function (data) {
    let game_participants = games.getUsersInAGameSession(games.getUserGameNumber(socket.id));
    if(game_participants) {
      var player = game_participants[socket.id].player;

      if(player) {
        if (data.left) {
          player.nextLeft();
        }
        if (data.up) {
          player.nextUp();
        }
        if (data.right) {
          player.nextRight();
        }
        if (data.down) {
          player.nextDown();
        }
      }
    }
  });

  /*
  * Gestisce la disconnesione di un giocatore
  */
  socket.on ('disconnect', function () { 
    let game_number = games.getUserGameNumber(socket.id);
    games.removeUser(game_number, socket.id);
    if(!games.has(game_number))
      io.emit('get games list', games.getGamesAvailable());
    io.to(game_number).emit('connected users', { 'game_number' : game_number, 'participants' : games.getUsersInAGameSession(game_number) });
    io.to(game_number).emit('player out', socket.id);
    console.log('User [', socket.id, '] out');
  }); 
});

const INTERVAL = 150;

var lastUpdateTime = (new Date()).getTime();
/*
* Gestisce e aggiorna la situazione di tutte le sessioni di gioco in corso
*/
setInterval(function () {
  var currentTime = (new Date()).getTime();
  var timeDifference = currentTime - lastUpdateTime;
  
  for(let game_number in games.game_session) {
    let game = games.game_session[game_number];
    if(game.animationHasStartedNow())
      io.to(game_number).emit('dead pacman animation start')

    
    if(game.animationIsOverNow()) 
      io.to(game_number).emit('dead pacman animation end')
    

    game.decreaseVulnerabilityTime(timeDifference);
    game.lowVulnerabilityTime();

    if(game.started && game.playersReady() && game.animationEnd(timeDifference)) {
      let participants = games.getUsersInAGameSession(game_number);
      for(let i = game.pacman_number; i === game.pacman_number || i % game.length() !== game.pacman_number; i++) {
        let player = participants[Object.keys(participants)[i % game.length()]].player;
        if(player && !player.decreaseRecoveryTime(timeDifference)) {
          player.updateDirection(games.get(game_number).map);
          player.move(game.map);
          game.updateGameProgress();
          if(game.lost_life)
            break;
        }
      }
      io.to(game_number).emit('state', { obj: participants, time: timeDifference});

      if(game.lost_life) {
        game.repositionPlayers();
        io.to(game_number).emit('state', { obj: participants, time: timeDifference});
      }

      let cherry = game.map.updateCherryTime(timeDifference);
      if(cherry) 
        io.to(game_number).emit('element', cherry);

      if(game.endGameCheck()) {
        io.to(game_number).emit('end game', { pacman_score: game.pacman.points, pacman_wins: Boolean(game.pacman.player.life)});
        games.remove(game_number);
      }

    }
  }
  lastUpdateTime = currentTime;
}, INTERVAL);
