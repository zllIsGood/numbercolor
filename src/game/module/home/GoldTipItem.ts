/*
 * @Author: zhoulanglang 
 * @Date: 2020-07-04 00:37:42 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-07-04 01:41:39
 */
class GoldTipItem extends eui.ItemRenderer {

    lab1: eui.Label
    lab2: eui.Label

    data: { xn: number, maxms: number, curtime: number, maxgold: number }
    public constructor() {
        super();
        this.skinName = 'GoldTipItemSkin'
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

        this.timer()
        TimerManager.ins().remove(this.timer, this)
        TimerManager.ins().doTimer(1000, 0, this.timer, this)
    }

    private timer() {
        let maxms = this.data.maxms
        let per = this.data.curtime / maxms
        per = per > 1 ? 1 : per
        let curgold = per * this.data.maxgold
        this.lab1.text = StringUtils.NumberToString(curgold) + '/' + StringUtils.NumberToString(this.data.maxgold)
        let left = maxms - this.data.curtime
        left = left < 0 ? 0 : left
        let tstr = left > 0 ? DateUtils.msToString(left) : 'READY!'
        this.lab2.text = tstr

        this.data.curtime += 1000
    }

    private onClick(e: egret.TouchEvent) {
        DisplayUtils.removeFromParent(this)
    }

    public close(...param: any[]): void {
        this.removeEventListener(egret.TouchEvent.REMOVED_FROM_STAGE, this.close, this);
        this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this)
        TimerManager.ins().remove(this.timer, this)
    }
}
window["GoldTipItem"] = GoldTipItem;