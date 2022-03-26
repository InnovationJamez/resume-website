// constants
const RAD = Math.PI / 180;
const RGB = 255;

//get the canvas
let catCanvas = document.getElementById("catCanvas");

// cat can context
let catCtx = catCanvas.getContext("2d");

// set dimensions
catCanvas.width = 500;
catCanvas.height = 500;

// animation
let anim;

// time passed
let time = 0;

// coords
let x = 250;
let y = 250;

// direction 
let dx = Math.random() * 3 + 1;
let dy = Math.random() * 3 + 1;

// draw variable
let square = false;

catCanvas.addEventListener("mouseover", ()=>{
    anim = setInterval(() => {
        // set color
        catCtx.fillStyle = getColor();
        catCtx.strokeStyle = getColor();
        // rectagle
        if(square){
            catCtx.fillRect(x, y, 50, 50);
        }
        else{
            circle();
        }

        // move
        x += dx;
        y += dy;

        if (x > 450 || x < 0) {
            dx = -dx;
        }
        if (y > 450 || y < 0) {
            dy = -dy;
        }

        // increemnt time
        time++;
    }, 1);
});

catCanvas.addEventListener("mouseout", ()=>{
    clearInterval(anim);
    anim = null;
});

// draw circle
function circle(){
    catCtx.beginPath();
    catCtx.arc(x + 25, y + 25, 25, 0, 2 * Math.PI, false);
    catCtx.fill();
    catCtx.stroke();
}

// get color grtadient
function getColor() {
    let r = Math.cos(time * RAD) * RGB;
    let g = Math.cos(time * RAD - 2 * Math.PI / 3) * RGB;
    let b = Math.cos(time * RAD - 4 * Math.PI / 3) * RGB;

    let color = `rgb(${r},${g},${b})`;
    return color;
}

function wierdColor(){
    switch(time % 4){
        case 0:
            return "red";
        case 1:
            return "green";
        case 2:
            return "blue";
        case 3:
            return "yellow";
    }
}


