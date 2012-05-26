var ShipBuildList = Class.sub();
ShipBuildList.prototype._init = function(){
    Widget.call(this,Static.template.shipBuildList);
    this.setTitle("Ship Builder");
    var items = [0,1,2,3];
    for(var i=0;i<items.length;i++){
	this.contentJ.append(new ShipBuildListItem(items[i]).nodeJ);
    }
}
ShipBuildList.prototype.setTitle = function(title){
    this.titleJ.text(title);
}

ShipBuildList.prototype.hide = function(){
    this.isShown = false;
    this.nodeJ.fadeOut(100);
}
ShipBuildList.prototype.show = function(){
    this.isShown = true;
    this.nodeJ.fadeIn(100);
}
ShipBuildList.prototype.toggle = function(){
    if(this.isShown)this.hide()
    else this.show();
}
ShipBuildListItem = Class.sub();
ShipBuildListItem.prototype._init = function(itemId){
    var template = "<div class='item'></div>";
    Widget.call(this,template);
    this.itemId = itemId;
    this.proto = Static.gameResourceManager.get(itemId);
    this.name = this.proto.name;
    this.nodeJ.text(this.name); 
    var self = this;
    this.nodeJ.click(function(){
	Static.gateway.send({
	    cmd:OperateEnum.MAKE_SHIP
	    ,itemId:self.itemId
	    ,team:Static.userteam
	})
    })
}