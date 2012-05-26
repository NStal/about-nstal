(function(exports){
    var Instance = require("./gameUtil").GameInstance;
    var AI = Instance.sub();
    var Point = require("./util").Point;
    var sylvester = require("sylvester");
    //AI holds ship's intention which is decided by user 
    //instruction
    AI.prototype._init = function(ship){
	if(!ship)return;
	this.ship = ship;
	this.destination = {};
    }
    AI.prototype.calculate = function(){
	if(this.destination.target){
	    if(this.destination.target.isDead){
		this.destination.target = null
	    }else{
		if(this.ship.fireReady
		   && this.destination.target.cordinates.distance(this.ship.cordinates)<this.ship.range){
		    this.ship.emit("fire",this.destination.target);
		    this.ship.coolDownIndex = 0;
		    this.ship.fireReady = false;
		}
	    }
	}
	if(this.destination.mineTarget){
	    if(this.ship.fireReady
	       && this.destination.mineTarget.position.distance(this.ship.cordinates)<this.ship.range+this.destination.mineTarget.size){
		this.ship.emit("gain",this.destination.mineTarget);
		this.ship.coolDownIndex = 0;
		this.ship.fireReady = false;
	    } 
	}
	
	this.ship.action.rotateFix = 0;
	this.ship.action.speedFix = 0;
	if(this.destination.roundRoute){
	    if(this.destination.roundRoute===this.ship.cordinates)return;
	    this._adjustRoundAt(this.destination.roundRoute.point,
				this.destination.roundRoute.radius,
				this.destination.roundRoute.antiClockWise);
	}
	if(this.destination.targetPoint){
	    this._adjustToPoint(this.destination.targetPoint);
	}
    }
    AI.prototype.clearDestination = function(){
        this.destination = {};
    }
    AI.prototype._adjustToPoint = function(targetPoint){
	var targetPoint = Point.Point(targetPoint);
	var ship = this.ship; 
	ship.action.speedFix = 0;
	ship.action.rotateFix = 0;
	var size = ship.size?ship.size/2:2;
	if(ship.cordinates.distance(targetPoint)<size){
	    return true;
	}
	//rotate?
	var clockWise = 0;
	var rad= targetPoint.sub(ship.cordinates).rad(); 
	if(!Math.floatEqual(rad,
			    ship.toward)){
	    //need rotate
	    var rdistance = Math.radSub(ship.toward,rad); 
	    if(rdistance>0){
		clockWise = 1;
	    }else{
		clockWise = -1;
	    }
	    var rotateSpeed = ship.maxRotateSpeed;
	    
	    if(Math.abs(rdistance) > Math.abs(rotateSpeed)){
		ship.action.rotateFix = 1* clockWise;
	    }else{
		ship.action.rotateFix = rdistance/rotateSpeed;
		//console.log(ship.action.rotateFix*rotateSpeed);
	    }
	    //big ship cant curve-forwarding
	    if(!this.ship.curveForwarding)return false;
	}
	var distance = targetPoint.distance(ship.cordinates);
	var speed = ship.maxSpeed;
	if(distance>speed){
	    ship.action.speedFix = 1;
	}else{
	    ship.action.speedFix = distance/speed;
	}
	return false;
    }
    //how
    AI.prototype.attackAt = function(target){
	this.destination.targetPoint = target.cordinates;
	this.destination.target = target;
    }
    AI.prototype.mineAt = function(target){
	if(target.type!="mine"){
	    console.log("target not mine");
	    return;
	}
	if(this.ship.subType!="miningShip"){
	    console.log("not mining ship");
	    return;
	}
	this.roundAt(target.position,target.size+10,true);
	this.destination.mineTarget = target;
	
    }
    AI.prototype._adjustRoundAtCurrentRoute = function(r,antiClockWise){
	//set distance to default if no distance specified
	//notion,if the rotateSpeed and current speed is not enough to
	//keep ship round at the distance, the real distance may change
	var ship = this.ship;
	var v = ship.ability.speed*0.8;
	var w = v/r;
	var rad = ship.cordinates.sub(point).rad();
	var rdistance = Math.radSub(ship.toward,rad);
	var clockWise = 0;
	//always clockWise at current version;
	if(antiClockWise)clockWise = -1;
	else clockWise = 1;
	rdistance = Math.abs(rdistance)-(Math.PI/2);
	var rotateFix = w/ship.ability.rotateSpeed*clockWise;
	if(rotateFix>1)rotateFix=1;
	if(rotateFix<-1)rotateFix=-1;
	ship.action.rotateFix = rotateFix;
	var speedFix = 0.8;
	return;
    }
    //how
    AI.prototype._adjustRoundAt = function(point,r,antiClockWise){
	//using matrix to calculate the rotate;
	
	if(antiClockWise)clockWise = -1;
	else clockWise = 1;
	var size = this.ship.size?this.ship.size/2:this.ship.maxSpeed*2;
	var x=size;
	var y=Math.sqrt(r*r-x*x);
	var posMatrix = $M([[x*clockWise],[y],[1]]);
	var rad =  this.ship.cordinates.sub(point).rad();
	var cosr = Math.cos(rad);
	var sinr = Math.sin(rad); 
	var rotateMatrix = $M([[cosr,sinr,0]
			       ,[-sinr,cosr,0]
			       ,[0,0,1]]);
	var realMatrix = rotateMatrix.x(posMatrix);
	var x = realMatrix.row(2).e(1);
	var y = realMatrix.row(1).e(1);
	var pos = new Point(point.x+x,point.y+y);
	this.destination.targetPoint = pos;	
    }
    //intent
    AI.prototype.standBy = function(){
	this.destination.targetPoint = new Point(this.ship.cordinates);
	return;
    }
    //intent
    AI.prototype.moveTo = function(targetPoint){
	this.clearDestination();
	this.destination.targetPoint = targetPoint;
    }
    AI.prototype.roundAtTarget = function(target,r,antiClockWise){
	this.roundAt(target.cordinates,r,antiClockWise);
	this.destination.roundTarget = target;
    }
    AI.prototype.roundAt =function(p,r,antiClockWise){
	this.clearDestination();
	if(r<20)r=20;
	this.destination.roundRoute = {point:p
				       ,radius:r
				       ,antiClockWise:antiClockWise};
    }
    AI.prototype.toData = function(){
	var data = {
	    destination:{
		targetPoint:this.destination.targetPoint
		,roundRoute:this.destination.roundRoute
	    }
	}
	return data;
    }
    exports.AI = AI;
})(exports)