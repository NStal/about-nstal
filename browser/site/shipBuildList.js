var ShipBuildList = Class.sub();
ShipBuildList.prototype._init = function(){
    Widget.call(this,Static.template.shipBuildList);
    this.setTitle("Ship Builder");
    var items = [0,1,2,3,4,5,6,7];
    this.listItem = [];
    for(var i=0;i<items.length;i++){
	var item = new ShipBuildListItem(items[i]);
	this.contentJ.append(item.nodeJ);
	this.listItem.push(item);
    }
    var self = this;
    Static.battleField.on("upgraded",function(team,itemId,level){
	if(team!=Static.userteam)return;
	var item = self.getItemById(itemId);
	if(item){
	    item.upgradeTo(level);
	}
    });
    Static.battleField.on("initialized",function(){
	var team = Static.userteam;
	var info = Static.battleField.teamInfo[team];
	for(item in info.tech){
	    var shipProto = self.getItemById(item);
	    if(shipProto){
		shipProto.upgradeTo(info.tech[item]);
	    }
	}
    })
}
ShipBuildList.prototype.getItemById = function(id){
    for(var i=0;i<this.listItem.length;i++){
	var item = this.listItem[i];
	if(item.itemId == id)return item;
    }
    return null;
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
    Widget.call(this,Static.template.shipBuildListItem);
    this.itemId = itemId;
    this.proto = Static.gameResourceManager.get(itemId);
    this.name = this.proto.name;
    var img = Static.resourceLoader.getForce(this.proto.src);
    this.nameJ.text(this.name);
    this.picJ.attr("src",img.src);
    var self = this;
    if(this.itemId==0){
	this.actionBuildJ.remove();
    }else{
	this.onClickActionBuild = function(){
	    Static.gateway.send({
		cmd:OperateEnum.MAKE_SHIP
		,itemId:self.itemId
		,team:Static.userteam
	    });
	}
    }
    this.onClickActionUpgrade = function(){
	var level = Static.battleField.teamInfo[Static.userteam].tech[self.itemId];
	Static.gateway.send({
	    cmd:OperateEnum.UPGRADE
	    ,itemId:self.itemId
	    ,team:Static.userteam
	    ,level:level+1
	})
    }
    this.levelJ.text(0);
}
ShipBuildListItem.prototype.upgradeTo = function(level){
    this.levelJ.text("等级 "+level);
    this.upgradePriceJ.text("升级价格 "+Static.battleField.calculateUpgrade(this.itemId,level+1));
    this.consumeJ.text("价格 "+(this.proto.consume.mine
				*(+level+1)));
    
}