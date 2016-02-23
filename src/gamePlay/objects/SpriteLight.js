/**
 * Created by nguyennhatanh on 1/23/16.
 */
var SpriteLight = cc.Sprite.extend({
    indexX:0,//Toạ độ ô ngang
    indexY:0,//Toạ độ ô dọc
    isLightOn:false,//Trạng thái bật tắt
    sprLightOff:null,
    button:null,
    mainScene:null,
    canTap:true,
    canLight:true,
    ctor: function (x,y,main) {
        this._super(res.light_on);
        this.mainScene = main;
        this.indexX = x;
        this.indexY = y;
        this.isLightOn = false;
        this.sprLightOff =new cc.Sprite(res.light_off);
        this.sprLightOff.setPosition(this.getContentSize().width/2,this.getContentSize().height/2);
        this.sprLightOff.setVisible(false);
        this.addChild(this.sprLightOff);

        this.button = new ccui.Button();
        this.button.setTouchEnabled(true);
        this.button.loadTextures(res.light_off, res.light_off, "");
        this.button.x = this.getContentSize().width / 2.0;
        this.button.y = this.getContentSize().height / 2.0;
        this.button.setOpacity(0);
        this.button.addTouchEventListener(this.onClickLight,this);
        this.addChild(this.button);

        this.setState(false);
    }
});

SpriteLight.prototype.setCanTap = function(canTap)
{
    this.canTap = canTap;
    if(canTap == false)
    {
        this.setColor(cc.color(255,0,0));
        this.setVisible(false);
    }
    else{
        this.setColor(cc.color(255,255,255));
        this.setVisible(true);
    }

}
SpriteLight.prototype.resetState = function()
{
    this.canLight = true;
    this.canTap = true;
    this.isLightOn = false;
    this.setVisible(true);
    this.setColor(cc.color(255,255,255));
}
SpriteLight.prototype.setCanLight = function(canLight)
{
    this.canLight = canLight;
    if(canLight == false)
    {
        this.setColor(cc.color(0,0,255));
    }
    else{
        this.setColor(cc.color(255,255,255));
    }

}
SpriteLight.prototype.switchState = function()
{
    if(this.canLight == false) return;
    if(this.canTap == false) return;

    if(this.isLightOn)
    {
        this.isLightOn = false;
        this.sprLightOff.setVisible(true);

    }
    else{
        this.isLightOn = true;
        this.sprLightOff.setVisible(false);
    }
}
SpriteLight.prototype.setState = function(isOn)
{
    this.setColor(cc.color(255,255,255));
    this.isLightOn = isOn;
    if(this.isLightOn)
    {
        this.sprLightOff.setVisible(false);
    }
    else{
        this.sprLightOff.setVisible(true);
    }
}
SpriteLight.prototype.onClickLight= function(sender,type)
{
    if(this.canTap == false) return;
    var self = this;
    switch (type)
    {
        case ccui.Widget.TOUCH_ENDED:
            switch (SharedData.gamePlayCurrentLayer)
            {
                case MAIN_LAYERS.LAYER_GAME_PLAY:

                    self.mainScene.lightSelector.selectLight(self);
                    self.mainScene.doSwitchLight();

                    break;
            }
            break;
    }
}