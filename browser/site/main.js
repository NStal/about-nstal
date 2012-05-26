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
    Static.popContainer = new PopContainer(document.getElementById("popContainer"));
    Static.popContainer.setTitle("选择您要制造的船");
    var ships = [];
    ships[0] = getResourceById("1");
    ships[0].callback = function(){alert(ships[0].life);};
    ships[1] = getResourceById("2");
    ships[1].callback = function(){alert(ships[1].attack);};
    Static.popContainer.setItemsData(ships);
}
