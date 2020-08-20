/*
 * @Author: zhoulanglang 
 * @Date: 2020-08-08 15:43:01 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-08-13 12:27:42
 */
class AuctionWin extends BaseEuiView {

    btn_stop: eui.Image
    img_gou: eui.Image
    topLab: eui.Label
    goldLab: eui.Label
    priceBtn: BaseBtn

    timeLab: eui.Label
    startBtn: BaseBtn
    srcImg: eui.Image
    sGrp: eui.Group
    goldGrp: eui.Group

    layGrp1: eui.Group
    layGrp2: eui.Group
    layGrp: eui.Group
    showImg: eui.Image
    mc: MovieClip
    mcs: MovieClip[] = []
    memc: MovieClip

    dialogGrp: eui.Group
    dialogLab: eui.Label

    LRGrp: eui.Group
    LImg: eui.Image
    RImg: eui.Image
    canMove = false
    isMove = false
    /**拍卖行类型*/
    private auc_type: number
    data = {
        id: 14, name: '孙悟空', imgs: ['shilitu_true_png', 'shilitu_false1_png', 'shilitu_false2_png', 'shilitu_false3_png'],
        basePrice: 80800, targetPrice: 280800, maxPrice: 380800, probability: 0.85
    }
    lefttime = 0
    cur = 0
    ids: number[]// = [0, 1, 2, 3]
    dialogTime = 2000
    guests: { name: string, mc: string }[]
    mcIsThree = false
    constructor() {
        super();
        this.skinName = `AuctionSkin`;
    }

    public initUI(): void {
        super.initUI();
    }

    public open(...param: any[]): void {
        this.addTouchEvent(this.btn_stop, this.onClick);
        this.addTouchEvent(this.priceBtn, this.onClick);
        this.addTouchEvent(this.startBtn, this.onClick);
        this.addTouchEvent(this.LImg, this.onClick);
        this.addTouchEvent(this.RImg, this.onClick);

        this.auc_type = param[0]
        this.init()
        this.upView()
    }

    private init() {
        this.guests = AuctionModel.guests
        this.data = AuctionModel.getDetailByType(this.auc_type)
        let len = this.data.imgs.length
        this.ids = []
        for (let i = 0; i < len; i++) {
            this.ids.push(i)
        }
    }

    private upView() {
        this.goldLab.text = StringUtils.NumberToString(UserModel.ins().gold)
        this.sGrp.visible = false
        this.goldGrp.visible = false
        this.dialogGrp.visible = false
        this.LRGrp.visible = false

        if (this.mc == null) {
            this.mc = new MovieClip()
            this.mc.x = -20
            this.mc.y = 260
            this.layGrp.addChildAt(this.mc, 0)
        }
        this.mc.playFile(App.ins().getMCResRoot() + 'resource/mc/' + 'auction_qsh2', -1)
        for (let i = 0; i < this.guests.length; i++) {
            let mc = new MovieClip()
            if (i < 5) {
                mc.x = 18 + i * 147
                mc.y = -120
                this.layGrp1.addChild(mc)
            }
            else if (i < 7) {
                mc.x = 18 + (i - 5) * 147
                mc.y = -120 + 10
                this.layGrp2.addChild(mc)
            }
            else {
                mc.x = 18 + (i - 5 + 1) * 147
                mc.y = -120 + 10
                this.layGrp2.addChild(mc)
            }
            mc.playFile(App.ins().getMCResRoot() + 'resource/mc/' + this.guests[i].mc, 1, null, false, true)
            this.mcs.push(mc)
        }
        if (this.memc == null) {
            this.memc = new MovieClip()
            this.memc.x = 18 + 2 * 147 - 19
            this.memc.y = -120 + 10
            this.layGrp2.addChildAt(this.memc, 0)
        }
        this.memc.playFile(App.ins().getMCResRoot() + 'resource/mc/' + 'auction_mainrole', 1, null, false, true)

        this.step1()
    }

    private async  step1() {
        let len = this.ids.length
        if (len > 1) {
            for (let i = len - 1; i > 0; i--) {
                let n = Math.floor(Math.random() * len)
                let temp = this.ids[i]
                this.ids[i] = this.ids[n]
                this.ids[n] = temp
            }
        }
        this.cur = 0
        this.showImg.source = this.data.imgs[this.ids[this.cur]]
        this.topLab.text = ''

        this.showDialog(0)
        await TimerManager.ins().deleyPromisse(this.dialogTime, this)
        this.showDialog(1)
        await TimerManager.ins().deleyPromisse(this.dialogTime, this)

        this.showDialog(2)
        TimerManager.ins().doTimer(this.dialogTime, 1, (() => {
            this.hideDialog()
        }).bind(this), this)
        this.step2()
    }

    private showDialog(n: number) {
        this.dialogGrp.visible = true
        if (n == -1) {
            let str: string
            if (this.buyData.lay == 0) {
                str = AuctionModel.talks[11]
                let price = StringUtils.NumberToString(this.buyData.curP)
                let name = '玩家'
                if (!this.buyData.isMe) {
                    name = this.guests[this.buyData.other].name
                }
                str = StringUtils.replace(str, name, price)

                this.topLab.text = price
            }
            else if (this.buyData.lay == 4) {
                str = AuctionModel.talks[7]
                let name = '玩家'
                if (!this.buyData.isMe) {
                    name = this.guests[this.buyData.other].name
                }
                else {
                    this.img_gou.source = 'auction_green_png'
                }
                str = StringUtils.replace(str, name)
            }
            else {
                str = AuctionModel.talks[this.buyData.lay + 7]
                let name = '玩家'
                if (!this.buyData.isMe) {
                    name = this.guests[this.buyData.other].name
                }
                str = StringUtils.replace(str, name)
            }
            this.dialogLab.text = str
            return
        }
        let str = AuctionModel.talks[n]
        if (n == 0) {
            str = StringUtils.replace(str, this.data.name)
        }
        else if (n == 1) {
            let price = StringUtils.NumberToString(this.data.targetPrice)
            str = StringUtils.replace(str, price)
        }
        this.dialogLab.text = str
    }
    private hideDialog() {
        this.dialogGrp.visible = false
    }

    private step2() {
        this.sGrp.visible = true
        this.goldGrp.visible = false
        this.srcImg.source = this.data.imgs[0]
        this.lefttime = 60
        this.timeLab.text = DateUtils.getFormatBySecond(this.lefttime, 0)
        TimerManager.ins().doTimer(1000, 0, this.timer, this)

        this.showLRGrp()
        this.canMove = true
        this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onMove, this)
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this)
        this.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onClick, this)
    }

    private showLRGrp() {
        this.LRGrp.visible = true
        this.topLab.text = (this.cur + 1) + '/' + this.ids.length
        let time = 800
        egret.Tween.removeTweens(this.LImg)
        egret.Tween.removeTweens(this.RImg)
        if (this.cur != 0) {
            this.LImg.x = 50
            this.LImg.visible = true
            let tw = egret.Tween.get(this.LImg, { loop: true })
            tw.to({ x: 60 }, time).to({ x: 50 }, time)
        }
        else {
            this.LImg.visible = false
        }
        if (this.cur != this.ids.length - 1) {
            this.RImg.x = 700
            this.RImg.visible = true
            let tw2 = egret.Tween.get(this.RImg, { loop: true })
            tw2.to({ x: 690 }, time).to({ x: 700 }, time)
        }
        else {
            this.RImg.visible = false
        }
        this.showImg.source = this.data.imgs[this.ids[this.cur]]
    }
    private hideLRGrp() {
        this.LRGrp.visible = false
        egret.Tween.removeTweens(this.LImg)
        egret.Tween.removeTweens(this.RImg)
        this.canMove = false
        this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this)
        this.removeEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onClick, this)
        this.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onMove, this)
    }

    private timer() {
        this.lefttime -= 1
        if (this.lefttime < 0) {
            TimerManager.ins().remove(this.timer, this)
            this.step3()
        }
        else {
            this.timeLab.text = DateUtils.getFormatBySecond(this.lefttime, 0)
        }
    }

    private async step3() {
        this.sGrp.visible = false
        this.goldGrp.visible = true
        this.hideLRGrp()
        this.topLab.text = StringUtils.NumberToString(this.data.basePrice)
        this.priceBtn.icon = 'btn_jc_hui_png'
        this.priceBtn.touchEnabled = false

        this.showDialog(3)
        await this.showPreTalk()
        this.showDialog(4)
        await TimerManager.ins().deleyPromisse(this.dialogTime, this)
        this.hideDialog()
        this.priceBtn.icon = 'btn_jc_liang_png'
        this.priceBtn.touchEnabled = true

        this.startBuy()
    }
    /**拍卖前说话*/
    async  showPreTalk() {
        let len = this.talkId.length
        for (let i = len - 1; i > 0; i--) {
            let n = Math.floor(Math.random() * len)
            let temp = this.talkId[i]
            this.talkId[i] = this.talkId[n]
            this.talkId[n] = temp
        }
        this.playPreTalk(0)
        await TimerManager.ins().deleyPromisse(500, this)
        this.playPreTalk(1)
        await TimerManager.ins().deleyPromisse(500, this)
        this.playPreTalk(2)
        await TimerManager.ins().deleyPromisse(1500, this)
    }
    playPreTalk(n) {
        let obj = this.mcs[n]
        if (obj) {
            let item = new AuctionTalkItem()
            item.x = obj.x + 60
            item.y = obj.y + 15
            item.upView(this.talkId[n])
            this.layGrp1.addChild(item)
        }
    }
    talkId = [0, 1, 2]

    /**开始拍卖*/
    startBuy() {
        this.buyData = { curP: this.data.basePrice, isMe: false, other: -1, lay: 0 }
        TimerManager.ins().doTimer(1500, 0, this.otherBuy, this)
    }

    buyData: { curP: number, isMe: boolean, other: number, lay: number } = null
    nextBuy(): boolean {
        if (this.buyData.lay == 4) {
            return true
        }
        this.buyData.lay++
        this.showDialog(-1)
        if (this.buyData.lay == 3) {
            this.mcIsThree = true
            this.mc.playFile(App.ins().getMCResRoot() + 'resource/mc/' + 'auction_qsh3', 1, (() => {
                this.mcIsThree = false
                this.mc.playFile(App.ins().getMCResRoot() + 'resource/mc/' + 'auction_qsh2', -1, null, false)
            }).bind(this), false)
        }
        return false
    }
    checkMc() {
        if (this.mcIsThree) {
            this.mcIsThree = false
            this.mc.playFile(App.ins().getMCResRoot() + 'resource/mc/' + 'auction_qsh2', -1, null, false)
        }
    }
    async  finish() {
        this.priceBtn.icon = 'btn_jc_hui_png'
        this.priceBtn.touchEnabled = false
        await TimerManager.ins().deleyPromisse(this.dialogTime, this)
        this.showDialog(5)
        await TimerManager.ins().deleyPromisse(this.dialogTime, this)
        let gold = this.buyData.curP
        if (this.buyData.isMe) {
            UserModel.ins().costGold(gold)
            let result = this.ids[this.cur] == 0 ? 1 : 2
            ViewManager.ins().open(AuctionResultWin, { result: result, img: this.data.imgs[this.ids[this.cur]], gold: gold, name: this.data.name })
            if (result == 1) {
                //成功拍得
                AuctionModel.ins().addAuction(this.auc_type, this.data.id)
            }
        }
        else {
            ViewManager.ins().open(AuctionResultWin, { result: 0, img: this.data.imgs[this.ids[this.cur]], gold: gold, name: this.data.name })
        }
    }
    public otherBuy() {
        if (this.buyData.curP >= this.data.maxPrice) {
            let nonext = this.nextBuy()
            if (nonext) {
                TimerManager.ins().remove(this.otherBuy, this)
                this.finish()
            }
            return
        }
        if (this.buyData.curP >= this.data.targetPrice) {
            let bool = Math.random() <= this.data.probability || this.buyData.lay == 4
            if (bool) {
                let nonext = this.nextBuy()
                if (nonext) {
                    TimerManager.ins().remove(this.otherBuy, this)
                    this.finish()
                }
                return
            }
        }

        this.checkMc()
        this.priceBtn.icon = 'btn_jc_liang_png'
        this.priceBtn.touchEnabled = true

        this.buyData.curP += this.data.basePrice
        this.buyData.isMe = false
        this.buyData.lay = 0
        if (this.buyData.other == -1) {
            let select = MathUtils.limitInteger(0, this.guests.length - 1)
            this.buyData.other = select
        }
        else {
            let select = MathUtils.limitInteger(0, this.guests.length - 2)
            this.buyData.other = select >= this.buyData.other ? (select + 1) : select
        }
        this.showDialog(-1)

        let mc = this.mcs[this.buyData.other]
        mc.playFile(App.ins().getMCResRoot() + 'resource/mc/' + this.guests[this.buyData.other].mc, 1, null, false)
    }

    public meBuy() {
        let newGold = this.buyData.curP + this.data.basePrice
        if (UserModel.ins().gold < newGold) {
            wx.showToast({ icon: 'none', title: `金币不足` })
            return
        }

        this.checkMc()
        this.priceBtn.icon = 'btn_jc_hui_png'
        this.priceBtn.touchEnabled = false

        this.buyData.curP += this.data.basePrice
        this.buyData.isMe = true
        this.buyData.other = -1
        this.buyData.lay = 0
        this.showDialog(-1)
        TimerManager.ins().remove(this.otherBuy, this)
        TimerManager.ins().doTimer(1500, 0, this.otherBuy, this)

        this.memc.playFile(App.ins().getMCResRoot() + 'resource/mc/' + 'auction_mainrole', 1, null, false)
    }

    public close(...param: any[]): void {
        TimerManager.ins().removeAll(this)
        this.hideLRGrp()
    }


    private onClick(e: egret.TouchEvent): void {
        if (this.canMove && this.isMove) {
            this.isMove = false
            this.hasMove = false
            this.moveX = null
            return
        }
        switch (e.currentTarget) {
            case this.btn_stop:
                ViewManager.ins().open(AuctionResultWin, { result: -1, img: this.data.imgs[this.ids[this.cur]] })
                // ViewManager.ins().close(this)
                break;
            case this.priceBtn:
                this.meBuy()
                break;
            case this.startBtn:
                TimerManager.ins().remove(this.timer, this)
                this.step3()
                break;
            case this.LImg:
                if (this.cur != 0) {
                    this.cur--
                    this.showLRGrp()
                }
                break;
            case this.RImg:
                if (this.cur != this.ids.length - 1) {
                    this.cur++
                    this.showLRGrp()
                }
                break;
        }
    }

    private onMove(e: egret.TouchEvent) {
        this.isMove = true
        if (this.moveX == null) {
            this.moveX = e.stageX
        }
        else {
            let dx = e.stageX - this.moveX
            if (!this.hasMove) {
                if (dx > 80) { //l
                    if (this.cur != 0) {
                        this.cur--
                        this.showLRGrp()
                        this.hasMove = true
                    }
                }
                else if (dx < -80) { //r
                    if (this.cur != this.ids.length - 1) {
                        this.cur++
                        this.showLRGrp()
                        this.hasMove = true
                    }
                }
            }
        }
    }
    private hasMove = false
    private moveX = null

}
ViewManager.ins().reg(AuctionWin, LayerManager.UI_Main);