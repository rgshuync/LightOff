/**
 * Created by nguyennhatanh on 10/17/15.
 */

//Home data
var SharedData = {};

SharedData.homeCurrentLayer = null;
var HOME_LAYERS = {
    LAYER_HOME : 0,
    LAYER_EXIT: 1,
    LAYER_ABOUT: 2,
}

SharedData.levelSelectCurrentLayer = null;
var LEVEL_SELECT_LAYERS = {
    LAYER_LEVEL_SELECT : 0,
}

SharedData.gamePlayCurrentLayer = null;
var MAIN_LAYERS = {
    LAYER_GAME_PLAY : 0,
    LAYER_WIN: 1,
    LAYER_LOSE: 2,
    LAYER_GUIDE:3,
}