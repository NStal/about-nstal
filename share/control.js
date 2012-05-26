var ShipControler = Class.sub();
ShipControler.prototype._init = function(canvas,bfs){
    canvas.addEventListener("mousemove",OnMouseMove,false);
    canvas.addEventListener("mouseup",OnMouseUp,false);
    this.battleFieldSimulator = bfs;
    this.parts = this.battleFieldSimulator.parts;
    canvas.addEventListener("mousedown",OnMouseDown,false);
}

ShipControler.prototype.calcuDis = function(evt){
    var minDistance = 10000;
    var index = -1;
    for(var i=0,length=this.parts.length;i < length;i++){
	    var item = this.parts[i];
        if(item.type == "ship")
        {
            console.log(item.cordinates.x+"|"+item.cordinates.y);
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
        if(minDistance < ship.size/2) {
            return ship;
        }
    }else 
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
                
            }   
        }
	}
}
function OnMouseDown(evt){
    Static.firstPoint = new Point(evt.layerX,evt.layerY);
    if(Static.shipController){
        if(evt.button == 0){
            
            Static.isLeftDown = true;
            //console.log(evt.layerX+"|"+evt.layerY);
            var ship = Static.shipController.calcuDis(evt);
            if(ship){
                Static.isShipSelect = true;
                Static.ship = ship;
            }else{
                Static.isShipSelect = false;
            }
        }else if(evt.button == 2 && Static.isShipSelect){
                Static.ship.moveTo(Static.ship.cordinates); 
            }
    }
}

function OnMouseMove(evt){
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
    }
}
