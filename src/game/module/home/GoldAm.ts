/* 金币动画
 * @Author: zhoulanglang 
 * @Date: 2020-06-29 14:16:40 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-07-07 00:30:19
 */
class GoldAm extends eui.Component {

    img: eui.Image
    lab: eui.Label
    data: { num: number, x, y, callFun?: Function }
    public constructor() {
        super();
        this.skinName = 'GoldAmSkin'
        this.addEventListener(egret.TouchEvent.ADDED_TO_STAGE, this.open, this);
        this.addEventListener(egret.TouchEvent.REMOVED_FROM_STAGE, this.close, this);
    }


    public open(...param: any[]): void {
        this.removeEventListener(egret.TouchEvent.ADDED_TO_STAGE, this.open, this)
    }

    public upView(data: { num: number, x, y, callFun?: Function }) {
        this.data = data
        this.clear()
        let tw = egret.Tween.get(this.img)
        tw.to({ scaleX: 1, scaleY: 1, alpha: 1, }, 100).wait(100)
            .to({ alpha: 0, }, 100).call(this.up2.bind(this))
    }

    private async  up2() {
        this.img.scaleX = 1
        this.img.scaleY = 1
        this.img.alpha = 1
        this.img.source = 'home_gold_png'
        this.lab.text = '+' + this.data.num

        await TimerManager.ins().deleyPromisse(300)
        this.lab.text = ''
        let tw = egret.Tween.get(this)
        let t = MathUtils.getDistance(this.x, this.y, this.data.x, this.data.y) * 1
        tw.to({ x: this.data.x, y: this.data.y }, t).call(this.finish.bind(this))
    }

    private finish() {
        UserModel.ins().addGold(this.data.num)
        let callFun = this.data.callFun
        DisplayUtils.removeFromParent(this)
        callFun && callFun()
        let home = ViewManager.ins().getView(HomeWin) as HomeWin
        if (home) {
            home.subGoldAmCount()
        }
    }

    private clear() {
        this.img.scaleX = 0.5
        this.img.scaleY = 0.5
        this.img.alpha = 0
        this.img.source = 'gold_star_png'
        this.lab.text = ''
    }

    public close(...param: any[]): void {
        this.removeEventListener(egret.TouchEvent.REMOVED_FROM_STAGE, this.close, this);
        this.clear()
        this.data = null
    }
}
window["GoldAm"] = GoldAm;