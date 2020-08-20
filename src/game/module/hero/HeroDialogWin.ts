/*
 * @Author: zhoulanglang 
 * @Date: 2020-06-08 11:58:28 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-07-06 21:22:14
 */
class HeroDialogWin extends BaseEuiView {

    closeGrp: eui.Group
    btn: BaseBtn
    lab: eui.Label

    constructor() {
        super();
        this.skinName = `HeroDialogSkin`;
    }

    public initUI(): void {
        super.initUI();
    }

    public open(...param: any[]): void {
        this.addTouchEvent(this.closeGrp, this.onClick);
        this.addTouchEvent(this.btn, this.onClick);

        this.upView()
        App.ins().playBannerAd(Ad.loadingBanner)
    }

    private upView() {
        let num = 5 //
        let str = `点击<font  color=0xFF0000>${num}</font>个客人吧，你可能 会发现新大陆!`
        this.lab.textFlow = new egret.HtmlTextParser().parser(str)
    }


    public close(...param: any[]): void {
        App.ins().destoryBanner()

    }


    private onClick(e: egret.TouchEvent): void {
        switch (e.currentTarget) {
            case this.closeGrp:
                ViewManager.ins().close(this)
                break;
            case this.btn:
                ViewManager.ins().close(this)
                break;
        }
    }

}
ViewManager.ins().reg(HeroDialogWin, LayerManager.UI_Popup);
window["HeroDialogWin"] = HeroDialogWin;