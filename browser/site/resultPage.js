var ResultPage = Class.sub();
ResultPage.prototype._init = function(){
    Widget.call(this,Static.template.resultPage);
    var self = this;
    Static.battleField.on("end",function(lost){
	self.show();
	if(lost == Static.userteam){
	    self.resultJ.text("You Lost!");
	}else{
	    self.resultJ.text("Congratulation, You Win!");
	}
    });
}
ResultPage.prototype.show = function(){
    this.nodeJ.fadeIn(100);
}