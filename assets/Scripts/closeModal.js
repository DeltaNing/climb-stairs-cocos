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
        parentNode: {
            default: null,
            type: cc.Node
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // cc.log(this.node);
        let click = new cc.Component.EventHandler();
        click.target = this.node;
        click.component = 'closeModal';
        click.handler = 'callback';
        // click.customEventData = "foobar";
        
        let button = this.node.getComponent(cc.Button);
        button.clickEvents.push(click);
    },

    callback: function (event) {
        this.parentNode.active = false;
        // console.log(this.parentNode)
    },

    start () {

    }

    // update (dt) {},
});
