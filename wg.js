let count = 0;
let avgX = 0;
let avgY = 0;

window.onload = function() {
    // create a heatmap instance
    var heatmap = h337.create({
    container: document.getElementById('heatmapContainer'),
    maxOpacity: .4,
    radius: 50,
    blur: .90,
    // backgroundColor with alpha so you can see through it
    backgroundColor: 'rgba(255, 255, 255, 0)'
    });
    var heatmapContainer = document.getElementById('heatmapContainerWrapper');
    heatmapContainer.hidden = true;
    function pinta(valX,valY) {
        heatmap.addData({ x: valX, y: valY, value: 1 });
    };
    document.getElementById("HSButton").addEventListener("click", function() {
            document.getElementById("heatmapContainerWrapper").hidden = false;
    }, false);

    heatmapContainer.onclick = function(e) {
    var x = e.layerX;
    var y = e.layerY;
    heatmap.addData({ x: x, y: y, value: 1 });
    };

    pontos=5;
    var arrayX = new Array(pontos);
    var arrayY = new Array(pontos);
    webgazer.setRegression('ridge') /* currently must set regression and tracker */
    //.setTracker('clmtrackr')
    .setGazeListener(function(data, clock) {
        try{
            //console.log(data.x);
            //console.log(data.y);
            arrayX[count]=Math.ceil(data.x);
            arrayY[count]=Math.ceil(data.y);
            count++;
            if(count==pontos){
                var totalX = 0;
                var totalY = 0;
                for(var i = 0; i < pontos; i++) {
                    totalX += arrayX[i];
                    totalY += arrayY[i];
                }
                var avgX = totalX / pontos;
                var avgY = totalY / pontos;
                console.log(avgX," | ",avgY)
                arrayX= new Array(pontos)
                arrayY= new Array(pontos)
                count=0;
                pinta(avgX,avgY)
            }
        }catch (error){
            arrayX= new Array(pontos)
            arrayY= new Array(pontos)
            count=0;
            console.error(error);
        }
    ; /* data is an object containing an x and y key which are the x and y prediction coordinates (no bounds limiting) */
    //   console.log(clock); /* elapsed time in milliseconds since webgazer.begin() was called */
    })
    .begin();

    var width = 320;
    var height = 240;
    var topDist = '0px';
    var leftDist = '0px';
    
    var setup = function() {
        var video = document.getElementById('webgazerVideoFeed');
        video.style.display = 'hidden';
        video.style.position = 'absolute';
        video.style.top = topDist;
        video.style.left = leftDist;
        video.width = width;
        video.height = height;
        video.style.margin = '0px';

        webgazer.params.imgWidth = width;
        webgazer.params.imgHeight = height;
    };

    function checkIfReady() {
        if (webgazer.isReady()) {
            setup();
        } else {
            setTimeout(checkIfReady, 100);
        }
    }
    setTimeout(checkIfReady,100);

    window.onbeforeunload = function() {
        webgazer.end();
    };

    var canvas = document.getElementById('myCanvas');
    var context = canvas.getContext('2d');
    var circles = [];
    context.canvas.width=window.innerWidth;
    context.canvas.height=window.innerHeight;
    var w = window.innerWidth;
    var h = window.innerHeight;

    var draw = function (context, x, y, fillcolor, radius, linewidth, strokestyle) {
        context.beginPath();
        context.arc(x, y, radius, 0, 2 * Math.PI, false);
        context.fillStyle = fillcolor;
        context.fill();
        context.lineWidth = linewidth;
        context.strokeStyle = strokestyle;
        context.stroke();
    };

    var stroking = function (strokestyle){
        context.strokeStyle = strokestyle;

    };

    var Circle = function(x, y, radius) {
        this.left = x - radius;
        this.top = y - radius;
        this.right = x + radius;
        this.bottom = y + radius;
    };

    var drawCircle = function (context, x, y, fillcolor, radius, linewidth, strokestyle, circles) {
        draw(context, x, y, fillcolor, radius, linewidth, strokestyle);
        var circle = new Circle(x, y, radius);
        circles.push(circle);
    };

    var calibrationPoints = [[40,40],[w/2,40],[w - 40,40],[40, h/2],[w/2, h/2],[w - 40, h/2],[40,h - 40],[w/2,h - 40],[w - 40, h - 40]
    ];

    var x = calibrationPoints[0][0];
    var y = calibrationPoints[0][1];

    drawCircle(context, x, y, "black", 17, 2, "black", circles);
    drawCircle(context, x, y, "black", 10, 2, "black", circles);
    drawCircle(context, x, y, "yellow", 3, 2, "black", circles);

    var j = 1;
    var k = 0;
    document.getElementById('myCanvas').addEventListener("click", function (e) {
        var clickedX = e.pageX - this.offsetLeft;
        var clickedY = e.pageY - this.offsetTop;

        if (clickedX < circles[2].right && clickedX > circles[2].left && clickedY > circles[2].top && clickedY < circles[2].bottom) {
            if (j < calibrationPoints.length){
                var x = calibrationPoints[j][0];
                var y = calibrationPoints[j][1];
                context.clearRect(0,0,canvas.width,canvas.height);
                circles.pop();
                circles.pop();
                circles.pop();
                drawCircle(context, x, y, "black", 17, 2, "black", circles);
                drawCircle(context, x, y, "black", 10, 2, "black", circles);
                drawCircle(context, x, y, "yellow", 3, 2, "black", circles);
                j++;
                k++;
            }
            else{
                context.clearRect(0,0,canvas.width,canvas.height);
                context.canvas.width = 0;
                context.canvas.height =0;
                
                //webgazer.showPredictionPoints(true);
            }
        }
    });

    function goToPage(page) {
        location.href = page+".htm";
    }

    document.getElementById('myCanvas').addEventListener("mousemove", function (e) {
        var clickedX = e.pageX - this.offsetLeft;
        var clickedY = e.pageY - this.offsetTop;
           var style1 = "black";
           var style2 = "black";
           var style3 = "black";

           if (k < calibrationPoints.length){

            if (clickedX < circles[0].right && clickedX > circles[0].left && clickedY > circles[0].top && clickedY < circles[0].bottom) {
                style1 = "red";
            }
            else{
                style1 = "black"
            }
            if (clickedX < circles[1].right && clickedX > circles[1].left && clickedY > circles[1].top && clickedY < circles[1].bottom) {
                style2 = "orange"
            }
            else{
                style2 = "black"
            }
            if (clickedX < circles[2].right && clickedX > circles[2].left && clickedY > circles[2].top && clickedY < circles[2].bottom) {
                style3 = "green"
            }
            else{
                style3 = "black"
            }
            var x = calibrationPoints[k][0];
            var y = calibrationPoints[k][1];
            context.clearRect(0,0,canvas.width,canvas.height);
            circles.pop();
            circles.pop();
            circles.pop();
            drawCircle(context, x, y, "black", 17, 2, style1, circles);
            drawCircle(context, x, y, "black", 10, 2, style2, circles);
            drawCircle(context, x, y, "yellow", 3, 2, style3, circles);
        }

    });
};
