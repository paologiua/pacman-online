export {PacMan, Ghost};

const LEFT = 0;
const RIGHT = 1;
const UP = 2;
const DOWN = 3;

/*
* La classe Figure gestisce la visualizzazione dei personaggi
*/
class Figure {
    constructor(pos_x, pos_y, direction = LEFT, color = null) {
        this.pos_x = pos_x;
        this.pos_y = pos_y;

        this.old_pos_x = pos_x;
        this.old_pos_y = pos_y;

        this.color = color;
        this.img = {};
        this.loadImg();
        this.name_img = '1'
        
        this.direction = direction;
        this.n_movements = 0;
    }

    loadImg() {}

    setDirection(direction) {
        this.direction = direction;
    }

    updatePosition(pos_x, pos_y) {
        this.old_pos_x = this.pos_x;
        this.old_pos_y = this.pos_y;

        this.pos_x = pos_x;
        this.pos_y = pos_y;
    }

    //updateImg() {}
    
    clear(ctx) { 
        ctx.blackXY(this.pos_x, this.pos_y);
    }
}

/*
* PacMan è una classe che estende Figure ed è specifica per 
* la visualizzazione del personaggio PacMan
*/ 
class PacMan extends Figure {
    constructor(pos_x, pos_y, direction = LEFT) {
        super(pos_x, pos_y, direction);
    }

    loadImg() {
        this.img['1'] = new Image;
        this.img['1'].src = 'assets/img/pacman/pacman_1.png';
        this.img['2l'] = new Image;
        this.img['2l'].src = 'assets/img/pacman/pacman_2l.png';
        this.img['3l'] = new Image;
        this.img['3l'].src = 'assets/img/pacman/pacman_3l.png';
        this.img['2r'] = new Image;
        this.img['2r'].src = 'assets/img/pacman/pacman_2r.png';
        this.img['3r'] = new Image;
        this.img['3r'].src = 'assets/img/pacman/pacman_3r.png';
        this.img['2u'] = new Image;
        this.img['2u'].src = 'assets/img/pacman/pacman_2u.png';
        this.img['3u'] = new Image;
        this.img['3u'].src = 'assets/img/pacman/pacman_3u.png';
        this.img['2d'] = new Image;
        this.img['2d'].src = 'assets/img/pacman/pacman_2d.png';
        this.img['3d'] = new Image;
        this.img['3d'].src = 'assets/img/pacman/pacman_3d.png';

        for(let i = 1; i < 13; i++) {
            this.img['pacman_dies_' + i] = new Image;
            this.img['pacman_dies_' + i].src = 'assets/img/pacman/pacman_dies_' + i + '.png';
        }
    }

    updateImg() { 
        if(this.old_pos_x !== this.pos_x || 
              this.old_pos_y !== this.pos_y ||
              this.name_img === '1') {
            let dir = null;
            switch(this.direction) {
                case LEFT: 
                    dir = 'l'
                    break;
                case RIGHT: 
                    dir = 'r';
                    break;
                case UP: 
                    dir = 'u';
                    break;
                case DOWN: 
                    dir = 'd';
                    break;
            }

            if(this.n_movements === 0)
                this.name_img = '2' + dir ;
            else if(this.n_movements === 7)
                this.name_img = '3' + dir;

            this.n_movements = (this.n_movements + 1) % 14;
        }
    }

    print(ctx) {
        ctx.drawImage(this.img[this.name_img], this.pos_x, this.pos_y, 1, 1);
    }

    printDied(ctx, frame) {
        ctx.drawImage(this.img['pacman_dies_' + frame], this.pos_x, this.pos_y, 1, 1);
    }
}


/*
* Ghost è una classe che estende Figure ed è specifica per 
* la visualizzazione dei personaggi Ghost
*/ 
class Ghost extends Figure {
    constructor(pos_x, pos_y, color, direction = LEFT) {
        super(pos_x, pos_y, direction, color);
        this.pos_animation_x = null;
        this.pos_animation_y = null;
        this.old_pos_animation_x = null;
        this.old_pos_animation_y = null;

        this.vulnerable_color = '';
    }

    loadImg() {
        switch(this.color) {
            case 'red': 
                this.img[this.color + '1'] = new Image;
                this.img[this.color + '1'].src = 'assets/img/ghost/blinky_1.png';
                this.img[this.color + '2'] = new Image;
                this.img[this.color + '2'].src = 'assets/img/ghost/blinky_2.png';
                break;
            case 'yellow': 
                this.img[this.color + '1'] = new Image;
                this.img[this.color + '1'].src = 'assets/img/ghost/clyde_1.png';
                this.img[this.color + '2'] = new Image;
                this.img[this.color + '2'].src = 'assets/img/ghost/clyde_2.png';
                break;
            case 'green': 
                this.img[this.color + '1'] = new Image;
                this.img[this.color + '1'].src = 'assets/img/ghost/inky_1.png';
                this.img[this.color + '2'] = new Image;
                this.img[this.color + '2'].src = 'assets/img/ghost/inky_2.png';
                break;
            case 'pink': 
                this.img[this.color + '1'] = new Image;
                this.img[this.color + '1'].src = 'assets/img/ghost/pinky_1.png';
                this.img[this.color + '2'] = new Image;
                this.img[this.color + '2'].src = 'assets/img/ghost/pinky_2.png';
                break;
        }

        this.img['eyes_' + LEFT] = new Image;
        this.img['eyes_' + LEFT].src = 'assets/img/ghost/eyes_l.png';
        this.img['eyes_' + RIGHT] = new Image;
        this.img['eyes_' + RIGHT].src = 'assets/img/ghost/eyes_r.png';
        this.img['eyes_' + UP] = new Image;
        this.img['eyes_' + UP].src = 'assets/img/ghost/eyes_u.png';
        this.img['eyes_' + DOWN] = new Image;
        this.img['eyes_' + DOWN].src = 'assets/img/ghost/eyes_d.png';

        this.img['vulnerable_1'] = new Image;
        this.img['vulnerable_1'].src = 'assets/img/ghost/vulnerable_1.png';
        this.img['vulnerable_2'] = new Image;
        this.img['vulnerable_2'].src = 'assets/img/ghost/vulnerable_2.png';

        this.img['vulnerable_1b'] = new Image;
        this.img['vulnerable_1b'].src = 'assets/img/ghost/vulnerable_1b.png';
        this.img['vulnerable_2b'] = new Image;
        this.img['vulnerable_2b'].src = 'assets/img/ghost/vulnerable_2b.png';
        
    }

    updateImg() { 
        if(this.old_pos_x !== this.pos_x || 
              this.old_pos_y !== this.pos_y) {
            if(this.n_movements === 0) 
                this.name_img = '1';
             else if(this.n_movements === 7)
                this.name_img = '2';

            this.n_movements = (this.n_movements + 1) % 14;
        }
    }

    updateVulnerable(vulnerable) {
        if(vulnerable === 1) {
            if(this.vulnerable_cont === undefined)
                this.vulnerable_cont = 0;
            
            if(this.vulnerable_cont === 0) 
                this.vulnerable_color = (this.vulnerable_color ? '' : 'b');
            
            this.vulnerable_cont = (this.vulnerable_cont + 1) % 30;
        }
    }

    print(ctx, vulnerable) {
        if(vulnerable === 2)
            ctx.drawImage(this.img['vulnerable_' + this.name_img], this.pos_x, this.pos_y, 1, 1);
        else if(vulnerable === 1) 
            ctx.drawImage(this.img['vulnerable_' + this.name_img + this.vulnerable_color], this.pos_x, this.pos_y, 1, 1);
        else {
            ctx.drawImage(this.img[this.color + this.name_img], this.pos_x, this.pos_y, 1, 1);
            ctx.drawImage(this.img['eyes_' + this.direction], this.pos_x, this.pos_y, 1, 1);
        }
    }

    printDeadAnimation(ctx, map, x, y) {
        let direction = null;
        if(this.old_pos_animation_x && this.old_pos_animation_y) {
            map.printCellWithBlackBackground(ctx, this.old_pos_animation_y, this.old_pos_animation_x);
            direction = LEFT;
        }

        if(this.old_pos_animation_x === this.pos_animation_x)
            if(this.old_pos_animation_y < this.pos_animation_y)
                direction = DOWN;
            else
                direction = UP;
        else if(this.old_pos_animation_x < this.pos_animation_x)
                direction = RIGHT;
            else
                direction = LEFT;

        if(x, y) {
            this.old_pos_animation_x = this.pos_animation_x;
            this.old_pos_animation_y = this.pos_animation_y;
            
            this.pos_animation_x = x;
            this.pos_animation_y = y;
            ctx.drawImage(this.img['eyes_' + direction], x, y, 1, 1);
        }
    }
}