var Game = World.sub();
Static.settings = {
    height:800
    ,width:1280
    ,rate:30
    ,host:"10.42.43.1"
    ,port:10000
}
Game.prototype._init = function(canvas){
    this.canvas = canvas;
    this.canvas.width = Static.settings.width
    this.canvas.height = Static.settings.height;
    this.setRate(Static.settings.rate);
    Static.battleField = new BattleFieldSimulator();
    Static.battleFieldDisplayer = new BattleFieldDisplayer(Static.battleField); 
    Static.gateway = new Gateway();
    Static.gateway.connect();
    Static.gateway.on("open",function(){
	Static.gateway.send({cmd:OperateEnum.SYNC});
    })
    Static.battleField.on("initialized",function(){
	Static.gateway.send(ProtocalGenerater.moveTo("1"
						     ,Math.random()*500
						     ,Math.random()*500))
    })
}
Game.prototype.next = function(){
    Game.parent.prototype.next.call(this);
    var context = this.canvas.getContext("2d");
    context.clearRect(0,0
		      ,Static.settings.width
		      ,Static.settings.height);
    Static.battleFieldDisplayer.next();
    Static.battleFieldDisplayer.draw(context);
    console.log(Static.battleField.time);
}