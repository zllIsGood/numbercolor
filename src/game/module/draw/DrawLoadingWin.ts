/*
 * @Author: zhoulanglang 
 * @Date: 2020-07-10 17:12:27 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-07-10 17:14:43
 */
class DrawLoadingWin extends BaseEuiView {

    cimg1: eui.Image
    cimg2: eui.Image
    cimg3: eui.Image
    cimgN = 1

    public constructor() {
        super();
        this.skinName = "DrawLoadingSkin";
    }

    public open(...param: any[]): void {

        this.playTw()
    }

    private playTw() {
        this.cimgN = 1
        let tw = egret.Tween.get(this, { loop: true, onChange: this.twOnChange, onChangeObj: this })
        tw.to({ cimgN: 0 }, 3000).call(() => {
            this.cimgN = 1
        }, this)
    }

    private twOnChange() {
        this.cimg1.x = this.cimgN * 750 - 750 - 100
        this.cimg2.x = this.cimgN * 750 - 750 + 375
        this.cimg3.x = this.cimgN * 750 + 100
    }

    public close(...param: any[]): void {
        egret.Tween.removeTweens(this)
    }


}
ViewManager.ins().reg(DrawLoadingWin, LayerManager.UI_LOADING);
window["DrawLoadingWin"] = DrawLoadingWin;