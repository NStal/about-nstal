var ShipControler = Class.sub();
ShipControler.prototype._init = function(canvas,bfs){
    var self = this;
    canvas.addEventListener("mousemove",function(e){
	self.onMouseMove(e);
	self.isMove = true;
    })
    canvas.addEventListener("mouseup",function(e){
	self.onMouseUp(e)
    }); 
    canvas.addEventListener("mousedown",function(e){
	self.onMouseDown(e);
    });
    $(canvas).mouseleave(function(e){
	self.onMouseUp(e);
    })
    this.battleFieldSimulator = bfs;
    this.parts = this.battleFieldSimulator.parts;
    Static.ships = [];
}
ShipControler.prototype.parseEvent = function(e){
    return e;
}
ShipControler.prototype.addSelectShip = function(ship){
    Static.ships.push(ship);
    ship.isSelected = true;
}
ShipControler.prototype.onMouseUp = function(e){
    this.onMouseMove(e);
    this.mouseUpPoint = this.eventToPoint(e);
    Static.leftButtonDown = false;
    Static.rightButtonDown = false; 
}
ShipControler.prototype.onMouseMove = function(e){
    if(Static.mousePosition){
	Static.mousePosition.release();
    } 
    Static.mousePosition = this.eventToPoint(e)
}
ShipControler.prototype.onMouseDown = function(e){
    this.onMouseMove(e);
    this.mouseDownPoint = this.eventToPoint(e);
    if(e.button == 0){
	Static.leftButtonDown = true;
    }else{
	Static.rightButtonDown = true;
    }
}
ShipControler.prototype.onDraw = function(context){
    if(this.p1 && this.p2){
	context.beginPath();
	context.rect(this.p1.x,this.p1.y
		     ,this.p2.x-this.p1.x
		     ,this.p2.y-this.p1.y);
	context.fill();
    }
}
ShipControler.prototype.eventToPoint = function(e){
    this.parseEvent(e);
    return Point.Point(e.layerX,e.layerY);
}
ShipControler.prototype.clear = function(){
    var ships = Static.ships;
    for(var i=0;i<ships.length;i++){
        ships[i].isSelected = false;
    }
    ships.length = 0;
}
ShipControler.prototype.remove = function(ship){
    var ships = Static.ships;
    for(var i=0;i<ships.length;i++){
        if(ships[i]===ship){
	    ships[i].isSelected = false;
	    return ships.splice(i,1)[0];
	}
    }
    return null;
}
ShipControler.prototype.next = function(){
    
    //console.log(this.lastLeftButtonDown,Static.leftButtonDown);
    if(!this.lastLeftButtonDown&&Static.leftButtonDown){
	this.isMove = false;
    }
    if(this.lastLeftButtonDown&&!Static.leftButtonDown){
	if(!this.isMove){
	    this.onLeftClick();
	} 
	if(this.p1 && this.p2){
	    p1 = Point.Point(this.p1);
	    p2 = Point.Point(this.p2);
	    console.log("~~~~~~~");
	    this.onRect(p1,p2);
	}
	this.p1 = null;
	this.p2 = null;
    } 
    //console.log(this.lastIsMove,this.isMove,Static.leftButtonDown);
    if(!this.lastIsMove && this.isMove && Static.leftButtonDown){
	this.p1 = Point.Point(Static.mousePosition);
    }
    if(this.isMove){
	this.p2 = Point.Point(Static.mousePosition);
    }
    if(!this.lastRightButtonDown&&Static.rightButtonDown){
	this.isMove = false;
    }
    if(this.lastRightButtonDown&&!Static.rightButtonDown){
	//if(!this.isMove){
	this.onRightClick();
	//}
    }
    this.lastLeftButtonDown = Static.leftButtonDown; 
    this.lastRightButtonDown = Static.rightButtonDown;
    this.lastIsMove = this.isMove;
}
ShipControler.prototype.onLeftClick = function(){
    var p = Point.Point(Static.mousePosition);
    this.clear();
    Static.battleFieldDisplayer.screenToBattleField(p);
    console.log(p.toString());
    var ship = Static.battleFieldDisplayer.getShipByPosition(p);
    if(ship){
	this.addSelectShip(ship);
    }
}
ShipControler.prototype.onRightClick = function(){
    var p = Point.Point(Static.mousePosition);
    Static.battleFieldDisplayer.screenToBattleField(p);
    var ship = Static.battleFieldDisplayer.getShipByPosition(p); 
    var tempArr = Static.ships;
    if(ship && ship.team!=Static.userteam){
	//attack
	for(var i=0,length=tempArr.length;i < length;i++){
	    var item = tempArr[i];
	    if(item.team!=Static.userteam)return;
	    if(item.type!="ship")return;
	    if(item.subType == "motherShip" 
	       ||item.subType == "attackShip"){
		console.log(item.subType);
		Static.gateway.send({
		    cmd:OperateEnum.ATTACK
		    ,id:item.id
		    ,targetId:ship.id
		})
	    }
	    if(item.subType == "miningShip"){
		Static.gateway.send({
		    cmd:OperateEnum.MOVE
		    ,id:item.id
		    ,position:ship.cordinates
		})
	    }
	}
	return;
    }
    var mine = Static.battleFieldDisplayer.getMineByPosition(p);
    if(mine){
	for(var i=0,length=tempArr.length;i < length;i++){
	    var item = tempArr[i];
	    if(item.team!=Static.userteam)return; 
	    if(item.subType=="miningShip"){
		Static.gateway.send({
		    cmd:OperateEnum.MINING
		    ,id:item.id
		    ,targetId:mine.id
		})
		this.remove(item);
		return;
	    }
	}
    }
    if(Static.ships.length>0){
	//normal move
	for(var i=0,length=tempArr.length;i < length;i++){
	    var item = tempArr[i];
	    if(item.team!=Static.userteam)return;
	    if(item.type!="ship")return;
	    Static.gateway.send({
		cmd:OperateEnum.MOVE
		,id:item.id
		,position:p
	    })
	}
    }
}
ShipControler.prototype.onRect = function(p1,p2){
    Static.battleFieldDisplayer.screenToBattleField(p1);
    Static.battleFieldDisplayer.screenToBattleField(p2)
    this.getShipsByRect(p1,p2);
}
ShipControler.prototype.getShipsByRect = function(p1,p2){
    this.clear();
    var arr = Static.battleField.parts;
    for(var i=0;i < arr.length;i++){
	var item = arr[i]; 
	if(item.type=="ship"
	   &&this.isShipInRect(item,p1,p2)
	   &&Static.userteam == item.team){
	    this.addSelectShip(item);
	}
    }
}
ShipControler.prototype.isShipInRect = function(ship,p1,p2){
    var p = ship.cordinates;
    return (p1.x-p.x)*(p2.x-p.x)<0 && (p1.y-p.y)*(p2.y-p.y)<0;
}
