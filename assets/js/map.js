export {Map};

const VOID = 0;
const PELLET = 20;
const POWER_PELLET = 30;
const CHERRY = 40;

/*
* La classe Map permette il caricamento, la visualizzazione e la manipolazione
* della mappa di gioco
*/
class Map {
    constructor() {
        this.door_x = null;
        this.door_y = null;
        this.powerPellet = [];
        this.lightPowerPellet = 0;
        this.init = true;
        this.img = [];

        this.matrix = [[0]];

        this.loadImg();
    }

    loadImg() {
        this.img[1] = new Image;
        this.img[1].src = 'assets/img/map/1.png';
        this.img[2] = new Image;
        this.img[2].src = 'assets/img/map/2.png';
        this.img[3] = new Image;
        this.img[3].src = 'assets/img/map/3.png';

        this.img[4] = new Image;
        this.img[4].src = 'assets/img/map/4.png';
        this.img[5] = new Image;
        this.img[5].src = 'assets/img/map/5.png';
        this.img[6] = new Image;
        this.img[6].src = 'assets/img/map/6.png';

        this.img[7] = new Image;
        this.img[7].src = 'assets/img/map/7.png';
        this.img[8] = new Image;
        this.img[8].src = 'assets/img/map/8.png';
        this.img[9] = new Image;
        this.img[9].src = 'assets/img/map/9.png';

        this.img[10] = new Image;
        this.img[10].src = 'assets/img/map/10.png';
        this.img[11] = new Image;
        this.img[11].src = 'assets/img/map/11.png';
        this.img[12] = new Image;
        this.img[12].src = 'assets/img/map/12.png';

        this.img[13] = new Image;
        this.img[13].src = 'assets/img/map/13.png';
        this.img[14] = new Image;
        this.img[14].src = 'assets/img/map/14.png';

        this.img[20] = new Image;
        this.img[20].src = 'assets/img/map/20.png';
        this.img[30] = new Image;
        this.img[30].src = 'assets/img/map/30.png';
        this.img[40] = new Image;
        this.img[40].src = 'assets/img/map/40.png';
    }

    setMatrix(matrix) { this.matrix = matrix; }

    print(ctx) {
        for(let i = 0; i < this.matrix.length; i++) {
            for(let j = 0; j < this.matrix[0].length; j++) {
                if(this.init) {
                    if(this.matrix[i][j] === 15) {
                        this.door_x = i;
                        this.door_y = j;
                    } else if(this.matrix[i][j] === 30) 
                        this.powerPellet.push({ x: i, y: j});
                }
                this.printCell(ctx, i, j);
                
            }
        }
        this.init = false;
    }

    printCell(ctx, i, j) {
        if(this.matrix[i][j] === 15) {
            this.printDoor(ctx);
        }
        else if(this.matrix[i][j] >= 1) {
            this.img[this.matrix[i][j]].onload = () => {
                ctx.drawImage(this.img[this.matrix[i][j]], j, i, 1, 1);
            }
            ctx.drawImage(this.img[this.matrix[i][j]], j, i, 1, 1);
        }
    }

    printCellWithBlackBackground(ctx, i, j) {
        ctx.fillRect(~~j, ~~i, 1, 1);
        this.printCell(ctx, ~~i, ~~j);
    }

    printCell5x5(ctx, i, j) {
        let _x = (~~(i - 2) < 0 ? 0 : ~~(i - 2));
        let _y = (~~(j - 2) < 0 ? 0 : ~~(j - 2));

        for(let x = _x; x <= i + 2 && x < this.matrix.length; x++) {
            for(let y = _y; y <= j + 2 && y < this.matrix[0].length; y++) {
                if(this.matrix[x][y] >= 20)
                    this.printCellWithBlackBackground(ctx, x, y);
            }
        }
    }

    switchPowerPelletState(ctx) {
        for(let i = 0; i < this.powerPellet.length; i++) { 
            let x = this.powerPellet[i].x;
            let y = this.powerPellet[i].y;
            if(this.matrix[x][y] === POWER_PELLET) {
                if(this.lightPowerPellet < 30)
                    ctx.blackXY(y, x);
                else
                    this.printCell(ctx, x, y);
            }
        }
        this.lightPowerPellet = (this.lightPowerPellet + 1) % 60;
    }

    printDoor(ctx) {
        ctx.blackXY(this.door_y, this.door_x);
        ctx.beginPath();
        ctx.moveTo(this.door_y, this.door_x + 0.5);
        ctx.lineTo(this.door_y + 1, this.door_x + 0.5);
        ctx.lineWidth = 0.2;
        ctx.strokeStyle = '#FFB8FF';
        ctx.stroke();
    }
}