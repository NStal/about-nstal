(function(exports){
    var Class = require("./util").Class;
    var Items = {
	"0":{
            name:"母船",
            speed:20, 
	    maxSpeed:1.5,
	    maxRotateSpeed:0.15,
            maxLife:1000,
            life:100,
            level:0,
	    subType:"motherShip"
	    ,size:50
	},
	"1":{
            name:"矿船",
            speed:20, 
            maxSpeed:2,
	    maxRotateSpeed:0.2,
            ability:20,
            maxLife:100,
            life:100,
            level:0,
	    subType:"miningShip"
	    ,size:30
	},
	"2":{
            name:"攻击船",
            maxSpeed:2,
	    maxRotateSpeed:0.05,
            attack:30,
            maxLife:100,
            life:100,
            level:0,
	    subType:"attackShip"
	    ,size:20
	    ,curveForwarding:true
	},
	"3":{
            name:"防御塔",
	    maxSpeed:0,
	    maxRotateSpeed:0,
            attack:60,
            maxLife:300,
            life:300,
	    subType:"defenceTower"
	    ,size:30
	}
    }
    GameResourceManager = Class.sub();
    GameResourceManager.prototype.load = function(items){
	this.items = items; 
    }
    GameResourceManager.prototype.get = function(id){
	return this.items[id];
    }
    exports.GameResourceManager = GameResourceManager;
    exports.Items = Items;
})(exports)
