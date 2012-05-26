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
Main.prototype.init = function(){
    Static.HttpAPI.template(function(rsp){
	if(!rsp.data){
	    alert("fail mo get data");
	}
	Static.template = rsp.data;
	Static.loginPage = new LoginPage(document.getElementById("loginPage"));
	if(window.location.hash=="#debug"){
	    Static.loginPage.usernameJ.val("nstal");
	    Static.loginPage.onClickConfirm();
	}
    })
}
Main.prototype.startGame = function(){
    Static.game = new Game(document.getElementById("screen"));
    Static.game.start(); 
    Static.resourceDisplayer = new ResourceDisplayer();
    $("body").append(Static.resourceDisplayer.nodeJ);
    Static.popContainer = new PopContainer(document.getElementById("popContainer"));
	
}
