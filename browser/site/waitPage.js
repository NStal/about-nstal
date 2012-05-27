var WaitPage = Class.sub();
WaitPage.prototype._init = function(){
    Widget.call(this,Static.template.resultPage);
    var self = this;
    self.resultJ.text("Waiting Player Join Now......");
}
WaitPage.prototype.show = function(){
    this.nodeJ.fadeIn(100);
}

WaitPage.prototype.hide = function(){
    this.nodeJ.fadeOut(100);
}
