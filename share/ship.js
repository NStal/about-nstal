(function(exports){
    var Class = require("./util").Class;
    var EventEmitter = require("./util").EventEmitter;
    var Point = require("./util").Point;
    var Util = require("./util").Util;
    var Ship = EventEmitter.sub();
    var AI = require("./ai").AI;    
    Ship.prototype._init = function(info){
	if(!info){
	    return;
	}
	this.type = "ship";
	if(info.id)
	    this.id = info.id.toString();
	if(!this.id){
	    console.warn("!!!!","no id!!!!");
	    console.trace();
	    return;
	} 
	console.log("ship int",info.cordinates);
	this.cordinates = info.cordinates?Point.Point(info.cordinates):Point.Point(0,0);
	console.log("ship int",this.cordinates);
	this.team = info.team; 
	this.ability = {};
	if(info.ability){
	    Util.update(this.ability,info.ability);
	}
	this.state = {}
	if(info.state){
	    Util.update(this.state,info.state);
	}else{
	    Util.update(this.state
			,this.ability);
	} 
	if(info.action){
	    this.action = info.action;
	}else{
	    this.action = {};
	}
	this.AI = new AI(this);
	if(typeof info.toward == "number"){
	    this.toward = info.toward;
	}else{
	    this.toward = 0;
	}
	if(typeof info.size == "number"){
	    this.size = info.size
	}else{
	    this.size = 10;
	}
    }
    Ship.prototype.toData = function(){
	var data ={
	    id:this.id
	    ,cordinates:{
		x:this.cordinates.x
		,y:this.cordinates.y
	    }
	    ,toward:this.toward
	    //,ability:this.ability
	    ,state:this.state
	    ,action:this.action
	    ,AI:this.AI.toData()
	}
	return data;
    }
    Ship.prototype.onDead = function(byWho){
	this.emit("dead",this,byWho);
    }
    Ship.prototype.next = function(){
	this.AI.calculate();
	this.emit("next");
	var fix = this.action.rotateFix;
	
	if(fix>1 || fix < -1){
	    console.trace();
	    return;
	}
	rotateSpeed = this.state.maxRotateSpeed;
	this.toward += fix*rotateSpeed;
	this.toward = Math.mod(this.toward,Math.PI*2);
	
	var fix = this.action.speedFix;
	var speed = this.state.maxSpeed;
	//move
	this.cordinates.x+=Math.cos(this.toward) *speed*fix;
	this.cordinates.y+=Math.sin(this.toward) *speed*fix;
	this.action.speedFix = 0;
	this.action.rotateFix = 0;
    } 
    exports.Ship = Ship;
})(exports)