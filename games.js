let Player = require('./player').Player;

class Games {
    constructor() {
        this.game_session = {}
        this.users = {}
    }

    get(number) {
        return this.game_session[number];
    }

    add(number) {
        if(!this.has(number))
            this.game_session[number] = new GameSession(number);
    }

    remove(number) {
        if(this.has(number))
            delete this.game_session[number];
    }

    length() { return Object.keys(this.game_session).length; }

    has(number) {
        return (number in this.game_session);
    }

    hasUser(number, socket_id) {
        if(!this.has(number))
            return false
        return this.game_session[number].has(socket_id);
    }

    addUser(game_number, socket_id) {
        if(this.hasUser(game_number, socket_id)) {
            return 'Client already in game';
        }
        if(!this.has(game_number)) {
            return 'Game number does not exist';
        }
        if(this.game_session[game_number].started) {
            return 'Game in progress';
        }
        if(!this.game_session[game_number].add(socket_id)) {
            return 'Full game session';
        }
        this.users[socket_id] = game_number;
        return '';
    }

    removeUser(game_number, socket_id) {
        if(game_number in this.game_session) {
            if(this.game_session[game_number].remove(socket_id)) {
                if(!(socket_id in this.users))
                    delete this.users[socket_id];

                if(this.game_session[game_number].length() === 0)
                    this.remove(game_number);
                return true;
            }
        }
        return false;
    }

    setUserNickname(game_number, socket_id, nickname) {
        if(this.hasUser(game_number, socket_id))
            this.game_session[game_number].participants[socket_id].setNickname(nickname);
    }

    getUserGameNumber(socket_id) {
        if(socket_id in this.users)
            return this.users[socket_id];
    }

    getUsersInAGameSession(game_number) {
        if(this.has(game_number))
            return this.game_session[game_number].participants;
    }

    findUserInAGameSessionByNickname(game_number, nickname) {
        if(this.has(game_number)){
            let participants = this.game_session[game_number].participants;
            for(let id in participants)
                if(participants[id].nickname === nickname)
                    return id;
        }
        return null;
    }

    setGameStarted(game_number, started) {
        if(this.has(game_number)) {
            this.game_session[game_number].setStarted(started);
        }
    }

    generateGame(socket_id) {
        let game_number = null;

        do {
            game_number = "#" + ~~(Math.random() * (99999 - 10000) + 10000);
        } while(this.has(game_number));

        this.add(game_number);
        this.addUser(game_number, socket_id);

        return game_number;
    }

    checkGameNumber(game_number, socket_id) {
        return this.addUser(game_number, socket_id);
    }

    checkNickname(game_number, nickname) {
        if(this.findUserInAGameSessionByNickname(game_number, nickname) !== null)
            return "Nickname already used";
        if(nickname.length > 8)
            return "Nickname too long";
        if(nickname.length < 3)
            return "Nickname too short";
        if(nickname.match("^[A-Za-z0-9]+$") === null)
            return "Nickname can only have letters and numbers";
        
        return "";
    }
}

class GameSession {
    constructor(number) {
        this.number = number;
        this.participants = {};
        this.started = false;
    }

    setStarted(started) {
        this.started = started;
    }

    add(socket_id) {
        if(this.length() < 4) {
            this.participants[socket_id] = new User(socket_id);
            return true;
        }
        return false;
    }

    remove(socket_id) {
        if(socket_id in this.participants) {
            delete this.participants[socket_id];
            return true;
        }
        return false;
    }

    length() { return Object.keys(this.participants).length; }

    has(socket_id) {
        return (socket_id in this.participants);
    }
}

class User {
    constructor(socket_id) {
        this.nickname = null;
        this.socket_id = socket_id;
        this.player = null;
    }

    setNickname(nickname) {
        this.nickname = nickname;
    }

    play() {
        this.player = new Player(13, 13);
    }
}

module.exports = {
    Games: Games
}