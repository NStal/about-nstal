BFS = require("./share/battleFieldSimulator").BattleFieldSimulator;
var Instance = require("./share/util").Instance;
var GameInstance =require("./share/gameUtil").GameInstance;
bfs = new BFS();
mainInstance = new Instance();
mainInstance.setRate(5);
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
var ship = bfs.initShip(shipInfo);
ship.AI.moveTo({
    x:300
    ,y:300
})
mainInstance.next = function(){
    GameInstance.nextTick();
    console.log("in loop")
    bfs.next();
    console.log(ship.cordinates);
}
mainInstance.start()