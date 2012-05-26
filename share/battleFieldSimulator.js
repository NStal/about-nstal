(function(exports){
    var Class = require("./util").Class;
    var EventEmitter = require("./util").EventEmitter;
    var Point = require("./util").Point;
    var Container = require("./util").Container;
    var Math = require("./util").Math;
    var BattleFieldSimulator = Container.sub();
    var Ship = require("./ship").Ship;
    var Static = require("./static").Static;
    var OperateEnum =require("./protocol").OperateEnum; 
    var Mine = require("./mine").Mine;
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
	this.time++;
	Static.time = this.time; 
	this.applyInstruction();
	for(var i=0;i<this.parts.length;i++){
	    var item = this.parts[i];
	    this.calculateUnit(item);
	    if(item.type == "ship"){
		item.position = item.cordinates;
		item.rotation = item.toward;
	    }
	    //if near star gate
	} 
    }
    BattleFieldSimulator.prototype.getMineById = function(id){
	for(var i=0;i<this.parts.length;i++){
	    var item = this.parts[i];
	    if(item.type == "mine" && item.id == id){
		return item;
	    }
	}
	return null;
    }
    BattleFieldSimulator.prototype.applyInstruction = function(){
	for(var i=0,length=this.instructionQueue.length;i < length;i++){
	    var item = this.instructionQueue[i];
	    if(item.time<this.time){
		console.error("recieve oudated instruction current"
			      ,this.time
			      ,"time:"
			      ,item.time);
		console.error("fatal error");
		console.trace();
		this.emit("outdate");
		this.instructionQueue.splice(i,1);
		i--;
		length--;
		continue;
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
    BattleFieldSimulator.prototype.calculateUnit = function(unit){
	if(unit.type == "ship"){
	    unit.next();
	}
	if(unit.type == "mine"){
	    //console.log(unit.position.toString());
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
    BattleFieldSimulator.prototype.initialize = function(shipsInfo,map){
	this.emit("initialize");
	this.parts.length = 0;
	this.instructionQueue.length = 0;
	this.initShips(shipsInfo); 
	var mines = []; 
	var arr = map.mines;
	for(var i=0;i < arr.length;i++){
	    var item = arr[i];
	    var m = new Mine(item);
	    mines.push(m);
	    this.parts.push(m);
	}
	this.emit("mineInitialized",mines);
	this.emit("initialized");
	
    }
    BattleFieldSimulator.prototype.initShips = function(shipInfos){
	var arr = shipInfos;
	var ships = [];
	for(var i=0;i < arr.length;i++){
	    var item = arr[i]; 
	    var ship = this.enterShip(item);
	    ships.push(ship);
	} 
	this.emit("shipInitialized",ships);
	return ships;
    }
    BattleFieldSimulator.prototype.initEnvironment = function(galaxy){
	
    }
    BattleFieldSimulator.prototype.enterShip = function(info){
	var ship = new Ship(info);
	this.add(ship);
	return ship;
    }
    BattleFieldSimulator.prototype.initShip = function(ship){
	return this.initShips([ship])[0]
    }
    BattleFieldSimulator.prototype.moveShipTo = function(cmd){
	if(cmd.id instanceof Array){
	    ids = cmd.id;
	}else{
	    ids = [cmd.id]
	}
	var ships = [];
	for(var i=0;i<ids.length;i++){
	    var ship = this.getShipById(ids[i]);
	    if(ship){
		ships.push(ship);
	    }
	    else{
		ships.push({id:ids[i]
			    ,invalid:true});
	    }
	} 
	for(var i=0;i<ships.length;i++){
	    var ship = ships[i];
	    if(ship.invalid){
		console.error("!!");
		console.warn("ship of id",ship.id,"not found");
		console.trace();
		continue;
	    } 
	    if(typeof cmd.position.x!="number"||
	       typeof cmd.position.y!="number"){
		console.warn("invalid position",cmd.position);
		console.trace();
		return;
	    } 
	    ship.AI.moveTo(cmd.position);
	} 
    }
    BattleFieldSimulator.prototype._excute = function(instruction){
	switch(instruction.cmd){
	case OperateEnum.MOVE:
	    this.moveShipTo(instruction)
	    break;
	}
    }
    exports.BattleFieldSimulator = BattleFieldSimulator;
})(exports)
