var CountDownPage = Class.sub();
CountDownPage.prototype._init = function(){
    var self = this;
    Widget.call(this,Static.template.countDownPage);
    Static.battleField.on("countDown",function(count){
    if(count!=0){
        Static.waitPage.hide();
	    self.show(count);
	}else{
	    self.hide();
	    $("#openDoor").css({'display':'block'});
	    $("#upDoor").animate({height:'0%',top:'0px'},1000);
	    $("#downDoor").animate({height:'0%',bottom:'0px'},1000,function(){
	    $("#openDoor").css({'display':'none'});
	    });
	}
    })
}
CountDownPage.prototype.show = function(count){
    this.counterJ.text(count);
    this.nodeJ.fadeIn(100);
}
CountDownPage.prototype.hide = function(){
    this.nodeJ.fadeOut(100);
}
