/* 升级
 * @Author: zhoulanglang 
 * @Date: 2020-06-04 16:25:32 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-07-06 21:23:14
 */
class UpgradeWin extends BaseEuiView {

    closeGrp: eui.Group
    list: eui.List
    constructor() {
        super();
        this.skinName = `UpgradeSkin`
        this.list.itemRenderer = UpgradeItem
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
        let arr = GlobalConfig.getUpgrade()
        let data = []
        for (let i = 0; i < arr.length; i++) {
            let isLast = i == arr.length - 1
            data.push({ itemData: arr[i], isLast: isLast })
        }
        this.list.dataProvider = new eui.ArrayCollection(data)
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
ViewManager.ins().reg(UpgradeWin, LayerManager.UI_Popup);
window["UpgradeWin"] = UpgradeWin;