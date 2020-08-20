/*
 * @Author: zhoulanglang 
 * @Date: 2020-06-04 16:25:32 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-07-17 18:19:26
 */
class PictureWin extends BaseEuiView {

    closeGrp: eui.Group
    list: eui.List
    mainGrp: eui.Group

    constructor() {
        super();
        this.skinName = `PictureSkin`;
        this.list.itemRenderer = PictureItem
    }

    public initUI(): void {
        super.initUI();
    }

    public open(...param: any[]): void {
        this.addTouchEvent(this.closeGrp, this.onClick);
        this.observe(UserModel.ins().postPut, this.upView)

        this.upView()
        App.ins().playBannerAd(Ad.loadingBanner)
        this.guide()
    }

    private upView() {
        let arr = UserModel.ins().getHousePut()
        let data = []
        for (let i = 0; i < arr.length; i++) {
            data.push({ housePut: arr[i], isLast: i == arr.length - 1, houseNum: i, isFirst: i == 0 })
        }
        this.list.dataProvider = new eui.ArrayCollection(data)

    }

    public guide() {
        let guideData = GuideUtil.getPutGuide()
        if (guideData.needArtGuide) {
            this.guided = true
            GuideUtil.showDialog(4)
        }
        else if (guideData.needHeroGuide) {
            this.guided = true
            GuideUtil.showDialog(5)
        }
        else {
            if (this.guided) {
                GuideUtil.showDialog(6)
                if (this.guideItem == null) {
                    this.guideItem = new GuideItem()
                    this.mainGrp.addChild(this.guideItem)
                }
                this.guideItem.x = 620
                this.guideItem.y = 90
                this.guideItem.upView(1)
            }
        }
    }

    guideItem: GuideItem
    guided = false

    public close(...param: any[]): void {
        App.ins().destoryBanner()
        if (this.guided) {
            ViewManager.ins().close(GuideDialog)
            this.guided = false
        }
    }

    private onClick(e: egret.TouchEvent): void {
        switch (e.currentTarget) {
            case this.closeGrp:
                ViewManager.ins().close(this)
                break;
        }
    }

}
ViewManager.ins().reg(PictureWin, LayerManager.UI_Popup);
window["PictureWin"] = PictureWin;