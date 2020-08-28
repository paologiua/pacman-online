import { Map } from './map.js';
import { PacMan, Ghost } from './figure.js';

(() => {
  var socket = io();

  socket.io.on('connect_error', function(err) {
    // handle server error here
    console.log('Error connecting to server');
    location.reload();
  });

  var map = new Map();

  (function(window, location) {
    history.replaceState(null, document.title, location.pathname+"#!/history");
    history.pushState(null, document.title, location.pathname);

    window.addEventListener("popstate", function() {
      if(location.hash === "#!/history") {
        history.replaceState(null, document.title, location.pathname);
        setTimeout(function(){
          location.replace("/");
        },10);
      }
    }, false);
  }(window, location));

  var nickname_val = null;
  var game_number = null;

  let menu_page = $('#menu_page');
  let host_button = $('#host_button');
  let join_button = $('#join_button');

  let nickname_page = $('#nickname_page');
  let dark_nickname_field = $('#dark_nickname_field');
  let nickname_button = $('#nickname_button');

  let game_number_page = $('#game_number_page');
  let dark_game_number_field = $('#dark_game_number_field');
  let game_number_button = $('#game_number_button');

  let player_list_page = $('#player_list_page');

  let play_button = $('#play_button');

  let canvas = $('#canvas');
  let swipe_info = $('#swipe_info');

  host_button.click(function () {
    createNewGame();
    hideMenu();
    showNicknamePage();
  });

  join_button.click(function () {
    hideMenu();
    showGameNumberPage();
  });

  function hideMenu() {
    host_button.off();
    join_button.off();
    menu_page.css("display", "none");
  }

  function showNicknamePage() {
    $(document).off();

    function send() {
      nickname_val = dark_nickname_field.val();
      console.log(nickname_val);
      checkNickname();
    }

    nickname_button.click(function() {
      send();
    });

    $(document).on('keypress',function(e) {
      if(e.which == 13) {
        send();
      }
    });

    dark_nickname_field.val('');
    nickname_page.css("display", "inline-block");
    dark_nickname_field.focus();
  }

  function hideNicknamePage() {
    nickname_button.off();
    nickname_page.css("display", "none");
  }

  function showGameNumberPage() {
    function send() {
      game_number = dark_game_number_field.val();
      console.log(game_number);
      checkGameNumber();
    }

    game_number_button.click(function() {
      send();
    });

    $(document).on('keypress',function(e) {
      if(e.which == 13) {
        send();
      }
    });

    dark_game_number_field.val('');
    game_number_page.css("display", "inline-block");
    dark_game_number_field.focus();
  }

  function hideGameNumberPage() {
    game_number_button.off();
    game_number_page.css("display", "none");
  }

  function showListPlayerPage() {
    $(document).off();
    play_button.click(function() {
      socket.emit('start game', game_number);
    });

    player_list_page.css("display", "inline-block");
    $('#game_number').html(game_number);

    socket.on('running', function (map_matrix) {
      hideListPlayerPage();
      showCanvas();
      startGame(map_matrix);
    });
  }

  function hideListPlayerPage() {
    play_button.off();
    player_list_page.css("display", "none");
  }

  function showCanvas() {
    canvas.css("display", "inline-block");
    swipe_info.addClass('mobile');
  }

  function disablePlayButton() {
    play_button.prop('disabled', true);
    play_button.removeClass('is-success');
    play_button.addClass('is-disabled');
  }

  function enablePlayButton() {
    play_button.prop('disabled', false);
    play_button.removeClass('is-disabled');
    play_button.addClass('is-success');
  }

  socket.on('connected users', function(data) {
    if(data.game_number === game_number) {
      let i = 1;
      enablePlayButton();
      for(let key in data.participants) {
        if(data.participants[key].nickname)
          $('#pl' + i++).html(data.participants[key].nickname);
        else {
          disablePlayButton();
          $('#pl' + i++).html('...');
        }
      
      }
      while(i <= 4)
        $('#pl' + i++).html('');
    } 
  });

  function createNewGame() {
    socket.emit('new game');
  }

  socket.on('game number', function(n) {
    game_number = n;
    console.log(game_number)
  });

  function checkGameNumber() {
    socket.emit('check game number', game_number);
  }

  socket.on('valid game number', function(error) {
    if(!error) {
      hideGameNumberPage();
      showNicknamePage();
    } else {
      dark_game_number_field.addClass('is-error');
      $('#game_number_error').html(error);
    }
  });

  function checkNickname() {
    socket.emit('check nickname', nickname_val);
  }

  socket.on('valid nickname', function(error) {
    if(!error) {
      hideNicknamePage();
      showListPlayerPage();
    } else {
      dark_nickname_field.addClass('is-error');
      $('#nickname_error').html(error);
    }
  });
/*
  function setController(movement) {
    if(screen.width <= 768) { //&& window.innerWidth <= 768) {
      //if(window.innerWidth <= 768) {
      $('#controller').css("display", "inline");
      $('#left_button').click(function () {
        movement.left = true;
        socket.emit('movement', movement);
        movement.left = false;
      });

      $('#right_button').click(function () {
        movement.right = true;
        socket.emit('movement', movement);
        movement.right = false;
      });

      $('#up_button').click(function () {
        movement.up = true;
        socket.emit('movement', movement);
        movement.up = false;
      });

      $('#down_button').click(function () {
        movement.down = true;
        socket.emit('movement', movement);
        movement.down = false;
      });
    }
  }
*/
  function setSwipe(movement) {
    document.addEventListener('swiped-left', function(e) {
      console.log(e.target); // the element that was swiped
      movement.left = true;
      socket.emit('movement', movement);
      movement.left = false;
    });
    
    document.addEventListener('swiped-right', function(e) {
      console.log(e.target); // the element that was swiped
      movement.right = true;
      socket.emit('movement', movement);
      movement.right = false;
    });
    
    document.addEventListener('swiped-up', function(e) {
      console.log(e.target); // the element that was swiped
      movement.up = true;
      socket.emit('movement', movement);
      movement.up = false;
    });
    
    document.addEventListener('swiped-down', function(e) {
      console.log(e.target); // the element that was swiped
      movement.down = true;
      socket.emit('movement', movement);
      movement.down = false;
    });

  }

  function printBackground(ctx) {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, 27, 23);
  }

  var get_scores = true;

  function getScores(data) {
    let content = '<table>';
    for(let key in data.obj) {
      let user = data.obj[key];

      let img = '<img ' + (user.nickname !== nickname_val ? 'class="user_img"' : 'class="user_img my_user_img" ');

      switch(user.player.color) {
        case 'red':  
          img += 'src="assets/img/ghost/blinky_1.png"> ';
          break;
        case 'yellow': 
          img += 'src="assets/img/ghost/clyde_1.png"> ';
          break;
        case 'green':
          img += 'src="assets/img/ghost/inky_1.png"> ';
          break;
        case 'pink':
          img += 'src="assets/img/ghost/pinky_1.png"> ';
          break;
        default:
          img += 'src="assets/img/pacman/pacman_2r.png"> ';
          break;
      }

      if(user.nickname !== nickname_val) {
        content += '<tr>' +
                      '<td>' + 
                        img + user.nickname + ':' + 
                      '<td/>' + 
                      '<td class="score_' + user.nickname + '" style="width: 50px;">' +
                         user.player.points + 
                      '</td>' +
                    '</tr> ';
      } else {
        $('#my_score').html('<h2>' + img + user.nickname + ': <span class="score_' + user.nickname + '">' + user.player.points + '</span><br></h2>')
      }
    }
    content += '</table>';
    $('.other_scores').html(content);
  }

  function updateScores(data) {
    for(let key in data.obj) {
      let user = data.obj[key];
      $('.score_' + user.nickname).html(user.player.points);
    }
  }

  function startGame(map_matrix) {
    socket.emit('new player');
    
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const SCALE_F = 30;

    ctx.scale(SCALE_F, SCALE_F);

    printBackground(ctx);
    map.setMatrix(map_matrix);
    map.print(ctx);

    var movement = {
      up: false,
      down: false,
      left: false,
      right: false
    }

    var last_key = null;

    //setController(movement);
    setSwipe(movement);

    document.addEventListener('keydown', function (event) { 
      switch (event.keyCode) {
        case 37: // A
          movement.left = true;
          break;
        case 38: // W
          movement.up = true;
          break;
        case 39: // D
          movement.right = true;
          break;
        case 40: // S
          movement.down = true;
          break;
      }
      if(last_key !== event.keyCode)
        if(movement.left || movement.up || movement.right || movement.down) {
          socket.emit('movement', movement);
          last_key = event.keyCode; 
        }
    });

    document.addEventListener('keyup', function (event) { console.log("Dentro")
      switch (event.keyCode) {
        case 37: // A 65
          movement.left = false;
          break;
        case 38: // W 87
          movement.up = false;
          break;
        case 39: // D 68
          movement.right = false;
          break;
        case 40: // S 83
          movement.down = false;
          break;
      }

      last_key = event.keyCode; 
    });

    var figure = {};
    var figuresToBeDeleted = [];

    var participants = null;
    var old_participants = null;
    var timeServer = null;
    var cont = 0;
    socket.on('state', function (locations) {
      old_participants = participants;
      timeServer = (timeServer === null ? locations.time : (timeServer + locations.time) / 2); //(timeServer + locations.time) / 2; 
      participants = locations.obj;
      cont = 0;

      for (var id in old_participants) {
        var old_player = old_participants[id].player;

        ctx.fillStyle = 'black';
        ctx.fillRect(Number((~~old_player.pos.x - 0.1).toFixed(2)), Number((~~old_player.pos.y - 0.1).toFixed(2)), 1.2, 1.2);
        ctx.fillRect(Number((old_player.pos.x - 0.1).toFixed(2)), Number((old_player.pos.y - 0.1).toFixed(2)), 1.2, 1.2);
        
      }
      for (var id in participants) {
        if(id in figure)
          figure[id].print(ctx);
      }

      figuresToBeDeleted.forEach(function (id, index) {
        if(!(id in figuresToBeDeleted)) {
          figure[id].clear(ctx);
          delete figure[id];
          figuresToBeDeleted.splice(index, 1);
        }
      });
      

      if(get_scores) {
        getScores(locations);
        get_scores = false;
      } else {
        updateScores(locations);
      }
    });

    socket.on('player out', function (id) {
      get_scores = true;
      figuresToBeDeleted.push(id);
    });

    socket.on('end game', function(data) {
      $('#winner').html(data.nickname);
      $('#win').css("display", "inline-block");
    });

    var lastUpdateTime = (new Date()).getTime();
    var timeClient = -1
    setInterval(function () {
      var currentTime = (new Date()).getTime();
      var timeDifference = currentTime - lastUpdateTime;

      timeClient = (timeClient === -1 ? timeDifference : (timeClient + timeDifference) / 2);

      let time = timeServer / timeClient;
      if(cont <= time) {
        for (var id in participants) {
          var player = participants[id].player;
          //console.log(player)

          if(figure[id] == undefined) {
            if(player.role === 'pacman')
              figure[id] = new PacMan(player.pos.x, player.pos.y);
            else
              figure[id] = new Ghost(player.pos.x, player.pos.y, player.color);
          }
          
          figure[id].clear(ctx)

          let starting_position = ( old_participants !== null ? old_participants[id].player.pos : player.pos );
          let end_position = player.pos;

          let delta_x = (end_position.x - starting_position.x);
          let delta_y = (end_position.y - starting_position.y);
          
          if(delta_x > map.matrix[0].length / 2 || -delta_x > map.matrix[0].length / 2)
            delta_x = 0;

          figure[id].updatePosition(starting_position.x + (delta_x * cont) / time, starting_position.y + (delta_y * cont) / time);
          figure[id].direction = player.direction;
          figure[id].updateImg();
        }

        map.printDoor(ctx);

        for (var id in participants) {
          figure[id].print(ctx);
        }
        cont++;
      }
      lastUpdateTime = currentTime;
    }, 15);
  }

})();
