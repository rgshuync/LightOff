/**
 * Created by nguyennhatanh on 1/23/16.
 */
var SpriteLightSelect = cc.Sprite.extend({
    indexX:0,//Toạ độ ô ngang
    indexY:0,//Toạ độ ô dọc
    currentLight:null,//Ô được chọn hiện tại

    ctor: function () {
        this._super(res.light_select);

    }
});

SpriteLightSelect.prototype.selectLight = function(sprLight)
{
    this.indexX = sprLight.indexX;
    this.indexY = sprLight.indexY;
    this.currentLight = sprLight;
    this.setPosition(sprLight.getPosition());
}