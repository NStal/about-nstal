var SmallMapLayer = Drawable.sub();
SmallMapLayer.prototype._init = function(bfs){
    this.battleFieldSimulater = bfs;
    //this.ships = this.battleFieldSimulater.parts;
    this.width = 200;
    this.height = 200;
    this.ships = Static.battleField.parts;
    this._scale = this.battleFieldSimulater.size.x/this.width;
    this.p = Static.battleFieldDisplayer.position;
    this.s = Static.battleFieldDisplayer.size;
    this.position.y = 30;
}
SmallMapLayer.prototype.onDraw = function(context){
    context.beginPath();
    context.rect(0,0,this.width,this.height);
    context.globalAlpha = 0.3;
    context.fillStyle = "blue";
    context.fill();
    context.globalAlpha = 1;
    
    var x = -this.p.x/this.s.x*this.width;
    var y = -this.p.y/this.s.y*this.height;
    var width = Static.settings.width/this.s.x*this.width;
    var height = Static.settings.height/this.s.y*this.height;
    context.beginPath();
    context.rect(x,y,width,height);
    context.strokeStyle = "white";
    context.stroke();
    for(var i=0;i<this.ships.length;i++){
        item = this.ships[i];
        if(item.type == "ship"){
            context.beginPath();
            context.arc(item.cordinates.x/this._scale,item.cordinates.y/this._scale,item.size/this._scale,0,2*Math.PI,false);
            if(item.team == Static.userteam){
                context.fillStyle = "green";
            }else{
                context.fillStyle = "red";
            }
            context.fill();
        }else{
            context.beginPath();
            context.rect(item.cordinates.x/this._scale,item.cordinates.y/this._scale,item.size/this._scale,item.size/this._scale);
            context.fillStyle = "white";
            context.fill();
        }
    }
}
