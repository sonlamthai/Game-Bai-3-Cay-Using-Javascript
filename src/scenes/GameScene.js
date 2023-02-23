
var cardsPlay = [];
var isShowCards = false;
var ObjResult = {
    pointOfA: -1,
    pointOfB: -1,
    winOrLose: "",
    reason: "",
};

var GameLayer = cc.Layer.extend({
    ctor: function () {
        this._super();
        let size = cc.director.getWinSize();

        var gameBackground = new ccui.ImageView(res.gameBackground);
        gameBackground.x = size.width / 2;
        gameBackground.y = size.height / 2;
        this.addChild(gameBackground);

        shuffle(res.cardFront);

        for (var i = 0; i < 6; i++) {
            var card = new Card(!isShowCards ? res.cardBack : res.cardFront[i]);
            card.spriteCard.x = size.width / 2 + (1.2 * i);
            card.spriteCard.y = size.height / 2 + (1.2 * i);
            cardsPlay.push(card);
            this.addChild(card.spriteCard);
        }

        this.cardPack = new cc.Sprite(res.cardBack);
        this.cardPack.x = size.width / 2 + 7.2;
        this.cardPack.y = size.height / 2 + 7.2;
        this.addChild(this.cardPack);
        // self = this;
        this.btnShowCards = new ccui.Button();
        this.btnShowCards.setTitleText("Lật Bài");
        this.btnShowCards.setTitleFontName("controlFont");
        this.btnShowCards.setTitleFontSize(40);
        this.btnShowCards.setColor(new cc.Color(236, 236, 236));
        this.btnShowCards.x = size.width - 350;
        this.btnShowCards.y = 220;
        this.btnShowCards.setZoomScale(0.5);
        this.btnShowCards.setPressedActionEnabled(true);
        this.btnShowCards.addClickEventListener(this.showCards.bind(this));
        this.addChild(this.btnShowCards);
        this.btnShowCards.setVisible(false);

        var eventListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: this._onTouchBegan.bind(this),
        });

        cc.eventManager.addListener(eventListener, this.cardPack);

        this.userA = new cc.LabelTTF("Người chơi A", "userFont", 40);
        this.userA.x = size.width / 2;
        this.userA.y = 90;
        this.addChild(this.userA);

        this.userB = new cc.LabelTTF("Người chơi B", "userFont", 40);
        this.userB.x = size.width / 2;
        this.userB.y = size.height - 70;
        this.addChild(this.userB);

        this.btnShowResult = new ccui.Button();
        this.btnShowResult.setTitleText("Kết Quả");
        this.btnShowResult.setTitleFontName("controlFont");
        this.btnShowResult.setTitleFontSize(40);
        this.btnShowResult.x = size.width - 350;
        this.btnShowResult.y = size.height / 2;
        // this.btnShowResult.setPressedActionEnabled(true);
        this.btnShowResult.addTouchEventListener(this.showResult, this);
        // this.btnShowResult.addClickEventListener(this.showResult.bind(this));
        this.addChild(this.btnShowResult);
        this.btnShowResult.setVisible(false);
        console.log("abcxyz");

    },


    _onTouchBegan: function (touch, event) {
        var target = event.getCurrentTarget();
        var locationInNode = target.convertToNodeSpace(touch.getLocation());
        var s = target.getContentSize();
        var rect = cc.rect(0, 0, s.width, s.height);
        if (cc.rectContainsPoint(rect, locationInNode)) {
            cc.audioEngine.setEffectsVolume(1);
            cc.audioEngine.playEffect(res.distributeEff);

            for (var j = 0; j < cardsPlay.length; j++) {
                if (j % 2 == 0) {
                    var moveB = new cc.MoveTo(0.1, cc.p(562 + (j * 40), 520));
                    var distribute1 = cc.sequence(cc.delayTime(j / 10), moveB);
                    cardsPlay[j].spriteCard.runAction(distribute1);
                }
                else {
                    var moveA = new cc.MoveTo(0.1, cc.p(528 + (j * 40), 230));
                    var distribute2 = cc.sequence(cc.delayTime(j / 10), moveA);
                    cardsPlay[j].spriteCard.runAction(distribute2);
                }
            }
            this.btnShowCards.setVisible(true);

            return true;
        }
        return false;

    },

    showCards: function () {

        var valueA = 0;
        var valueB = 0;
        var cardsOrder = [];
        for (var i = 0; i < cardsPlay.length; i++) {
            cardsPlay[i].spriteCard.setTexture(res.cardFront[i]);
            cardsPlay[i].src = res.cardFront[i];
            cardsOrder.push(cardsPlay[i].getOrder());
            if (i % 2 == 0) {
                valueB += cardsPlay[i].getValue();
            }
            else {
                valueA += cardsPlay[i].getValue();
            }
        }

        var scoreA = valueA % 10;
        var scoreB = valueB % 10;

        this.result = cardsCompare(scoreA, scoreB, cardsOrder);
        this.btnShowCards.setVisible(false);
        this.btnShowResult.setVisible(true);
    },

    showResult: function (sender, type) {
        if (type == ccui.Widget.TOUCH_BEGAN) {
            this.btnShowResult.setVisible(false);
            var layerResult = new LayerResult(this.result);
            this.addChild(layerResult);
            this.removeChild(this.cardPack);
            cc.audioEngine.playEffect(res.winEff);
            cc.audioEngine.setEffectsVolume(0.2);
        }
    }
});


var LayerResult = cc.Layer.extend({
    ctor: function (result) {
        this._super();
        let size = cc.director.getWinSize();

        var bg = new ccui.ImageView(res.bg_black);
        bg.x = size.width / 2;
        bg.y = size.width / 2;
        bg.setOpacity(230);
        this.addChild(bg);

        var scoreA = new ccui.Text("Điểm của người chơi A: " + result.pointOfA, "scoreFont", 50);
        scoreA.x = 250;
        scoreA.y = 550;
        this.addChild(scoreA);

        var scoreB = new ccui.Text("Điểm của người chơi B: " + result.pointOfB, "scoreFont", 50);
        scoreB.x = size.width - 250;
        scoreB.y = 550;
        this.addChild(scoreB);

        var status = new ccui.Text(result.winOrLose, "winFont", 20);
        status.x = size.width / 2;
        status.y = size.height / 2;
        status.setColor(new cc.Color(252, 252, 112));
        this.addChild(status);
        var scaleText = cc.scaleBy(1, 4);
        var blinkText = cc.blink(2, 5);
        status.runAction(scaleText);
        status.runAction(blinkText);

        var reason = new ccui.Text("Lý Do: " + result.reason, "reasonFont", 40);
        reason.x = size.width / 2;
        reason.y = size.height / 2 - 150;
        reason.setColor(new cc.Color(252, 252, 112));
        this.addChild(reason);
        reason.opacity = 0;
        var fadeInText = cc.fadeIn(1);
        reason.runAction(fadeInText);

        this.btnRePlay = new cc.MenuItemFont("Chơi Lại", replay);
        this.btnRePlay.setPosition(size.width - 250, 90);
        this.btnRePlay.setFontName("menuFont");

        this.backToMenu = new cc.MenuItemFont("Main Menu", backMenu);
        this.backToMenu.setPosition(250, 90);
        this.backToMenu.setFontName("menuFont");

        this.menu2 = new cc.Menu(this.btnRePlay, this.backToMenu);
        this.menu2.setPosition(0, 0);
        this.addChild(this.menu2);
    }

});

var Card = cc.Class.extend({
    ctor: function (src) {
        this.src = src;
        this.spriteCard = new cc.Sprite();
        this.spriteCard.setTexture(this.src);
    },

    getValue: function () {
        var value = parseInt(this.src.slice(5, 6));
        return value;
    },

    getOrder: function () {
        var order = parseInt(this.src.slice(7, 9));
        return order;
    }
});

var cardsCompare = function (scoreA, scoreB, cardsOrder) {
    if (scoreA - scoreB != 0) {
        if (scoreA != 0 && scoreB != 0) {
            if (scoreA - scoreB > 0) {
                ObjResult.pointOfA = scoreA;
                ObjResult.pointOfB = scoreB;
                ObjResult.winOrLose = "A Thắng";
                ObjResult.reason = "Hơn Điểm";
                return ObjResult;
            }
            else if (scoreA - scoreB < 0) {
                ObjResult.pointOfA = scoreA;
                ObjResult.pointOfB = scoreB;
                ObjResult.winOrLose = "B Thắng";
                ObjResult.reason = "Hơn Điểm";
                return ObjResult;
            }
        }
        else {
            if (scoreA - scoreB > 0) {
                ObjResult.pointOfA = scoreA;
                ObjResult.pointOfB = 10;
                ObjResult.winOrLose = "B Thắng";
                ObjResult.reason = "Hơn Điểm";
                return ObjResult;
            }

            else {
                ObjResult.pointOfA = 10;
                ObjResult.pointOfB = scoreB;
                ObjResult.winOrLose = "A Thắng";
                ObjResult.reason = "Hơn Điểm";
                return ObjResult;
            }
        }
    }

    else {
        var index = cardsOrder.indexOf(getValueMax(cardsOrder));
        if (index % 2 == 0) {
            if (scoreA == 0 || scoreB == 0) {
                ObjResult.pointOfA = 10;
                ObjResult.pointOfB = 10;
            }
            else {
                ObjResult.pointOfA = scoreA;
                ObjResult.pointOfB = scoreB;
            }
            ObjResult.winOrLose = "B Thắng";
            ObjResult.reason = "Hơn Chất";
            return ObjResult;
        }
        else {
            if (scoreA == 0 || scoreB == 0) {
                ObjResult.pointOfA = 10;
                ObjResult.pointOfB = 10;
            }
            else {
                ObjResult.pointOfA = scoreA;
                ObjResult.pointOfB = scoreB;
            }
            ObjResult.winOrLose = "A Thắng";
            ObjResult.reason = "Hơn Chất";
            return ObjResult;
        }
    }
}



var getValueMax = function (array) {
    var max = 0;
    for (let i = 0; i < array.length; i++) {
        if (max < array[i]) {
            max = array[i];
        }
    }
    return max;
}


function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let t = array[i];
        array[i] = array[j];
        array[j] = t;
    }
}




var replay = function () {
    cardsPlay = [];
    cc.director.runScene(new cc.TransitionFadeUp(1, new GameScene()));
}

var backMenu = function () {
    cardsPlay = [];
    cc.director.runScene(new cc.TransitionProgressRadialCCW(1, new MenuScene()));
}


var GameScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var layer = new GameLayer();
        this.addChild(layer);
    }
})