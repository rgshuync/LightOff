/**
 * Created by nguyennhatanh on 1/20/16.
 */
/**
 * Created by nguyennhatanh on 10/17/15.
 */


var MainLayer = cc.LayerColor.extend({
    rootNode:null,

    popupBg:null,

    popupGuide:null,
    btnGuideOK:null,

    btnDung:null,
    btnSai:null,
    btnChoiLai:null,
    btnGoHome:null,

    popupGameOver:null,
    btnGameOverChoiLai:null,
    btnGameOverHome:null,
    btnGameOverNext:null,

    lbMove:null,
    lbTime:null,
    lbCurrentLevel:null,

    cols:GC.maxCols,
    rows:GC.maxRows,
    currentMove:0,
    maxTime:5,//time attack max
    currentTime:5,//current time attack

    layerGridBg:null,
    lightSelector:null,//Cho biết đang chọn đèn nào
    lightMatrix:null,//Ma trận đèn

    canClick:true,

    dataCurrentLevel:null,//Danh sách các ô đèn từ JSON
    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();
        this.setColor(cc.color(24,186,155));

        SharedData.gamePlayCurrentLayer = MAIN_LAYERS.LAYER_GAME_PLAY;

        this.loadSceneFromCocos();

        this.bindEvent();

        this.initLightMatrix();

        this.loadLevel();

        this.showGuide();

        return true;
    }
});

MainLayer.prototype.initLightMatrix = function()
{
    var self = this;
    self.lightMatrix = [];

    //Mảng 2 chiều chứa các đèn
    for(var i = 0;i<GC.maxCols;i++)
    {
        self.lightMatrix[i] = [];
        for(var j = 0;j<GC.maxRows;j++)
        {
            var sprLight = new SpriteLight(i,j,self);
            sprLight.setState(false);
            var w = sprLight.getContentSize().width;
            var h = sprLight.getContentSize().height;

            sprLight.setPosition(w*i + w/2, h*j + h/2);

            self.lightMatrix[i][j] = sprLight;
            self.layerGridBg.addChild(sprLight);
        }
    }

    //Chọn đèn đầu tiên
    self.lightSelector = new SpriteLightSelect();
    self.layerGridBg.addChild(self.lightSelector);
    self.lightSelector.selectLight(self.lightMatrix[0][0]);
}

MainLayer.prototype.turnOffAllLight = function()
{
    var self = this;
    for(var i = 0;i<self.cols;i++)
    {
        for(var j = 0;j<self.rows;j++)
        {
            this.lightMatrix[i][j].resetState();
        }
    }
}

MainLayer.prototype.testReg = function()
{
    var jsonList ="0-0-0-1-0";
    var arr = jsonList.split("-");
    console.log(arr);
}

MainLayer.prototype.loadLevel = function()
{
    var self = this;
    var currentLevel = GC.getCurrentLevel();

    self.lbCurrentLevel.setString(currentLevel+1);

    cc.loader.loadJson("res/level.json", function(error, data){

        GC.setMaxLevel(data.level_list.length-1);

        if(currentLevel > GC.getMaxLevel()) currentLevel = GC.getMaxLevel();

        self.dataCurrentLevel = data.level_list[currentLevel];

        self.fillDataLevel();

        });


}
/**
 * Load level đã được config từ file json
 */
MainLayer.prototype.fillDataLevel = function()
{
    this.turnOffAllLight();
    var self = this;

    //Các ô bật sẵn
    self.rows = self.dataCurrentLevel.light_matrix.length;
        for(var i = 0;i<self.dataCurrentLevel.light_matrix.length;i++)
        {
            var arrCols = self.dataCurrentLevel.light_matrix[i].split("-");
            self.cols = arrCols.length;

            for(var j = 0;j<arrCols.length;j++)
            {
                var cellValue = arrCols[j];

                switch (cellValue) {
                    case "0":
                        self.lightMatrix[j][self.rows-1-i].setState(false);
                        break;
                    case "1":
                        self.lightMatrix[j][self.rows-1-i].setState(true);
                        break;
                    case "2":
                        self.lightMatrix[j][self.rows-1-i].setState(true);
                        self.lightMatrix[j][self.rows-1-i].setCanTap(false);
                        break;
                    case "3":
                        self.lightMatrix[j][self.rows-1-i].setState(true);
                        self.lightMatrix[j][self.rows-1-i].setCanLight(false);
                        break;

                }

            }

        }


    //Ẩn các ô có kích thước lớn hơn kích thước level (w,h)
    for(var j = 0;j< GC.maxCols;j++)
    {
        for(var k = 0;k<GC.maxRows;k++)
        {
            var w = self.lightMatrix[j][k].getContentSize().width;
            var h = self.lightMatrix[j][k].getContentSize().height;

            var deltaX = w * (GC.maxCols-self.cols)/2;
            var deltaY = h * (GC.maxRows-self.rows)/2;

            self.lightMatrix[j][k].setPosition(w*j + w/2 + deltaX, h*k + h/2+deltaY);

            if(j>=self.cols || k>=self.rows)
            {
                self.lightMatrix[j][k].setVisible(false);
            }
            else{
                if(self.lightMatrix[j][k].canTap) self.lightMatrix[j][k].setVisible(true);

            }

        }
    }

    this.lightSelector.selectLight(this.lightMatrix[0][0]);

}

MainLayer.prototype.moveSelector = function(moveDirect)
{
    var self = this;
    var x = this.lightSelector.indexX;
    var y = this.lightSelector.indexY;

    switch (moveDirect)
    {
        case  GC.MOVE_DIRECT.UP:
            y++;
            break;
        case  GC.MOVE_DIRECT.DOWN:
            y--;
            break;
        case  GC.MOVE_DIRECT.LEFT:
            x--;
            break;
        case  GC.MOVE_DIRECT.RIGHT:
            x++;
            break;
    }

    if (x < 0) x = self.cols - 1;if (x > (self.cols - 1)) x = 0;
    if (y < 0) y = self.rows - 1;if (y > (self.rows - 1)) y = 0;

    this.lightSelector.selectLight(this.lightMatrix[x][y]);

}

MainLayer.prototype.doSwitchLight = function()
{
    this.switchSelectedLightState();
    this.checkGameOver();
}
MainLayer.prototype.switchSelectedLightState = function() //Thực hiện việc bật tắt đèn đang được chọn
{
    if(this.lightSelector.currentLight.canTap == false) return;
    var self = this;
    this.lightSelector.currentLight.switchState();
    var x = this.lightSelector.indexX;
    var y = this.lightSelector.indexY;
    if(x+1 <= self.cols - 1) this.lightMatrix[x+1][y].switchState();
    if(x-1 >=0) this.lightMatrix[x-1][y].switchState();
    if(y+1 <= self.rows - 1) this.lightMatrix[x][y+1].switchState();
    if(y-1 >=0) this.lightMatrix[x][y-1].switchState();

    this.currentMove++;
    this.lbMove.setString(this.currentMove);


}
MainLayer.prototype.checkGameOver = function()
{
    var self = this;
    for(var i = 0;i<self.cols;i++)
    {
        for(var j = 0;j<self.rows;j++)
        {
           if(this.lightMatrix[i][j].isLightOn && this.lightMatrix[i][j].canTap &&this.lightMatrix[i][j].canLight) return false;
        }
    }
    this.doGameOver();
}
MainLayer.prototype.showGuide = function()
{
    SharedData.gamePlayCurrentLayer = MAIN_LAYERS.LAYER_GUIDE;
    this.popupGuide.setVisible(true);
    this.popupBg.setVisible(true);
}
MainLayer.prototype.startGame  = function()
{
    SharedData.gamePlayCurrentLayer = MAIN_LAYERS.LAYER_GAME_PLAY;
    this.popupGuide.setVisible(false);
    this.popupBg.setVisible(false);

    this.resetGame();
}
MainLayer.prototype.loadSceneFromCocos = function()
{
    var mainscene = ccs.load(res.cs_main_scene);
    this.rootNode = mainscene.node;
    this.addChild(this.rootNode);

    this.layerGridBg = this.rootNode.getChildByName("grid_bg");

    this.lbMove = this.rootNode.getChildByName("lb_move");
    this.lbMove.setText("0");

    this.lbCurrentLevel = this.rootNode.getChildByName("lb_current_level");
    this.lbCurrentLevel.setText("0");

    this.lbTime = this.rootNode.getChildByName("lb_time");
    this.lbTime.setText("0");

    this.popupBg = this.rootNode.getChildByName("popup_bg");
    this.popupGameOver = this.rootNode.getChildByName("popup_win");

    this.popupGuide = this.rootNode.getChildByName("popup_huongdan");
    this.btnGuideOK = this.popupGuide.getChildByName("btn_huong_dan_ok");
    this.btnGuideOK.addTouchEventListener(this.touchEvent,this);
    this.popupBg.setZOrder(1000);
    this.popupGameOver.setZOrder(1000);
    this.popupGuide.setZOrder(1000);

    this.btnGameOverChoiLai = this.popupGameOver.getChildByName("btn_choi_lai");
    this.btnGameOverChoiLai.addTouchEventListener(this.touchEvent,this);
    this.btnGameOverHome = this.popupGameOver.getChildByName("btn_thoat");
    this.btnGameOverHome.addTouchEventListener(this.touchEvent,this);
    this.btnGameOverNext = this.popupGameOver.getChildByName("btn_tiep_tuc");
    this.btnGameOverNext.addTouchEventListener(this.touchEvent,this);

    this.btnChoiLai = this.rootNode.getChildByName("btn_choi_lai");
    this.btnChoiLai.addTouchEventListener(this.touchEvent,this);
    this.btnGoHome = this.rootNode.getChildByName("btn_thoat");
    this.btnGoHome.addTouchEventListener(this.touchEvent,this);

}

MainLayer.prototype.touchEvent = function(sender,type)
{
    var self = this;
    switch (type)
    {
        case ccui.Widget.TOUCH_ENDED:
            if(self.canClick == false) return;
            switch (SharedData.gamePlayCurrentLayer)
            {
                case MAIN_LAYERS.LAYER_GUIDE:
                {
                    if(sender == self.btnGuideOK)
                    {
                        self.startGame();
                    }
                }
                    break;
                case MAIN_LAYERS.LAYER_GAME_PLAY:
                {
                    if(sender == self.btnChoiLai)
                    {
                        self.resetGame();
                    }
                    if(sender == self.btnAboutOK)
                    {
                        self.hideAbout();
                    }
                    if(sender == self.btnGoHome)
                    {
                        self.goHomeScene();
                    }
                }
                    break;

                case MAIN_LAYERS.LAYER_WIN:
                {
                    if(sender == self.btnGameOverHome)
                    {
                        self.goHomeScene();
                    }

                    else if(sender == self.btnGameOverChoiLai)
                    {
                        self.resetGame();
                    }

                    else if(sender == self.btnGameOverNext)
                    {
                        self.nextLevel();
                    }

                }
                    break;
            }

            break;
    }
}
MainLayer.prototype.bindEvent = function()
{
    var self = this;
    cc.eventManager.add
    cc.eventManager.addListener({
        event: cc.EventListener.KEYBOARD,
        onKeyReleased:function (key, event) {
            switch (SharedData.gamePlayCurrentLayer)
            {
                case MAIN_LAYERS.LAYER_GUIDE:
                    switch (key)
                    {
                        case GC.KEY_CODE.ENTER:self.startGame(); break;
                        default :break;
                    }
                    break;
                case MAIN_LAYERS.LAYER_GAME_PLAY:
                    switch (key)
                    {
                        case GC.KEY_CODE.NUM_1:self.resetGame(); break;
                        case GC.KEY_CODE.NUM_2:self.goHomeScene();break;

                        case GC.KEY_CODE.ENTER:self.doSwitchLight();break;
                        case GC.KEY_CODE.UP:self.onClickMove(GC.MOVE_DIRECT.UP);break;
                        case GC.KEY_CODE.DOWN:self.onClickMove(GC.MOVE_DIRECT.DOWN);break;
                        case GC.KEY_CODE.LEFT:self.onClickMove(GC.MOVE_DIRECT.LEFT);break;
                        case GC.KEY_CODE.RIGHT:self.onClickMove(GC.MOVE_DIRECT.RIGHT);break;

                        //for test level
                        case GC.KEY_CODE.NUM_9: self.prevLevel();break;
                        case GC.KEY_CODE.NUM_0: self.nextLevel();break;

                        default :break;
                    }
                    break;

                case MAIN_LAYERS.LAYER_WIN:
                    switch (key)
                    {
                        case GC.KEY_CODE.NUM_1:self.nextLevel();break;
                        case GC.KEY_CODE.NUM_2:self.resetGame(); break;
                        case GC.KEY_CODE.NUM_3:self.goHomeScene();break;
                        default :break;
                    }
                    break;

            }

        }
    }, this);
}

MainLayer.prototype.onClickMove = function(moveDirect)
{
    this.moveSelector(moveDirect);
}
MainLayer.prototype.doGameOver = function()
{
    SharedData.gamePlayCurrentLayer = MAIN_LAYERS.LAYER_WIN;
    this.unschedule(this.updateTimer);
    var delay = cc.DelayTime.create(0.7);
    var func = cc.CallFunc.create(this.showGameOver,this);
    this.runAction(cc.Sequence.create(delay,func));
}



MainLayer.prototype.convertSign = function(sign)
{
    switch (sign)
    {
        case GC.cong: return "+";break;
        case GC.tru: return "-";break;
        default :return "+";break;
    }
}
MainLayer.prototype.convertCenterSign = function(sign)
{
    switch (sign)
    {
        case GC.bang:return "=";break;
        case GC.nhoHon:return "<";break;
        case GC.lonHon:return ">";break;
        default :return "=";break;
    }
}
MainLayer.prototype.resetTimeAttack = function () {

}

MainLayer.prototype.updateTimer = function ()
{
    this.currentTime ++;
    this.lbTime.setString(this.currentTime);
}

MainLayer.prototype.showGameOver = function () {
    SharedData.gamePlayCurrentLayer = MAIN_LAYERS.LAYER_WIN;
    this.popupGameOver.setVisible(true);
    this.popupBg.setVisible(true);

    if(GC.getCurrentLevel() >= GC.getLockLevel()-1)
    {
        GC.setLockLevel(GC.getCurrentLevel()+2);
    }
}
MainLayer.prototype.hideGameOver = function ()
{
    SharedData.gamePlayCurrentLayer = MAIN_LAYERS.LAYER_GAME_PLAY;
    this.popupGameOver.setVisible(false);
    this.popupBg.setVisible(false);
}
MainLayer.prototype.exitGame = function()
{

}
MainLayer.prototype.pauseGame = function()
{

}
MainLayer.prototype.showPauseGame = function()
{
    SharedData.gamePlayCurrentLayer = MAIN_LAYERS.LAYER_PAUSE;
}
MainLayer.prototype.hidePauseGame = function()
{
    SharedData.gamePlayCurrentLayer = MAIN_LAYERS.LAYER_GAME_PLAY;
    this.popupGameOver.setVisible(false);
}
MainLayer.prototype.resetGame = function()
{
    console.log("Reset game");
    SharedData.gamePlayCurrentLayer = MAIN_LAYERS.LAYER_GAME_PLAY;
    this.hideGameOver();
    this.currentMove = 0;
    this.currentTime = 0;
    this.fillDataLevel();
    this.schedule(this.updateTimer,1);
}

MainLayer.prototype.nextLevel = function()
{
    console.log("Next level");
    var currentLevel = GC.getCurrentLevel();
    currentLevel++;
    if(currentLevel>= GC.getMaxLevel()) currentLevel == GC.getMaxLevel();
    GC.setCurrentLevel(currentLevel);
    SharedData.gamePlayCurrentLayer = MAIN_LAYERS.LAYER_GAME_PLAY;
    this.hideGameOver();
    this.currentMove = 0;
    this.currentTime = 0;
    this.loadLevel();
    this.schedule(this.updateTimer,1);
}
MainLayer.prototype.prevLevel = function()
{
    var currentLevel = GC.getCurrentLevel();
    currentLevel--;
    if(currentLevel<=0) currentLevel = 0;
    GC.setCurrentLevel(currentLevel);
    SharedData.gamePlayCurrentLayer = MAIN_LAYERS.LAYER_GAME_PLAY;
    this.hideGameOver();
    this.currentMove = 0;
    this.currentTime = 0;
    this.loadLevel();

    this.schedule(this.updateTimer,1);
}

MainLayer.prototype.goHomeScene = function()
{
    this.canClick = false;
    console.log("Go home scene");
    cc.director.runScene(new LevelSelectScene());
}

MainLayer.prototype.showExitDialog = function()
{
    SharedData.homeCurrentLayer = MAIN_LAYERS.LAYER_EXIT;
    this.layerPopupBg.setVisible(true);
    this.popupExit.setVisible(true);
}

MainLayer.prototype.hideExitDialog = function()
{
    SharedData.homeCurrentLayer = MAIN_LAYERS.LAYER_HOME;
    this.layerPopupBg.setVisible(false);
    this.popupExit.setVisible(false);
}

var MainScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new MainLayer();
        this.addChild(layer);
    }
});

