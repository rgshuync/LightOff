/**
 * Created by nguyennhatanh on 10/17/15.
 */


var HomeLayer = cc.LayerColor.extend({
    rootNode:null,

    layerPopupBg:null,

    popupAbout:null,

    btnAboutOK:null,

    btnOK:null,

    btnIntro:null,

    btnExit:null,

    popupExit:null,

    btnExitNo:null,

    btnExitYes:null,

    canClick:true,
    self:this,
    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();
        this.setColor(cc.color(24,186,155));

        SharedData.homeCurrentLayer = HOME_LAYERS.LAYER_HOME;

        this.loadSceneFromCocos();

        this.bindEvent();
        return true;
    }
});

HomeLayer.prototype.loadSceneFromCocos = function()
{
    var mainscene = ccs.load(res.cs_home_scene);
    this.rootNode = mainscene.node;
    this.addChild(this.rootNode);

    this.layerPopupBg =this.rootNode.getChildByName("popup_bg");
    this.popupAbout = this.rootNode.getChildByName("popup_about");
    this.btnAboutOK = this.popupAbout.getChildByName("btn_about_ok");
    this.btnAboutOK.addTouchEventListener(this.touchEvent,this);

    this.popupExit = this.rootNode.getChildByName("popup_exit");
    this.btnOK = this.rootNode.getChildByName("btn_bat_dau");
    this.btnOK.addTouchEventListener(this.touchEvent,this);
    this.btnIntro = this.rootNode.getChildByName("btn_gioi_thieu");
    this.btnIntro.addTouchEventListener(this.touchEvent,this);
    this.btnExit = this.rootNode.getChildByName("btn_thoat");
    this.btnExit.addTouchEventListener(this.touchEvent,this);

    this.btnExitNo = this.popupExit.getChildByName("btn_exit_no");
    this.btnExitNo.addTouchEventListener(this.touchEvent,this);

    this.btnExitYes = this.popupExit.getChildByName("btn_exit_yes");
    this.btnExitYes.addTouchEventListener(this.touchEvent,this);
}

HomeLayer.prototype.touchEvent = function(sender,type)
{
    var self = this;
    switch (type)
    {
        case ccui.Widget.TOUCH_BEGAN:
            cc.log("Touch began");
            break;
        case ccui.Widget.TOUCH_ENDED:
            if(self.canClick == false) return;
            if(sender == self.btnOK)
            {
                self.goPlayScene();
            }

            if(sender == self.btnIntro)
            {
                self.showAbout();
            }

            if(sender == self.btnExit)
            {
                self.showExitDialog();
            }

            if(sender == self.btnAboutOK)
            {
                self.hideAbout();
            }

            if(sender == self.btnExitNo)
            {
                self.hideExitDialog();
            }

            if(sender == self.btnExitYes)
            {
                self.hideExitDialog();
            }

            break;
    }
}
HomeLayer.prototype.bindEvent = function()
{
    var self = this;
    cc.eventManager.addListener({
        event: cc.EventListener.KEYBOARD,
        onKeyReleased:function (key, event) {
            if (self.canClick == false) return;
            switch (SharedData.homeCurrentLayer)
            {

                case HOME_LAYERS.LAYER_HOME:
                    switch (key)
                    {
                        case GC.KEY_CODE.ENTER:self.goPlayScene(); break;
                        case GC.KEY_CODE.NUM_1:self.showAbout(); break;
                        case GC.KEY_CODE.NUM_2:self.showExitDialog();break;
                        default :break;
                    }
                    break;

                case HOME_LAYERS.LAYER_EXIT:
                    switch (key)
                    {
                        case GC.KEY_CODE.NUM_1:self.hideExitDialog(); break;
                        case GC.KEY_CODE.NUM_2:self.exitGame();break;
                        default :break;
                    }
                    break;


                case HOME_LAYERS.LAYER_ABOUT:
                    switch (key)
                    {
                        case GC.KEY_CODE.ENTER:self.hideAbout(); break;
                        case GC.KEY_CODE.BACK:self.hideAbout();break;
                        default :break;
                    }
                    break;
            }

        }
    }, this);
}

HomeLayer.prototype.exitGame = function()
{

}

HomeLayer.prototype.goPlayScene = function()
{
    this.canClick = false;
    cc.director.runScene(new LevelSelectScene());
}

HomeLayer.prototype.showAbout = function()
{
    SharedData.homeCurrentLayer = HOME_LAYERS.LAYER_ABOUT;
    this.layerPopupBg.setVisible(true);
    this.popupAbout.setVisible(true);
}

HomeLayer.prototype.hideAbout = function()
{
    SharedData.homeCurrentLayer = HOME_LAYERS.LAYER_HOME;
    this.layerPopupBg.setVisible(false);
    this.popupAbout.setVisible(false);
}

HomeLayer.prototype.showExitDialog = function()
{
    SharedData.homeCurrentLayer = HOME_LAYERS.LAYER_EXIT;
    this.layerPopupBg.setVisible(true);
    this.popupExit.setVisible(true);
}

HomeLayer.prototype.hideExitDialog = function()
{
    SharedData.homeCurrentLayer = HOME_LAYERS.LAYER_HOME;
    this.layerPopupBg.setVisible(false);
    this.popupExit.setVisible(false);
}

var HomeScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HomeLayer();
        this.addChild(layer);
    }
});

