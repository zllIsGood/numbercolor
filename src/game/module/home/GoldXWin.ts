/*
 * @Author: zhoulanglang 
 * @Date: 2020-07-02 10:19:53 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-08-13 16:41:44
 */
class GoldXWin extends BaseEuiView {

    closeGrp: eui.Group
    adBtn: BaseBtn
    lab: eui.Label
    labX: eui.Label

    img11: eui.Image
    img13: eui.Image
    img21: eui.Image
    img23: eui.Image
    img31: eui.Image
    img33: eui.Image
    tgrp0: eui.Group
    tgrp1: eui.Group
    tgrp2: eui.Group
    lab0: eui.Label
    lab1: eui.Label
    lab2: eui.Label

    constructor() {
        super();
        this.skinName = `GoldXSkin`;
    }

    public initUI(): void {
        super.initUI();
    }

    public open(...param: any[]): void {
        this.addTouchEvent(this.closeGrp, this.onClick);
        this.addTouchEvent(this.adBtn, this.onClick);
        this.observe(XDataModel.ins().postData, this.upView)

        this.lab.text = '购买金币增量'

        TimerManager.ins().doTimer(1000, 0, this.upView, this)
        this.upView()
        App.ins().playBannerAd(Ad.loadingBanner)
    }

    private upView() {
        let xn = XDataModel.ins().getXdataBeiSu()
        xn = xn == 1 ? 0 : xn
        this.labX.text = 'X' + xn

        let xdata = XDataModel.ins().xdata
        let curt = new Date().getTime()
        let dtime = curt - xdata.freshTime

        let x2 = xdata.x2 - dtime
        x2 = x2 > 0 ? x2 : 0
        if (x2 > 0) {
            this.img11.visible = false
            this.img13.visible = true

            this.tgrp0.visible = true
            this.lab0.text = StringUtils.timeToString(x2)
        }
        else {
            this.img11.visible = true
            this.img13.visible = false

            this.tgrp0.visible = false
        }


        let x4 = xdata.x4 - dtime
        x4 = x4 > 0 ? x4 : 0
        if (x4 > 0) {
            this.img21.visible = false
            this.img23.visible = true

            this.tgrp1.visible = true
            this.lab1.text = StringUtils.timeToString(x4)
        }
        else {
            this.img21.visible = true
            this.img23.visible = false

            this.tgrp1.visible = false
        }

        let x2x = xdata.x2x - dtime
        x2x = x2x > 0 ? x2x : 0
        if (x2x > 0) {
            this.img31.visible = false
            this.img33.visible = true

            this.tgrp2.visible = true
            this.lab2.text = StringUtils.timeToString(x2x)
        }
        else {
            this.img31.visible = true
            this.img33.visible = false

            this.tgrp2.visible = false
        }
    }

    public close(...param: any[]): void {
        TimerManager.ins().remove(this.upView, this)
        App.ins().destoryBanner()

    }


    private onClick(e: egret.TouchEvent): void {
        switch (e.currentTarget) {
            case this.closeGrp:
                ViewManager.ins().close(this)
                break;
            case this.adBtn:
                App.ins().watchAdCall(AwardType.TIP_VIDEO, (() => {
                    XDataModel.ins().addXdata(-1, -1, 3 * 60 * 1000)
                    // ViewManager.ins().close(this)
                }).bind(this))
                break;
        }
    }

}
ViewManager.ins().reg(GoldXWin, LayerManager.UI_Popup);
window["GoldXWin"] = GoldXWin;