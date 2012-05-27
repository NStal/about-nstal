var Game = World.sub();
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
    Static.smallMap = new SmallMapLayer(Static.battleField);
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
    Static.interactionManager = new InteractionManager();
    
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
    Static.shipController.next();
    Static.shipController.onDraw(context);
    Static.interactionManager.draw(context);
    Static.smallMap.onDraw(context);
    this.solveKeyEvent();
    //console.log(Static.battleField.time);
}
Game.prototype.solveKeyEvent = function(){
    if(Static.KEYS[Key.b]){
	Static.KEYS[Key.b] = false;
	Static.shipBuildList.toggle();
    }    
    if(Static.KEYS[Key.f]){
	Static.KEYS[Key.f] = false;
	Static.interactionManager.followMotherShip = !Static.interactionManager.followMotherShip;
    }
    if(Static.KEYS[Key.a]){
	Static.KEYS[Key.a] = false;
	var tempArr = Static.ships;
	for(var i=0,length=tempArr.length;i < length;i++){
	    var item = tempArr[i];
	}
    }
}
