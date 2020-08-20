/* 员工
 * @Author: zhoulanglang 
 * @Date: 2020-06-04 16:25:32 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-07-06 21:22:25
 */
class HeroWin extends BaseEuiView {

    closeGrp: eui.Group
    list: eui.List

    mainGrp: eui.Group
    guideItem: GuideItem
    constructor() {
        super();
        this.skinName = `HeroSkin`;
        this.list.itemRenderer = HeroItem
    }

    public initUI(): void {
        super.initUI();
    }

    public open(...param: any[]): void {
        this.addTouchEvent(this.closeGrp, this.onClick);
        this.observe(DrawModel.ins().postData, this.upView)

        this.upView()
        App.ins().playBannerAd(Ad.loadingBanner)
    }

    private upView() {
        let data = GlobalConfig.getHero()
        this.list.dataProvider = new eui.ArrayCollection(data)

        let guideNeed = !GuideUtil.hasHero()
        if (guideNeed) {
            if (this.guideItem == null) {
                this.guideItem = new GuideItem()
                this.guideItem.x = 340 + 24
                this.guideItem.y = 660 + 50
                this.mainGrp.addChild(this.guideItem)
            }
            this.guideItem.upView(1)
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
        }
    }

}
ViewManager.ins().reg(HeroWin, LayerManager.UI_Popup);
window["HeroWin"] = HeroWin;