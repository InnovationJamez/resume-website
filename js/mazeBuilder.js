// constants
const UP = 1;
const DOWN = 2;
const RIGHT = 4;
const LEFT = 8;
const VISIT = 16;
const SOLVE = 32;


// get random number
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

// scramble an array
function scramble(array){
    for(let i = 0; i < 5; i++){
        let r1 = getRandomInt(array.length);
        let r2 = getRandomInt(array.length);

        // hold so not lost
        let hold = array[r1];
        // swap the values
        array[r1] = array[r2];
        array[r2] = hold;
    }
}

// conect number to string direction for debugging
function word(number) {
    switch (number) {
        case UP:
            return "UP";
        case DOWN:
            return "DOWN";
        case LEFT:
            return "LEFT";
        case RIGHT:
            return "RIGHT";
        default:
            return "Back";
    }
}

// check surounging cells and find open ones 
function checkNeighbor(maze, pos, dim) {
    // store directions
    let dir = [];

    // check up 
    if (pos.y < (dim - 1) && (maze[(pos.y + 1) * dim + pos.x] & VISIT) == 0)
        dir.push(UP);
    // check down
    if (pos.y > 0 && (maze[(pos.y - 1) * dim + pos.x] & VISIT) == 0)
        dir.push(DOWN);
    // check right
    if (pos.x < (dim - 1) && (maze[pos.y * dim + pos.x + 1] & VISIT) == 0)
        dir.push(RIGHT);
    // check left
    if (pos.x > 0 && (maze[pos.y * dim + pos.x - 1] & VISIT) == 0)
        dir.push(LEFT);

    // return -1 if no way to go
    if (dir.length == 0) {
        return -1;
    }
    else {
        scramble(dir);
        let index = getRandomInt(dir.length - 1);
        return dir[index];
    }
}

function drawMaze(maze, dim){
    let c = document.getElementById("mazeCanvas");
    let ctx = c.getContext("2d");

    c.width = 500;
    c.height = 500;

    let line = 500 / (dim * 2);
    let step = 500 / dim;

    ctx.strokeStyle = "white";
	ctx.lineWidth = line;

    for(let j = 0; j < dim; j++){
        for(let i = 0; i < dim; i++){
            if((maze[j * dim + i] & UP) != 0){
                ctx.beginPath();
                ctx.moveTo((i + 0.5) * step, (j + 0.5) * step);
                ctx.lineTo((i + 0.5) * step, (j + 1.5) * step);
                ctx.stroke();
            }
            if((maze[j * dim + i] & LEFT) != 0){
                ctx.beginPath();
                ctx.moveTo((i + 0.5) * step, (j + 0.5) * step);
                ctx.lineTo((i - 0.5) * step, (j + 0.5) * step);
                ctx.stroke();
            }
        }
    }

    if(document.getElementById("solve").checked){
        let solution = solve(maze, dim);
    
        ctx.strokeStyle = "red";
    
        for(let i = 0; i < solution.length - 1; i++){
            let curr = solution[i];
            let next = solution[i + 1];
            ctx.beginPath();
            ctx.moveTo((curr.x + 0.5) * step, (curr.y + 0.5) * step);
            ctx.lineTo((next.x + 0.5) * step, (next.y + 0.5) * step);
            ctx.stroke();
        }
    }
}


/*

growing tree algo

*/

function growingTree() {
    // get dim of maze
    let dim = document.getElementById("dim").value;

    // create data to store maze
    var maze = [];

    // list of traversed positions
    let pos = [];

    // get intial location for traversal
    let init = {
        x: getRandomInt(dim),
        y: getRandomInt(dim)
    };

    // get the starting position for traversal
    // add initial postion to pos list
    pos.push(init);

    // add elements for dimensions
    for (let i = 0; i < dim * dim; i++) {
        maze.push(0);
    }

    // set initial tile as visited
    maze[init.y * dim + init.x] |= VISIT;

    // lop until find all in maze
    while (pos.length > 0) {

        // get the current position 
        // tree pull from the end
        let current = pos[pos.length - 1];

        // grow tree get cuttent pos and check suroundings && prim get random pos
        let dir = checkNeighbor(maze, current, dim);

        // if no locations found back track
        // growing tree pop the end
        if (dir == -1) {
            pos.pop();
        }
        else {
            // move in direction selected
            switch (dir) {
                case UP:
                    // set connection to tile
                    maze[current.y * dim + current.x] |= UP;
                    current.y++;
                    maze[current.y * dim + current.x] |= DOWN;
                    // set visited
                    maze[current.y * dim + current.x] |= VISIT;
                    break;
                case DOWN:
                    maze[current.y * dim + current.x] |= DOWN;
                    current.y--;
                    maze[current.y * dim + current.x] |= UP;
                    maze[current.y * dim + current.x] |= VISIT;
                    break;
                case LEFT:
                    maze[current.y * dim + current.x] |= LEFT;
                    current.x--;
                    maze[current.y * dim + current.x] |= RIGHT;
                    maze[current.y * dim + current.x] |= VISIT;
                    break;
                case RIGHT:
                    // set connection
                    maze[current.y * dim + current.x] |= RIGHT;
                    current.x++;
                    maze[current.y * dim + current.x] |= LEFT;
                    // set the new tile as visisted
                    maze[current.y * dim + current.x] |= VISIT;
                    break;
            }

            // add the new positon to list of positions
            pos.push({ x: current.x, y: current.y });
        }
    }
    drawMaze(maze, dim);
}

/*

prim algo

*/

function prim(){
    // get dim of maze
    let dim = document.getElementById("dim").value;

    // create data to store maze
    var maze = [];

    // list of traversed positions
    let pos = [];

    // get intial location for traversal
    let init = {
        x: getRandomInt(dim),
        y: getRandomInt(dim)
    };

    // get the starting position for traversal
    // add initial postion to pos list
    pos.push(init);

    // add elements for dimensions
    for (let i = 0; i < dim * dim; i++) {
        maze.push(0);
    }

    // set initial tile as visited
    maze[init.y * dim + init.x] |= VISIT;

    // lop until find all in maze
    while (pos.length > 0) {

        // get the current position 
        // tree pull from the end
        let index = getRandomInt(pos.length - 1);
        let current = pos[index];

        // grow tree get cuttent pos and check suroundings && prim get random pos
        let dir = checkNeighbor(maze, current, dim);

        // if no locations found back track
        // growing tree pop the end
        if (dir == -1) {
            pos.splice(index, 1);
        }
        else {
            // move in direction selected
            switch (dir) {
                case UP:
                    // set connection to tile
                    maze[current.y * dim + current.x] |= UP;
                    current.y++;
                    maze[current.y * dim + current.x] |= DOWN;
                    // set visited
                    maze[current.y * dim + current.x] |= VISIT;
                    break;
                case DOWN:
                    maze[current.y * dim + current.x] |= DOWN;
                    current.y--;
                    maze[current.y * dim + current.x] |= UP;
                    maze[current.y * dim + current.x] |= VISIT;
                    break;
                case LEFT:
                    maze[current.y * dim + current.x] |= LEFT;
                    current.x--;
                    maze[current.y * dim + current.x] |= RIGHT;
                    maze[current.y * dim + current.x] |= VISIT;
                    break;
                case RIGHT:
                    // set connection
                    maze[current.y * dim + current.x] |= RIGHT;
                    current.x++;
                    maze[current.y * dim + current.x] |= LEFT;
                    // set the new tile as visisted
                    maze[current.y * dim + current.x] |= VISIT;
                    break;
            }

            // add the new positon to list of positions
            pos.push({ x: current.x, y: current.y });
        }
    }

    drawMaze(maze, dim);
}

/*
solve the maze and draw the solution
*/
function solve(maze, dim){
    // the list of positions
    let posList = [{x:0, y:0}];
    let curr = {x:0, y:0};

    // loop until gets to end
    while(curr.x < (dim - 1) || curr.y < (dim - 1)){
        // shallow
        let s = posList[posList.length - 1];
        // create a deep copy
        curr = {x:s.x, y:s.y};
        let dir = -1;

        // check up connection and the cell above solved yet
        if((maze[curr.y * dim + curr.x] & UP) != 0 && 
        (maze[(curr.y + 1) * dim + curr.x] & SOLVE) == 0){
            dir = UP;
        }
        // check down and south neighbor
        else if((maze[curr.y * dim + curr.x] & DOWN) != 0 && 
        (maze[(curr.y - 1) * dim + curr.x] & SOLVE) == 0){
            dir = DOWN;
        }
        // check left and west neightbor
        else if((maze[curr.y * dim + curr.x] & LEFT) != 0 && 
        (maze[curr.y * dim + curr.x - 1] & SOLVE) == 0){
            dir = LEFT;
        }
        // check right and right neighbor
        else if((maze[curr.y * dim + curr.x] & RIGHT) != 0 && 
        (maze[curr.y * dim + curr.x + 1] & SOLVE) == 0){
            dir = RIGHT;
        }
        else{
            dir = -1;
        }

        if(dir == -1){
            posList.pop();
        }
        else {
            // move
            switch (dir) {
                case UP:
                    // move 
                    curr.y++;
                    // set solved
                    maze[curr.y * dim + curr.x] |= SOLVE;
                    break;
                case DOWN:
                    curr.y--;
                    maze[curr.y * dim + curr.x] |= SOLVE;
                    break;
                case LEFT:
                    curr.x--;
                    maze[curr.y * dim + curr.x] |= SOLVE;
                    break;
                case RIGHT:
                    curr.x++;
                    // set the new tile as solved
                    maze[curr.y * dim + curr.x] |= SOLVE;
                    break;
            }

            // ad new position to pos list
            posList.push({x:curr.x, y:curr.y});
        }
    }

    return posList;
}

/*

begin

*/

prim();