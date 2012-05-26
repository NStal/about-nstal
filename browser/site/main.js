//This file init and start the whole site
var main;
$(function(){
    main = new Main();
    main.init();
})
/*API = function(){
    APIManager.call(this);
    this.apiEx = {
	"template":["template/all.json"]
    }
    this.initAPI();
}
API.prototype = new APIManager();
Static.HttpAPI = new API();*/
Main = Class.sub();
Main.prototype.init = function(){
    Static.game = new Game(document.getElementById("screen"));
    Static.game.start();
    Static.loginPage = new LoginPage(document.getElementById("loginPage"));
    Static.popContainer = new PopContainer(document.getElementById("popContainer"));
}
