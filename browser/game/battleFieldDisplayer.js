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
    
    console.log("position",this.position.toString());
}
BattleFieldDisplayer.prototype.initShip = function(shipInfo){
    return this.battleFieldSimulator.initShip(shipInfo);
}
BattleFieldDisplayer.prototype.onDraw = function(context){
    if(!this.grid){
	var img = Static.resourceLoader.get("grid"); 
	
	if(img){
	    this.grid = context.createPattern(img,"repeat");
	}
    }else{
	context.beginPath();
	context.rect(0,0,this.battleFieldSimulator.size.x
		     ,this.battleFieldSimulator.size.y);
	context.fillStyle = this.grid;
	context.fill();
    }
}
BattleFieldDisplayer.prototype.decorateShip =function(ship){
    ship.onDraw = function(context){
	context.beginPath();
	var size = this.size; 
	if(!this.shake){
	    this.shake = new Shake({
		time:120
		,range:5
		,angle:90
	    });
	    this.shake.index+=Math.random()*100;
	    this.effects = [this.shake];
	}
	if(this.img){
	    context.save();
	    context.globalAlpha = 0.8;
	    context.shadowBlur = 3;
	    context.rotate(Math.PI/2); 
	    context.drawImage(this.img,-this.img.width/2,-this.img.height/2,this.img.width,this.img.height);
	    context.restore();
	}else{
	    this.img = Static.resourceLoader.get(this.src);
	    if(this.img){
		this.img.width = 40;
		this.img.height= 53;
	    }
	    context.moveTo(-size/2,-size/3);
	    context.lineTo(size/2,0);
	    context.lineTo(-size/2,size/3);
	    context.closePath();
	    context.fillStyle = "black";
	    context.fill();
	}
	if(this.index){
	    this.index++;
	}
	else{
	    this.index=1;
	}
	if(this.isSelected){
	    context.save();
	    context.rotate(-this.rotation);
	    //draw life
	    context.beginPath();
	    context.arc(0,0,this.size,0,Math.PI*2*this.life/this.maxLife);
	    context.strokeStyle = "green";
	    context.stroke();
	    context.rotate(this.index/5);
	    context.globalAlpha = (Math.sin(this.index/5)+2)/3;
	    //draw selection
	    context.beginPath();
	    context.arc(0,0,this.size+8,0,Math.PI*2-1);
	    context.strokeStyle = "black";
	    context.stroke(); 
	    context.rotate(-this.index/2); 
	    context.beginPath();
	    context.arc(0,0,this.size+4,0,Math.PI*2-1);
	    context.strokeStyle = "black";
	    context.stroke();
	    context.restore();
	}
    }
    ship.moveTo = function(position){
	var cmd = ProtocalGenerater.moveTo(this.id
					   ,position.x
					   ,position.y);
	Static.gateway.send(cmd);
    }
}
BattleFieldDisplayer.prototype.decorateMine = function(mine){
    mine.lineColor = "#009cff";
    mine.fillColor = "#00b4ff";
    mine.onDraw = function(context){
	
	context.beginPath();
	
	context.arc(0,0,this.size,0,Math.PI*2);
	context.globalAlpha = 1;
	context.strokeStyle = this.lineColor;
	context.stroke();
	context.globalAlpha = 0.12;
	context.shadowBlur = 5;
	context.shadowColor = this.fillColor;
	context.fillStyle = this.fillColor;
	context.fill();
    }
}
BattleFieldDisplayer.prototype.next = function(){
    this.battleFieldSimulator.next();
    var padding = 50;
    var width = Static.settings.width;
    var height = Static.settings.height;
    var move = Point.Point(0,0);
    if(Static.mousePosition){
	if(Static.mousePosition.x>width-padding){
	    move.x = -20;
	}
	if(Static.mousePosition.x<padding){
	    move.x = 20;
	} 
	if(Static.mousePosition.y>height-padding){
	    move.y = -20;
	}
	if(Static.mousePosition.y<padding){
	    move.y = 20;
	}
	this.moveViewPort(move);
	move.release();
    }
}
BattleFieldDisplayer.prototype.moveViewPort = function(p){
    this.position.x += p.x;
    this.position.y += p.y;
    if(this.position.x>0)this.position.x=0;
    if(this.position.y>0)this.position.y=0;
}
BattleFieldDisplayer.prototype.getShipByPosition = function(){
    
}
