var CountDownPage = Class.sub();
CountDownPage.prototype._init = function(){
    var self = this;
    Widget.call(this,Static.template.countDownPage);
    Static.battleField.on("countDown",function(count){
	if(count!=0){
	    self.show(count);
	}else{
	    self.hide();
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