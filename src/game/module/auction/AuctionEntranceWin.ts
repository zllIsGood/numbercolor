/*
 * @Author: zhoulanglang 
 * @Date: 2020-08-10 14:44:21 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-08-13 12:01:45
 */
class AuctionEntranceWin extends BaseEuiView {

    closeGrp: eui.Group
    list: eui.List
    constructor() {
        super();
        this.skinName = `AuctionEntranceSkin`
        this.list.itemRenderer = AuctionEntranceItem
    }

    public initUI(): void {
        super.initUI();
    }

    public open(...param: any[]): void {
        this.addTouchEvent(this.closeGrp, this.onClick);

        this.upView()
        App.ins().playBannerAd(Ad.loadingBanner)
    }

    private upView() {
        let arr = AuctionModel.auctionList
        this.list.dataProvider = new eui.ArrayCollection(arr)
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
ViewManager.ins().reg(AuctionEntranceWin, LayerManager.UI_Popup);