
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

var map = new Map;
var games = new Games;

function generateGame(socket_id) {
  let game_number = null;

  do {
    game_number = "#" + ~~(Math.random() * 100000);

    while(game_number.length < 6)
      game_number += '0';
  
  } while(game_number in games);

  games.add(game_number);
  games.addUser(game_number, socket_id);

  return game_number;
}

function checkGameNumber(game_number, socket_id) {
  return games.addUser(game_number, socket_id);
}

function checkNickname(game_number, nickname) {
  if(games.findUserInAGameSessionByNickname(game_number, nickname) !== null || 
      nickname.length > 8 || nickname.length < 3)
    return false;
  return (nickname.match("^[A-Za-z0-9]+$") !== null);
}

io.on('connection', function (socket) {
  socket.on('new game', function () {
    let game_number = generateGame(socket.id);
    socket.emit('game number', game_number);
    socket.join(game_number);
  });

  socket.on('check game number', function (game_number) {
    let game_number_ok = checkGameNumber(game_number, socket.id);
    socket.emit('valid game number', game_number_ok);
    if(game_number_ok) {
      socket.join(game_number);
      io.to(game_number).emit('connected users', { 'game_number' : game_number, 'participants' : games.getUsersInAGameSession(game_number) });
    }
  });

  socket.on('check nickname', function (nickname) {
    let game_number = games.getUserGameNumber(socket.id);
    let check_nickname = checkNickname(game_number, nickname);

    if(check_nickname) {
      games.setUserNickname(game_number, socket.id, nickname);
      
      io.to(game_number).emit('connected users', { 'game_number' : game_number, 'participants' : games.getUsersInAGameSession(game_number) });
    }

    socket.emit('valid nickname', check_nickname);
  });

  socket.on('start game', function (game_number) {
    games.setGameStarted(game_number, true);
    io.to(game_number).emit(game_number + ' running', map.matrix);
  });

  socket.on('new player', function () {
    let game_number = games.getUserGameNumber(socket.id);
    if(game_number) {
      games.getUsersInAGameSession(game_number)[socket.id].play();
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

var lastUpdateTime = (new Date()).getTime();
const INTERVAL = 150;
setInterval(function () {
  var currentTime = (new Date()).getTime();
  var timeDifference = currentTime - lastUpdateTime;
  
  for(let game_number in games.game_session) {
    let participants = games.getUsersInAGameSession(game_number);
    for(let key in participants) {
      player = participants[key].player;
      if(player) {
        player.updateDirection(map);
        player.move(map);
      }
    }
    io.to(game_number).emit('state ' + game_number, { obj: participants, time: timeDifference});
  }
  lastUpdateTime = currentTime;
}, INTERVAL);
