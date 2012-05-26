(function(exports){
    var Instance = require("./util").Instance;
    var Static = require("./static").Static;
    var GameInstance = require("./gameUtil").GameInstance;
    var World = Instance.sub();
    var Static = require("./static"); 
    World.prototype._init = function(){
	//set GameInstanceRate
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