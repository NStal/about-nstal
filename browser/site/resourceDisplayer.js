ResourceDisplayer = Class.sub();
ResourceDisplayer.prototype._init = function(){
    Widget.call(this,Static.template.resourceDisplayer);
    this.mineNameJ.text("Mine")
    this.mineAmmountJ.text("0");
    var self = this;
    Static.battleField.on("gained",function(ship,mine,ammount){
	if(ship.team==Static.userteam){
	    console.error(ship.team,Static.userteam);
	    self.gain("mine",ammount);
	}
    })
    Static.battleField.on("initialized",function(){
	self.setResource("mine",Static.battleField.teamInfo[Static.userteam].mine); 
    });
}
ResourceDisplayer.prototype.setResource = function(type,count){
    this.mineAmmountJ.text(count);
}
ResourceDisplayer.prototype.gain = function(type,count){
    var total = +this.mineAmmountJ.text();
    total+=count;
    this.mineAmmountJ.text(total);
}
ResourceDisplayer.prototype.reduce = function(type,count){
    var total = +this.mineAmmountJ.text();
    total-=count;
    this.mineAmmountJ.text(total);
}