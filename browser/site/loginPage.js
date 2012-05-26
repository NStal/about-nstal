var LoginPage = EventEmitter.sub();
LoginPage.prototype._init = function(template){
    Widget.call(this,template);
    this.onClickConfirm = function(){
	alert(this.usernameJ.val());
	this.hide();
	$("#screen").show();
    }
}
LoginPage.prototype.hide = function(){
    this.nodeJ.fadeOut(100);
}
LoginPage.prototype.show = function(){
    this.nodeJ.fadeIn(100);
}