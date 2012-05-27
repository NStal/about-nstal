//This file init and start the whole site
var main;
$(function(){
    main = new Main();
    main.init();
})
API = function(){
    APIManager.call(this);
    this.apis = {};
    this.apiEx = {
	"template":["template/all.json"]
    }
    this.initAPI();
}
API.prototype = new APIManager();
Static.HttpAPI = new API();
Main = Class.sub();

Static.settings = {
    height:800
    ,width:1280
    ,rate:30
    ,host:"10.42.43.1"
    ,port:10000
}
Static.checkSize = function(){
    var scj = $("#screen");
    var settings = Static.settings;
    settings.width = scj.width();
    settings.height = scj.height();
    scj[0].width = settings.width;
    scj[0].height = settings.height;
}
Main.prototype.init = function(){
    Static.checkSize();
    $(window).resize(function(){
	Static.checkSize();
    })
    Static.resourceLoader = new ResourceLoader();
    Static.resourceLoader.add(GameResource);
    Static.resourceLoader.start();
    Static.HttpAPI.template(function(rsp){
	if(!rsp.data){
	    alert("fail mo get data");
	}
	Static.template = rsp.data;
	Static.waitPage = new WaitPage();
    $("body").append(Static.waitPage.nodeJ);
    Static.loginPage = new LoginPage(document.getElementById("loginPage"));
	if(window.location.hash=="#debug"){
	    Static.loginPage.usernameJ.val("nstal");
	    Static.loginPage.onClickConfirm();
	}
    })
    Static.KEYS = [];
    window.onkeydown =function(e){
	Static.KEYS[e.which] = true;
    }
    window.onkeyup = function(e){
	Static.KEYS[e.which] = false;
    }
	
}
Main.prototype.startGame = function(){
    Static.game = new Game(document.getElementById("screen"));
    Static.game.start(); 
    Static.resourceDisplayer = new ResourceDisplayer();
    $("body").append(Static.resourceDisplayer.nodeJ);
    Static.shipBuildList = new ShipBuildList(); 
    $("body").append(Static.shipBuildList.nodeJ);
    Static.countDownPage = new CountDownPage();
    $("body").append(Static.countDownPage.nodeJ); 
    document.getElementById("screen").oncontextmenu = function(){return false;}
    Static.resultPage = new ResultPage();
    $("body").append(Static.resultPage.nodeJ);
    
}
