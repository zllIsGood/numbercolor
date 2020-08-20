/* 星星动画
 * @Author: zhoulanglang 
 * @Date: 2020-06-29 14:16:40 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-08-13 17:50:53
 */
class StarMv extends eui.Component {

    star0: eui.Image
    star1: eui.Image
    star2: eui.Image
    star3: eui.Image
    star4: eui.Image
    public constructor() {
        super();
        this.skinName = 'StarMvSkin'
        this.addEventListener(egret.TouchEvent.ADDED_TO_STAGE, this.open, this);
        this.addEventListener(egret.TouchEvent.REMOVED_FROM_STAGE, this.close, this);
    }


    public open(...param: any[]): void {
        this.removeEventListener(egret.TouchEvent.ADDED_TO_STAGE, this.open, this)
        this.upView()
    }

    public upView() {
        DisplayUtils.setScale(this.star0, 0)
        DisplayUtils.setScale(this.star1, 0)
        DisplayUtils.setScale(this.star2, 0)
        DisplayUtils.setScale(this.star3, 0)
        DisplayUtils.setScale(this.star4, 0)
        this.playTw()
    }

    async playTw() {
        this.play(0)
        await TimerManager.ins().deleyPromisse(200, this)
        this.play(1)
        await TimerManager.ins().deleyPromisse(200, this)
        this.play(2)
        await TimerManager.ins().deleyPromisse(200, this)
        this.play(3)
        await TimerManager.ins().deleyPromisse(200, this)
        this.play(4)
    }

    play(n) {
        let obj = this['star' + n]
        if (obj) {
            let tw = egret.Tween.get(obj, { loop: true })
            tw.to({ scaleX: 1, scaleY: 1 }, 300).to({ scaleX: 0, scaleY: 0 }, 300).wait(500)
        }
    }

    public close(...param: any[]): void {
        this.removeEventListener(egret.TouchEvent.REMOVED_FROM_STAGE, this.close, this);
        TimerManager.ins().removeAll(this)
        egret.Tween.removeTweens(this.star0)
        egret.Tween.removeTweens(this.star1)
        egret.Tween.removeTweens(this.star2)
        egret.Tween.removeTweens(this.star3)
        egret.Tween.removeTweens(this.star4)
    }
}