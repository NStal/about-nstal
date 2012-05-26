var BattleFieldDisplayer = Drawable.sub();
BattleFieldDisplayer.prototype._init = function(bfs){
    this.battleFieldSimulator = bfs; 
    //so we can call this.draw(context);
    this.parts = this.battleFieldSimulator.parts;
    var self = this;
    this.battleFieldSimulator.on("shipInitialized",function(ships){
	var tempArr = ships;
	for(var i=0,length=tempArr.length;i < length;i++){
	    var item = tempArr[i];
	    self.decorateShip(item);
	}
    })
}
BattleFieldDisplayer.prototype.initShip = function(shipInfo){
    return this.battleFieldSimulator.initShip(shipInfo);
}
BattleFieldDisplayer.prototype.decorateShip =function(ship){
    ship.onDraw = function(context){
	context.beginPath();
	context.arc(0,0,30,0,Math.PI*2);
	context.fillStyle = "black";
	context.fill();
    }
}
BattleFieldDisplayer.prototype.next = function(){
    this.battleFieldSimulator.next();
}
