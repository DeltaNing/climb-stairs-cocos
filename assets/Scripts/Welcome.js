// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        startButton: {
            default: null,
            type: cc.Node
        },

        // bgAudio: {
        //     default: null,
        //     url: cc.AudioClip
        // }
    },

    // LIFE-CYCLE CALLBACKS:
    onLoad() {
        cc.debug.setDisplayStats(false);
        console.log('start……')
        //开始游戏按钮动画放大缩小动画
        var scaleTo = cc.scaleTo(0.8, 0.9);
        var reverse = cc.scaleTo(0.8, 1);
        var seq = cc.sequence(scaleTo, reverse);
        this.startButton.runAction(seq.repeatForever()); //重复动画

        //预加载Game的场景
        cc.director.preloadScene("GameScene");

        this.startButton.on("touchstart", function () {
            this.buttonAnimation();
        }, this);
        
        // 背景自适应
        let scaleForShowAll = Math.min(
            cc.view.getCanvasSize().width / this.node.width,
            cc.view.getCanvasSize().height / this.node.height
        );
        let realWidth = this.node.width * scaleForShowAll;
        let realHeight = this.node.height * scaleForShowAll;

        // 2. 基于第一步的数据，再做缩放适配
        this.node.scale = Math.max(
            cc.view.getCanvasSize().width / realWidth,
            cc.view.getCanvasSize().height / realHeight
        );
    },

    // start () {

    // },

    // update (dt) {},

    //添加点击开始游戏后按钮动画
    buttonAnimation: function () {
        this.startButton.stopAllActions();

        var move1 = cc.moveBy(1.0, 0, 500);
        var move2 = cc.scaleTo(1.0, 0.6, 0.6);
        var callback = cc.callFunc(this.loadGameScene, this); //callFunc在动画执行完毕后调用哪个方法

        var spa = cc.spawn(move1, move2); //spawn让动画同时进行
        var seq = cc.sequence(spa, callback);

        this.startButton.runAction(seq);
    },

    //动画完成后加载Game场景
    loadGameScene: function () {
        cc.director.loadScene("GameScene");
    },
});