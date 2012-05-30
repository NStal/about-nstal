(function(exports){
    var EventEmitter = require("./util").EventEmitter; 
    var Point = require("./util").Point;
    var Mine = EventEmitter.sub();
    MineTypes = {
	0:"Crystal" 
	,1:"Tai"
    };
    Mine.prototype._init = function(info){
	this.position = Point.Point(info);
	this.size = info.size;
	this.type = "mine";
	this.id = info.id;
	var _t = this.id%2;
	this.subType = info.subType
	this.maxMine = this.size*10;
	this.speed = Math.floor(this.size/20);
	this.mine = 0;
	this.cordinates = this.position;
    } 
    Mine.prototype.next = function(){
	this.mine+=this.speed;
	if(this.mine>this.maxMine){
	    this.mine = this.maxMine;
	}
    }
    Mine.prototype.gainByShip = function(ship){
	console.log(this.mine);
	if(this.mine>ship.attack){
	    this.mine-=ship.attack;
	    return ship.attack;
	}else{
	    var m = this.mine;
	    this.mine=0;
	    return m;
	}
    }
    exports.Mine =Mine;
})(exports)
