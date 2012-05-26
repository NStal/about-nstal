var PopContainer = EventEmitter.sub();
PopContainer.prototype._init = function(template){
    Widget.call(this,template);
}
PopContainer.prototype.setTitle = function(title){
    this.popTitleJ.html(title);
}
PopContainer.prototype.setItemsData = function(items){
    this.popContentJ.empty();
    for(i=0;i<items.length;i++)
    {
        var item = items[i];
        var _item = new PopContainerItem(item.name,item.callback);
        this.popContentJ.append(_item.nodeJ);
    }
}
PopContainerItem = Class.sub();
PopContainerItem.prototype._init = function(name,callback){
    var template = "<div class='popItem'></div>";
    Widget.call(this,template);   
    this.nodeJ.click(callback);
    this.nodeJ.text(name);
}
PopContainer.prototype.hide = function(){
    this.nodeJ.fadeOut(100);
}
PopContainer.prototype.show = function(){
    this.nodeJ.fadeIn(100);
}
