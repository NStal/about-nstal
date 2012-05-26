var LoginPage = EventEmitter.sub();
LoginPage.prototype._init = function(template){
    Widget.call(this,template);
    this.onClickConfirm = function(){
	Static.username = this.usernameJ.val();
	this.hide();
    $("#screen").show();
    $("#openDoor").css({'display':'block'});
    $("#upDoor").animate({height:'0%',top:'0px'},1000);
    $("#downDoor").animate({height:'0%',bottom:'0px'},1000);
	main.startGame();
	
    }
}
LoginPage.prototype.hide = function(){
    this.nodeJ.fadeOut(100);
}
LoginPage.prototype.show = function(){
    this.nodeJ.fadeIn(100);
}
