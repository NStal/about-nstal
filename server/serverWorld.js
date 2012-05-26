(function(exports){
    var Static = require("./static").Static;
    var ServerWorld = require("./share/world")World.sub();
    ServerWorld.prototype._init = function(){
	Static.gateway = new ServerGateway();
    }
})(exports)