(function(exports){
    var Instance = require("./util").Instance;
    var GameInstance = require("./gameUtil").GameInstance;
    var World = Instance.sub();
    var Static = require("./static").Static;
    World.prototype._init = function(){
	//set GameInstanceRate
	if(!Static.settings)return;
	GameInstance.setTickPerUnitTime(Static.settings.rate); 
	//set Debug
	Instance.toggleDebug();
	//set rate of the game
	this.setRate(Static.settings.rate);
	//see Class Instance in util.js
	this.garenteed = true;
    }
    World.prototype.next = function(){
	GameInstance.nextTick();
	this.emit("nextTick");
    }
    exports.World = World;
})(exports)