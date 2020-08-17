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
	console.log("value: " + iff);
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