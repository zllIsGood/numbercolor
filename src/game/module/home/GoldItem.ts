/*
 * @Author: zhoulanglang 
 * @Date: 2020-06-30 16:48:40 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-07-02 19:36:27
 */
class GoldItem extends eui.ItemRenderer {

    grp: eui.Group
    pimg: eui.Image
    ximg: eui.Image

    data: { xn: number, maxms: number, curtime: number, callFun?: Function }
    public constructor() {
        super();
        this.skinName = 'GoldItemSkin'
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
        let src = 'home_2x_png'
        xn == 1 && (src = '')
        xn == 2 && (src = 'home_2x_png')
        xn == 4 && (src = 'home_4x_png')
        xn == 6 && (src = 'home_6x_png')
        xn == 8 && (src = 'home_8x_png')
        this.ximg.source = src
        egret.Tween.removeTweens(this.grp)
        DisplayUtils.setScale(this.grp, 1)
        let tw = egret.Tween.get(this.grp, { loop: true })
        tw.to({ scaleX: 0.9, scaleY: 0.9 }, 400).to({ scaleX: 1, scaleY: 1 }, 400)

        this.pimg.mask = new egret.Rectangle(0, 90, 93, 90)
        this.timer()
        TimerManager.ins().remove(this.timer, this)
        TimerManager.ins().doTimer(1000, 0, this.timer, this)
    }

    private timer() {
        let maxms = this.data.maxms
        let value = this.data.curtime / maxms
        value = value > 1 ? 1 : value
        if (this.pimg.mask) {
            // this.pimg.mask.y = 90 - value * 90 //在原生项目里，修改 mask 的值后（如 x,y,width,height），一定要对 displayObject 重新赋值 mask，不然会出问题
            this.pimg.mask = new egret.Rectangle(0, 90 - value * 90, 93, 90)
        }

        this.data.curtime += 1000
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
        TimerManager.ins().remove(this.timer, this)
        this.data = null
    }
}
window["GoldItem"] = GoldItem;