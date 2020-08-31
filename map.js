const MAP_0 = [
    [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4],
    [5,20,20,20,20,20,20,20,20,20,20,20,20, 5,20,20,20,20,20,20,20,20,20,20,20,20, 5],
    [5,20, 2, 1, 1, 4,20, 2, 1, 1, 1, 4,20, 5,20, 2, 1, 1, 1, 4,20, 2, 1, 1, 4,20, 5],
    [5,20, 5, 0, 0, 5,20, 5, 0, 0, 0, 5,20, 5,20, 5, 0, 0, 0, 5,20, 5, 0, 0, 5,20, 5],
    [5,20, 6, 1, 1, 7,20, 6, 1, 1, 1, 7,20,12,20, 6, 1, 1, 1, 7,20, 6, 1, 1, 7,20, 5],
    [5,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20, 5],
    [5,20, 8, 1, 1, 1, 1, 9,20,10,20, 8, 1, 3, 1, 9,20,10,20, 8, 1, 1, 1, 1, 9,20, 5],
    [5,20,20,20,20,20,20,20,20, 5,20,20,20, 5,20,20,20, 5,20,20,20,20,20,20,20,20, 5],
    [6, 1, 1, 1, 1, 1, 1, 4,20,11, 1, 9, 0,12, 0, 8, 1,13,20, 2, 1, 1, 1, 1, 1, 1, 7],
    [0, 0, 0, 0, 0, 0, 0, 5,20, 5, 0, 0, 0, 0, 0, 0, 0, 5,20, 5, 0, 0, 0, 0, 0, 0, 0],
    [8, 1, 1, 1, 1, 1, 1, 7,20,12, 0, 2, 9,15, 8, 4, 0,12,20, 6, 1, 1, 1, 1, 1, 1, 9],
    [0, 0, 0, 0, 0, 0, 0, 0,20, 0, 0, 5, 0, 0, 0, 5, 0, 0,20, 0, 0, 0, 0, 0, 0, 0, 0],
    [8, 1, 1, 1, 1, 1, 1, 4,20,10, 0, 6, 1, 1, 1, 7, 0,10,20, 2, 1, 1, 1, 1, 1, 1, 9],
    [0, 0, 0, 0, 0, 0, 0, 5,20, 5, 0, 0, 0, 0, 0, 0, 0, 5,20, 5, 0, 0, 0, 0, 0, 0, 0],
    [2, 1, 1, 1, 1, 1, 1, 7,20,12, 0, 8, 1, 3, 1, 9, 0,12,20, 6, 1, 1, 1, 1, 1, 1, 4],
    [5,20,20,20,20,20,20,20,20,20,20,20,20, 5,20,20,20,20,20,20,20,20,20,20,20,20, 5],
    [5,20, 8, 1, 4,20, 8, 1, 1, 1, 1, 9,20,12,20, 8, 1, 1, 1, 1, 9,20, 2, 1, 9,20, 5],
    [5,20,20,20, 5,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20, 5,20,20,20, 5],
    [11,1, 9,20,12,20,10,20, 8, 1, 1, 1, 1, 3, 1, 1, 1, 1, 9,20,10,20,12,20, 8, 1,13],
    [5,20,20,20,20,20, 5,20,20,20,20,20,20, 5,20,20,20,20,20,20, 5,20,20,20,20,20, 5],
    [5,20, 8, 1, 1, 1,14, 1, 1, 1, 1, 9,20, 5,20, 8, 1, 1, 1, 1,14, 1, 1, 1, 9,20, 5],
    [5,20,20,20,20,20,20,20,20,20,20,20,20, 5,20,20,20,20,20,20,20,20,20,20,20,20, 5],
    [6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,14, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 7]
]

const VOID = 0;
const PELLET = 20;
const POWER_PELLET = 30;
const CHERRY = 40;

const POSITIONS = [
    { x: 25, y: 16}, { x: 16, y: 13}, { x: 1, y: 1}, 
    { x: 10, y: 9},  { x: 23, y: 1},  { x: 16, y: 9}, 
    { x: 13, y: 13}, { x: 4, y: 11},  { x: 10, y: 11}, 
    { x: 22, y: 11}, { x: 16, y: 11}, { x: 1, y: 20}, 
    { x: 10, y: 13}
];

function cloneMatrix(matrix) {
    let m = [];
    for(let i = 0; i < matrix.length; i++) 
        m[i] = matrix[i].slice(0, matrix[i].length);
    return m;
}

/*
* La classe Map gestisce la struttura della Mappa e
* presenta delle funzioni per poterla manipolare
*/
class Map {
    constructor(n_map = 0) {
        this.cherry_time = this.getCherryTime();
        this.num_cherry = 5;
        switch(n_map) {
            case 0: 
                this.matrix = cloneMatrix(MAP_0);
                this.num_pellets = 218;
                break;
            default:
                break;
        }
    }

    setXY(x, y, el) {
        this.matrix[y][x] = el;
    }

    setVoid(x, y) {
        this.setXY(x, y, VOID);
    }

    switchPelletToVoid(x, y) {
        if(this.isPellet(x, y)) {
            this.num_pellets--;
            this.setVoid(x, y);
        }
    }

    isPellet(x, y) {
        return (this.matrix[y][x] === PELLET);
    }

    isVoid(x, y) {
        return (this.matrix[y][x] === VOID);
    }

    isCherry(x, y) {
        return (this.matrix[y][x] === CHERRY);
    }

    setPellet(x, y) {
        this.setXY(x, y, PELLET);
    }

    setPowerPellet(x, y) {
        this.setXY(x, y, POWER_PELLET);
    }

    setCherry(x, y) {
        this.setXY(x, y, CHERRY);
    }

    getCherryTime() {
        return ~~(Math.random() * (30000 - 10000) + 10000);
    }

    updateCherryTime(time) {
        if(this.num_cherry) {
            this.cherry_time -= time;
            if(this.cherry_time <= 0) {
                this.cherry_time = this.getCherryTime();
                return { pos: this.createCherry(), val: CHERRY};
            }
        }
        return null;
    }

    createCherry() {
        let index = ~~(Math.random() * (POSITIONS.length - 1));
        let pos = { ...POSITIONS[index]};
        while(!this.isVoid(pos.x, pos.y)) {
            index = (index + 1) % POSITIONS.length;
            pos = { ...POSITIONS[index]};
        }
        this.setCherry(pos.x, pos.y);
        this.num_cherry--;
        return pos;
    }
}

module.exports = {
    Map: Map
}
