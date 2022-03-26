// canvas refrence variables
var can = document.getElementById('can');
var c = can.getContext('2d');

// input html handler
var inputList = document.getElementById('inputList');

// the number of segments
var segNum = 3;

// time
var time = 0;

// set the width of the canvas
can.width = window.innerWidth;
can.height = window.innerHeight;

// the center of the canvas
var xCenter = can.width / 2;
var yCenter = can.height / 2;

// the positions of the drawer
var xValues = [xCenter, 0, 0, 0, 0, 0, 0, 0];
var yValues = [yCenter, 0, 0, 0, 0, 0, 0, 0];

// the radias of the segments
var radias = [75, 45, 75, 30];
// the rotation speed
var speeds = [-50, 20, -1, 20];

// holds the positions to drawlines
var xList = [];
var yList = [];

// refrence to interval functions
var func1;
var func2;

// stores if the animation is playing
var start = false;

// stores a list of radias inputs
var radInputs = [];

// radias label
var radLabels = [];

// stores a list of speed inputs
var speedInputs = [];

// speed label
var speedLabel = [];

// create inputs radias, speed
function createInputs(){
	// string to holf html
	var string = "";
	// lists of html ids
	var radId = [];
	var speedId = [];
	// label id names
	var rValueInput = [];
	var sValueInput = [];
	// for each segment add html to string
	for(var i = 0; i < segNum; i++){
		// add the refrences
		radId.push(i + "rad");
		speedId.push(i + "speed");
		rValueInput.push(i + "radInput");
		sValueInput.push(i + "sValue");

		// create the strings
		string += "<input min='10' " + 
			"max='100' value='50' type='range'" + 
			"id=\'" + i + "rad\'>";
		// label
		string += "<label id='" + i + "radInput''>Value: </label>";
		// speed value
		string += "<input min='-10' " + 
			"max='10' value='5' type='range'" + 
			"id=\'" + i + "speed\'>";
		// speed label
		string += "<label id='" + i + "sValue''>Value: </label><br>";
	}
	// set the html of input
	inputList.innerHTML = string;
	// set the html handlers
	for(var i = 0; i < segNum; i++){
		radInputs.push(document.getElementById(radId[i]));
		speedInputs.push(document.getElementById(speedId[i]));
		radLabels.push(document.getElementById(rValueInput[i]));
		speedLabel.push(document.getElementById(sValueInput[i]));
	}
	// set values
	setValues();
}

/*
	create event listeners for inputs
*/
function eventListener(){
	// add new
	for(var i = 0; i < segNum; i++){
		radInputs[i].addEventListener("change", function(){
			setLabels();
		});
		speedInputs[i].addEventListener("change", function(){
			setLabels();
		});
	}
}

/*
	set the value of the labels
*/
function setLabels(){
	for(var i = 0; i < segNum; i++){
		radLabels[i].innerHTML = radInputs[i].value;
		speedLabel[i].innerHTML = speedInputs[i].value;
	}
}

// set the values of the spyro
function setValues(){
	// set labels
	setLabels();
	// add event listeners
	eventListener();
	// the redias and speed values to 0
	radias = [];
	speeds = [];
	// reset list
	xList = [];
	yList = [];
	// set time to zero
	time = 0;
	// stop animation
	stopAnim();
	// set the redais and speed of segments
	for(var i = 0; i < segNum; i++){
		radias.push(radInputs[i].value);
		console.log(radInputs[i].value);
		speeds.push(speedInputs[i].value);
		console.log(speedInputs[i].value);
	}
	// clear the screen
	c.clearRect(0, 0, can.width, can.height);
}

// edit input
function editInput(num){
	// edit the number
	segNum+=num;
	// check the number
	if(segNum > 1){
		createInputs();
		// set labels
		setLabels();
		// add event listeners
		eventListener();
	}
}

// update function
function update(){
	c.clearRect(0, 0, can.width, can.height);

	var len = xValues.length;

	drawPath();

	for(var i = 1; i < len; i++){
		xValues[i] = xValues[i - 1] + radias[i - 1] * Math.cos(speeds[i - 1] * time);
		yValues[i] = yValues[i - 1] + radias[i - 1] * Math.sin(speeds[i - 1] * time);
		printLine(xValues[i - 1], yValues[i - 1], xValues[i], yValues[i]);
	}
	time -= 0.001;
}

// draw the path of the line and the drawer
function drawPath(){
	var len = xList.length;
	for(var i = 1; i < len; i++){
		var color = "rgb(" + 255 + ", 0, " + 255 / len * i + ")";
		printLine(xList[i - 1], yList[i - 1], xList[i], yList[i], color);
	}
	printLine(xValues[xValues.length - 1], yValues[xValues.length - 1], xList[xList.length - 1], yList[xList.length - 1],"rgb(255,0,255)");
}

// add the position to the lsit
function addPoint(x, y){
	xList.push(x);
	yList.push(y);

	if(xList.length > 500){
		xList.shift();
		yList.shift();
	}
}

// print a line
function printLine(x, y, x1, y1, color = "rgb(255,255,255"){
	c.beginPath();
	c.moveTo(x, y);
	c.lineTo(x1, y1);
	c.lineWidth = 5;
	c.strokeStyle = color;
	c.stroke();
}

// print a circle
function printCirc(x, y){
	c.beginPath();
	c.arc(x, y, 50, 0, 2 * Math.PI);
	c.fill();
	c.stroke();
}

// stop the animation
function stopAnim(){
	if(start){
		clearInterval(func1);
		clearInterval(func2);
		start = false;
	}
}

// start the animation
function startAnim(){
	if(!start){
		func1 = setInterval(update, 50);
		func2 = setInterval(function(){
			addPoint(xValues[segNum], 
				yValues[segNum]);
		}, 200)
		start = true;
	}
}

// function calls
createInputs();