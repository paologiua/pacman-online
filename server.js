
// Dependencies
let Games = require('./games').Games;
let Map = require('./map').Map;

var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');


var app = express();
var server = http.Server(app);
var io = socketIO(server);

app.set('port', 5000);
app.use('/', express.static(__dirname + '/'));

// Routing
app.get('/', function (request, response) {
  response.sendFile(path.join(__dirname, 'index.html'));
});

// Starts the server.
server.listen(5000, function () {
  console.log('Starting server on port 5000');
});

var games = new Games;

io.on('connection', function (socket) {
  socket.on('new game', function () {
    let game_number = games.generateGame(socket.id);
    socket.emit('game number', game_number);
    socket.join(game_number);
  });

  socket.on('check game number', function (game_number) {
    let error = games.checkGameNumber(game_number, socket.id);
    socket.emit('valid game number', error);
    if(!error) {
      socket.join(game_number);
      io.to(game_number).emit('connected users', { 'game_number' : game_number, 'participants' : games.getUsersInAGameSession(game_number) });
    }
  });

  socket.on('check nickname', function (nickname) {
    let game_number = games.getUserGameNumber(socket.id);
    let error = games.checkNickname(game_number, nickname);

    if(!error) {
      games.setUserNickname(game_number, socket.id, nickname);
      
      io.to(game_number).emit('connected users', { 'game_number' : game_number, 'participants' : games.getUsersInAGameSession(game_number) });
    }

    socket.emit('valid nickname', error);
  });

  socket.on('start game', function (game_number) {
    if(!games.game_session[game_number].started) {
      games.setGameStarted(game_number, true);
      games.get(game_number).map = new Map;
      io.to(game_number).emit('running', games.get(game_number).map.matrix);
    }
  });

  socket.on('new player', function () {
    let game_number = games.getUserGameNumber(socket.id);
    if(game_number) {
      games.get(game_number).userPlays(socket.id);
      console.log('Player [', socket.id, '] in game');
    }
  });

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

  socket.on ('disconnect', function () { 
    let game_number = games.getUserGameNumber(socket.id);
    games.removeUser(game_number, socket.id);

    io.to(game_number).emit('connected users', { 'game_number' : game_number, 'participants' : games.getUsersInAGameSession(game_number) });
    io.to(game_number).emit('player out', socket.id);
    console.log('Player [', socket.id, '] out');
  }); 
});

const INTERVAL = 150;

var lastUpdateTime = (new Date()).getTime();
setInterval(function () {
  var currentTime = (new Date()).getTime();
  var timeDifference = currentTime - lastUpdateTime;
  
  for(let game_number in games.game_session) {
    if(games.game_session[game_number].started) {
      let participants = games.getUsersInAGameSession(game_number);
      for(let key in participants) {
        player = participants[key].player;
        if(player) {
          player.updateDirection(games.get(game_number).map);
          player.move(games.get(game_number).map);
        }
      }
      games.game_session[game_number].updateGameProgress();

      let cherry = games.game_session[game_number].map.updateCherryTime(timeDifference);
      if(cherry) 
        io.to(game_number).emit('element', cherry);

      if(games.game_session[game_number].endGameCheck()) {
        io.to(game_number).emit('end game', games.game_session[game_number].getWinningUser());
        games.remove(game_number);
      }
      io.to(game_number).emit('state', { obj: participants, time: timeDifference});
    }
  }
  lastUpdateTime = currentTime;
}, INTERVAL);
