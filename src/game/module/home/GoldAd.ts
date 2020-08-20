/*
 * @Author: zhoulanglang 
 * @Date: 2020-07-03 19:50:42 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-08-13 16:56:22
 */
class GoldAd extends eui.ItemRenderer {

    grp: eui.Group
    ximg: eui.Image

    data: { xn: number, callFun }
    public constructor() {
        super();
        this.skinName = 'GoldAdSkin'
        this.addEventListener(egret.TouchEvent.ADDED_TO_STAGE, this.open, this);
        this.addEventListener(egret.TouchEvent.REMOVED_FROM_STAGE, this.close, this);
    }


    public open(...param: any[]): void {
        this.removeEventListener(egret.TouchEvent.ADDED_TO_STAGE, this.open, this)
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this)
    }

    public upView() {
        this.dataChanged()
    }

    protected dataChanged() {
        if (this.data == null) {
            return
        }
        let xn = this.data.xn
        let src = 'bs_x_2x_png'
        xn == 1 && (src = '')
        xn == 2 && (src = 'bs_x_2x_png')
        xn == 4 && (src = 'bs_x_4x_png')
        xn == 6 && (src = 'bs_x_6x_png')
        xn == 8 && (src = 'bs_x_8x_png')
        this.ximg.source = src
        egret.Tween.removeTweens(this.grp)
        DisplayUtils.setScale(this.grp, 1)
        let tw = egret.Tween.get(this.grp, { loop: true })
        tw.to({ scaleX: 0.9, scaleY: 0.9 }, 500).to({ scaleX: 1, scaleY: 1 }, 500)

    }


    private onClick(e: egret.TouchEvent) {
        if (this.data && this.data.callFun) {
            this.data.callFun()
        }
    }

    public close(...param: any[]): void {
        this.removeEventListener(egret.TouchEvent.REMOVED_FROM_STAGE, this.close, this);
        this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this)
        egret.Tween.removeTweens(this.grp)
        this.data = null
    }
}
window["GoldAd"] = GoldAd;