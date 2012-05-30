(function(exports){
    var random = require("./util").HashRandom;
    map = {
	mines:[
	]
	,born:{
	    "0":{x:100,y:100}
	    ,"1":{x:2000,y:2600}
	}
    }
    var seed = 20198;
    function between(a,b){
	seed++;
	return Math.floor(a+random(seed)*(b-a));
    }
    var size = {x:3000,y:3000}
    for(var i=0;i<50;i++){
	var typeId = between(0,10);
	if(typeId>8){
	    subType ="Tai";
	}else{
	    subType ="Crystal"
	}
	map.mines.push({
	    id:i.toString()
	    ,x:between(0,size.x)
	    ,y:between(0,size.y)
	    ,size:between(20,50)
	    ,subType:subType
	});
    }
    exports.map = map;
})(exports)