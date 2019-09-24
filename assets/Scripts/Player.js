cc.Class({
    extends: cc.Component,

    properties: {
        isTouched:true, // 是否碰撞到物体
        score:0,
        isJumpOver: true,
        jumpAudio: {
            default: null,
            type: cc.AudioClip
        },
        scoreAudio: {
            default: null,
            type: cc.AudioClip
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // console.log('Player.js: ',this.node,this.node.parent)
        // 加载时，注册监听touchend事件
        this.node.parent.on(cc.Node.EventType.TOUCH_END,function(event){
            // console.log('监听touchend事件：')
            // this.isTouched = false; // isTouch设为false, 是否触碰到物体
            var manager = cc.director.getCollisionManager(); // 获取碰撞检测系统
            if (manager.enabled == false) { // 如果没开碰撞检测
                manager.enabled = true; // 则开启
            }
        },this)

        cc.director.preloadScene("OverGame");
    },

    start () {
        
    },

    // update (dt) {},
    /**
     * 当碰撞产生的时候调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionEnter: function (other, self) {
        // 调用声音引擎播放吃到星星的声音
        // cc.audioEngine.playEffect(this.jumpAudio, false);
        // cc.log("onCollisionEnter: ", other, self)
        this.isTouched = true; // 碰撞到物体
        //tag为0代表碰撞到的是正常的台阶，其他的为障碍
        if (other.tag == 0) {

            //把分数存储到本地
            this.score++;
            cc.sys.localStorage.setItem("score",this.score);

            //find为查找场景下对应的组件，getComponent为对应的组件类型
            // var stair = cc.find("Canvas/scorePanel/scoreLabel").getComponent(cc.Label);   

            //获取在Canvas上的分数label来更新分数
            var scoreLabel = cc.find("Canvas/scorePanel/scoreLabel").getComponent(cc.Label);   //find为查找场景下对应的组件，getComponent为对应的组件类型
            if (scoreLabel) {
                scoreLabel.string = this.score;
            }
        } else if(other.tag == 2) { // 吃到星星，加2分
            let up = cc.moveBy(0.5, cc.v2(0, 200))
            let fadeOut = cc.fadeOut(0.5, 1);
            // let star = this.node.parent.getComponent("Game").starStair.data.children[0];
            // star.opacity = 0;
            other.node.children[0].runAction(cc.spawn(up, fadeOut))
            // 调用声音引擎播放吃到星星的声音
            cc.audioEngine.playEffect(this.scoreAudio, false);
            //把分数存储到本地
            this.score += 2;
            cc.sys.localStorage.setItem("score",this.score);

            //find为查找场景下对应的组件，getComponent为对应的组件类型
            // var stair = cc.find("Canvas/scorePanel/scoreLabel").getComponent(cc.Label);   

            //获取在Canvas上的分数label来更新分数
            var scoreLabel = cc.find("Canvas/scorePanel/scoreLabel").getComponent(cc.Label);   //find为查找场景下对应的组件，getComponent为对应的组件类型
            if (scoreLabel) {
                scoreLabel.string = this.score;
            }
        } else {
            var outAction = cc.fadeOut(0.2,1.0);
            this.node.runAction(outAction);
            this.scheduleOnce(function(){
                let gameOverNode = cc.find('Canvas/gameOver');
                this.node.parent.off(cc.Node.EventType.TOUCH_START, this.node.parent.onTouchStart, this);
                gameOverNode.zIndex = 2;
                gameOverNode.active = true;
                // cc.director.loadScene("OverGame")
            },0.2);
        }
    },

    /**
     * 当碰撞产生后，碰撞结束前的情况下，每次计算碰撞结果后调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionStay: function (other, self) {
        // cc.log('on collision stay');
    },

    /**
     * 当碰撞结束后调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionExit: function (other, self) {
        // cc.log('on collision exit');
    },

});
