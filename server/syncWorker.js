var EventEmitter = require("./share/util").sub();
var SyncWorker = EventEmitter.sub();
SyncWorker.prototype._init = function(ws){
    var self = this; 
    this.ws = ws;
    this.ws.onclose = function(){
	self.emit("close");
	self.over = true;
    }
}
SyncWorker.prototype.start = function(){
    var self = this;
    this.ws.on("message",function(msg){
	var instruction = JSON.parse(msg);
	self.emit("message",instruction);
    });
    return this;
}
SyncWorker.prototype.send = function(msg){
    if(this.over){
	console.error("syncWorker has shut down");
	console.trace();
	return null;
    }
    this.ws.send(JSON.stringify(msg));
    return this;
}
