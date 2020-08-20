/* 画作
 * @Author: zhoulanglang 
 * @Date: 2020-06-04 16:25:32 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-07-06 21:22:07
 */
class DrawWin extends BaseEuiView {

    closeGrp: eui.Group
    list: eui.List

    constructor() {
        super();
        this.skinName = `DrawSkin`;
        this.list.itemRenderer = DrawItem
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
        let data = GlobalConfig.getDraw()
        let arr = []
        for (let item of data) {
            let bool = false
            for (let obj of item.pic) {
                if (GlobalConfig.getBaseName(obj)) {
                    bool = true
                    break;
                }
            }
            if (bool) {
                arr.push(item)
            }
        }
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
ViewManager.ins().reg(DrawWin, LayerManager.UI_Popup);
window["DrawWin"] = DrawWin;