/*
 * @Author: zhoulanglang 
 * @Date: 2020-08-10 15:12:44 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-08-13 12:22:42
 */
class AuctionEntranceItem extends eui.ItemRenderer {
    btn: BaseBtn
    img: eui.Image
    img2: eui.Image
    lab0: eui.Label
    lab1: eui.Label
    lab2: eui.Label
    lab3: eui.Label

    data: { type: number, name: string, gold: number, img: string }
    curtime = 0
    curData: { cur, all }
    public constructor() {
        super();
        this.skinName = 'AuctionEntranceItemSkin'
        this.addEventListener(egret.TouchEvent.ADDED_TO_STAGE, this.open, this);
        this.addEventListener(egret.TouchEvent.REMOVED_FROM_STAGE, this.close, this);
    }


    public open(...param: any[]): void {
        this.removeEventListener(egret.TouchEvent.ADDED_TO_STAGE, this.open, this)
        this.btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this)
    }

    protected dataChanged() {
        let data = this.data
        this.img.source = data.img
        this.lab0.text = data.name
        this.lab2.text = StringUtils.NumberToString(data.gold)

        this.curData = AuctionModel.ins().getCurByType(data.type)
        this.lab1.text = this.curData.cur + '/' + this.curData.all
        if (this.curData.cur >= this.curData.all) {
            this.lab3.text = ''
            this.img2.visible = false
            this.btn.visible = false
            TimerManager.ins().remove(this.timer, this)
            return
        }

        this.btn.visible = true
        this.curtime = AuctionModel.ins().getTimeByType(data.type)
        if (this.curtime > 0) {
            this.img2.visible = true
            this.lab3.text = DateUtils.getFormatBySecond(this.curtime, 0)
            TimerManager.ins().doTimer(1000, 0, this.timer, this)
            this.btn.icon = 'auction_ad_subtime_png'
        }
        else {
            this.lab3.text = ''
            this.img2.visible = false
            this.btn.icon = 'auction_enter_png'
        }
    }

    private timer() {
        this.curtime--
        if (this.curtime < 0) {
            this.curtime = 0
            TimerManager.ins().remove(this.timer, this)

            this.lab3.text = ''
            this.img2.visible = false
            this.btn.icon = 'auction_enter_png'
        }
        else {
            this.lab3.text = DateUtils.getFormatBySecond(this.curtime, 0)
        }
    }

    private onClick() {
        if (this.curtime > 0) {
            App.ins().watchAdCall(AwardType.TIP_VIDEO, (() => {
                AuctionModel.ins().resetTime(this.data.type)
                ViewManager.ins().close(AuctionEntranceWin)
                ViewManager.ins().open(AuctionWin, this.data.type)
            }).bind(this))
        }
        else {
            AuctionModel.ins().resetTime(this.data.type)
            ViewManager.ins().close(AuctionEntranceWin)
            ViewManager.ins().open(AuctionWin, this.data.type)
        }
    }

    public close(...param: any[]): void {
        this.removeEventListener(egret.TouchEvent.REMOVED_FROM_STAGE, this.close, this);
        this.btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this)
        TimerManager.ins().remove(this.timer, this)
    }
}