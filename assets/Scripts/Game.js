// var tmpStair = require("Stair");
cc.Class({
    extends: cc.Component,

    properties: {
        player: {
            default: null,
            type: cc.Node
        },
        selfPlayer: {
            default: null,
            type: cc.Component
        },
        gameBG: {
            default: null,
            type: cc.Component
        },

        stair: {
            default: null,
            type: cc.Prefab
        },
        // star: {
        //     default: null,
        //     type: cc.Prefab
        // },
        starStair: {
            default: null,
            type: cc.Prefab
        },

        scoreLabel: {
            default: null,
            type: cc.Label
        },

        nodeView: {
            default: null,
            type: cc.Node
        },

        score: 0,
        starStairRate: 0, // 生成星星的概率

        stairCount: 0,
        otherStairCount: 3000,

        moveDuration: 0.2,
        moveDuration2: 0.05,

        stairWidth: 121,
        stairHeight: 117,
        stairDistanceY: 100, // 两个台阶之间的距离

        preStairX: 0,
        preStairY: 0,
        continuous: 0,

        otherStairs: [cc.Prefab],

        gameIsStart: false,

        time: 0,
        stairDownSecond: 0,
        gameOverSecond: 1, // 

        touchSquence: { // 记录按的左边还是右边的序列
            default: null,
            type: Array
        },
        touchTime: 0,
        // 关卡等级--分数
        level1: 0,
        level2: 0,
        level3: 0,
        level4: 0,
        levelControl: "0", //  "1"： 处在level1， ‘2’：处在level2

        clickTimes: 0 // 点击次数

        // isStart: null
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        cc.debug.setDisplayStats(false);
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

        // 开启碰撞系统
        var manager = cc.director.getCollisionManager();
        manager.enabled = false;
        this.selfPlayer = this.selfPlayer.getComponent("Player");
        this.touchSquence = new Array();
        //以下代码为显示物理碰撞的范围
        // manager.enabledDebugDraw = true;
        // manager.enabledDrawBoundingBox = true;

        // player的初始位置
        this.player.setPosition(0, -200);

        this.setInputControl();

        // 初始生成8个台阶
        for (var i = 0; i < 8; i++) {
            this.newStair();
        }

        this.player.zIndex = 1;
        this.scoreLabel.node.zIndex = 1;

        cc.director.preloadScene("OverGame")
    },

    // 监听touch_start方法
    setInputControl: function () {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this)
    },

    playerMoveLeft: function () {
        // console.log(this, this.player.isTouched)
        //角色跳跃的效果
        var goL1, goL2, sque, goAction;
        goL1 = cc.moveTo(this.moveDuration2, cc.v2(this.player.x, this.player.y + this.stairHeight / 2));
        goL2 = cc.moveTo(this.moveDuration2, cc.v2(this.player.x, this.player.y));
        sque = cc.sequence(goL1, goL2, cc.callFunc(this.judgeAction, this));

        this.player.runAction(sque);
        // 设置player的朝向
        this.player.scaleX = -1;
        goAction = cc.moveBy(this.moveDuration, cc.v2(this.stairWidth / 2, -this.stairDistanceY));
        
        this.nodeView.runAction(goAction);

    },
    /*
     * 判断是否失败
     */
    judgeAction() {
        if (this) {
            // console.log(this.player.y)
            // this.checkIsFailed();
            this.selfPlayer.isJumpOver = true;
            if (this && this.selfPlayer.isJumpOver) {
                this.checkIsFailed()
            }
        }

    },

    playerMoveRight: function () {
        //角色跳跃的效果
        var goR1, goR2, sque, goAction;

        goR1 = cc.moveTo(this.moveDuration2, cc.v2(this.player.x, this.player.y + this.stairHeight / 2));
        goR2 = cc.moveTo(this.moveDuration2, cc.v2(this.player.x, this.player.y));
        sque = cc.sequence(goR1, goR2, cc.callFunc(this.judgeAction, this));
        this.player.runAction(sque);

        this.player.scaleX = 1;
        goAction = cc.moveBy(this.moveDuration, cc.v2(-this.stairWidth / 2, -this.stairDistanceY));

        this.nodeView.runAction(goAction);

    },

    start() {
        this.targetY = this.player.y;
    },

    update(dt) {
        if (this.gameIsStart) {
            this.time += dt; //dt为每一帧执行的时间，把它加起来等于运行了多长时间  
            if (this.time >= this.stairDownSecond) {
                // cc.log("每2秒显示一次" + this.stairDownSecond);
                this.downStair();
                this.time = 0; //每达到stairDownSecond的值后重置时间为0，以达到循环执行  
            }
            if (this.touchSquence.length > 0 && this.selfPlayer.isJumpOver && this.selfPlayer.isTouched) {
                // console.log(33333333333333)
                if (this.touchSquence[0] == "L") {
                    this.playerMoveLeft();
                } else if (this.touchSquence[0] == "R") {
                    this.playerMoveRight();
                }
                this.touchSquence.shift();
                this.touchFunction();
                // 开始执行跳的动作时
                this.selfPlayer.isJumpOver = false; // player开始跳
                this.selfPlayer.isTouched = false; // isTouch设为false, 表示没有触碰到物体
            }

            // 根据分数切换背景图片
            if (this.selfPlayer.score >= this.level1 && this.selfPlayer.score < this.level2) {
                if (this.levelControl === '1') {
                    return;
                }
                this.gameOverSecond = 0.8;
                this.changeBGTexture('bg2', '1');
            } else if (this.selfPlayer.score >= this.level2 && this.selfPlayer.score < this.level3) {
                if (this.levelControl === '2') {
                    return;
                }
                this.gameOverSecond = 0.6;
                this.changeBGTexture('bg3', '2');
            } else if (this.selfPlayer.score >= this.level3 && this.selfPlayer.score < this.level4) {
                if (this.levelControl === '3') {
                    return;
                }
                this.gameOverSecond = 0.4;
                this.changeBGTexture('bg4', '3');
            } else if (this.selfPlayer.score >= this.level4) {
                if (this.levelControl === '4') {
                    return;
                }
                this.gameOverSecond = 0.3;
                this.changeBGTexture('bg5', '4');
            }
        }
    },
    checkIsFailed: function () {
        if (this.selfPlayer.isTouched == false) { // 如果没有碰到物体
            cc.log("fail");
            var goAction = cc.moveBy(0.2, cc.v2(0, -800));
            this.player.runAction(goAction);
            this.scheduleOnce(function () {
                // cc.director.loadScene("OverGame")
                this.showGameOverPanel();
            }, 0.2);
        }
    },

    //初始台阶生成
    newStair: function () {
        this.stairCount += 1;
        var newStair = cc.instantiate(this.stair);
        this.nodeView.addChild(newStair, -1);

        var randD = Math.random();

        var stairPosition = this.stairPosition(randD)
        newStair.setPosition(stairPosition);
    },

    //台阶生成带上动画效果
    newStairUpToDown: function () {
        this.stairCount += 1;
        let randStar = Math.random(),newStair;
        let isStar = randStar < this.starStairRate / 100; // 是否生成星星
        if(isStar) {
            newStair = cc.instantiate(this.starStair);
            this.nodeView.addChild(newStair, -this.stairCount++);
            // newStair.isStar = true;
            // console.log(newStair)
        } else {
            newStair = cc.instantiate(this.stair);
            this.nodeView.addChild(newStair, -this.stairCount++);
        }
        // var newStair = cc.instantiate(this.stair);
        // var starStair = cc.instantiate(this.starStair);
        // this.nodeView.addChild(newStair, -999);

        var randD = Math.random();

        var stairPosition = this.stairPosition(randD)
        newStair.setPosition(cc.v2(stairPosition.x, stairPosition.y + this.stairDistanceY));

        var goAction = cc.moveTo(this.moveDuration2, stairPosition);
        newStair.runAction(goAction);
    },
    
    // 生成障碍物台阶
    newOtherStair: function (isLeft, position) {
        if (this.stairCount == 1) {
            return;
        }

        var hasOther = false;
        var randD = Math.random();

        //生成障碍台阶的概率
        if (randD <= 0.8) {

        } else {
            hasOther = true;
        }

        if (hasOther) {
            // var count = Math.ceil(Math.random() * 2) - 1;
            // console.log('line 312',this.otherStairs[count])
            var newStair;
            // 不同的关卡，加载不同的障碍物
            switch (this.levelControl) {
                case '1':
                    newStair = cc.instantiate(this.otherStairs[1]);
                    break;
                case '2':
                    newStair = cc.instantiate(this.otherStairs[2]);
                    break;
                case '3':
                    newStair = cc.instantiate(this.otherStairs[3]);
                    break;
                case '4':
                    newStair = cc.instantiate(this.otherStairs[4]);
                    break;
                default:
                    newStair = cc.instantiate(this.otherStairs[0]);
                    break;
            }

            this.otherStairCount--;

            this.nodeView.addChild(newStair, this.otherStairCount);
            // console.log(this.preStairX, this.preStairY, position)
            //如果生成的台阶在左，那障碍就在右
            if (isLeft) {
                newStair.setPosition(this.preStairX + this.stairWidth / 2, position.y - 17);
            } else {
                newStair.setPosition(this.preStairX - this.stairWidth / 2, position.y - 17);
            }
        }
    },

    stairPosition: function (randD) {
        var randX = 0;
        var randY = 0;
        var isLeft = true;
        if (randD <= 0.5) {

        } else {
            isLeft = false;
        }

        if (this.stairCount == 1) { // 第1块台阶的位置
            randX = this.player.x;
            randY = this.player.y - 60;
        } else {
            if (isLeft) { // 如果台阶产生在左侧
                randX = this.preStairX - this.stairWidth / 2;
            } else { // 台阶产生在右侧
                randX = this.preStairX + this.stairWidth / 2;
                if (this.stairCount == 2) {
                    this.player.scaleX = -1;
                }
            }
            // 两个台阶之间垂直方向上的距离
            randY = this.preStairY + this.stairDistanceY;

        }

        var position = cc.v2(randX, randY);
        this.newOtherStair(isLeft, position); // 生成新的障碍台阶

        this.preStairX = randX;
        this.preStairY = randY;

        return position;
    },
    // 台阶掉落方法
    downStair: function () {
        // this.schedule(function(){
        var childrens = this.nodeView.children;
        // console.log(childrens)
        var length = childrens.length;
        for (var i = 0; i < length; i++) {
            var stairPrefab = childrens[i];
            if (stairPrefab.getComponent("Stair")) {
                var newStair = stairPrefab.getComponent("Stair");
                // console.log(newStair.isUsed)
                // console.log('stairs down')
                if (newStair.isUsed) { // 如果台阶与player产生了碰撞
                    if (newStair.isStanding) { // 如果player站在台阶上

                        this.gameIsStart = false;

                        this.node.off(cc.Node.EventType.TOUCH_START,
                            this.onTouchStart, this); // 取消监听touch_start事件

                        var downAction = cc.moveBy(0.5, cc.v2(0, -600));
                        var callback = cc.callFunc(this.gameIsOver, this); //callFunc在动画执行完毕后调用哪个方法

                        var seq = cc.sequence(downAction, callback);
                        this.player.runAction(seq);

                        var goAction = cc.moveBy(0.5, cc.v2(0, -600));
                        var fadeAction = cc.fadeOut(0.2, 1.0);

                        var spa = cc.spawn(goAction, fadeAction); //spawn让动画同时进行
                        newStair.node.runAction(spa);
                    } else { // 如果player没有站在台阶上
                        var goAction = cc.moveBy(0.8, cc.v2(0, -600));
                        var fadeAction = cc.fadeOut(0.5, 1.0);

                        var spa = cc.spawn(goAction, fadeAction); //spawn让动画同时进行
                        newStair.node.runAction(spa);
                    }
                }
            }

        }
    },

    //动画完成后加载Over场景
    gameIsOver: function () {
        this.unschedule()
        var goAction = cc.moveBy(0.2, cc.v2(0, -600));
        this.player.runAction(goAction);
        this.showGameOverPanel();
        // cc.director.loadScene("OverGame")
        // this.node.off(this);    //移除所有点击事件
    },

    onTouchStart: function (event) {
        // console.log(this.node.getChildByName('modal'))
        if(this.node.getChildByName('modal').active || this.node.getChildByName('gameOver').active) {
            return false;
        }
        if (!this.clickTimes) {
            let instrucion = cc.find("Canvas/instruction");
            let fadeout = cc.fadeOut(0.2, 1);
            instrucion.runAction(fadeout)
            // console.log(instrucion)
        }
        this.clickTimes++;

        let location = event.touch.getLocation();
        let locationX = location.x;
        if (locationX > this.node.width / 2) { // 如果，触碰位置在右侧，
            //this.playerMoveRight();
            this.touchSquence.push("R");
        } else {
            //this.playerMoveLeft();
            this.touchSquence.push("L");
        }
        this.gameIsStart = true;
    },
    touchFunction: function () {
        // 生成新台阶
        // let randStar = Math.random();
        // let isStar = randStar < this.starStairRate / 100; // 是否生成星星
        // if (isStar) {
        //     this.newStarUpToDown();
        // }

        this.newStairUpToDown();

        // if (this.gameIsStart == false) {
        this.gameIsStart = true;
        this.time = 0;

        // this.downStair();
        // }

        if (this.stairDownSecond <= this.gameOverSecond) {
            this.stairDownSecond = this.gameOverSecond;
        } else {
            this.stairDownSecond -= 0.05;
        }
    },
    // 修改背景图片
    changeBGTexture(url, level) {
        console.log(level)
        this.levelControl = level;
        let self = this;
        cc.loader.loadRes(url, cc.SpriteFrame, function (err, spriteFrame) {
            // console.log(spriteFrame)
            self.gameBG.node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
    },

    //星星生成带上动画效果
    newStarUpToDown: function () {
        // console.log('生成星星', this.star.data)

        let newStar = cc.instantiate(this.star);

        this.nodeView.addChild(newStar, ++this.otherStairCount);

        var starD = Math.random();
        // 星星位置
        var starX = 0;
        var starY = 0;
        var isLeft = true;
        if (starD <= 0.5) { // 判断在还是右侧

        } else {
            isLeft = false;
        }

        if (this.stairCount == 1) { // 第1块台阶的位置
            starX = this.player.x;
            starY = this.player.y - 100;
        } else {
            starX = this.preStairX
            // 两个台阶之间垂直方向上的距离
            starY = this.preStairY + this.stairDistanceY - 40;

        }
        var position = cc.v2(starX, starY);
        newStar.setPosition(cc.v2(position.x, position.y + this.stairDistanceY));

        var goAction = cc.moveTo(this.moveDuration2, position);
        newStar.runAction(goAction);
    },

    showGameOverPanel() {
        let gameOverNode = cc.find('Canvas/gameOver');
        this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        gameOverNode.zIndex = 2;
        gameOverNode.active = true;
    }
});