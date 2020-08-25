const LEFT = 0;
const RIGHT = 1;
const UP = 2;
const DOWN = 3;

class Player {
    constructor(pos_x, pos_y, direction = LEFT, role) {
        this.pos = {
            'x' : pos_x,
            'y' : pos_y
        }
        this.direction = direction;
        this.next_direction = null;
        this.n_movements = 0;
        this.points = 0;
        
        if(role === undefined)
            this.role = Math.round(Math.random()) === 1 ? 'ghost' : 'pacman';
        else
            this.role = role;

        if(this.role === 'ghost') {
            this.color = (~~(Math.random() * 10)) % 4;
            switch(this.color) {
                case 1: 
                    this.color = 'yellow';
                    break;
                case 2: 
                    this.color = 'green';
                    break;
                case 'pink': 
                    this.color = 'pink';
                    break;
                default: 
                    this.color = 'red';
                    break;
            }
        }
    }

    increasePoints(n) {
        this.points += n;
    }

    updateDirection(map) {
        let update = false;
        //if(this.pos['y'] !== ~~this.pos['y'] || this.pos['x'] !== ~~this.pos['x'])
        //    return;

        switch(this.next_direction) {
            case LEFT: 
                if(!this.isAnObstacle(map.matrix[this.pos['y']][~~(this.pos['x'] - 0.1)]))
                    update = true;
                break;
            case RIGHT: 
                if(!this.isAnObstacle(map.matrix[this.pos['y']][~~(this.pos['x'] + 1)]))
                    update = true;
                break;
            case UP: 
                if(!this.isAnObstacle(map.matrix[~~(this.pos['y'] - 0.1)][this.pos['x']]))
                    update = true;
                break;
            case DOWN: 
                if(!this.isAnObstacle(map.matrix[~~(this.pos['y'] + 1)][this.pos['x']]) )
                    update = true;
                break;
            default:
                break;
        }

        if(update) {
            this.direction = this.next_direction;
            this.next_direction = null;
        }
    }

    isAnObstacle(x) {
        if(x >= 1 && x <= 14)
            return true;
        return false
    }

    move(map) {
        switch(this.direction) {
            case LEFT: 
                this.moveLeft(map);
                break;
            case RIGHT: 
                this.moveRight(map);
                break;
            case UP: 
                this.moveUp(map);
                break;
            case DOWN: 
                this.moveDown(map);
                break;
        }
    }

    moveRight(map) {
        if(map.matrix[this.pos['y']][this.pos['x'] + 1] === undefined ||
            !this.isAnObstacle(map.matrix[this.pos['y']][this.pos['x'] + 1])) {
            this.pos['x']++;
        }

        if(this.pos['x'] === 27)
            this.pos['x'] = 0
    }

    moveLeft(map) {
        if(map.matrix[this.pos['y']][this.pos['x'] - 1] === undefined ||
            !this.isAnObstacle(map.matrix[this.pos['y']][this.pos['x'] - 1])) {
            this.pos['x']--;
        }

        if(this.pos['x'] === -1)
            this.pos['x'] = 26
    }

    moveUp(map) {
        if(!this.isAnObstacle(map.matrix[~~(this.pos['y'] - 1)][this.pos['x']])) {
            this.pos['y']--;
        }
    }

    moveDown(map) {
        if(!this.isAnObstacle(map.matrix[this.pos['y'] + 1][this.pos['x']])) {
            this.pos['y']++;
        }
    }

    nextLeft() {
        this.next_direction = LEFT;
    }

    nextRight() {
        this.next_direction = RIGHT;
    }

    nextUp() {
        this.next_direction = UP;
    }

    nextDown() {
        this.next_direction = DOWN;
    }
}

module.exports = {
    Player: Player
}
