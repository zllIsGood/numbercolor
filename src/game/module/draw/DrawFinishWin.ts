/*
 * @Author: zhoulanglang 
 * @Date: 2020-08-14 17:46:00 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-08-14 17:57:32
 */
class DrawFinishWin extends BaseEuiView {


    private imgGrp: eui.Group;
    private bigImg: eui.Image
    private mainGrp: eui.Group
    private clickGrp: eui.Group;
    private btn: BaseBtn

    private curId: string
    private imgobjs: eui.Image[] = []
    constructor() {
        super();
        this.skinName = `DrawFinishSkin`;
    }

    public initUI(): void {
        super.initUI();
    }

    public open(...param: any[]): void {
        this.addTouchEvent(this.btn, this.onClick);

        this.curId = param[0]
        this.upView()
        App.ins().playBannerAd(Ad.loadingBanner)
    }

    private upView() {
        let paintCfg = GlobalConfig.paintConfig
        let curString = this.curId
        let data = paintCfg.paintGroup[curString]
        let jsons = GlobalConfig.picConfig.xydata
        let drawData = DrawModel.ins().getDrawData()[curString]
        if (data) {
            this.imgGrp.removeChildren()
            this.imgobjs.length = 0
            for (let i in data) {
                let src = data[i]
                let json = jsons[src]
                let img = new eui.Image()
                img.source = src
                img.x = json.x
                img.y = json.y

                this.imgGrp.addChild(img)
                this.imgobjs.push(img)
            }
        }
        let basedata = paintCfg.base[curString]
        this.bigImg.source = basedata.bigImg
        let w1 = this.mainGrp.width - 30
        let h1 = this.mainGrp.height - 30
        let scale = w1 / h1 > basedata.w / basedata.h ? h1 / basedata.h : w1 / basedata.w
        DisplayUtils.setScale(this.clickGrp, scale)
        this.clickGrp.x = (this.mainGrp.width - basedata.w * scale) / 2
        this.clickGrp.y = (this.mainGrp.height - basedata.h * scale) / 2
    }


    public close(...param: any[]): void {
        App.ins().destoryBanner()

    }


    private onClick(e: egret.TouchEvent): void {
        switch (e.currentTarget) {
            case this.btn:
                ViewManager.ins().close(this)
                break;
        }
    }

}
ViewManager.ins().reg(DrawFinishWin, LayerManager.UI_Popup);