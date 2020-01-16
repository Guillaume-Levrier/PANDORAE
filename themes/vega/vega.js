//Vega PANDORAE Theme JS

const vega = () => {

    let canvas = document.createElement("CANVAS");
    canvas.id ="vega";
    canvas.className +="purgeable";
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    document.body.insertBefore(canvas,document.getElementById("signal"));
    var ctx = canvas.getContext('2d');
    
    var etalon = window.innerHeight/2;

    function circleDrawer(rayon) {
        ctx.save()
        var midX = canvas.offsetWidth/2;
        var midY = canvas.offsetHeight/2;
        ctx.fillstyle="#141414"
        ctx.arc(midX,midY,rayon,0,2*Math.PI);
        let pas = window.innerHeight/20;
        let clipHeight = 7000/rayon;
        let region = new Path2D();
        for (let i = 0; i < canvas.offsetHeight; i=i+(pas*2)) {
            region.rect(0,i-clipHeight/2,window.innerWidth,clipHeight);
        } 
        ctx.clip(region, "evenodd");
        ctx.fill();
        for (let i = 0; i < canvas.offsetHeight; i=i+(pas*2)) {
            ctx.fillRect(0,i-1,window.innerWidth,2); 
        } 
        ctx.restore()
    }
    for (let i = .1; i < .9; i=i+.1) {circleDrawer(etalon*(i))};
}


module.exports = () => {vega();};