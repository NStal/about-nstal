var ShipControler = Class.sub();
ShipControler.prototype._init = function(canvas,bfs){
    
    canvas.addEventListener("mousemove",OnMouseMove,false);
    canvas.addEventListener("mouseup",OnMouseUp,false);
    this.battleFieldSimulator = bfs;
    this.parts = this.battleFieldSimulator.parts;
    canvas.addEventListener("mousedown",OnMouseDown,false);
}
ShipControler.prototype.calcuDis = function(evt){
    var minDistance = 100000;
    var index = -1;
    for(var i=0,length=this.parts.length;i < length;i++){
	    var item = this.parts[i];
        if(item.type == "ship")
        {
            var dx = evt.layerX - item.cordinates.x;
            var dy = evt.layerY - item.cordinates.y;
            var _dis = Math.abs(Math.sqrt(dx*dx+dy*dy));
            if(_dis<minDistance){
                minDistance = _dis;
                index = i;
            }

        }
	}
    if(index != -1){
        var ship = this.parts[index];
        if(minDistance < ship.size*2) {
            Static.isShipSelect = true;
            ship.isSelected = true;
            return ship;
        }
    } 
    return 0;
}

ShipControler.prototype.getShips = function(evt){
    for(var i=0,length=this.parts.length;i < length;i++){
	    var item = this.parts[i];
        if(item.type == "ship")
        {
            //console.log(item.cordinates.x+"|"+Static.firstPoint.x);
            //console.log(item.cordinates.y+"|"+Static.firstPoint.y);
            //console.log(evt.layerX+"|"+evt.layerY);
           if((item.cordinates.x>Static.firstPoint.x && item.cordinates.x<evt.layerX && item.cordinates.y>Static.firstPoint.y && item.cordinates.y<evt.layerY) || (item.cordinates.x<Static.firstPoint.x && item.cordinates.x>evt.layerX && item.cordinates.y>Static.firstPoint.y && item.cordinates.y<evt.layerY) ){
                console.log(item.name+"is in");
                Static.isShipSelect = true;
                item.isSelected = true;
                Static.ships.push(item);
            }   
        }
	}
}

ShipControler.prototype.getAction = function(evt){
    var minDistance = 10000;
    var index = -1;
    for(var i=0,length=this.parts.length;i < length;i++){
	    var item = this.parts[i];
        var dx = evt.layerX - item.cordinates.x;
        var dy = evt.layerY - item.cordinates.y;
        var _dis = Math.abs(Math.sqrt(dx*dx+dy*dy));
        if(_dis<minDistance){
            minDistance = _dis;
            index = i;
        }
	}
    console.log("finish");
    if(index != -1){
        console.log(minDistance);
        var item = this.parts[index];
        console.log("X:"+item.cordinates.x+"|"+evt.layerX);
        console.log("Y:"+item.cordinates.y+"|"+evt.layerY);
        if(minDistance < item.size*2) {
            if(item.type == "ship"){
                if(item.team == "0"){
                    return 1;
                }else {
                    Static.shipController.beingAttackId = item.id;
                    return 2;
                }
            }else if(item.type == "mine"){
                Static.shipController.beingMinedId = item.id;
                return 3;
            }
        }
    }
    return 0;
}
function OnMouseDown(evt){
    if(!Static.mousePosition){
	Static.mousePosition = Point.Point(evt.layerX,evt.layerY);
    }
    else{
	Static.mousePosition.x = evt.layerX;
	Static.mousePosition.y = evt.layerY;
    }
    Static.firstPoint = new Point(evt.layerX,evt.layerY);
    if(Static.shipController){
        if(evt.button == 0){
            Static.isLeftDown = true;
            //console.log(evt.layerX+"|"+evt.layerY);
            var ship = Static.shipController.calcuDis(evt);
            if(ship){
                console.log(evt.layerX+"|"+evt.layerY); 
                //Static.ships = [];
                emptySelectShips(Static.ships);
                Static.ships.push(ship);
            }else{
                Static.isShipSelect = false;
                //Static.ships = [];
                emptySelectShips(Static.ships);
            }
        }else if(evt.button == 2 && Static.isShipSelect){
                var type = Static.shipController.getAction(evt);
                switch(type){
                    case 0:
                    for(var i =0;i<Static.ships.length;i++){
                        Static.ships[i].moveTo(new Point(evt.layerX,evt.layerY)); 
                    } 
                    break;
                    case 1:
                    for(var i =0;i<Static.ships.length;i++){
                        Static.ships[i].moveTo(new Point(evt.layerX,evt.layerY)); 
                    }
                    break;
                    case 2:
                    for(var i =0;i<Static.ships.length;i++){
                        if(Static.ships[i].subType == "attackShip"){
                            var cmd = ProtocalGenerater.attackTo(Static.ships[i].id,Static.shipController.beingAttackId);
                            Static.gateway.send(cmd);
                        }else{
                            Static.ships[i].moveTo(new Point(evt.layerX,evt.layerY));
                        }
                    }      
                    break;
                    case 3:
                    var selectIndex = -1;
                    var mindis = 1000000;
                    for(var i =0;i<Static.ships.length;i++){
                        if(Static.ships[i].subType == "miningShip"){
                            _dis = Static.ships[i].cordinates.distance(new Point(evt.layerX,evt.layerY));
                                
                            if(_dis<=mindis){
                                selectIndex = i;
                                mindis = _dis;
                            }
                        }else{
                            Static.ships[i].moveTo(new Point(evt.layerX,evt.layerY));
                        }          
                    }
                    if(selectIndex != -1){
                        var cmd = ProtocalGenerater.mining(Static.ships[selectIndex].id,Static.shipController.beingMinedId);
                            Static.gateway.send(cmd);
                    }
                    break;
                }
            }
    }
}

function OnMouseMove(evt){
    if(!Static.mousePosition){
	Static.mousePosition = Point.Point(evt.layerX,evt.layerY);
    }
    else{
	Static.mousePosition.x = evt.layerX;
	Static.mousePosition.y = evt.layerY;
    }
    if(evt.button == 0 && Static.isLeftDown){
        Static.isSelecting = true;
        Static.shipController.getShips(evt);
        if(Static.selectRect){
            Static.selectRect.position.x=Static.firstPoint.x;
            Static.selectRect.position.y=Static.firstPoint.y;
            Static.selectRect.width = evt.layerX - Static.firstPoint.x;
            //console.log("width1",Static.selectRect.width);
            Static.selectRect.height = evt.layerY - Static.firstPoint.y;
        }
    }

}
function OnMouseUp(evt){
    if(evt.button == 0 ){
        Static.isLeftDown = false;
        Static.isSelecting = false;
        Static.isMoving = false;
    }
}

function emptySelectShips(ships){
    for(var i=0;i<ships.length;i++){
        ships[i].isSelected = false;
    }
    ships.length = 0;
}
