/*
 * @Author: zhoulanglang 
 * @Date: 2020-06-29 19:40:49 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-07-17 17:00:19
 */
class HeroInfoWin extends BaseEuiView {

    closeGrp: eui.Group
    colorBtn: BaseBtn
    img: eui.Image
    lab: eui.Label
    lab2: eui.Label
    lab1: eui.Label
    lab0: eui.Label
    lab3: eui.Label
    lockBtn: BaseBtn
    lockGrp: eui.Group
    imgAd: eui.Image

    curId: number
    guideItem: GuideItem
    mainGrp: eui.Group
    constructor() {
        super();
        this.skinName = `HeroInfoSkin`;
    }

    public initUI(): void {
        super.initUI();
    }

    public open(...param: any[]): void {
        this.addTouchEvent(this.closeGrp, this.onClick);
        this.addTouchEvent(this.colorBtn, this.onClick);
        this.addTouchEvent(this.lockBtn, this.onClick);
        this.observe(DrawModel.ins().postData, this.upView)

        this.curId = param[0]
        this.upView()
        App.ins().playBannerAd(Ad.loadingBanner)
    }

    private upView() {
        let curname = GlobalConfig.getBaseName(this.curId)
        if (!curname) {
            return
        }
        let cfg = GlobalConfig.paintConfig.base[curname]
        this.img.source = cfg.infoImg
        this.lab.text = cfg.name

        this.lab2.text = '增加容量' + cfg.add * 100 + '%'
        this.lab0.text = cfg.info

        let drawData = DrawModel.ins().getDrawData()[curname]
        if (drawData.lock) {
            this.lockGrp.visible = true
            this.colorBtn.visible = false

            let coststr = StringUtils.NumberToString(cfg.cost)
            this.lab3.textFlow = new egret.HtmlTextParser().parser(coststr)
        }
        else {
            this.lockGrp.visible = false
            this.colorBtn.visible = true
        }

        let guideNeed = this.curId == 111 && !GuideUtil.hasHero()
        if (guideNeed) {
            if (this.guideItem == null) {
                this.guideItem = new GuideItem()
                this.guideItem.x = 480
                this.guideItem.y = 650
                this.mainGrp.addChild(this.guideItem)
            }
            this.guideItem.upView(2)
        }
        else {
            DisplayUtils.removeFromParent(this.guideItem)
            this.guideItem = null
        }

        this.imgAd.visible = this.colorBtn.visible && Main.gamePlatform == Main.platformTT && App.ins().isOpenAd() && GuideUtil.hasHero()
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
                let name = GlobalConfig.getBaseName(this.curId)
                if (name) {
                    if (!App.ins().isOpenAd() || (Main.gamePlatform == Main.platformTT && !GuideUtil.hasHero())) {
                        ViewManager.ins().close(this)
                        ViewManager.ins().close(HeroWin)
                        ViewManager.ins().open(DrawColorWin, name)
                        return
                    }
                    App.ins().watchAdCall(AwardType.TIP_VIDEO, (() => {
                        ViewManager.ins().close(this)
                        ViewManager.ins().close(HeroWin)
                        ViewManager.ins().open(DrawColorWin, name)
                    }).bind(this))
                }
                break;
            case this.lockBtn:
                let curs = GlobalConfig.getBaseName(this.curId)
                DrawModel.ins().costLock(curs)
                break;
        }
    }
}
ViewManager.ins().reg(HeroInfoWin, LayerManager.UI_Popup);
window["HeroInfoWin"] = HeroInfoWin;