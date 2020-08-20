/*
 * @Author: zhoulanglang 
 * @Date: 2020-06-30 21:28:19 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-08-13 14:57:21
 */
class TaskWin extends BaseEuiView {

    closeGrp: eui.Group
    colorBtn: BaseBtn
    img: eui.Image
    grp: eui.Group
    lab: eui.Label
    lab0: eui.Label

    curId: number
    constructor() {
        super();
        this.skinName = `TaskSkin`;
    }

    public initUI(): void {
        super.initUI();
    }

    public open(...param: any[]): void {
        this.addTouchEvent(this.closeGrp, this.onClick);
        this.addTouchEvent(this.colorBtn, this.onClick);
        this.observe(TaskModel.ins().postTask, this.upView)

        this.curId = param[0]
        this.upView()
        App.ins().playBannerAd(Ad.loadingBanner)
    }

    private upView() {
        let cfg = GlobalConfig.config.task[this.curId - 1]
        let curfin = TaskModel.ins().getPutFinish(this.curId)
        let lab: string
        if (curfin.cur < curfin.all) {
            lab = `<font  color=0xFF0000>${curfin.cur}</font><font  color=0xE1F1FF>/${curfin.all}</font>`
        }
        else {
            lab = `<font  color=0x00FF00>${curfin.cur}</font><font  color=0xE1F1FF>/${curfin.all}</font>`
        }
        this.lab.textFlow = new egret.HtmlTextParser().parser(lab)
        let award = StringUtils.NumberToString(cfg.award)
        this.lab0.textFlow = new egret.HtmlTextParser().parser(`<font  color=0xE1F1FF>${award}</font>`)
        this.grp.removeChildren()
        let hasn = 0
        for (let i in cfg.data) {
            let item = cfg.data[i]
            let cur = GlobalConfig.getBaseName(item)
            if (cur) {
                let imgbg = new eui.Image()
                imgbg.source = 'blue_frame_png'
                imgbg.x = hasn * 180
                this.grp.addChild(imgbg)

                let img = new eui.Image()
                img.source = GlobalConfig.paintConfig.base[cur].taskImg
                img.y = 24
                img.x = hasn * 180 + 16
                this.grp.addChild(img)
                hasn++
            }
        }

        let mod = TaskModel.ins()
        let task = mod.getTask(this.curId)
        let can = mod.canFinishTask(this.curId)
        if (task.hasStart && can) {
            this.colorBtn.icon = 'task_award_btn_png'
        }
        else {
            this.colorBtn.icon = 'ok_btn_png'
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
            case this.colorBtn:
                let mod = TaskModel.ins()
                let task = mod.getTask(this.curId)
                if (task.hasStart) {
                    let can = mod.canFinishTask(this.curId)
                    if (can) {
                        mod.finishTask(this.curId)
                    }
                    ViewManager.ins().close(this)
                }
                else {
                    TaskModel.ins().startTask(this.curId)
                    ViewManager.ins().close(this)
                }
                break;
        }
    }

}
ViewManager.ins().reg(TaskWin, LayerManager.UI_Popup);
window["TaskWin"] = TaskWin;