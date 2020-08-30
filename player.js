const LEFT = 0;
const RIGHT = 1;
const UP = 2;
const DOWN = 3;

const POSITIONS = [{ x: 10, y: 13}, { x: 16, y: 13}, { x: 10, y: 9}, { x: 16, y: 9}];
const ROLES = ['pacman', 'ghost'];
const COLORS = ['pink', 'red', 'yellow', 'green'];

class Player {
    constructor(x, pos_y, direction = LEFT, role, color) {
        this.next_direction = null;
        this.points = 0;
        if(pos_y)
            this.normalConstruction(x, pos_y, direction, role, color);
        else
            this.buildWithDefaultSets(x);
    }

    buildWithDefaultSets(x) {
        this.pos = { ...POSITIONS[x]};
        this.direction = x % 2;
        if(x === 0)
            this.role = ROLES[0];
        else {
            this.role = ROLES[1];
            this.color = COLORS[x];
        }

    }

    normalConstruction(pos_x, pos_y, direction, role, color) {
        this.pos = {
            'x' : pos_x,
            'y' : pos_y
        }
        this.direction = direction;
        this.role = (role in ROLES ? role : ROLES[Math.round(Math.random())]);

        if(this.role === 'ghost') {
            this.color = (color in COLORS ? color : COLORS[~~(Math.random() * 3)]);
        }
    }

    increasePoints(n) {
        this.points += n;
    }

    updateDirection(map) {
        let update = false;

        switch(this.next_direction) {
            case LEFT: 
                if(!this.isAnObstacle(map.matrix[this.pos['y']][this.pos['x'] - 1]))
                    update = true;
                break;
            case RIGHT: 
                if(!this.isAnObstacle(map.matrix[this.pos['y']][this.pos['x'] + 1]))
                    update = true;
                break;
            case UP: 
                if(!this.isAnObstacle(map.matrix[this.pos['y'] - 1][this.pos['x']]))
                    update = true;
                break;
            case DOWN: 
                if(!this.isAnObstacle(map.matrix[this.pos['y'] + 1][this.pos['x']]) )
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
