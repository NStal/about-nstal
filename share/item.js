(function(exports){
    var Class = require("./util").Class;
    var Items = {
	"0":{
            name:"母船",
            maxSpeed:0.8,
	    maxRotateSpeed:0.02,
            maxLife:2000,
            life:2000,
            level:0,
	    subType:"motherShip"
	    
	    ,coolDown:60
	    ,size:50
	    ,range:100
	    ,attack:60
	    ,src:"motherShip"
	},
	"1":{
            name:"矿船",
            maxSpeed:0.8,
	    maxRotateSpeed:0.02,
            maxLife:400,
            life:400,
            level:0, 
	    subType:"miningShip" 
	    ,curveForwarding:true
	    ,size:30 
	    ,range:20
	    ,attack:0
	    ,coolDown:90
	    ,consume:{
		mine:1000
		,time:600
	    }
	},
	"2":{
            name:"攻击船",
            maxSpeed:2,
	    maxRotateSpeed:0.05,
	    coolDown:45,
            maxLife:200,
            life:200,
            level:0,
	    subType:"attackShip"
	    ,size:20
	    ,curveForwarding:true
	    ,attack:10
	    ,range:80 
	    ,consume:{
		mine:1000
		,time:300
	    }
	},
	"3":{
            name:"防御塔",
	    maxSpeed:0,
	    maxRotateSpeed:0,
            maxLife:300,
            life:300,
	    subType:"defenceTower"
	    ,size:30 
            ,attack:25
	    ,range:100
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
