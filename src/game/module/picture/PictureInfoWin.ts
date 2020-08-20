/*
 * @Author: zhoulanglang 
 * @Date: 2020-06-29 19:39:25 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-07-17 16:59:56
 */
class PictureInfoWin extends BaseEuiView {

    closeGrp: eui.Group
    colorBtn: BaseBtn
    img: eui.Image
    lab: eui.Label
    lab0: eui.Label
    lab1: eui.Label
    lab2: eui.Label
    lab3: eui.Label
    mainGrp: eui.Group
    guideItem: GuideItem
    imgAd: eui.Image

    curId: number
    constructor() {
        super();
        this.skinName = `PictureInfoSkin`;
    }

    public initUI(): void {
        super.initUI();
    }

    public open(...param: any[]): void {
        this.addTouchEvent(this.closeGrp, this.onClick);
        this.addTouchEvent(this.colorBtn, this.onClick);

        this.curId = param[0]
        this.upView()
        App.ins().playBannerAd(Ad.loadingBanner)
        let state = AuctionModel.ins().getStateById(this.curId)
        this.imgAd.visible = Main.gamePlatform == Main.platformTT && App.ins().isOpenAd() && GuideUtil.hasArt() &&
            state != 0
        this.colorBtn.icon = state != 0 ? 'btn_color_png' : 'ui_go_auction_png'
    }

    private upView() {
        let curname = GlobalConfig.getBaseName(this.curId)
        if (!curname) {
            return
        }
        let cfg = GlobalConfig.paintConfig.base[curname]
        this.img.source = cfg.infoImg
        this.lab.text = cfg.name

        let cfg2 = GlobalConfig.getDraw()
        let typename
        for (let item of cfg2) {
            item.pic.indexOf(this.curId) >= 0 && (typename = item.name)
        }
        this.lab2.text = typename

        let cfg4 = GlobalConfig.config.art[this.curId - 1]
        this.lab3.text = cfg4.info

        let lv = DrawModel.ins().getDrawLv(curname)
        let cfg3 = GlobalConfig.config.drawCfg[lv - 1]
        this.lab1.text = StringUtils.NumberToString(cfg3.profit[cfg4.type - 1])
        this.lab0.text = cfg4.timeMin + 'm'

        let guideNeed = this.curId == 13 && !GuideUtil.hasArt()
        if (guideNeed) {
            if (this.guideItem == null) {
                this.guideItem = new GuideItem()
                this.guideItem.x = 120
                this.guideItem.y = 680
                this.mainGrp.addChild(this.guideItem)
            }
            this.guideItem.upView(2)
        }
        else {
            DisplayUtils.removeFromParent(this.guideItem)
            this.guideItem = null
        }
    }

    public close(...param: any[]): void {
        App.ins().destoryBanner()

    }


    private onClick(e: egret.TouchEvent): void {
        switch (e.currentTarget) {
            case this.closeGrp:
                ViewManager.ins().close(this)
                break;
            case this.colorBtn:
                let state = AuctionModel.ins().getStateById(this.curId)
                if (state == 0) {
                    ViewManager.ins().close(this)
                    ViewManager.ins().close(DrawWin)
                    ViewManager.ins().open(AuctionEntranceWin)
                    return
                }
                let name = GlobalConfig.getBaseName(this.curId)
                if (name) {
                    if (!App.ins().isOpenAd() || !GuideUtil.hasArt()) {
                        ViewManager.ins().close(this)
                        ViewManager.ins().close(DrawWin)
                        ViewManager.ins().open(DrawColorWin, name)
                        return
                    }
                    App.ins().watchAdCall(AwardType.TIP_VIDEO, (() => {
                        ViewManager.ins().close(this)
                        ViewManager.ins().close(DrawWin)
                        ViewManager.ins().open(DrawColorWin, name)
                    }).bind(this))
                }
                break;
        }
    }

}
ViewManager.ins().reg(PictureInfoWin, LayerManager.UI_Popup);
window["PictureInfoWin"] = PictureInfoWin;