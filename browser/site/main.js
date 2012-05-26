//This file init and start the whole site
var main;
$(function(){
    main = new Main();
    main.init();
})
Main = Class.sub();
Main.prototype.init = function(){
    Static.game = new Game(document.getElementById("screen"));
    Static.game.start();
    Static.loginPage = new LoginPage(document.getElementById("loginPage"));
}
