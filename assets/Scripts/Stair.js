var tmpPlayer = require("Player");
cc.Class({
    extends: cc.Component,

    properties: {
        isUsed: false,
        // isStar: false,
        isStanding: false,
        isDowned: false,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {
    // },

    start () {

    },

    // update (dt) {
    // },

    onCollisionEnter: function(other, self) {
        // console.log('isUsed: ',this, this.isUsed)
        this.isUsed = true;

    },

    onCollisionStay: function (other, self) {
        // console.log('before isStanding: ',this.isStanding)
        this.isStanding = true;
        // console.log('after isStanding: ',this.isStanding)
    },

    onCollisionExit: function (other, self) {
        // console.log('exit--isStanding' )
        this.isStanding = false;
        // cc.log("end end");
        this.scheduleOnce(function(){
            this.stairIsUsed();
        },0.5);
    },

    stairIsUsed: function() {
        var goAction = cc.moveBy(1.0,cc.v2(0,-600));
        this.node.runAction(goAction);
        setTimeout(() => {
            if (cc.isValid(this.node)) {
                this.node.destroy();
            }
        },1200);
    },

    // gameIsOver: function () {
    //     if (this.isTouched == false) {
    //         var goAction = cc.moveBy(0.2,cc.v2(0,-600));
    //         this.node.runAction(goAction);
    //         this.scheduleOnce(function(){
    //             cc.director.loadScene("OverGame")
    //         },0.2);
    //     }
    // },
});
