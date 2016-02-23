/**
 * Created by huangyi03 on 2014/10/9.
 */

var GC = GC || {};

GC.setEnableEffect = function(enable)
{
    Locstor.set("effect",enable);
}

GC.getEnableEffect = function()
{
    return Locstor.get("effect",true);
}

GC.switchEnableEffect = function()
{
    if(GC.getEnableEffect())
    {
        GC.setEnableEffect(false);
    }
    else{
        GC.setEnableEffect(true);
    }
}

GC.maxRows = 7;
GC.maxCols = 7;

GC.winSize = cc.size(1600, 900);

GC.tileSize = 180;

GC.h = GC.winSize.height;

GC.w = GC.winSize.width;

GC.w_2 = GC.w / 2;

GC.h_2 = GC.h / 2;

GC.gap = 20;

GC.padding = 20;

GC.size = 4;

GC.startTiles = 2;

GC.winValue = 2048;

GC.GAME_STATE = {
    PLAY: 1,
    OVER: 2
};
GC.MOVE_DIRECT = {
    UP: 1,
    DOWN: 2,
    LEFT: 3,
    RIGHT: 4
};
GC.KEY_MAP = {
    38: 0, // Up
    39: 1, // Right
    40: 2, // Down
    37: 3, // Left
    87: 0, // W
    68: 1, // D
    83: 2, // S
    65: 3  // A
};
GC.KEY_CODE = {
    LEFT:37,
    RIGHT:39,
    UP:38,
    DOWN:40,
    ENTER:13,
    BACK:461,
    PREV:412,
    PAUSE_REPLAY : 415,
    NEXT:417,
    NUM_1:49,
    NUM_2:50,
    NUM_3:51,
    NUM_4:52,
    NUM_5:53,
    NUM_6:54,
    NUM_7:55,
    NUM_8:56,
    NUM_9:57,
    NUM_0:48,
    COLOR_RED:403,
    COLOR_YELLOW:405,
    COLOR_GREEN:404,
    COLOR_BLUE:406,
    ESC:27
}
//Color
GC.MAIN_BG_COLOR = cc.color(250,248,239);
GC.getBestScore = function()
{
    return Locstor.get("best",0);
}
GC.setBestScore = function(best)
{
    Locstor.set("best",best);
}

GC.getCurrentLevel  = function()
{
    return Locstor.get("level",0);
}
GC.setCurrentLevel = function(level)
{
    if(level >= Locstor.get("lock_level",1))
    {
        Locstor.set("lock_level", level + 1);
    }
    Locstor.set("level",level);
}
GC.getMaxLevel  = function()
{
    return Locstor.get("max_level",0);
}
GC.setMaxLevel = function(max_level)
{
    Locstor.set("max_level",max_level);
}
GC.getLockLevel  = function()
{
    //Test
    //return Locstor.get("max_level",0);
    return Locstor.get("lock_level",1);

}
GC.setLockLevel = function(lock_level) {
    Locstor.set("lock_level", lock_level);
}