/**
 * Created by nguyennhatanh on 1/25/16.
 */
var SpriteLevel = cc.Sprite.extend({
    indexX:0,//Toạ độ ô ngang
    indexY:0,//Toạ độ ô dọc
    levelID:0,
    isSelect:false,//Trạng thái được chọn hay không
    sprLevelLock:null,
    sprLevelSelect:null,
    lbLevel:null,
    btnLevel:null,
    rootNode:null,
    levelScene:null,
    ctor: function (level,levelScene,x,y) {
        this._super(res.btn_level_normal);
        this.setOpacity(0);

        this.indexX = x;
        this.indexY = y;

        this.levelScene = levelScene;
        this.levelID = level;

        var csNode = ccs.load(res.cs_level_node);
        this.rootNode = csNode.node;
        this.addChild(this.rootNode);

        this.sprLevelLock = this.rootNode.getChildByName("btn_level_lock");
        this.sprLevelSelect = this.rootNode.getChildByName("btn_level_select");
        this.lbLevel = this.rootNode.getChildByName("lb_level");
        this.btnLevel = this.rootNode.getChildByName("btn_level");
        this.btnLevel.addTouchEventListener(this.onClickLevel,this);

       this.updateUI();

    }
});

SpriteLevel.prototype.checkLock = function()
{
    if(this.levelID >= GC.getLockLevel()) return true;
    return false;

}

SpriteLevel.prototype.setLevel = function(level)
{
    this.levelID = level;
    this.updateUI();

}

SpriteLevel.prototype.updateUI = function()
{
    this.lbLevel.setString(this.levelID+1);
    if(this.isSelect) {
        this.sprLevelSelect.setVisible(true);
    }
    else{
        this.sprLevelSelect.setVisible(false);
    }
    if(this.levelID >= GC.getLockLevel())
    {
        this.sprLevelLock.setVisible(true);
        this.lbLevel.setVisible(false);
    }
    else{
        this.sprLevelLock.setVisible(false);
        this.lbLevel.setVisible(true);
    }
}
SpriteLevel.prototype.selectSelf = function()
{
    this.isSelect = true;
    this.updateUI();
}
SpriteLevel.prototype.deSelectSelf = function()
{
    this.isSelect = false;
    this.updateUI();
}



SpriteLevel.prototype.onClickLevel = function(sender,type)
{
    if(this.checkLock()) return;
    var self = this;
    switch (type)
    {
        case ccui.Widget.TOUCH_ENDED:
            self.levelScene.selectLevel(self.levelID);
            break;
    }
}