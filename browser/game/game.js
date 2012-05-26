var Game = Instance.sub();
EventEmitter.mixin(Game);
Static.settings = {
    height:800
    ,width:1280
    ,rate:30
}
Game.prototype._init = function(canvas){
    this.canvas = canvas;
    this.canvas.width = Static.settings.width
    this.canvas.height = Static.settings.height;
    this.setRate(Static.settings.rate);
}