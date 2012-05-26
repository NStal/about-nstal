var Game = World.sub();
Static.settings = {
    height:800
    ,width:1280
    ,rate:30
}
Game.prototype._init = function(canvas){
    var shipInfo = {
	cordinates:{x:100,y:100}
	,ability:{
	    maxSpeed:10
	    ,maxRotateSpeed:0.5
	    ,attack:100
	    ,range:50
	}
	,size:20
	,id:"1"
    }
    this.canvas = canvas;
    this.canvas.width = Static.settings.width
    this.canvas.height = Static.settings.height;
    this.setRate(Static.settings.rate);
    Static.battleField = new BattleFieldDisplayer();
    
    var ship = Static.battleField.initShip(shipInfo);
    ship.AI.moveTo({
	x:300
	,y:300
    })
}
Game.prototype.next = function(){
    Game.parent.prototype.next.call(this);
    var context = this.canvas.getContext("2d");
    context.clearRect(0,0
		      ,Static.settings.width
		      ,Static.settings.height);
    Static.battleField.next();
    Static.battleField.draw(context);
}