const COLORS = ["209,217,255","205,206,209","252,251,237","252,235,237"];
//const BUBBLE_DENSITY = 100;


function generateDecimalBetween(left, right){
    return (Math.random() * (left - right) + right).toFixed(2);
}

class Bubble {
    constructor(canvas){
        this.canvas = canvas;

        this.getCanvasSize();
        this.init();
    }
    getCanvasSize(){
        this.canvasWidth = this.canvas.clientWidth;
        this.canvasHeight = this.canvas.clientHeight;
    }
    init(){
        this.color = COLORS[Math.floor(Math.random()*COLORS.length)]
        this.size = 1
        this.alpha = generateDecimalBetween(4, 8) / 10;
        this.translateX = generateDecimalBetween(0, this.canvasWidth);
        this.translateY = generateDecimalBetween(0, this.canvasHeight);
        this.velocity = generateDecimalBetween(20, 40);
        this.movementX = generateDecimalBetween(1,3) / this.velocity;
        this.movementY = generateDecimalBetween(1,2) / this.velocity;

    }
    move(){
        this.translateX = this.translateX - this.movementX;
        this.translateY = this.translateY - this.movementY;
        if(this.translateY < 0 || this.translateX < 0 || this.translateX > this.canvasWidth){
            this.init();
            this.translateY = this.canvasHeight;
        }
    }
}

export class CanvasBackground{
    constructor(id){
        this.canvas = document.getElementById(id);
        this.ctx = this.canvas.getContext("2d");
        this.dpr = window.devicePixelRatio;
        //console.log(this.dpr);

    }
    start(){
        this.canvasSize();
        this.generateBubbles();
        this.animate();

    }
    canvasSize(){
        this.canvas.width = this.canvas.offsetWidth * this.dpr;
        this.canvas.height = this.canvas.offsetHeight * this.dpr;
        /*ширину и высоту для холста мы выставили, умножив ее на 
        значение devicePixelRatio. Это важно, чтобы потом графика 
        на холсте не отображалась мутно на мониторах с более высоким
        разрешением*/
        //console.log(this.canvas.width, this.canvas.height);
        //console.log(this.canvas.offsetWidth, this.canvas.offsetHeight);
        
    }
    generateBubbles(){
        this.bubblesList = [];
        for (let index = 0; index < 500; index++) {
           this.bubblesList.push(new Bubble(this.canvas));
        }
    }
    animate(){
        this.ctx.clearRect(0,0,this.canvas.clientWidth,this.canvas.clientHeight);
        this.bubblesList.forEach(bubble => {
            bubble.move();
            this.ctx.translate(bubble.translateX,bubble.translateY);
            this.ctx.beginPath();
            this.ctx.arc(0,0,bubble.size,0,2* Math.PI);
            this.ctx.fillStyle = `rgba(${bubble.color},${bubble.alpha})`;
            this.ctx.fill();
            this.ctx.setTransform(this.dpr,0,0,this.dpr,0,0);
        });
        
        requestAnimationFrame(this.animate.bind(this));
    
    
    }

}

//const canvasBG = new CanvasBackground('orb-canvas');
//canvasBG.start();

