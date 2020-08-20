/*
 * @Author: zhoulanglang 
 * @Date: 2020-06-04 16:25:32 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-08-13 16:23:41
 */
class WatchAdWin extends BaseEuiView {

    closeGrp: eui.Group
    btn: BaseBtn
    ximg: eui.Image

    addx: number
    currole: number
    constructor() {
        super();
        this.skinName = `WatchAdSkin`;
    }

    public initUI(): void {
        super.initUI();
    }

    public open(...param: any[]): void {
        this.addTouchEvent(this.closeGrp, this.onClick);
        this.addTouchEvent(this.btn, this.onClick);

        this.addx = param[0] == null ? 2 : param[0]
        this.currole = param[1]
        this.upView()
        App.ins().playBannerAd(Ad.loadingBanner)
    }

    private upView() {
        if (this.addx == 2) {
            this.ximg.source = 'bs_x_2x_png'
        }
        else if (this.addx == 4) {
            this.ximg.source = 'bs_x_4x_png'
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
            case this.btn:
                App.ins().watchAdCall(AwardType.TIP_VIDEO, (() => {
                    if (this.addx == 2) {
                        XDataModel.ins().addXdata(3 * 60 * 1000, -1, -1)
                    }
                    else if (this.addx == 4) {
                        XDataModel.ins().addXdata(-1, 3 * 60 * 1000, -1)
                    }
                    ViewManager.ins().close(this)
                    HeroModel.ins().finish(this.currole)
                }).bind(this))
                break;
        }
    }

}
ViewManager.ins().reg(WatchAdWin, LayerManager.UI_Popup);
window["WatchAdWin"] = WatchAdWin;