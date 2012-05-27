var InteractionManager = Drawable.sub();
InteractionManager.prototype._init = function(){
    var self = this;
    this.followMotherShip = true;
    Static.battleField.on("shipFire",function(ship,target){
	var Ammor = Ammunition[ship.subType];
	var ammor = new Ammor(ship,target);
	self.add(ammor);
    })
    Static.battleField.on("gained",function(ship,mine,ammount){
	if(ship.team == Static.userteam)
	    self.add(new EarnAnimation(ship,mine,ammount));
    });
    Static.battleField.on("countDown",function(count){
	if(count == 0){
	    var motherShip = Static.battleField.getShipById(Static.userteam);
	    if(!motherShip)return;
	    Static.battleFieldDisplayer.setViewPortTo(motherShip.cordinates);
	}
    });
    Static.battleField.on("shipInitialized",function(){
	var motherShip = Static.battleField.getShipById(Static.userteam);
	if(!motherShip)return;
	Static.battleFieldDisplayer.setViewPortTo(motherShip.cordinates);
	self.motherShip = motherShip
    });
    this.position = Static.battleFieldDisplayer.position;
}
InteractionManager.prototype.onDraw = function(context){
    if(this.followMotherShip && this.motherShip){
	Static.battleFieldDisplayer.setViewPortTo(this.motherShip.cordinates);
    }
}
var EarnAnimation = Drawable.sub()
EarnAnimation.prototype._init = function(ship,mine,ammount){
    this.mine = mine;
    this.position = ship.cordinates;
    this.index=0;
    this.length = 30;
    this.ammount = ammount
}
EarnAnimation.prototype.onDraw = function(context){
    if(this.index==this.length){
	this.parentContainer.remove(this);
    }
    context.translate(0,-this.index/3);
    context.globalAlpha = 1-this.index/this.length;
    this.index++;
    context.fillStyle = "white";
    context.beginPath();
    context.font="18px";
    context.fillText("+"+this.ammount.toString(),0,0);
}
var NormalAmmunition = Drawable.sub();
NormalAmmunition.prototype._init = function(ship,target){
    this.position=ship.cordinates;
    this.targetPosition = target.cordinates;
    if(ship.team == Static.userteam)
	this.color = "orange";
    else
	this.color = "red";
    this.index = 0;
    this.length = 5;
}
NormalAmmunition.prototype.onDraw = function(context){
    if(this.index==this.length){
	this.parentContainer.remove(this);
    }
    context.beginPath();
    context.moveTo(0,0);
    context.lineTo(this.targetPosition.x-this.position.x
		   ,this.targetPosition.y-this.position.y);
    context.strokeStyle = this.color;
    context.lineWidth = (Math.sin(this.index)+2);
    context.stroke();
    
    this.index++;
}
var Ammunition = {
    "motherShip":NormalAmmunition
    ,"attackShip":NormalAmmunition
    ,"defenceTower":NormalAmmunition
}