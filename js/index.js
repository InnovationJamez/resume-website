var coll = document.getElementsByClassName("collapsible");

for (var i = 0; i < coll.length; i++) {
  	coll[i].addEventListener("click", function() {
	    this.classList.toggle("active");
	    var content = this.nextElementSibling;
	    if (content.style.display === "block") {
	      	content.style.display = "none";
	    } 
	    else {
	      	content.style.display = "block";
	    }
  });
}

/*
	change the maze image
*/
var butt = document.getElementsByClassName("mazeButton");
for(var index = 0; index < butt.length; index++){
	butt[index].addEventListener("click", function(event){
		// list of content obejects
		var con = document.getElementsByClassName("mazeContent");

		console.log(event.target.value);

		for(var i = 0; i < con.length; i++){
			if(butt[i].value == event.target.value){
				con[i].style.display = "initial";
			}
			else{
				con[i].style.display = "none";
			}
		}	

	});
}


var grad = "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(241,0,0,1) 47%, rgba(0,212,255,1) 100%)";

$(document).ready(function(){
  	console.log("ok");
});

var num = 20;
var change = 0.1;

function setColorGrad(){
	var iff = "linear-gradient(90deg, " + 
				rgba(num * 2, 0, 0, 1) + " 0%, " + 
				rgba(0, 255, 0, 1) + " " + num + "%," + 
				rgba(0, 0, 255 - (num * 2), 1) + " 100%)";
	$("#dyn").css("background", iff);
	num+= change;
	if(num > 80){
		change = -0.1;
	}
	else if(num < 20){
		change = 0.1;
	}
}

function rgba(r, g, b, a){
	var s = "rgba(" + r + "," + g + "," + b + ", " + a + ")";
	return s; 
}

setColorGrad();
setInterval(setColorGrad, 500);


function Pos(x, y){
	this.x = x;
	this.y = y;
}

var can = document.getElementById("can");
var ctx = can.getContext('2d');
can.width = 500;
can.height = can.width;

var horStep;
var verStep;

var lineWidth;
var lineHeight;

$("#enter").click(function(event){
	// reset canvas
	ctx.clearRect(0, 0, can.width, can.height);
	// get the width and height
	var width = parseInt($("#width").val());
	var height = width;

	horStep = can.width / width;
	verStep = can.height / height;

	lineWidth = can.width / (width * 2);
	lineHeight = can.height / (height * 2);

	// maze container
	var maze = [];
	for (var i = 0; i < width * height; i++)
		maze.push(false);

	// position list 
	var pos = [];

	// initial position
	curr = new Pos(getRandomInt(width), getRandomInt(height));

	// initial position
	pos.push(new Pos(curr.x, curr.y));

	// set position as visited
	maze[curr.y * width + curr.x] = true;

	// loop until pos is empty
	while(pos.length > 0){
		console.log(curr.x + " " + curr.y);
		// check the bounds
		var choice = checkBounds(curr, maze, width, height);
		// none
		if(choice == -1){
			// pop the end
			pos.pop();
			// set new curr
			curr = pos[pos.length - 1];
		}
		// up
		else if(choice == 1){
			// draw rect
			drawRect(curr.x, curr.y + 1, curr.x, curr.y);
			// go up
			curr.y++;
			// set position as visited
			maze[curr.y * width + curr.x] = true;
			// add position
			pos.push(new Pos(curr.x, curr.y));
		}
		// down
		else if(choice == 2){
			// draw rect
			drawRect(curr.x, curr.y - 1, curr.x, curr.y);
			// go down
			curr.y--;
			// set position as visited
			maze[curr.y * width + curr.x] = true;
			// add position
			pos.push(new Pos(curr.x, curr.y));
		}
		// right
		else if(choice == 3){
			// draw rect
			drawRect(curr.x + 1, curr.y, curr.x, curr.y);
			// go right
			curr.x++;
			// set position as visited
			maze[curr.y * width + curr.x] = true;
			// add position
			pos.push(new Pos(curr.x, curr.y));
		}
		// left
		else if(choice == 4){
			// draw rect
			drawRect(curr.x - 1, curr.y, curr.x, curr.y);
			// go left
			curr.x--;
			// set position as visited
			maze[curr.y * width + curr.x] = true;
			// add position
			pos.push(new Pos(curr.x, curr.y));
		}
		else{

		}
	}

});

function checkBounds(curr, maze, width, height){
	// open directions
	var open = [];
	// check up
	if(curr.y >= height - 1){
		// pass
	}
	else if(maze[(curr.y + 1) * width + curr.x] == false){
		open.push(1);
	}
	// check down
	if(curr.y == 0){
		// pass
	}
	else if(maze[(curr.y - 1) * width + curr.x] == false){
		open.push(2);
	}
	// check right
	if(curr.x >= width - 1){
		// pass
	}
	else if(maze[curr.y * width + curr.x + 1] == false){
		open.push(3);
	}
	// check left
	if(curr.x == 0){
		// pass
	}
	else if(maze[curr.y * width + curr.x - 1] == false){
		open.push(4);
	}

	if(open.length > 0){
		return open[getRandomInt(open.length)];
	}
	else{
		return -1;
	}
}

function drawRect(x, y, x1, y1){
	ctx.beginPath();
	ctx.moveTo((x + 0.5) * horStep, (y + 0.5) * verStep);
	ctx.lineTo((x1 + 0.5) * horStep, (y1 + 0.5) * verStep);
	ctx.strokeStyle = "white";
	ctx.lineWidth = (x == x1) ? lineHeight : lineWidth;
	ctx.stroke();
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}