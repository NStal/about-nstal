RunTest = function(){
    var tests = [{
	test:function(){
	    Static.gateway.send(
		ProtocalGenerater.moveTo(
		    "1"
		    ,1000
		    ,300)); 
	    Static.gateway.send(
		ProtocalGenerater.moveTo(
		    "2"
		    ,500
		    ,100));
	}
	,time:100
    },{
	test:function(){
	    return;
	    Static.gateway.send({
		cmd:OperateEnum.ATTACK
		,id:"1"
		,targetId:"2"
	    })
	}
	,time:3000
    },{
	test:function(){
	    Static.gateway.send({
		cmd:OperateEnum.MINING
		,id:"2"
		,targetId:"1"
	    })
	}
	,time:3000
    }];
    for(var i=0;i<tests.length;i++){
	setTimeout(tests[i].test,tests[i].time)
    }
    
}