var res = {

    cs_home_scene:"res/SceneHome.json",
    cs_main_scene:"res/SceneMain.json",
    cs_level_scene:"res/SceneLevelSelect.json",
    cs_level_node:"res/NodeLevel.json",

    font:"res/Fonts/UVNGIOMAY_R.TTF",

    popup_bg:"res/Rescommon/popup_bg.png",

    popup_outgame:"res/ResHome/popup_outgame_blue.png",
    popup_about:"res/ResHome/about_blue.png",
    menu_bg:"res/ResHome/menu.png",

    popup_win:"res/ResMain/popup_win.png",
    light_off:"res/ResMain/light_off.png",
    light_on:"res/ResMain/light_on.png",
    light_select:"res/ResMain/light_select.png",
    main_bg:"res/ResMain/main.png",
    popup_huong_dan:"res/ResMain/popup_huongdan.png",

    btn_level_lock:"res/ResLevelSelect/btn_level_lock.png",
    btn_level_normal:"res/ResLevelSelect/btn_level_normal.png",
    btn_level_select:"res/ResLevelSelect/btn_level_select.png",
    level_select_bg:"res/ResLevelSelect/levelselect.jpg",

    icon:"res/icon.png"

};
var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}
