// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        clickButton: 0,
        parentNode: {
            default: null,
            type: cc.Component
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function () {
        this.changeColor();
        this.parentNode = this.parentNode.getComponent('Btns'); // 获取拥有Btns脚本组件的父节点
        var clickEventHandler = new cc.Component.EventHandler();
        clickEventHandler.target = this.node; // 这个 node 节点是你的事件处理代码组件所属的节点
        clickEventHandler.component = "Button";// 这个是代码文件名
        clickEventHandler.handler = "callback";
        clickEventHandler.customEventData = "foobar";

        var button = this.node.getComponent(cc.Button);
        // 添加按钮点击事件
        button.clickEvents.push(clickEventHandler);
    },

    callback: function (event, customEventData) {

        // console.log(this.node.children)
        this.parentNode.clickNum = this.clickButton;
        // console.log(this.parentNode)
        this.changeColor();
        // 这里 event 是一个 Event 对象，你可以通过 event.target 取到事件的发送节点
        var node = event.target;
        var button = node.getComponent(cc.Button);
        // 这里的 customEventData 参数就等于你之前设置的 "foobar"
    },

    start () {

    },

    update (dt) {
        this.changeColor();
        // if(this.clickButton === this.parentNode.clickNum) {
        //     this.node.getChildByName('bg').color = new  cc.color(236, 158, 0, 255);
        //     this.node.getChildByName('text').color = new cc.color(255, 255, 255, 255);
        // } else {
        //     this.node.getChildByName('bg').color = new  cc.color(255, 255, 255, 255);
        //     this.node.getChildByName('text').color = new cc.color(0, 0, 0, 255);
        // }
    },

    changeColor() {
        if(this.clickButton == this.parentNode.clickNum) {
            this.node.getChildByName('bg').opacity = 255;
            this.node.getChildByName('text').color = new cc.color(255, 255, 255, 255);
        } else {
            this.node.getChildByName('bg').opacity = 0;
            this.node.getChildByName('text').color = new cc.color(0, 0, 0, 255);
        } 
    }
});
