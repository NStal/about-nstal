(function(exports){
    var Judger = require("./share/util").Class.sub();
    var Static = require("./share/static").Static;
    var OperateEnum = require("./share/protocol").OperateEnum;
    Judger.prototype._init = function(){
	Static.battleField.on("shipDead",function(ship,byWho){
	    Static.battleField.remove(ship);
	    Static.gateway.boardCast({
		cmd:OperateEnum.DEAD
		,id:ship.id
	    }) 
	}); 
    }
	
})(exports)