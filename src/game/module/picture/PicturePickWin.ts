/*
 * @Author: zhoulanglang 
 * @Date: 2020-06-30 11:33:15 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-07-17 18:09:52
 */
class PicturePickWin extends BaseEuiView {

    closeGrp: eui.Group
    list: eui.List

    isArt: boolean
    order: number

    constructor() {
        super();
        this.skinName = `PicturePickSkin`;
        this.list.itemRenderer = PicturePickItem
    }

    public initUI(): void {
        super.initUI();
    }

    public open(...param: any[]): void {
        this.addTouchEvent(this.closeGrp, this.onClick);
        ViewManager.ins().close(GuideDialog)

        this.isArt = param[0]
        this.order = param[1]
        this.upView()
        App.ins().playBannerAd(Ad.loadingBanner)
    }

    private upView() {
        let arr = this.isArt ? DrawModel.ins().getHasArt() : DrawModel.ins().getHasNotArt()
        let data = []
        for (let i = 0; i < arr.length; i++) {
            data.push({ picname: arr[i], isLast: false, houseNum: this.order, isArt: this.isArt, isFirst: i == 0 })
        }
        data.push({ picname: '', isLast: true, houseNum: this.order, isArt: this.isArt, isFirst: false })
        this.list.dataProvider = new eui.ArrayCollection(data)
    }


    public close(...param: any[]): void {
        App.ins().destoryBanner()
        let view = ViewManager.ins().getView(PictureWin) as PictureWin
        if (view) {
            view.guide()
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
ViewManager.ins().reg(PicturePickWin, LayerManager.UI_Popup);
window["PicturePickWin"] = PicturePickWin;