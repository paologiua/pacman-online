
/*
* Funzioni per trovare il percorso minimo tra un
* punto e un altro
*/

function posInMatrix(map, x, y) {
    if(x >= 0 && x < map.length)
        return true;
    if(y >= 0 && y < map[0].length)
        return true;
    return false;
}

function findAdjacentLocations(map, pos) {
    let adj = [];

    if(posInMatrix(map, pos.x - 1, pos.y) && (map[pos.x - 1][pos.y] === 0 || map[pos.x - 1][pos.y] > 14)) {
        adj.push({x: pos.x - 1, y: pos.y});
        map[pos.x - 1][pos.y] = -1;
    }

    if(posInMatrix(map, pos.x, pos.y - 1) && (map[pos.x][pos.y - 1] === 0 || map[pos.x][pos.y - 1] > 14)) {
        adj.push({x: pos.x, y: pos.y - 1});
        map[pos.x][pos.y - 1] = -1;
    }

    if(posInMatrix(map, pos.x + 1, pos.y) && (map[pos.x + 1][pos.y] === 0 || map[pos.x + 1][pos.y] > 14)) {
        adj.push({x: pos.x + 1, y: pos.y});
        map[pos.x + 1][pos.y] = -1;
    }

    if(posInMatrix(map, pos.x, pos.y + 1) && (map[pos.x][pos.y + 1] === 0 || map[pos.x][pos.y + 1] > 14)) {
        adj.push({x: pos.x, y: pos.y + 1});
        map[pos.x][pos.y - 1] = -1;
    }

    return adj;
}

function cloneMatrix(matrix) {
    matrix.length = Object.keys(matrix).length;

    let m = [];
    for(let i = 0; i < matrix.length; i++) {
        matrix[i].length = Object.keys(matrix[i]).length;
        m[i] = matrix[i].slice(0, matrix[i].length);
    }
    
    return m;
}

var buffer = null;
var m = null;

function minimumPaths(map, pos) {
    buffer = [{pos: pos, val: -1}];
    map[pos.x][pos.y] = -1;
    m = cloneMatrix(map);
    
    let i = 0;
    while(true) {
        if(i >= buffer.length)
            break;
        let adj = findAdjacentLocations(map, buffer[i].pos);
        for(let j in adj) {
            buffer.push({pos: adj[j], val: i});
            m[adj[j].x][adj[j].y] = buffer.length - 1;
        }
        i++;
    }
}

function getPath(pos) {
    let path = [];
    let index = m[pos.x][pos.y];
    while(index !== -1) {
        path.push(buffer[index].pos);
        index = buffer[index].val;
    }

    return path;
}


onmessage = function (event) { 
    switch(event.data.action) {
        case 'init':
            minimumPaths({...event.data.map}, event.data.pos);
            break;
        case 'get path':
            let path = getPath(event.data.pos);

            let index = 0
            let inetervalID = setInterval(function () {
                if(index >= path.length * 2 - 1) {
                    postMessage({ action: 'end animation', socket_id: event.data.socket_id});
                    clearInterval(inetervalID);
                }
                else if(index % 2 === 0){
                    postMessage({ socket_id: event.data.socket_id, pos: path[~~(index / 2)]});
                } else {
                    let delta_x = (path[~~(index / 2) + 1].x - path[~~(index / 2)].x);
                    let delta_y = (path[~~(index / 2) + 1].y - path[~~(index / 2)].y);

                    postMessage({ action: 'animation', socket_id: event.data.socket_id, pos: { x: path[~~(index / 2)].x + delta_x / 2, y: path[~~(index / 2)].y + delta_y / 2}});
                }
                index++;
            }, 20);
    }
}
