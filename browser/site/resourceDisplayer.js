ResourceDisplayer = Class.sub();
ResourceDisplayer.prototype._init = function(){
    Widget.call(this,Static.template.resourceDisplayer);
    this.mineNameJ.text("Mine")
    this.mineAmmountJ.text("0");
    var self = this;
    Static.battleField.on("gained",function(ship,mine,ammount){
	self.gain("mine",ammount);
    })
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