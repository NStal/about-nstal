ResourceDisplayer = Class.sub();
ResourceDisplayer.prototype._init = function(){
    Widget.call(this,Static.template.resourceDisplayer);
    this.mineNameJ.text("Mine")
    this.mineAmmountJ.text("0");
    var self = this;
    Static.battleField.on("gained",function(ship,mine,ammount){
	if(ship.team==Static.userteam){
	    self.gain("mine",ammount);
	}
    })
    Static.battleField.on("initialized",function(){
	self.setResource("mine",Static.battleField.teamInfo[Static.userteam].mine);
	self.updateUnit();
    });
    Static.battleField.on("shipIsDead",function(){
	self.updateUnit();
    });
    
    Static.battleField.on("shipInitialized",function(){
	self.updateUnit();
    });
    Static.battleField.on("consume",function(type,ammount,team){
	if(team==Static.userteam)
	    self.reduce(type,ammount);
    });
    this.shipItems = []
    for(var i=7;i>=0;i--){
	var _item = new ResourceShipItem(i);
	this.shipItems.push(_item);
	this.nodeJ.append(_item.nodeJ);
    }
}
ResourceDisplayer.prototype.updateUnit = function(){
    this.unitDisplayJ.text(Static.battleField.teamInfo[Static.userteam].unit
			   +"/"+Static.battleField.teamInfo[Static.userteam].maxUnit);
}
ResourceDisplayer.prototype.setResource = function(type,count){
    this.mineAmmountJ.text(count);
}
ResourceDisplayer.prototype.gain = function(type,count){
    var total = +this.mineAmmountJ.text();
    total+=count;
    this.mineAmmountJ.text(total);
}
ResourceDisplayer.prototype.reduce = function(type,count){
    var total = +this.mineAmmountJ.text();
    total-=count;
    this.mineAmmountJ.text(total);
}
ResourceShipItem = Class.sub();
ResourceShipItem.prototype._init = function(itemId){
    Widget.call(this,Static.template.resourceShipItem);
    this.proto = Static.gameResourceManager.get(itemId);
    if(!this.proto){
	console.error("item of",itemId,"has noproto");
	console.trace();
	return;
    }
    this.itemId = itemId; 
    this.setCount(0);
    
    this.shipNameJ.text(this.proto.name);
    var self = this;
    Static.battleField.on("shipInitialized",function(ships){
	for(var i=0;i<ships.length;i++){
	    var ship = ships[i];
	    if(ship.itemId == self.itemId && ship.team == Static.userteam){
		self.setCount(self.count+1);
	    }
	}
    })
    Static.battleField.on("shipDead",function(ship){
	if(ship.itemId == self.itemId && ship.team == Static.userteam){
	    self.setCount(self.count-1);
	}
    });
}
ResourceShipItem.prototype.setCount = function(count){
    this.count=count;
    this.shipCountJ.text(count);
}