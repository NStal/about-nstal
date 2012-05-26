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
	var mines = []; 
	var arr = map.mines;
	this.map = map;
	for(var i=0;i < arr.length;i++){
	    var item = arr[i];
	    var m = new Mine(item);
	    mines.push(m);
	    this.parts.push(m);
	}
	this.emit("mineInitialized",mines);
	this.initShips(shipsInfo); 
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
	var self = this;
	ship.on("dead",function(){
	    self.emit("shipDead",ship);
	});
	ship.on("fire",function(target){
	    self.emit("shipFire",ship,target);
	}); 
	ship.on("gain",function(mine){
	    self.emit("shipGain",ship,mine);
	    
	})
	return ship;
    }
    BattleFieldSimulator.prototype.initShip = function(ship){
	return this.initShips([ship])[0]
    }
    BattleFieldSimulator.prototype.setShipDead = function(cmd){
	var ship = this.getShipById(cmd.id);
	if(!ship){
	    this.emit("shipNotExist",cmd);
	    console.log("ship not exist")
	    console.trace();
	    return;
	}
	
	this.emit("shipIsDead",ship);
	this.remove(ship);
	ship.isDead = true; 
    }
    BattleFieldSimulator.prototype.shipGain = function(cmd){
	var ship = this.getShipById(cmd.id);
	if(!ship){
	    this.emit("shipNotExist",cmd);
	    console.log("ship not exist")
	    console.trace();
	    return;
	}
	var mine = this.getMineById(cmd.targetId)
	if(!mine){
	    this.emit("mineNotExist",cmd);
	    console.log("mine not exist")
	    console.trace();
	    return;
	}
	this.emit("gained",ship,mine,cmd.ammount);
    }
    BattleFieldSimulator.prototype.shipMine = function(cmd){
	var ship = this.getShipById(cmd.id);
	if(!ship){
	    this.emit("shipNotExist",cmd);
	    console.log("ship not exist")
	    console.trace();
	    return;
	}
	var mine = this.getMineById(cmd.targetId)
	if(!mine){
	    this.emit("mineNotExist",cmd);
	    console.log("mine not exist")
	    console.trace();
	    return;
	}
	if(ship.subType!="miningShip"){
	    console.log("not mine ship");
	    console.trace();
	    return;
	}
	ship.AI.mineAt(mine);
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
    BattleFieldSimulator.prototype.doDamage = function(cmd){
	var ship = this.getShipById(cmd.id);
	if(!ship){
	    this.emit("shipNotExist",cmd);
	    console.log("ship not exist");
	    console.trace();
	    return;
	}
	ship.onDamage(cmd.damage);
    }
    BattleFieldSimulator.prototype.shipAttack = function(cmd){
	var ship = this.getShipById(cmd.id);
	if(!ship){
	    this.emit("shipNotExist",cmd);
	    console.log("ship not exist");
	    console.trace();
	    return;
	}
	var target = this.getShipById(cmd.targetId); 
	if(!target){
	    this.emit("shipNotExist",cmd);
	    console.log("target not exist");
	    console.trace();
	    return;
	}
	ship.AI.attackAt(target);
    } 
    BattleFieldSimulator.prototype.aboutReady = function(instruction){
	this.team = instruction.team;
	this.emit("aboutReady");
    }
    BattleFieldSimulator.prototype.addMotherShip = function(){
	var m0 = {
	    id:"0"
	    ,itemId:"0"
	    ,cordinates:this.map.born["0"]
	    ,team:"0"
	}
	var m1 = {
	    id:"1"
	    ,itemId:"0"
	    ,cordinates:this.map.born["1"]
	    ,team:"1"
	}
	this.initShips([m0,m1]);
    }
    BattleFieldSimulator.prototype.countDown = function(instruction){
	this.emit("countDown",instruction.count);
	if(instruction.count==0){
	    this.addMotherShip();
	} 
    } 
    BattleFieldSimulator.prototype.makeShip = function(instruction){
	var team = instruction.team;
	var itemId = instruction.itemId;
	this.emit("makeShip",{
	    team:team
	    ,itemId:itemId
	})
    };
    BattleFieldSimulator.prototype.createShip = function(instruction){
	var team = instruction.team;
	var motherShip = this.getShipById(team);
	var info = {
	    id:instruction.id
	    ,itemId:instruction.itemId
	    ,cordinates:motherShip.cordinates
	}
	var ship = this.initShip(info);
	this.emit("shipBuilt",ship);
    }
    BattleFieldSimulator.prototype._excute = function(instruction){
	switch(instruction.cmd){
	case OperateEnum.MOVE:
	    this.moveShipTo(instruction)
	    break;
	case OperateEnum.DEAD:
	    this.setShipDead(instruction);
	    break;	    
	case OperateEnum.DAMAGE:
	    this.doDamage(instruction);
	    break;
	case OperateEnum.ATTACK:
	    this.shipAttack(instruction);
	    break;
	case OperateEnum.MINING:
	    this.shipMine(instruction);
	    break;
	case OperateEnum.GAIN:
	    this.shipGain(instruction);
	    break;
	case OperateEnum.ABOUTREADY:
	    this.aboutReady(instruction);
	    break;
	case OperateEnum.COUNTDOWN:
	    this.countDown(instruction);
	    break;
	case OperateEnum.CREATE_SHIP:
	    this.createShip(instruction);
	    break;
	case OperateEnum.MAKE_SHIP:
	    this.makeShip(instruction);
	    break;
	}
    }
    exports.BattleFieldSimulator = BattleFieldSimulator;
})(exports)
