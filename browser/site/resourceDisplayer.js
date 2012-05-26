ResourceDisplayer = Class.sub();
ResourceDisplayer.prototype._init = function(){
    Widget.call(this,Static.template.resourceDisplayer);
    alert(this.nodeJ.html());
}