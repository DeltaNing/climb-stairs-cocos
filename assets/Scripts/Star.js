var tmpPlayer = require("Player");
cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {
    // },

    start () {

    },

    // update (dt) {
    // },

    onCollisionEnter: function(other, self) {
        console.log(this.node)
    },

    onCollisionStay: function (other, self) {
        
    },

    onCollisionExit: function (other, self) {
        this.scheduleOnce(function(){
            this.starIsUsed();
        },0.2);
    },

    starIsUsed: function() {
        var goAction = cc.moveBy(0.2,cc.v2(0,-180));
        var fadeOut = cc.fadeOut(0.2, 1);
        this.node.runAction(cc.spawn(goAction, fadeOut));
        setTimeout(() => {
            if (cc.isValid(this.node)) {
                this.node.destroy();
            }
        },1200);
    },
});
