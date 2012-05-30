var ChatBox = Class.sub();
ChatBox.prototype._init = function(){
    Widget.call(this,Static.template.chatBox);
    var self = 0;
    Static.gateway.on("chat",function(username,msg){
	self.historyContainerJ.append(username+":"+msg+"</br>"); 
	self.historyContainerJ.scrollTop(self.historyContainerJ[0].scrollHeight);
    })
    var self = this;
    this.lastHide = 0;
    this.chatInputJ.keyup(function(e){
	if(e.which == 13){
	    if(self.chatInputJ.val().length==0
	       && Date.now() - self.lastHide>800){
		self.hide();
		return;
	    } 
	    if(self.chatInputJ.val().length==0){
		return;
	    }
	    Static.gateway.send({
		cmd:OperateEnum.CHAT
		,data:self.chatInputJ.val()
	    })
	    self.chatInputJ.val(""); 
	}
    })
    this.chatInputJ.blur(function(){
	self.hide();
    })
}
ChatBox.prototype.show = function(){
    if(this.isShown)return;
    this.isShown = true;
    console.log(Date.now()-this.lastHide)
    if(Date.now()-this.lastHide<100){
	return;
    }
    this.lastShow = Date.now();
    this.chatInputJ.show();
    this.chatInputJ.focus();
    this.inChat = true;
    this.chatInputJ.removeAttr("disabled");
}
ChatBox.prototype.hide = function(){
    if(!this.isShown)return;
    this.isShown = false;
    this.chatInputJ.hide();
    this.inChat = false;
    this.lastHide = Date.now();
    this.chatInputJ.attr("disabled","disabled");
    Static.KEYS[Key.enter] = false; 
}