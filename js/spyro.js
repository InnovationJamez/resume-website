// entry point of the program 
window.onload = function(){

    // mode
    let mode = false;
    
    // get a reference to the canvas
    let canvas =  document.getElementById('can');
    var ctx = canvas.getContext('2d');

    // set canvas size
    canvas.width = 500;
    canvas.height = 500;

    let time = 0;

    // position list
    let posList = [];

    // get the middle of the canvas
    let xMid = canvas.width / 2;
    let yMid = canvas.height / 2;

    // list of spyro segments lendth and rotation speed
    let segmentList = [
        {radias:Math.random() * 100,speed:Math.random() * 10 + 5},
        {radias:Math.random() * 100,speed:Math.random() * 10 + 5},
        {radias:Math.random() * 100,speed:Math.random() * 10 + 5}
    ];

    // update function
    function update(){
        // the last position at
        let lastPos = {x:yMid, y:yMid};

        // draw lines
        ctx.beginPath();
        ctx.moveTo(xMid, yMid);

        // draw segments
        segmentList.forEach((element) => {
            let x = lastPos.x + element.radias * Math.cos(time * Math.PI / 180 * element.speed);
            let y = lastPos.y + element.radias * Math.sin(time * Math.PI / 180 * element.speed);
            ctx.lineTo(x, y);
            lastPos = {x:x, y:y};
        });

        // add end to position list
        posList.push(lastPos);

        ctx.stroke();
    }

    if(mode){
        for(let i = 0; i < 360; i++){
            update();
        }
        time += 1;
    }
    else{
        setInterval(() => {
            ctx.clearRect(0,0,innerWidth,innerHeight);
            update()
            ctx.beginPath();
            ctx.moveTo(posList[0].x, posList[0].y);
            posList.forEach((element)=>{
                ctx.lineTo(element.x, element.y);
            });
            ctx.stroke();
            time += 0.1;
        }, 10);
    }


}
