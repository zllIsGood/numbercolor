/* 拍卖结果
 * @Author: zhoulanglang 
 * @Date: 2020-08-10 16:07:27 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-08-10 17:45:01
 */
class AuctionResultWin extends BaseEuiView {

    closeGrp: eui.Group
    grp: eui.Group
    dialogLab: eui.Label
    btnC: BaseBtn
    btnL: BaseBtn
    btnR: BaseBtn
    btnL2: BaseBtn
    btnR2: BaseBtn
    srcBg: eui.Image
    srcImg: eui.Image
    failImg: eui.Image

    mc: MovieClip
    data: { result: number, img?, gold?, name?}
    canRet = false
    constructor() {
        super();
        this.skinName = `AuctionResultSkin`
    }

    public initUI(): void {
        super.initUI();
    }

    public open(...param: any[]): void {
        this.addTouchEvent(this.closeGrp, this.onClick);
        this.addTouchEvent(this.btnC, this.onClick);
        this.addTouchEvent(this.btnL, this.onClick);
        this.addTouchEvent(this.btnR, this.onClick);
        this.addTouchEvent(this.btnR2, this.onClick);
        this.addTouchEvent(this.btnL2, this.onClick);

        this.data = param[0]
        this.canRet = false
        this.upView()
        App.ins().playBannerAd(Ad.loadingBanner)
    }

    private upView() {
        let data = this.data
        this.btnC.visible = false
        this.btnL.visible = false
        this.btnR.visible = false
        this.btnL2.visible = false
        this.btnR2.visible = false
        this.srcBg.visible = false
        this.failImg.visible = false
        if (this.mc == null) {
            this.mc = new MovieClip()
            this.mc.x = 650
            this.mc.y = 100
            this.mc.scaleX = -1
            this.grp.addChild(this.mc)
        }
        this.mc.playFile(App.ins().getMCResRoot() + 'resource/mc/' + 'auction_qsh1', -1)
        if (data.result == -1) { // 直接到拍卖结果？
            this.canRet = true
            this.dialogLab.text = '直接到拍卖结果？'
            this.btnL2.visible = true
            this.btnR2.visible = true
            this.srcImg.source = ''
            return
        }
        else if (data.result == 0) { //空手
            this.dialogLab.text = '你什么都没有投到...'
            this.btnC.visible = true
            this.srcImg.source = ''
            return
        }
        //恭喜您获得唐三彩，让我们 来鉴定真假吧！
        let str = `恭喜您获得${data.name}，让我们来鉴定真假吧！`
        this.dialogLab.text = str
        this.srcImg.source = this.data.img
        this.step()
    }

    private async step() {
        await TimerManager.ins().deleyPromisse(2000)
        let data = this.data
        if (data.result == 1) { //是真品。恭喜你！
            this.dialogLab.text = '是真品。恭喜你！'
            this.srcBg.visible = true
            this.btnC.visible = true
        }
        else if (data.result == 2) { //太遗憾了，拍到了赝品！
            this.dialogLab.text = '太遗憾了，拍到了赝品！'
            this.btnL.visible = true
            this.btnR.visible = true

            this.failImg.visible = true
            let colorFlilter = new egret.ColorMatrixFilter(ColorUtil.getMatGrayAlpha())
            this.srcImg.filters = [colorFlilter]
        }
    }

    public close(...param: any[]): void {
        App.ins().destoryBanner()
        this.data = null
    }


    private onClick(e: egret.TouchEvent): void {
        switch (e.currentTarget) {
            case this.closeGrp:
                ViewManager.ins().close(this)
                if (!this.canRet) {
                    ViewManager.ins().close(AuctionWin)
                }
                break;
            case this.btnC:
                ViewManager.ins().close(this)
                ViewManager.ins().close(AuctionWin)
                break;
            case this.btnL: //修复
                App.ins().watchAdCall(AwardType.TIP_VIDEO, (() => {
                    UserModel.ins().addGold(this.data.gold)
                    ViewManager.ins().close(this)
                    ViewManager.ins().close(AuctionWin)
                }).bind(this))
                break;
            case this.btnR: //不修复
                ViewManager.ins().close(this)
                ViewManager.ins().close(AuctionWin)
                break;
            case this.btnL2:
                ViewManager.ins().close(this)
                break;
            case this.btnR2:
                this.dialogLab.text = '你什么都没有投到...'
                this.btnC.visible = true
                this.srcImg.source = ''
                this.btnL2.visible = false
                this.btnR2.visible = false
                this.canRet = false
                break;
        }
    }

}
ViewManager.ins().reg(AuctionResultWin, LayerManager.UI_Popup);