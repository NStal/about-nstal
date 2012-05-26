
SelectRect = Drawable.sub();
SelectRect.prototype._init = function(){
    this.width = 0;
    this.height = 0;
}
SelectRect.prototype.onDraw = function(context){
    if(Static.isSelecting){
        context.beginPath();
        context.rect(0,0,this.width,this.height);
        context.fillStyle = "black";
        context.fill();
    }
}
