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
	Static.gateway.connector.send({cmd:OperateEnum.SYNC
				       ,username:Static.username});
	RunTest();
    }) 
    Static.interactionManager = new InteractionManager();
    Static.userCustomTeam = [];
    Static.chatBox = new ChatBox();
    $("body").append(Static.chatBox.nodeJ);
}
Game.prototype.next = function(){
    Game.parent.prototype.next.call(this);
    var context = this.canvas.getContext("2d");
    context.clearRect(0,0
		      ,Static.settings.width
		      ,Static.settings.height);
    Static.battleFieldDisplayer.next();
    Static.battleFieldDisplayer.draw(context);
    Static.shipController.next();
    Static.shipController.onDraw(context);
    Static.interactionManager.draw(context);
    Static.smallMap.draw(context);
    //Static.gateway.next();
    this.solveKeyEvent();
    //console.log(Static.battleField.time);
}
Game.prototype.solveKeyEvent = function(){
    if(Static.chatBox.inChat)return; 
    if(Static.KEYS[Key.enter]){
	Static.KEYS[Key.enter] = false; 
	Static.chatBox.show();
    }
    if(Static.KEYS[Key.b]){
	Static.KEYS[Key.b] = false;
	Static.shipBuildList.toggle();
    }    
    if(Static.KEYS[Key.f]){
	Static.KEYS[Key.f] = false;
	Static.interactionManager.followMotherShip = !Static.interactionManager.followMotherShip;
    }
    if(Static.KEYS[Key.k]){
	Static.KEYS[Key.k] = false;
	var ships = [];
	var arr = Static.ships;
	for(var i=0;i < Static.ships.length;i++){
	    var item = Static.ships[i];
	    if(item.subType=="attackShip"){
		ships.push(item.id);
	    }
	}
	if(ships.length>0){
	    Static.gateway.send({
		cmd:OperateEnum.ATTACK
		,id:ships
		,targetId:(1-(+Static.userteam)).toString()
	    })
	}
    }
    for(var i=0;i<10;i++){
	if(Static.KEYS[Key[i.toString()]]
	   && Static.KEYS[Key.ctrl]
	   && Static.ships.length>0){
	    Static.KEYS[Key[i.toString()]] = false;
	    Static.userCustomTeam[i] = Static.ships.slice()
	    break;
	}
	if(Static.KEYS[Key[i.toString()]]
	   && Static.KEYS[Key.alt]
	   && Static.ships.length>0
	   && Static.userCustomTeam[i].length>0){
	    Static.KEYS[Key[i.toString()]] = false;
	    var ships = Static.userCustomTeam[i]; //ships to exclude
	    for(var i=0;i<ships.length;i++){
		Static.shipController.remove(ships[i]);
	    }
	    break;
	}
	
	if(Static.KEYS[Key[i.toString()]]
	   && Static.userCustomTeam[i] instanceof Array
	   && Static.userCustomTeam[i].length>0){
	    Static.KEYS[Key[i.toString()]] = false;
	    Static.shipController.clear(); 
	    for(var j=0;j<Static.userCustomTeam[i].length;j++){
		Static.shipController.addSelectShip(Static.userCustomTeam[i][j]);
	    }
	}
    }
    if(Static.KEYS[Key.a]){
	var attackPair = [];
	Static.KEYS[Key.a] = false;
	var tempArr = Static.ships;
	for(var i=0,length=tempArr.length;i < length;i++){
	    var item = tempArr[i];
	    if(item.subType!="attackShip" 
	       && item.subType!="motherShip"){
		continue;
	    }
	    var _tempArr = Static.battleField.parts;
	    for(var _i=0,_length=_tempArr.length;_i < _length;_i++){
		var _item = _tempArr[_i];
		if(_item.type=="ship" 
		   && _item.team!=Static.userteam
		   && _item.cordinates.distance(item.cordinates)<item.range*1.5){
		    attackPair.push([item.id,_item.id]);
		    break;
		}
	    }
	}
	var tempArr = attackPair;
	var result = {};
	for(var i=0,length=tempArr.length;i < length;i++){
	    var item = tempArr[i];
	    if(typeof result[item[1]] == "undefined")
		result[item[1]] = [];
	    result[item[1]].push(item[0]);
	}
	for(var item in result){
	    Static.gateway.send({
		cmd:OperateEnum.ATTACK
		,id:result[item]
		,targetId:item
	    })
	    Static.shipController.remove(item);
	}
    }
    
    if(Static.KEYS[Key.r]){
	var attackPair = [];
	Static.KEYS[Key.a] = false;
	var tempArr = Static.ships;
	for(var i=0,length=tempArr.length;i < length;i++){
	    var item = tempArr[i];
	    if(item.subType!="repairShip")continue;
	    var _tempArr = Static.battleField.parts;
	    for(var _i=0,_length=_tempArr.length;_i < _length;_i++){
		var _item = _tempArr[_i];
		if(_item.type=="ship" 
		   && _item.team==Static.userteam
		   && _item.life<_item.maxLife
		   && _item.cordinates.distance(item.cordinates)<item.range*1.5){
		    attackPair.push([item.id,_item.id]);
		    break;
		}
	    }
	}
	var tempArr = attackPair;
	var result = {};
	for(var i=0,length=tempArr.length;i < length;i++){
	    var item = tempArr[i];
	    if(typeof result[item[1]] == "undefined")
		result[item[1]] = [];
	    result[item[1]].push(item[0]);
	}
	for(var item in result){
	    Static.gateway.send({
		cmd:OperateEnum.ATTACK
		,id:result[item]
		,targetId:item
	    })
	    Static.shipController.remove(item);
	}
    } 
    if(Static.KEYS[Key.h]){
	Static.KEYS[Key.h] = false;
	Static.shipController.clear();
	Static.shipController.addSelectShip(Static.interactionManager.motherShip);
    }
}
