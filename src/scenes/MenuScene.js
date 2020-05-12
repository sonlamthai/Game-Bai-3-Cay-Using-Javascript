var MenuLayer = cc.Layer.extend({
    ctor: function () {
        this._super();

        cc.log("Tao PlayLayer");
        var size = cc.director.getWinSize();
        cc.log(size);

        cc.audioEngine.playMusic(res.mainMusic, true);
        cc.audioEngine.setMusicVolume(0.3);

        var bgMenu = new ccui.ImageView(res.bg_menu);
        bgMenu.x = size.width / 2;
        bgMenu.y = size.height / 2;
        bgMenu.setOpacity(150);
        this.addChild(bgMenu);

        var nameGame = new ccui.Text("Bài 3 Cây", "gameNameFont", 100);
        nameGame.setColor(new cc.Color(255, 255, 255));
        nameGame.x = size.width / 2;
        nameGame.y = size.height / 2 + 200;
        this.addChild(nameGame);

        var btnPlay = new cc.MenuItemFont("Chơi Ngay", goGameScene)
        btnPlay.setFontName("menuFont");
        btnPlay.setFontSize(50);
        btnPlay.setColor(new cc.Color(252, 252, 112));
        var menu = new cc.Menu(btnPlay);
        menu.alignItemsVertically();
        this.addChild(menu);
    }
});

var goGameScene = function () {
    cc.audioEngine.stopMusic();
    var gameScene = new GameScene();
    cc.director.runScene(new cc.TransitionFade(1, gameScene));

}


var MenuScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        cc.log("Tao Play Scene");
        var layer = new MenuLayer();
        this.addChild(layer);
    }
})