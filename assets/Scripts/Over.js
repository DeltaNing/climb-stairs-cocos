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
        },
        rankBtn: {
            default:null,
            type:cc.Node
        },
        shareBtn: {
            default:null,
            type:cc.Node
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.log(this.node)
        console.log('over')
        var score = cc.sys.localStorage.getItem("score");
        if (score) {
            this.scoreLabel.string = "您的得分："+score;
        }
        let self = this;
        // 初始化分数
        cc.sys.localStorage.setItem("score",0);
        cc.director.preloadScene("GameScene");
        this.button.on("touchstart",function(){
            self.node.active = false
            cc.sys.localStorage.removeItem("score");
            cc.director.loadScene("GameScene")
            cc.log(self.node)
        });
        this.rankBtn.on('touchstart',function() {
            // 显示排行榜面板
            let modal = cc.find('Canvas/modal');
            modal.zIndex = 3; // gameover 的zindex是2，排行榜面板在gameover上面
            modal.active = true;
            modal.getComponent('Btns').clickNum = 1;
        })
    },

    start () {

    },

    // update (dt) {},
});
