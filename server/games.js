let Player = require('./player').Player;

/*
* Questa classe gestisce, crea e rimuove tutte le sessioni di gioco 
*/
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
            game_number = "" + ~~(Math.random() * (99999 - 10000) + 10000);
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

    getGamesAvailable() {
        let list = [];
        for(let number in this.game_session) {
            if(this.get(number).length() < 4 && !this.get(number).started) {
                list.push({ game_number: number, length: this.get(number).length()});
            }
        }
        return list;
    }
}

const ANIMATION_T = 3500;

const VULNERABILITY_T = 7000;
const LOW_VULNERABILITY_T = 3500;

const HIGH_VULNERABILITY = 2;
const LOW_VULNERABILITY = 1;
const NO_VULNERABILITY = 0;

/*
* Questa classe gestisce una singola sessione di gioco e 
* gli utenti che ne fanno parte
*/
class GameSession {
    constructor(number) {
        this.number = number;
        this.participants = {};
        this.started = false;
        this.map = null;
        this.pacman_number = 0;
        this.game_name = 'classic game';
        switch(this.game_name) {
                case 'catch the pellets':
                    break;
                case 'classic game':
                    this.initAnimationTime();
                    this.initVulnerabilityTime();
                    break;
        }
    }

    updateGameProgress() {
        if(this.started) {
            switch(this.game_name) {
                case 'catch the pellets':
                    this.catchThePellets();
                    break;
                case 'classic game':
                    this.classicGame();
                    break;
                default:
                    break;
            }
        }
    }

    catchThePellets() {
        for(let key in this.participants) {
            let user = this.participants[key];
            if(user.player) {
                if(this.map.isPellet(user.player.pos.x, user.player.pos.y)) {
                    user.player.increasePoints(1);
                    this.map.switchPelletToVoid(user.player.pos.x, user.player.pos.y);
                }
                else if(this.map.isCherry(user.player.pos.x, user.player.pos.y)) {
                    user.player.increasePoints(10);
                    this.map.setVoid(user.player.pos.x, user.player.pos.y);
                }
            }
        }
    }

    classicGame() {
        for(let i = this.pacman_number; i === this.pacman_number || i % this.length() !== this.pacman_number; i++) {
            let user = this.participants[Object.keys(this.participants)[i % this.length()]];
            if(user.player) {
                if(user.player.role === 'pacman') {
                    this.pacman = user;
                    
                    if(this.map.isPellet(user.player.pos.x, user.player.pos.y)) {
                        user.player.increasePoints(1);
                        this.map.switchPelletToVoid(user.player.pos.x, user.player.pos.y);
                    }
                    else if(this.map.isPowerPellet(user.player.pos.x, user.player.pos.y)) {
                        user.player.increasePoints(5);
                        this.setVulnerableGhosts(HIGH_VULNERABILITY);
                        this.setVulnerabilityTime();
                        this.map.switchPelletToVoid(user.player.pos.x, user.player.pos.y);
                    }
                    else if(this.map.isCherry(user.player.pos.x, user.player.pos.y)) {
                        user.player.increasePoints(10);
                        this.map.setVoid(user.player.pos.x, user.player.pos.y);
                    }
                } else if(user.player.role === 'ghost') {
                    if(this.pacman && 
                            this.pacman.socket_id in this.participants &&
                            this.pacman.player.pos.x === user.player.pos.x && 
                            this.pacman.player.pos.y === user.player.pos.y) {
                                if(user.player.vulnerable) {
                                    this.pacman.player.increasePoints(20);
                                    user.player.setDefaultPosition(1);
                                    user.player.direction = 3;
                                    user.player.vulnerable = false;
                                    user.player.initRecoveryTime();
                                } else {
                                    this.pacman.player.life--;
                                    this.lost_life = true;
                                    this.setAnimationTime();
                                    this.setVulnerableGhosts(NO_VULNERABILITY);
                                }
                    }
                }
            }
        }
    }

    setVulnerableGhosts(x) {
        for(let key in this.participants) {
            let user = this.participants[key];
            if(user.player && user.player.role === 'ghost')
                user.player.vulnerable = x;
        }
    }

    setLowVulnerableGhosts() {
        for(let key in this.participants) {
            let player = this.participants[key].player;
            if(player && player.role === 'ghost' && player.vulnerable === HIGH_VULNERABILITY)
                player.vulnerable = LOW_VULNERABILITY;
        }
    }

    decreaseVulnerabilityTime(t) {
        if(!this.vulnerabilityTimeOff()) {
            this.vulnerability_time -= t;
            if(this.vulnerability_time < 0) {
                this.initVulnerabilityTime();
                this.setVulnerableGhosts(NO_VULNERABILITY);
            }
        }
    }

    vulnerabilityTimeOff() {
        return (this.vulnerability_time === -1);
    }

    lowVulnerabilityTime() {
        if(this.vulnerability_time < LOW_VULNERABILITY_T && !this.vulnerabilityTimeOff())
            this.setLowVulnerableGhosts();
    }

    setVulnerabilityTime() { this.vulnerability_time = VULNERABILITY_T;}

    initVulnerabilityTime() {
        this.vulnerability_time = -1;
    }

    repositionPlayers() {
        this.lost_life = false;
        for(let key in this.participants) {
            let user = this.participants[key];
            if(user.player) {
                let default_number = (Object.keys(this.participants).indexOf(user.socket_id) + this.pacman_number) % this.length();
                user.player.setDefaultPosition(default_number);
                user.player.setDefaultDirection(default_number);
            }
        }
    }

    endGameCheck() {
        if(this.started) {
            switch(this.game_name) {
                case 'catch the pellets':
                    return this.endCatchThePellets();
                    break;
                case 'classic game':
                    return this.endClassicGame();
                    break;
                default:
                    break;
            }
        }
        return false;
    }

    endCatchThePellets() {
        if(!this.map)
            return false;
        return !(this.map.num_pellets);
    }

    endClassicGame() {
        if(!(this.pacman.socket_id in this.participants)) {
            this.pacman.player.life = 0;
            return true;
        }
        return ((this.pacman.player && !this.pacman.player.life) || this.endCatchThePellets());
    }

    getWinningUser() {
        let winning_user = this.participants[Object.keys(this.participants)[0]];
        for(let key in this.participants) {
            let user = this.participants[key];
            if(user.player.points > winning_user.player.points)
                winning_user = user;
        } 
        return winning_user;
    }

    getRanking() {
        let sortScores = (a, b) => {
            let user_a = this.participants[a];
            let user_b = this.participants[b];
            return user_b.player.points - user_a.player.points;
        }

        let ranking = []
        Object.keys(this.participants).sort(sortScores).forEach((key) => {
            ranking.push({ nickname: this.participants[key].nickname, score: this.participants[key].player.points });
        });
        return ranking;
    }

    setStarted(started) {
        this.started = started;
    }

    getPacmanNumber() {
        let i = 0;
        for(let key in this.participants) {
            let user = this.participants[key];
            if(user.player && user.player.role === 'pacman')
                return i;
            i++;
        }
        return 0;
    }

    add(socket_id) {
        if(this.length() < 4) {
            this.participants[socket_id] = new User(socket_id);
            let random = (Math.round(Math.random() * 10)) % this.length();
            this.pacman_number = random;
            return true;
        }
        return false;
    }

    remove(socket_id) {
        if(socket_id in this.participants) {
            delete this.participants[socket_id];
            this.pacman_number = this.getPacmanNumber();
            return true;
        }
        return false;
    }

    length() { return Object.keys(this.participants).length; }

    has(socket_id) {
        return (socket_id in this.participants);
    }

    userPlays(socket_id) {
        if(this.has(socket_id)) { 
            this.participants[socket_id].plays((Object.keys(this.participants).indexOf(socket_id) + this.pacman_number) % this.length());
        }
    }

    playersReady() {
        let players_ready = true;
        for(let key in this.participants) 
            players_ready = players_ready && Boolean(this.participants[key].player);
        return players_ready;
    }

    decreaseAnimationTime(t) {
        this.animation_time -= t;
        if(this.animation_time < 0)
            this.animation_time = -1;
    }

    setAnimationTime() { this.animation_time = ANIMATION_T;}

    animationEnd(t) { 
        if(Boolean(this.animation_time)) 
            this.decreaseAnimationTime(t);
        
        return !Boolean(this.animation_time);
    }

    animationHasStartedNow() {
        return (this.animation_time === ANIMATION_T);
    }

    animationIsOverNow() {
        if(this.animation_time === -1) {
            this.initAnimationTime();
            return true;
        }
        return false;
    }

    initAnimationTime() {
        this.animation_time = 0;
    }
}

/*
* la classe User rappresenta un utente che partecipa a una sessione di gioco
*/
class User {
    constructor(socket_id) {
        this.nickname = null;
        this.socket_id = socket_id;
        this.player = null;
    }

    setNickname(nickname) {
        this.nickname = nickname;
    }

    plays(x) {
        this.player = new Player(x);
    }
}

module.exports = {
    Games: Games
}