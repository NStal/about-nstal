(function(exports){
    var Class = require("./share/util").Class;
    var Static = require("./share/static");
    
    var Container = require("./share/container");
    
    var EventEmitter = require("./share/util");
    var ServerGateway = Container.sub();
    
    ServerGateway.prototype._init = function(bf){
	this.battleField = bf;
	this.battleField.gateway = this;
    }
    ServerGateway.prototype.onConnect = function(worker){
	
    }
    ServerGateway.prototype.boardCast = function(){
	
    } 
    ServerGateway.prototype.onMessage = function(msg,who){
    }
    exports.ServerGateway = ServerGateway;
})(exports)