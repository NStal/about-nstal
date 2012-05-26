(function(exports){
    var Class = require("./util").Class;
    var EventEmitter = require("./util").EventEmitter;
    var Point = require("./util").Point;
    var Container = require("./util").Container;
    var Math = require("./util").Math;
    var BattleFieldSimulator = Container.sub();
    var Ship = require("./ship").Ship;
    var Static = require("./static").Static;
    EventEmitter.mixin(BattleFieldSimulator);
    BattleFieldSimulator.prototype._init = function(){
	this.size = Point.Point(10000,10000);
	this.instructionQueue = []; 
	this.time = 0;
    }
    BattleFieldSimulator.prototype.toData = function(){
	var ships = [];
	for(var i=0;i<this.parts.length;i++){
	    var item = this.parts[i];
	    if(item.type!="ship")continue;
	    ships.push(item.toData());
	}
	return {
	    ships:ships
	};
    }
    BattleFieldSimulator.prototype.next = function(){
	this.applyInstruction(this.time);
	this.time++;
	Static.time = this.time;
	for(var i=0;i<this.parts.length;i++){
	    var item = this.parts[i];
	    this.calculateUnit(item);
	    item.position = item.cordinates;
	    item.rotation = item.toward;
	    //if near star gate
	} 
    }
    BattleFieldSimulator.prototype.applyInstruction = function(time){
	this.time = time;
	for(var i=0,length=this.instructionQueue.length;i < length;i++){
	    var item = this.instructionQueue[i];
	    if(item.time<this.time){
		console.error("recieve oudated instruction");
		console.error("fatal error");
		console.trace();
	    }
	    if(item.time == this.time){
		var ins = item;
		this._excute(ins);
		this.instructionQueue.splice(i,1);
		i--;
		length--;
	    }
	} 
    }
    BattleFieldSimulator.prototype._excute = function(instruction){
    }
    BattleFieldSimulator.prototype.calculateUnit = function(unit){
	if(unit.type == "ship"){
	    unit.next();
	}
	if(unit.type == "gate")return;
    }
    BattleFieldSimulator.prototype.getShipById = function(id){
	for(var i=0;i<this.parts.length;i++){
	    var item = this.parts[i];
	    if(item.id === id && item.type == "ship"){
		return item;
	    }
	}
	return null;
    }
    BattleFieldSimulator.prototype.addInstruction = function(instruction){
	this.instructionQueue.push(instruction); 
    }
    BattleFieldSimulator.prototype.setTime = function(time){
	this.time = time;
    }
    BattleFieldSimulator.prototype.initialize = function(shipsInfo){
	this.emit("initialize");
	this.parts.length = 0;
	this.instructionQueue.length = 0;
	this.initShips(shipsInfo);
    }
    BattleFieldSimulator.prototype.initEnvironment = function(galaxy){
    }
    BattleFieldSimulator.prototype.enterShip = function(info){
	var ship = new Ship(info);
	this.add(ship);
	return ship;
    }
    BattleFieldSimulator.prototype.initShip = function(ship){
	var ship = this.enterShip(ship);
	this.emit("shipInitialized",[ship]);
	
	return ship;
    }
    exports.BattleFieldSimulator = BattleFieldSimulator;
})(exports)
