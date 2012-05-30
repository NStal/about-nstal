(function(exports){
    var Judger = require("./share/util").Class.sub();
    var Static = require("./share/static").Static;
    var OperateEnum = require("./share/protocol").OperateEnum;
    Judger.prototype._init = function(){
	this.cmdBuffer = {
	    "DAMAGE":[]
	}; 
	var self = this;
	Static.battleField.on("shipDead",function(ship,byWho){
	    Static.gateway.boardCast({
		cmd:OperateEnum.DEAD
		,id:ship.id
	    })
	    if(ship.subType == "motherShip"){
		Static.gateway.boardCast({
		    cmd:OperateEnum.END
		    ,lost:ship.team
		})
	    }
	});
	Static.battleField.on("upgrade",function(team,itemId,level){
	    Static.gateway.boardCast({
		cmd:OperateEnum.DOUPGRADE
		,team:team
		,itemId:itemId
		,level:level
	    })
	})
	Static.battleField.on("shipFire",function(ship,target){
	    self.buffer("DAMAGE",{
		id:target.id
		,damage:ship.attack
	    })
	});
	Static.battleField.on("shipGain",function(ship,mine){
	    var ammount = mine.gainByShip(ship);
	    console.log("judger give",ammount);
	    Static.gateway.boardCast({
		cmd:OperateEnum.GAIN
		,id:ship.id
		,targetId:mine.id
		,ammount:ammount
	    });
	})
	Static.battleField.on("end",function(){
	    Static.battleField.initialize([],Static.battleField.map);
	    Static.battleField.initTeamInfo();
	});
	Static.battleField.on("makeShip",function(info){
	    var id = Math.floor((Math.random()*1000000)).toString();
	    Static.gateway.boardCast({
		cmd:OperateEnum.CREATE_SHIP
		,id:id
		,team:info.team
		,itemId:info.itemId
	    });
	})
	Static.battleField.on("shipBuilt",function(ship){
	    Static.gateway.boardCast({
		cmd:OperateEnum.MOVE
		,id:ship.id
		,position:{
		    x:ship.cordinates.x+(Math.random()-0.5)*100
		    ,y:ship.cordinates.y+(Math.random()-0.5)*100
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
    Judger.prototype.buffer = function(type,info){
	this.cmdBuffer[type].push(info); 
    }
    Judger.prototype.next = function(){
	/*//FIRE
	var results = {};
	var arr = this.cmdBuffer["FIRE"];
	for(var i=0;i<arr.length;i++){
	    var item = arr[i];
	    if(!results[item.targetId]){
		results[item.targetId] = [item.id];
	    }else{
		results[item.targetId].push(item.id);
	    }
	} 
	for(var item in results){
	    Static.gateway.boardCast({
		cmd:OperateEnum.FIRE
		,id:results[item]
		,targetId:item
	    })
	}
	this.cmdBuffer["FIRE"].length = 0;
	*/
	
	var results = {};
	var arr = this.cmdBuffer["DAMAGE"];
	for(var i=0;i<arr.length;i++){
	    var item = arr[i];
	    if(!results[item.id]){
		results[item.id] = item.damage;
	    }else{
		results[item.id] +=item.damage;
	    }
	} 
	for(var item in results){
	    Static.gateway.boardCast({
		cmd:OperateEnum.DAMAGE
		,id:item
		,damage:results[item]
	    })
	}
	
	this.cmdBuffer["DAMAGE"].length = 0;
    }
    exports.Judger = Judger;
})(exports)