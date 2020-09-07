import { Map } from './map.js';
import { PacMan, Ghost } from './figure.js';
import { GamesList } from './gameslist.js';

(() => {
  // Oggetto che ci permette di comunicare col server
  var socket = io();

  socket.io.on('connect_error', function(err) {
    // handle server error here
    console.log('Error connecting to server');
    location.reload();
  });

  var map = new Map();
  var gamesList = new GamesList($(document).height());

  var minimumPathsWorker = new Worker('assets/js/minimum_paths_algorithm.js');

  /*
  * Fa in modo che il tasto indietro ricarichi la pagina
  */
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

  /*
  * Rileva se il dispositivo in uso ha uno schermo touch
  */
  function isTouchDevice() {
    var prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');
    
    var mq = function (query) {
      return window.matchMedia(query).matches;
    }

    if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch)
      return true;

    var query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('');
    return mq(query);
}

  var nickname_val = null;
  var game_number = null;

// Elementi DOM manipolati
  let $menu_page = $('#menu_page');
  let $host_button = $('#host_button');
  let $join_button = $('#join_button');

  let $nickname_page = $('#nickname_page');
  let $dark_nickname_field = $('#dark_nickname_field');
  let $nickname_button = $('#nickname_button');

  let $game_number_page = $('#game_number_page');
  let $dark_game_number_field = $('#dark_game_number_field');
  let $game_number_button = $('#game_number_button');

  let $player_list_page = $('#player_list_page');

  let $play_button = $('#play_button');

  let $canvas = $('#canvas');

  let $join_page = $('#join_page');
  let $join_game_number_button = $('#join_game_number_button');
  let $list_games_button = $('#list_games_button');

  let $games_list_page = $('#games_list_page');

  let $games_list_controls = $('#games_list_controls');
  let $previous_games_list_page = $('#previous_games_list_page');
  let $next_games_list_page = $('#next_games_list_page');

// Funzioni di manipolazione della pagina HTML
  $host_button.click(function () {
    createNewGame();
    hideMenu();
    showNicknamePage();
  });

  $join_button.click(function () {
    hideMenu();
    showJoinPage();
  });

  function hideMenu() {
    $host_button.off();
    $join_button.off();
    $menu_page.css("display", "none");
  }

  function showNicknamePage() {
    $(document).off();

    function send() {
      nickname_val = $dark_nickname_field.val();
      console.log(nickname_val);
      checkNickname();
    }

    $nickname_button.click(function() {
      send();
    });

    $(document).on('keypress',function(e) {
      if(e.which == 13) {
        send();
      }
    });

    $dark_nickname_field.val('');
    $nickname_page.css("display", "inline-block");
    $dark_nickname_field.focus();
  }

  function hideNicknamePage() {
    $nickname_button.off();
    $nickname_page.css("display", "none");
  }

  function hideJoinPage() {
    $join_game_number_button.off();
    $list_games_button.off();
    $join_page.css("display", "none");
  }

  function showJoinPage() {
    $join_page.css("display", "inline-block");
    $join_game_number_button.click(function() {
      hideJoinPage();
      showGameNumberPage();
    });
    $list_games_button.click(function() {
      hideJoinPage();
      showGamesListPage();
    });
  }

  function hideGamesListPage() {
    socket.off('get games list');
    $games_list_page.css("display", "none");
    $games_list_controls.css("display", "none");
  }
  function removeGamesListPage() {
    $games_list_page.html('');
    $games_list_controls.html('');
  }

  function disablePreviousGamesListPage() {
    $previous_games_list_page.off();

    $previous_games_list_page.prop('disabled', true);
    $previous_games_list_page.removeClass('is-success');
    $previous_games_list_page.addClass('is-disabled');
  
  }

  function disableNextGamesListPage() {
    $next_games_list_page.off();

    $next_games_list_page.prop('disabled', true);
    $next_games_list_page.removeClass('is-success');
    $next_games_list_page.addClass('is-disabled');
  
  }

  function previousPage() {
    if(!gamesList.setPreviousPage())
      disablePreviousGamesListPage();

    if(!gamesList.nextPageDoesNotExist())
      enableNextGamesListPage();
    
    printListPage();
  }

  function nextPage() {
    if(!gamesList.setNextPage()) 
      disableNextGamesListPage();

    if(!gamesList.previousPageDoesNotExist())
      enablePreviousGamesListPage();
    
    printListPage();
  }

  function enablePreviousGamesListPage() {
    $previous_games_list_page.off();

    $previous_games_list_page.click(previousPage);

    $previous_games_list_page.prop('disabled', false);
    $previous_games_list_page.removeClass('is-disabled');
    $previous_games_list_page.addClass('is-success');
  }


  function enableNextGamesListPage() {
    $next_games_list_page.off();

    $next_games_list_page.click(nextPage);

    $next_games_list_page.prop('disabled', false);
    $next_games_list_page.removeClass('is-disabled');
    $next_games_list_page.addClass('is-success');
  }

  function printListPage() {
    $games_list_page.html(gamesList.textToPrint());
      for(let i = gamesList.current_page_number * gamesList.cards_per_page; i < gamesList.current_page_number * gamesList.cards_per_page + gamesList.cards_per_page && i < gamesList.list.length; i++) {
        $('#game' + i).click(function () {
          hideGamesListPage();

          game_number = gamesList.list[i].game_number;
          console.log(game_number);
          checkGameNumber();
          $(document).off(); 
        });
      }
  }

  function showGamesListPage() {
    socket.emit('request games list');
    socket.on('get games list', function (list) {
      gamesList.setCardPerPage($(document).height());
      gamesList.setList(list);
      
      printListPage();

      $(document).off(); 
      
      disablePreviousGamesListPage();
      disableNextGamesListPage();
      if(!gamesList.nextPageDoesNotExist())
        enableNextGamesListPage();

      if(!gamesList.previousPageDoesNotExist())
        enablePreviousGamesListPage();

      $games_list_page.css("display", "block");

      if(gamesList.list.length !== 0) {
        $games_list_controls.css("display", "block");

        $(document).keydown(function(e) {
          if(e.which == 37 || e.which == 65) {
            previousPage();
          }
        });

        $(document).keydown(function(e) {
          if(e.which == 39 || e.which == 68) {
            nextPage();
          }
        });
      } else {
        $games_list_controls.css("display", "none");
      }

    });
  }

  function showGameNumberPage() {
    function send() {
      let val = $dark_game_number_field.val();
      game_number = (val[0] === '#' ? val.substr(1) : val);
      console.log(game_number);
      checkGameNumber();
    }

    $game_number_button.click(function() {
      send();
    });

    $(document).on('keypress',function(e) {
      if(e.which == 13) {
        send();
      }
    });

    $dark_game_number_field.val('');
    $game_number_page.css("display", "inline-block");
    $dark_game_number_field.focus();
  }

  function hideGameNumberPage() {
    $game_number_button.off();
    $game_number_page.css("display", "none");
  }

  function showListPlayerPage() {
    $(document).off();
    $play_button.click(function() {
      socket.emit('start game', game_number);
    });

    $player_list_page.css("display", "inline-block");
    $('#game_number').html(game_number);

    socket.on('running', function (map_matrix) {
      hideListPlayerPage();
      showCanvas();
      startGame(map_matrix);
      minimumPathsWorker.postMessage({ action: 'init', map: map_matrix, pos: { x: 11, y: 13}});
    });
  }

  function hideListPlayerPage() {
    $play_button.off();
    $player_list_page.css("display", "none");
  }

  function showCanvas() {
    $('#scores').css("display", "block");
    $canvas.css("display", "inline-block");
    
    if(isTouchDevice())
      $('#swipe_info').addClass('mobile');
  }

  function disablePlayButton() {
    $play_button.off();
    $play_button.prop('disabled', true);
    $play_button.removeClass('is-success');
    $play_button.addClass('is-disabled');
  }

  function enablePlayButton() {
    $play_button.off();
    $play_button.click(function() {
      socket.emit('start game', game_number);
    });
    $play_button.prop('disabled', false);
    $play_button.removeClass('is-disabled');
    $play_button.addClass('is-success');
  }

  socket.on('connected users', function(data) {
    if(data.game_number === game_number) {
      let i = 1;
      if(data.participants[Object.keys(data.participants)[0]].nickname !== nickname_val)
        disablePlayButton();
      else
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
      removeGamesListPage();
      hideGameNumberPage();
      showNicknamePage();
    } else {
      $dark_game_number_field.addClass('is-error');
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
      $dark_nickname_field.addClass('is-error');
      $('#nickname_error').html(error);
    }
  });

  /*
  * Permette di controllare il gioco tramite swipe
  */
  function setSwipe(movement) {
    document.addEventListener('swiped-left', function(e) {
      movement.left = true;
      socket.emit('movement', movement);
      movement.left = false;
    });
    
    document.addEventListener('swiped-right', function(e) {
      movement.right = true;
      socket.emit('movement', movement);
      movement.right = false;
    });
    
    document.addEventListener('swiped-up', function(e) {
      movement.up = true;
      socket.emit('movement', movement);
      movement.up = false;
    });
    
    document.addEventListener('swiped-down', function(e) {
      movement.down = true;
      socket.emit('movement', movement);
      movement.down = false;
    });
  }

  /*
  * Rende lo sfondo della sezione di gioco nera
  */
  function printBackground(ctx) {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, 27, 23);
  }

  var get_scores = true;

  /*
  * Crea una tabella con i nickname e i punteggi dei giocatori
  */
  function getScores(data, pacman_does_not_win) {
    let content = '<table>';
    let imGhost = false;
    for(let key in data.obj) {
      let user = data.obj[key];
      if(user.player) {
        let img = '<img ' + 'class="user_img"';

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

        if(user.player.role !== "pacman") {
          content += '<tr>' +
                        '<td>' + 
                          img + '<span ' + (user.nickname !== nickname_val ? '' :' style="color:#f7d51d"') + '>' + user.nickname  + '</span>' 
                        '<td/>' +
                      '</tr> ';
          if(user.nickname !== nickname_val)
            imGhost = true;
        } else {
          let pacman_life = '';
          if(pacman_does_not_win)
            user.player.life = 0;
          for(let i = 0; i < 3 - user.player.life; i++)
            pacman_life += '<img class="user_img" src="assets/img/pacman/pacman_dies_12.png"> ';
          for(let i = 0; i < user.player.life; i++)
            pacman_life += img;
          $('#my_score').html('<span ' + (user.nickname !== nickname_val ? '' : ' style="color:#f7d51d"') + '>' + 
                                '<span style="display: inline-block; width: 96px;">' + 
                                  pacman_life + 
                                '</span>' + 
                                user.nickname + ': ' +
                                '<span id="score_pacman" class="score_' + user.nickname + '">' + 
                                  user.player.points + 
                                '</span><br>' +
                              '</span>');
        }
      }
    }
    content += '</table>';
    $('.other_scores').html(content);
  }

  /*
  * Aggiorna la tabella creata con la funzione getScores(data)
  */
  function updateScores(data) {
    for(let key in data.obj) {
      let user = data.obj[key];
      $('.score_' + user.nickname).html(user.player.points);
    }
  }

  /*
  * Gestisce e crea la sezione di gioco
  */
  function startGame(map_matrix) {
    socket.emit('new player');
    
    const $canvas = document.getElementById('canvas');
    const ctx = $canvas.getContext('2d');
    const SCALE_F = 30;

    ctx.scale(SCALE_F, SCALE_F);

    ctx.blackXY = function (x, y) {
      this.fillStyle = 'black';
      this.fillRect(Number((x - 0.1).toFixed(2)), Number((y - 0.1).toFixed(2)), 1.2, 1.2);
    }

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

    setSwipe(movement);

    /*
    * Questo listener esegue la funzione quando un pulsante viene premuto;
    * Rileva la pressione dei tasti freccia e dei tasti A, S, D, W per gestire il movimento.
    */
    document.addEventListener('keydown', function (event) { 
      switch (event.keyCode) {
        case 37: 
          movement.left = true;
          break;
        case 65:
          movement.left = true;
          break;
        case 38: 
          movement.up = true;
          break;
        case 87: 
          movement.up = true;
          break;
        case 39: 
          movement.right = true;
          break;
        case 68: 
          movement.right = true;
          break;
        case 40: 
          movement.down = true;
          break;
        case 83:
          movement.down = true;
          break;
      }
      //if(last_key !== event.keyCode)
      if(movement.left || movement.up || movement.right || movement.down) {
        socket.emit('movement', movement);
        last_key = event.keyCode; 
      }
    });

    /*
    * Questo listener esegue la funzione quando un pulsante viene rilasciato;
    */
    document.addEventListener('keyup', function (event) {
      switch (event.keyCode) {
        case 37:
          movement.left = false;
          break;
        case 65:
          movement.left = false;
          break;
        case 38: 
          movement.up = false;
          break;
        case 87: 
          movement.up = false;
          break;
        case 39: 
          movement.right = false;
          break;
        case 68: 
          movement.right = false;
          break;
        case 40:
          movement.down = false;
          break;
        case 83:
          movement.down = false;
          break;
      }

      last_key = event.keyCode; 
    });

    var figure = {};
    var figuresToBeDeleted = [];

    var pacman = null;
    var frame = -1;

    var lastUpdateTimeServer = null;

    var participants = null;
    var old_participants = null;
    
    var timeServer = null;
    var cont = 0;
    var first_state = true;
    /*
    * Aggiorna la posizione dei giocatori prelevando i dati dal server
    */
    socket.on('state', function (locations) {
      old_participants = {...participants};

      if(!lastUpdateTimeServer)
        lastUpdateTimeServer = (new Date()).getTime();
      
      var currentTimeServer = (new Date()).getTime();
      var timeDifferenceServer = currentTimeServer - lastUpdateTimeServer;
      lastUpdateTimeServer = currentTimeServer;

      let time = (timeDifferenceServer + locations.time) / 2;

      timeServer = (timeServer === null ? locations.time : (timeServer + time) / 2); 
      participants = locations.obj;
      cont = 0;
      
      for (var id in old_participants) {
        var old_player = old_participants[id].player;

        ctx.blackXY(old_player.pos.x, old_player.pos.y);
        if(old_player.role === 'ghost')
          map.printCell(ctx, old_player.pos.y, old_player.pos.x);
      }

      for (var id in participants) {
        if(id in figure) {
          if(!figure[id].notShow)
            figure[id].print(ctx, participants[id].player.vulnerable);
          if(participants[id].player.role === 'pacman') 
            map.matrix[participants[id].player.pos.y][participants[id].player.pos.x] = 0; 
        }
      }
      
      figuresToBeDeleted.forEach(function (id, index) {
        if(!(id in figuresToBeDeleted)) {
          figure[id].clear(ctx);
          map.printCellWithBlackBackground(ctx, figure[id].pos_y, figure[id].pos_x);
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

      if(old_participants && first_state) {
        worker.postMessage("");
        first_state = false;
      }
    });

    /*
    * Seguendo le direttive del server, 
    * modifica un campo della mappa e mostra la modifica a schermo
    */
    socket.on('element', function (data) { 
      map.matrix[data.pos.y][data.pos.x] = data.val;
      map.printCell(ctx, data.pos.y, data.pos.x);
    });

    var animation_print = 0;
    /*
    * Stampa un'animazione in seguito alla morte di pacman
    */
    function printDeadPacmanAnimation() {
      animation_print = (animation_print + 1) % 15;
      if(frame > -1 && !animation_print) {
        printBackground(ctx);
        map.print(ctx);
        if(frame >= 0 && frame <= 11) frame++;
        pacman.printDied(ctx, frame);
      }
    }

    socket.on('dead pacman animation start', function (data) {
      frame = 0;
    });

    socket.on('dead pacman animation end', function (data) {
      frame = -1;
    });

    /*
    * Si occupa di rimuovere i giocatori che lasciano la partita
    */
    socket.on('player out', function (id) {
      get_scores = true;
      figuresToBeDeleted.push(id);
    });

    function getFinalScores(pacman_does_not_win) {
      let data = {obj: participants}
      getScores(data, pacman_does_not_win);
    }

    /*
    * Mostra la classifica dei giocatori quando la partita si conclude
    */
    socket.on('end game', function(data) {
      getFinalScores(!data.pacman_wins);
      $('#winner').html((data.pacman_wins ? 'Pacman wins' : 'Ghosts win'));
      $('#pacman_score').html($('#score_pacman').html());
      $('#win').css("display", "inline-block");
    });

    let worker = new Worker('assets/js/worker.js');

    var lastUpdateTime = null;
    var timeClient = null;
    /*
    * Mostra l'animazione di spostamento di un giocatore da una posizione ad un'altra
    */
    worker.onmessage = function (event) {
      map.switchPowerPelletState(ctx);

      if(!lastUpdateTime)
        lastUpdateTime = (new Date()).getTime();
      var currentTime = (new Date()).getTime();
      var timeDifference = currentTime - lastUpdateTime;
      
      timeClient = (timeClient === null ? timeDifference : (timeClient + timeDifference) / 2);

      let time = timeServer / timeClient;
      if(cont <= time && frame === -1) {
        for (var id in participants) {
          var player = participants[id].player;
          if(player) {
            if(figure[id] == undefined) {
              if(player.role === 'pacman') {
                figure[id] = new PacMan(player.pos.x, player.pos.y);
                pacman = figure[id];
              } else
                figure[id] = new Ghost(player.pos.x, player.pos.y, player.color);
            }
            
            figure[id].clear(ctx)
            
            if(player.role === 'ghost' && old_participants[id]) 
              map.printCell5x5(ctx, old_participants[id].player.pos.y, old_participants[id].player.pos.x);

            let starting_position = ( old_participants && old_participants[id] && old_participants[id].player ? old_participants[id].player.pos : player.pos );
            let end_position = player.pos;

            let delta_x = (end_position.x - starting_position.x);
            let delta_y = (end_position.y - starting_position.y);
            
            if(delta_x > 1 || -delta_x > 1 || delta_y > 1 || -delta_y > 1) {
              delta_x = 0;
              delta_y = 0;
              get_scores = true;

              if(player.role === 'ghost' && player.recovery_time && player.recovery_time !== old_participants[id].player.recovery_time ) {
                minimumPathsWorker.postMessage({ socket_id: id, action: 'get path', pos: {x: starting_position.y, y: starting_position.x}});
                player.recovery_time = false;
                figure[id].notShow = true; 
              }
            }

            figure[id].updatePosition(starting_position.x + (delta_x * cont) / time, starting_position.y + (delta_y * cont) / time);
            figure[id].setDirection(player.direction);
            figure[id].updateImg();
            if(player.role === 'ghost')
              figure[id].updateVulnerable(player.vulnerable);
          }
        }

        map.printDoor(ctx);
        for (var id in participants)
          if(!figure[id].notShow)
            figure[id].print(ctx, participants[id].player.vulnerable);

        cont++;
      }
      lastUpdateTime = currentTime;

      printDeadPacmanAnimation();
    }

    /*
    * Stampa un'animazione in seguito alla morte di un fantasma
    */
    minimumPathsWorker.onmessage = function (event) {
      if(event.data.pos)  
        figure[event.data.socket_id].printDeadAnimation(ctx, map, event.data.pos.y, event.data.pos.x);

      if(event.data.action === 'end animation')
        figure[event.data.socket_id].notShow = false;
    }
  }

})();
