(function(exports){
    var Judger = require("./share/util").Class.sub();
    var Static = require("./share/static").Static;
    var OperateEnum = require("./share/protocol").OperateEnum;
    Judger.prototype._init = function(){
	Static.battleField.on("shipDead",function(ship,byWho){
	    Static.gateway.boardCast({
		cmd:OperateEnum.DEAD
		,id:ship.id
	    })
	});
	Static.battleField.on("shipFire",function(ship,target){
	    Static.gateway.boardCast({
		cmd:OperateEnum.FIRE
		,id:ship.id
		,targetId:target.id
	    })
	    Static.gateway.boardCast({
		cmd:OperateEnum.DAMAGE
		,id:target.id
		,damage:ship.attack
	    })
	}); 
	Static.battleField.on("shipGain",function(ship,mine){
	    console.log("judger give",mine.size);
	    Static.gateway.boardCast({
		cmd:OperateEnum.GAIN
		,id:ship.id
		,targetId:mine.id
		,ammount:mine.size
	    });
	})
	Static.gateway.on("shipBuilt",function(ship){
	    Static.gateway.boardCast({
		cmd:OperateEnum.MOVE
		,id:ship.id
		,position:{
		    x:ship.position.x+(Math,random()-0.5)*30
		    ,y:ship.position.y+(Math,random()-0.5)*30
		}
	    })
	});
	Static.gateway.on("aboutToReady",function(){
	    Static.gateway.boardCast({
		cmd:OperateEnum.ABOUTREADY
		,team:Static.team
	    });
	    var count = 3;
	    var tid = setInterval(function(){
		if(count==0){
		    clearInterval(tid);
		}
		Static.gateway.boardCast({
		    cmd:OperateEnum.COUNTDOWN
		    ,count:count
		});
		count--;
	    },1000);
	});
    }
    exports.Judger = Judger;
})(exports)