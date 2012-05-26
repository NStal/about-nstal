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
    this.battleFieldSimulator.on("mineInitialized",function(mines){
	var tempArr = mines;
	for(var i=0,length=tempArr.length;i < length;i++){
	    var item = tempArr[i];
	    self.decorateMine(item);
	}
    })
}
BattleFieldDisplayer.prototype.initShip = function(shipInfo){
    return this.battleFieldSimulator.initShip(shipInfo);
}
BattleFieldDisplayer.prototype.decorateShip =function(ship){
    ship.onDraw = function(context){
	context.beginPath();
	var size = this.size;
	context.moveTo(-size/2,-size/3);
	context.lineTo(size/2,0);
	context.lineTo(-size/2,size/3);
	context.closePath();
	context.fillStyle = "black";
	context.fill();
    }
    ship.moveTo = function(position){
	var cmd = ProtocalGenerater.moveTo(this.id
					   ,position.x
					   ,position.y);
	Static.gateway.send(cmd);
    }
}
BattleFieldDisplayer.prototype.decorateMine = function(mine){
    mine.onDraw = function(context){
	context.beginPath();
	context.arc(0,0,20,0,Math.PI*2);
	context.fillStyle = "blue";
	context.fill();
    }
}
BattleFieldDisplayer.prototype.next = function(){
    this.battleFieldSimulator.next();
}
BattleFieldDisplayer.prototype.getShipByPosition = function(){
    
}
