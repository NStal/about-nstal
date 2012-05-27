(function(exports){
    var Class = require("./util").Class;
    var EventEmitter = require("./util").EventEmitter;
    var Point = require("./util").Point;
    var Util = require("./util").Util;
    var Ship = EventEmitter.sub();
    var AI = require("./ai").AI;
    var Static = require("./static").Static;
    Ship.prototype._init = function(info){
	if(!info){
	    return;
	}
	this.proto = Static.gameResourceManager.get(info.itemId);
	var proto = this.proto;
	this.type = "ship";
	this.coolDownIndex = 0;
	if(info.id)
	    this.id = info.id.toString();
	if(!this.id){
	    console.warn("!!!!","no id!!!!");
	    console.trace();
	    return;
	} 
	this.cordinates = info.cordinates?Point.Point(info.cordinates):Point.Point(0,0); 
	this.team = info.team; 
	Util.update(this,proto);
	if(info.action){
	    this.action = info.action;
	}else{
	    this.action = {};
	}
	this.AI = new AI(this);
	if(info.AI){
	    Util.update(this.AI,info.AI);
	}
	if(typeof info.toward == "number"){
	    this.toward = info.toward;
	}else{
	    this.toward = 0;
	}
	this.itemId = info.itemId;
	if(info.life)this.life = info.life;
    }
    Ship.prototype.toData = function(){
	var data ={
	    id:this.id
	    ,team:this.team
	    ,cordinates:{
		x:this.cordinates.x
		,y:this.cordinates.y
	    }
	    ,toward:this.toward
	    ,action:this.action
	    ,AI:this.AI.toData()
	    ,itemId:this.itemId
	    ,life:this.life
	}
	return data;
    }
    Ship.prototype.onDead = function(byWho){
	this.emit("dead",this,byWho);
    }
    Ship.prototype.onDamage = function(damage){
	this.life -=damage;
	if(this.life<=0){
	    this.life = 0;
	    this.onDead();
	}
    }
    Ship.prototype.next = function(){
	this.AI.calculate();
	this.emit("next");
	if(this.coolDownIndex<this.coolDown){
	    this.coolDownIndex++;
	}else{
	    this.fireReady = true;
	}
	var fix = this.action.rotateFix;
	
	if(fix>1 || fix < -1){
	    console.trace();
	    return;
	}
	rotateSpeed = this.maxRotateSpeed;
	this.toward += fix*rotateSpeed;
	
	this.toward = Math.mod(this.toward,Math.PI*2);
	
	var fix = this.action.speedFix;
	var speed = this.maxSpeed;
	//move
	var realSpeed = speed*fix;
	if(typeof this.minSpeed == "number" && realSpeed<this.minSpeed)
	    realSpeed = this.minSpeed;
	this.cordinates.x+=Math.cos(this.toward) *realSpeed;
	this.cordinates.y+=Math.sin(this.toward) *realSpeed;
	this.action.speedFix = 0;
	this.action.rotateFix = 0;
    } 
    exports.Ship = Ship;
})(exports)