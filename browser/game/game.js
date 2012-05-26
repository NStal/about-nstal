var Game = World.sub();
Static.settings = {
    height:800
    ,width:1280
    ,rate:30
    ,host:"127.0.0.1"
    ,port:10000
}
Game.prototype._init = function(canvas){
    this.canvas = canvas;
    this.canvas.width = Static.settings.width
    this.canvas.height = Static.settings.height;
    this.setRate(Static.settings.rate);
    Static.selectRect = new SelectRect();
    Static.selectRect.alpha = 0.3
    this.team = [];
    Static.gameResourceManager = new GameResourceManager();
    Static.gameResourceManager.load(Items);
    Static.battleField = new BattleFieldSimulator();
    Static.battleFieldDisplayer = new BattleFieldDisplayer(Static.battleField); 
    Static.isShipSelect=false;
    Static.ships = [];
    Static.shipController = new ShipControler(canvas,Static.battleField);
    Static.gateway = new Gateway();
    Static.gateway.connect();
    Static.gateway.on("open",function(){
	    Static.gateway.send({cmd:OperateEnum.SYNC
			        ,username:Static.username});
	RunTest();
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
    Static.selectRect.draw(context);
    //console.log(Static.battleField.time);
}
