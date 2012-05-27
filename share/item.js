(function(exports){
    var Class = require("./util").Class;
    var Items = {
	"0":{
            name:"母船",
            maxSpeed:1.4,
	    maxRotateSpeed:0.02,
            maxLife:5000,
            life:5000,
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
	    ,size:25
	    ,range:20
	    ,attack:0
	    ,coolDown:90
	    ,consume:{
		mine:500
		,time:300
	    }
	    ,src:"miningShip"
	},
	"2":{
            name:"哨兵",
            maxSpeed:4,
	    maxRotateSpeed:0.08,
	    coolDown:30,
            maxLife:200,
            life:200,
            level:0,
	    subType:"attackShip"
	    ,size:15
	    ,curveForwarding:true
	    ,attack:10
	    ,range:80
	    ,minSpeed:3
	    ,consume:{
		mine:300
		,time:150
	    }
	    ,src:"frontier"
	},
	"3":{
            name:"守护者",
            maxSpeed:2.4,
	    maxRotateSpeed:0.05,
	    coolDown:90,
            maxLife:600,
            life:600,
            level:0,
	    subType:"attackShip"
	    ,size:25
	    ,curveForwarding:true
	    ,attack:30
	    ,range:120
	    ,consume:{
		mine:800
		,time:240
	    }
	    ,src:"gardian"
	},"4":{
            name:"驱逐舰",
            maxSpeed:2.2,
	    maxRotateSpeed:0.06,
	    coolDown:60,
            maxLife:500,
            life:500,
            level:0,
	    subType:"attackShip"
	    ,size:25
	    ,curveForwarding:true
	    ,attack:60
	    ,range:150
	    ,consume:{
		mine:1200
		,time:300
	    }
	    ,src:"crusador"
	},"5":{
            name:"战列舰",
            maxSpeed:1.4,
	    maxRotateSpeed:0.05,
	    coolDown:120,
            maxLife:1200,
            life:1200,
            level:0,
	    subType:"attackShip"
	    ,size:35
	    ,curveForwarding:true
	    ,attack:150
	    ,range:150
	    ,consume:{
		mine:2000
		,time:600
	    }
	    ,src:"battleShip"
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
