/**
 * Created by nguyennhatanh on 1/25/16.
 */



var LevelSelectLayer = cc.LayerColor.extend({
    rootNode:null,

    btnMenu:null,

    btnOK:null,

    btnExit:null,

    levelGrid:null,

    currentLevelSelect:0,

    sprCurrentLevelSelect:null,

    arrLevelList:null,

    canClick:true,

    levelMatrix:null,

    startIndex:0,
    endIndex:0,

    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();
        this.setColor(cc.color(24,186,155));

        SharedData.levelSelectCurrentLayer = LEVEL_SELECT_LAYERS.LAYER_LEVEL_SELECT;

        this.loadSceneFromCocos();

        this.bindEvent();


        this.initLevelMatrix();

        this.loadLevel();

        return true;
    }
});

LevelSelectLayer.prototype.loadSceneFromCocos = function()
{
    var levelScene = ccs.load(res.cs_level_scene);
    this.rootNode = levelScene.node;
    this.addChild(this.rootNode);

    this.levelGrid =this.rootNode.getChildByName("grid_bg");

    this.btnOK = this.rootNode.getChildByName("btn_ok");
    this.btnOK.addTouchEventListener(this.touchEvent,this);
    this.btnMenu = this.rootNode.getChildByName("btn_menu");
    this.btnMenu.addTouchEventListener(this.touchEvent,this);
    this.btnExit = this.rootNode.getChildByName("btn_thoat");
    this.btnExit.addTouchEventListener(this.touchEvent,this);

}
LevelSelectLayer.prototype.initLevelMatrix = function()
{
    var self = this;
    self.levelMatrix = [];
    self.currentLevelSelect = GC.getCurrentLevel();
    for(var i = 0;i< 5;i++)
    {
        self.levelMatrix[i]=[];
        for(var j = 0;j<4;j++)
        {
            var sprLevel = new SpriteLevel(0,self,i,j);
            var w = sprLevel.getContentSize().width;
            var h = sprLevel.getContentSize().height;

            sprLevel.setPosition(w*i + w + w/4, h*(4-j));
            self.levelGrid.addChild(sprLevel);
            self.levelMatrix[i][j] = sprLevel;
            sprLevel.updateUI();

        }

    }
}
LevelSelectLayer.prototype.fillData = function()
{
    var self = this;
    self.startIndex = self.currentLevelSelect - (self.currentLevelSelect % 20);
    self.endIndex = Math.min(self.startIndex+19,GC.getMaxLevel());
    for(var i = 0;i<5;i++)
    {
        for(var j = 0;j<4;j++)
        {
            self.levelMatrix[i][j].setVisible(true);
            self.levelMatrix[i][j].setLevel(self.startIndex + j*5 + i);
            if(self.levelMatrix[i][j].levelID > self.endIndex) self.levelMatrix[i][j].setVisible(false);
            self.levelMatrix[i][j].deSelectSelf();
            if(self.currentLevelSelect == self.levelMatrix[i][j].levelID)
            {
                self.levelMatrix[i][j].selectSelf();
                self.sprCurrentLevelSelect = self.levelMatrix[i][j];
            }
        }
    }
}
LevelSelectLayer.prototype.nextPage = function()
{
    if(this.endIndex >= GC.getLockLevel() - 1) return;

    this.currentLevelSelect = this.endIndex +1;
    GC.setCurrentLevel(this.currentLevelSelect);
    this.fillData();
}
LevelSelectLayer.prototype.prevPage = function()
{
    if(this.currentLevelSelect < 16) return;
   this.currentLevelSelect -= 16;
    GC.setCurrentLevel(this.currentLevelSelect);
    this.fillData();
}
LevelSelectLayer.prototype.moveSelect = function(moveDirect)
{
    var x = this.sprCurrentLevelSelect.indexX;
    var y = this.sprCurrentLevelSelect.indexY;

    var oldY = y;
    var isBreak = false;
    do {
        switch (moveDirect)
        {
            case GC.MOVE_DIRECT.UP:   y--;break;
            case GC.MOVE_DIRECT.DOWN: y++;break;
            case GC.MOVE_DIRECT.LEFT: x--;break;
            case GC.MOVE_DIRECT.RIGHT:x++;break;
        }

        if(y<0) y = 3;if(y>3) y = 0;

        if(x<0) {
            this.prevPage();
            return;
        }
        else
        if(x>4) {
            this.nextPage();
            return;
        }

    }
    while(this.levelMatrix[x][y]==null || this.levelMatrix[x][y].isVisible()==false || this.levelMatrix[x][y].checkLock() == true );

    this.selectLevelCell(x,y);



}
LevelSelectLayer.prototype.loadLevel = function()
{
    var self = this;
    var currentLevel = GC.getCurrentLevel();
    cc.loader.loadJson("res/level.json", function(error, data){

        self.arrLevelList = data.level_list;
        GC.setMaxLevel(self.arrLevelList.length-1);
        if(currentLevel > GC.getMaxLevel()) currentLevel = GC.getMaxLevel();
        self.fillData();

    });
}

LevelSelectLayer.prototype.touchEvent = function(sender,type)
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
                self.selectLevel(self.currentLevelSelect);
            }


            if(sender == self.btnMenu)
            {
                self.goHomeScene();
            }

            if(sender == self.btnExit)
            {
                self.exitGame();
            }

            break;
    }
}
LevelSelectLayer.prototype.bindEvent = function()
{
    var self = this;
    cc.eventManager.addListener({
        event: cc.EventListener.KEYBOARD,
        onKeyReleased:function (key, event) {
            if(self.canClick == false) return;
            switch (SharedData.levelSelectCurrentLayer)
            {
                case LEVEL_SELECT_LAYERS.LAYER_LEVEL_SELECT:
                    switch (key)
                    {
                        case GC.KEY_CODE.ENTER:self.selectLevel(self.currentLevelSelect); break;
                        case GC.KEY_CODE.NUM_1:self.goHomeScene(); break;
                        case GC.KEY_CODE.NUM_2:self.exitGame();break;

                        case GC.KEY_CODE.ENTER:self.selectLevel(self.currentLevelSelect);break;
                        case GC.KEY_CODE.UP:self.moveSelect(GC.MOVE_DIRECT.UP);break;
                        case GC.KEY_CODE.DOWN:self.moveSelect(GC.MOVE_DIRECT.DOWN);break;
                        case GC.KEY_CODE.LEFT:self.moveSelect(GC.MOVE_DIRECT.LEFT);break;
                        case GC.KEY_CODE.RIGHT:self.moveSelect(GC.MOVE_DIRECT.RIGHT);break;

                        default :break;
                    }
                    break;


            }

        }
    }, this);
}

LevelSelectLayer.prototype.onClickLevel = function(level)
{
    this.selectLevel(level);
}


LevelSelectLayer.prototype.selectLevelCell = function(x,y)
    {
        for(var i = 0;i<5;i++)
        {
            for(var j = 0;j<4;j++)
            {


                if(x==i && y == j && this.levelMatrix[x][y].checkLock() == false)
                {
                    this.sprCurrentLevelSelect =  this.levelMatrix[x][y];
                    this.currentLevelSelect = this.sprCurrentLevelSelect.levelID;
                    this.sprCurrentLevelSelect.selectSelf();
                }
                else{
                    this.levelMatrix[i][j].deSelectSelf();
                }
            }
        }


    }
LevelSelectLayer.prototype.selectLevel = function(level)
{
    GC.setCurrentLevel(level);
    this.goPlayScene();
}

LevelSelectLayer.prototype.exitGame = function()
{
    console.log("Exit home scene");
    cc.director.runScene(new HomeScene());
}

LevelSelectLayer.prototype.goHomeScene = function()
{
    this.canClick = false;
    console.log("Go home scene");
    cc.director.runScene(new HomeScene());
}

LevelSelectLayer.prototype.goPlayScene = function()
{
    this.canClick = false;
    this.stopAllActions();
    cc.director.runScene(new MainScene());
}

LevelSelectLayer.prototype.showAbout = function()
{
    SharedData.homeCurrentLayer = HOME_LAYERS.LAYER_ABOUT;
    this.layerPopupBg.setVisible(true);
    this.popupAbout.setVisible(true);
}

LevelSelectLayer.prototype.hideAbout = function()
{
    SharedData.homeCurrentLayer = HOME_LAYERS.LAYER_HOME;
    this.layerPopupBg.setVisible(false);
    this.popupAbout.setVisible(false);
}

LevelSelectLayer.prototype.showExitDialog = function()
{
    SharedData.homeCurrentLayer = HOME_LAYERS.LAYER_EXIT;
    this.layerPopupBg.setVisible(true);
    this.popupExit.setVisible(true);
}

LevelSelectLayer.prototype.hideExitDialog = function()
{
    SharedData.homeCurrentLayer = HOME_LAYERS.LAYER_HOME;
    this.layerPopupBg.setVisible(false);
    this.popupExit.setVisible(false);
}


var LevelSelectScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new LevelSelectLayer();
        this.addChild(layer);
    }
});

