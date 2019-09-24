cc.Class({
    extends: cc.Component,

    properties: {
        scoreLabel:{
            default:null,
            type:cc.Label
        },

        button:{
            default:null,
            type:cc.Node
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        console.log('over')
        var score = cc.sys.localStorage.getItem("score");
        if (score) {
            this.scoreLabel.string = "您的得分："+score;
        }
        // 初始化分数
        cc.sys.localStorage.setItem("score",0);
        cc.director.preloadScene("GameScene");
        this.button.on("touchstart",function(){
            cc.sys.localStorage.removeItem("score");
            cc.director.loadScene("GameScene")
        });
    },

    start () {

    },

    // update (dt) {},
});
