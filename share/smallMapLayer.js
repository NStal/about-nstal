var SmallMapLayer = Drawable.sub();
SmallMapLayer.prototype._init = function(bfs){
    this.battleFieldSimulater = bfs;
    this.parts = this.battleFieldSimulater.parts;
    this.width = 200;
    this.height = 200;
    this._scale = this.battleFieldSimulater.size.x/this.width;
}
SmallMapLayer.prototype.onDraw = function(context){
    context.beginPath();
    context.rect(0,26,this.width,this.height);
    context.globalAlpha = 0.3;
    context.fillStyle = "blue";
    context.fill();
    context.globalAlpha = 1;
    for(var i=0;i<this.parts.length;i++){
        item = this.parts[i];
        if(item.type == "ship"){
            context.beginPath();
            context.arc(item.cordinates.x/this._scale,item.cordinates.y/this._scale+26,item.size/this._scale,0,2*Math.PI,false);
            if(item.team == Static.userteam){
                context.fillStyle = "green";
            }else{
                context.fillStyle = "red";
            }
            context.fill();
        }else{
            context.beginPath();
            context.rect(item.cordinates.x/this._scale,item.cordinates.y/this._scale+26,item.size/this._scale,item.size/this._scale);
            context.fillStyle = "white";
            context.fill();
        }
    }
}
