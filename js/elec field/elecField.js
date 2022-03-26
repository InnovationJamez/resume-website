/*
	called when the website finishes loading
	create range change event listeners
	set dim of canvas
*/

/*
	global variables
*/

// the field width and height
var bWidth, bHeight;

// the min x and y values
var minX, minY;

// pixel width and height of field
var rWidth, rHeight;

// get the scale of the field
var scale;

// the dimension of each block
var dim;

// ratio
var ratio;

// list of ions
var ions = [];

// index of selected ion
var selected = -1;


// for good practice
'use strict';

function start(){
	// get refrence to canvas
	var layerOne = document.getElementById("layerOne");
	var layerTwo = document.getElementById("layerTwo");

	// set init input values
	bWidth = parseFloat($("#in2").val());
	bHeight = parseFloat($("#in3").val());
	scale = parseFloat($("#in1").val());
	dim =  parseFloat($("#dim").val());

	// set the dimensions of layer one
	layerOne.width = window.innerWidth * 0.75;
	layerOne.height = window.innerHeight * 0.99;

	// et the dimension of layer two
	layerTwo.width = window.innerWidth * 0.75;
	layerTwo.height = window.innerHeight * 0.99;

	/*
		list of event listeners for each html element
	*/

	// scale change listener
	$("#in1").change(function(){
		// get the scale of the field
		scale = parseFloat($("#in1").val());
		// get html element
		$("#out1").html(scale);
		// update the screen
		update(layerOne, layerTwo);
	});

	// width change listener
	$("#in2").change(function(){
		// get the width of the field
		bWidth = parseFloat($("#in2").val());
		// set the html element to val
		$("#out2").html(bWidth);
		// set the ions as zero
		ions = [];
		// draw the field and arrows
		update(layerOne, layerTwo);
	});

	// height change listener
	$("#in3").change(function(){
		// get the heieght of the field
		bHeight = parseFloat($("#in3").val());
		// print the value recorded
		$("#out3").html(bHeight);
		// set the ions as zero
		ions = [];
		// redraw the field
		update(layerOne, layerTwo);
	});

	// the dim of each square
	$("#dim").change(function(){
		// set the ions as zero
		ions = [];
		// get the heieght of the field
		dim = parseFloat($("#dim").val());
		// print the value recorded
		$("#dimLabel").html(dim);
		// update the field
		update(layerOne, layerTwo);
	});

	// arrow density
	$("#in4").change(function(){
		// set htmnl object
		$("#out4").html($("#in4").val());
		// draw arrow
		drawArrows(layerTwo);
		// draw the ions
		drawIons(layerTwo);
	});

	// click listener for add ion button
	$("#addIon").click(function(){
		var charge = parseInt($("#charge").val());
		// add ions to the list
		ions.push(new Ion(bWidth * dim * 0.5, bHeight * dim * 0.5, charge));
		// draw ions
		update(layerOne, layerTwo);
	});

	// canvas mouse on move update
	$("#layerTwo").mousemove(function(event){
		// if ion is selected move to mouse
		if(selected != -1){
			// set ion postion to mouse position adjusted
			ions[selected].x = getTheoX(event.pageX);
			ions[selected].y = getTheoY(event.pageY);
			// draw the arrows
			drawArrows(layerTwo);
			drawIons(layerTwo);
		}
	});

	// when the user clicks the screen
	$("#layerTwo").click(function(event){
		/// get the adjusdted x value
		var adjX = getTheoX(event.pageX);
		// get the adjusted y value
		var adjY = getTheoY(event.pageY);
		// the theohretical dimensions of the field
		var theoWidth = bWidth * dim;
		var theoHeight = bHeight * dim;
		// if no ion is selected find one
		if(selected == -1){
			// for each ion check if it was clicked
			ions.forEach(function(item, index){
				// get the x distance
				var width = Math.abs(item.x - adjX);
				// get the y distance
				var height = Math.abs(item.y - adjY);
				// get the length
				console.log(width.toFixed(2) + " " + item.rad / ratio);
				console.log(height.toFixed(2) + " " + item.rad / ratio);
				if(width < item.rad / ratio && height < item.rad / ratio){
					// select the clicked ion
					selected = index;
					// break loop so only one ions is selected
					return;
				}
			});
		}
		// the ion has moved off the scren
		else if(adjX < 0 || adjX > theoWidth || adjY < 0 || adjY > theoHeight){
			// remove the ion
			ions.splice(selected, 1);
			// set the selected to 0
			selected = -1;
			// draw arrow
			drawArrows(layerTwo);
			// draw the ions
			drawIons(layerTwo);

		}
		else{

			// drop the selected ion
			selected = -1;
		}
	});

	update(layerOne, layerTwo);
}

/*
	get x screen x value return the theo x value
*/
function getTheoX(x){
	return (x - minX) / ratio;
}

/*
	get y screen y value return the theo y value
*/
function getTheoY(y){
	return (y - minY) / ratio;
}

/*
	update the screen
*/
function update(layerOne, layerTwo){

	/* get values from the user */

	/* calculate dimensions */

	// set ratio based on the height of the canvas
	ratio = layerOne.height * scale;

	// the theohretical dimensions of the field
	var theoWidth = bWidth * dim;
	var theoHeight = bHeight * dim;

	// get the real width and height (pixel space) of field
	rWidth = theoWidth * ratio;
	rHeight = theoHeight * ratio;

	// get the min x and y in for the field (pixels)
	minX = (layerOne.width - rWidth) / 2;
	minY = (layerOne.height - rHeight) / 2;
	
	// redraw the field
	drawField(layerOne);
	// draw arrow
	drawArrows(layerTwo);
	// draw the ions
	drawIons(layerTwo);
}

/*
	draw the field
	get input from user
*/
function drawField(layerOne){
	// get context
	var c1 = layerOne.getContext('2d');

	// get the dimension of each block
	var wStep = rWidth / bWidth;
	var hStep = rHeight / bHeight;

	/* begin drawing */

	// clear the canvas
	c1.clearRect(0, 0, layerOne.width, layerTwo.height);

	// create field background
	c1.fillStyle = "lightgreen";
	c1.fillRect(minX, minY, rWidth, rHeight);

	// begin drawing 
	c1.beginPath();

	// draw the vertical dividers for the field
	for(var i = 0; i < (bWidth + 1); i++){
		// calc x location
		var x = minX + i * wStep;
		// draw
		c1.moveTo(x, minY);
		c1.lineTo(x, rHeight + minY);
	}
	// draw the horizontal dividers for the field
	for(var j = 0; j < (bHeight + 1); j++){
		// calc y value
		var y = (j * hStep) + minY;
		// draw 
		c1.moveTo(minX, y);
		c1.lineTo(minX + rWidth, y);
	}
	// finish drawing
	c1.stroke();
}

/*
	draw arrows
*/
function drawArrows(layerTwo){
	// get context of layer 2
	var c2 = layerTwo.getContext('2d');

	// get the density of the arrows
	var arr = $("#in4").val();

	// get the distance between the arrows
	var wStep = rWidth / arr;
	var hStep = rHeight / arr;

	// clear the canvas
	c2.clearRect(0, 0, layerTwo.width, layerTwo.height);

	// draw arrows
	for(var i = 0; i < arr; i++){
		for(var j = 0; j < arr; j++){
			// get position
			var x = (i + 0.5) * wStep + minX;
			var y = (j + 0.5) * hStep + minY;
			// get angle
			var arrow = getElecField(getTheoX(x), getTheoY(y));
			// draw field arrows if mag > 0
			if(arrow.mag > 0)
				drawArrow(x, y, arrow.mag, arrow.angle, 20, c2);
		}
	}
}

/*

/*
	draw an arrow at set locaion and in set direction
	x: x position
	y: y position
	mag: length of arrow
	angle: angle of arrow
	c2: canvas
*/
function drawArrow(x, y, mag, angle, r, c2){

	// get the len from mag
	let len = Math.sqrt(Math.cbrt(mag));

	// arrow head ends value
	var arEnd = Math.PI * 0.40;
	// begin path
	c2.beginPath();
	// tip fo arrow of arrow
	c2.lineTo(len * Math.cos(angle) * r + x, len * Math.sin(angle) * r + y);
	// arrow head right
	c2.lineTo(len * Math.cos(angle + arEnd) * r * 0.4 + x, len * Math.sin(angle + arEnd) * r * 0.4 + y);

	// arrow base right
	c2.lineTo(len * Math.cos(angle + Math.PI * 0.14) * r * 0.3 + x, 
	len * Math.sin(angle + Math.PI * 0.14) * r * 0.3 + y);
	
	// arrow stem right
	c2.lineTo(len * Math.cos(angle + Math.PI * 0.95) * r + x, 
	len * Math.sin(angle + Math.PI * 0.95) * r + y);
	// arrow stem left 
	c2.lineTo(len * Math.cos(angle + Math.PI * 1.05) * r + x, 
	len * Math.sin(angle + Math.PI * 1.05) * r + y);

	// arrow base left
	c2.lineTo(len * Math.cos(angle - Math.PI * 0.14) * r * 0.3 + x, 
	len * Math.sin(angle - Math.PI * 0.14) * r * 0.3 + y);

	// arrow head left
	c2.lineTo(len * Math.cos(angle - arEnd) * r * 0.4 + x, 
	len * Math.sin(angle - arEnd) * r * 0.4 + y);
	
	// back to the tip fo arrow of arrow
	c2.lineTo(len * Math.cos(angle) * r + x, len * Math.sin(angle) * r + y);
	// fill in arrow
	c2.fillStyle = "red";
	c2.fill(); 
	// finish drawing line
	c2.lineWidth = 1;
	c2.stroke();
}


/*
	get two points and return the angle
	x, y : arrow postion
	x1, y1 : ion position
*/
function getAngle(x, y, x1, y1){
	// the angle 
	if(x1 > x){
		var angle = Math.atan((y - y1)/(x - x1));
	}
	else{
		var angle =  Math.PI + Math.atan((y - y1)/(x - x1));
	}

	return angle % (2 * Math.PI);
}

/*
	get angle from two measurements
*/

function getTwoAngle(w, h){
	// the angle 
	if(w < 0){
		var angle = Math.atan(h / w);
	}
	else{
		var angle =  Math.PI + Math.atan(h / w);
	}

	return angle % (2 * Math.PI);
}

/*
	the ion constructor
	store positon and drag and drop
*/
function Ion(x, y, c){
	// x position of the ion
	this.x = x;
	// y position of the ion
	this.y = y;
	// the charge of the ion
	this.c = c;
	// the radias
	this.rad;

	// draw the ion
	this.draw = function(c2){
		// set the radias
		this.rad = ratio * 0.01;
		// adjusted x
		var x = (this.x * ratio) + minX;
		// adjusted y
		var y = (this.y * ratio) + minY;
		// draw the circle
		c2.beginPath();
		c2.arc(x, y, this.rad, 0, 2 * Math.PI);
		// draw the plus
		c2.moveTo(x + this.rad * 0.8, y);
		c2.lineTo(x - this.rad * 0.8, y);
		// draw verital line if posetive
		if(this.c > 0){
			c2.moveTo(x, y + this.rad * 0.8);
			c2.lineTo(x, y - this.rad * 0.8);
		}
		// set the color of the ion
		c2.lineWidth = 2;
		c2.fillStyle = (this.c > 0) ? "grey" : "red";
		// fill in the shape
		c2.fill();
		// end line
		c2.stroke();
	}
}

/*
	for each ion draw the ion in the field
*/
function drawIons(layerTwo){
	// get the context of the layer
	var c2 = layerTwo.getContext('2d');
	// for each ion draw
	ions.forEach(function(item, index){
		item.draw(c2);
	});
}

/*
	electric field calculations
	for each arrow determine its direction
	x : arrow x position
	y : arrow y position
*/
function getElecField(x, y){
	// x and y components of e field
	var xList = [], yList = [];

	// object for arrow
	let arrow = {
		angle:0,
		mag:0
	};

	// for each ion add the components of the e field
	ions.forEach(function(item, index){
		// get the electric field magnitude
		var field = item.c / (Math.abs(x - item.x) + Math.abs(y - item.y));
		// get the angle of the ion to arrow
		var a = getAngle(x, y, item.x, item.y);
		// add x component
		xList.push(Math.cos(a) * field);
		// add y component
		yList.push(Math.sin(a) * field);
	});

	// check the number of components
	if(xList.length > 0){
		// get the sum of x elements
		var sumX = xList.reduce((a, b) => a + b, 0);
		// get the sum of y elements
		var sumY = yList.reduce((a, b) => a + b, 0);
		// get the angle of the resulting field
		arrow.angle = getTwoAngle(sumX, sumY);
		// get the magnitude of the filed
		arrow.mag = Math.sqrt(sumX ** 2 + sumY ** 2);
		// return the value
		return arrow;
	}
	// if no ions return o
	else{
		return arrow;
	}
}

/*
get a 

/*
	when the program is ready call the start function
*/
$(document).ready(function(){
	start();
});