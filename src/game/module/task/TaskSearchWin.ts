/*
 * @Author: zhoulanglang 
 * @Date: 2020-07-02 12:06:48 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-08-13 15:20:46
 */
class TaskSearchWin extends BaseEuiView {

    closeGrp: eui.Group
    btnL: BaseBtn
    btnR: BaseBtn
    btnC: BaseBtn
    lab: eui.Label
    lab2: eui.Label
    lab3: eui.Label
    wordImg: eui.Image
    roleImg: eui.Image

    curId: number
    constructor() {
        super();
        this.skinName = `TaskSearchSkin`;
    }

    public initUI(): void {
        super.initUI();
    }

    public open(...param: any[]): void {
        this.addTouchEvent(this.closeGrp, this.onClick);
        this.addTouchEvent(this.btnR, this.onClick);
        this.addTouchEvent(this.btnL, this.onClick);
        this.addTouchEvent(this.btnC, this.onClick);
        this.observe(TaskModel.ins().postTask, this.upView)

        this.curId = param[0]
        this.upView()
        App.ins().playBannerAd(Ad.loadingBanner)
    }

    private upView() {
        let cfg = GlobalConfig.config.task[this.curId - 1]
        this.lab.textFlow = new egret.HtmlTextParser().parser(cfg.lab)
        let imgs = cfg.imgs
        this.wordImg.source = imgs[0]
        this.roleImg.source = imgs[1]

        let award = StringUtils.NumberToString(cfg.award)
        let str = `<font  color=0xE1F1FF>${award}</font>`
        this.lab3.textFlow = new egret.HtmlTextParser().parser(str)

        this.timer()
        TimerManager.ins().doTimer(1000, 0, this.timer, this)
    }

    private timer() {
        let task = TaskModel.ins().getTask(this.curId)
        let cfg = GlobalConfig.config.task[this.curId - 1]
        let lefttime = task.leftTime
        if (task.hasStart) {
            let time = new Date().getTime()
            let dt = time - task.freshTime
            lefttime = task.leftTime - dt
            lefttime = lefttime < 0 ? 0 : lefttime
        }
        let tstr = DateUtils.getFormatBySecond(lefttime / 1000, 0)
        let str = `<font  color=0xE1F1FF>${tstr}</font>`
        this.lab2.textFlow = new egret.HtmlTextParser().parser(str)
        if (lefttime <= 0) {
            TimerManager.ins().remove(this.timer, this)
        }

        this.btnC.visible = false
        this.btnL.visible = false
        this.btnR.visible = false
        if (task.hasStart) {
            if (lefttime <= 0) {
                this.btnC.visible = true
                this.btnC.icon = 'task_award_btn_png'
            }
            else {
                this.btnL.visible = true
                this.btnR.visible = true
            }
        }
        else {
            this.btnC.visible = true
            this.btnC.icon = 'ok_btn_png'
        }
    }

    public close(...param: any[]): void {
        TimerManager.ins().remove(this.timer, this)
        App.ins().destoryBanner()
    }


    private onClick(e: egret.TouchEvent): void {
        switch (e.currentTarget) {
            case this.closeGrp:
                ViewManager.ins().close(this)
                break;
            case this.btnR:
                App.ins().watchAdCall(AwardType.TIP_VIDEO, (() => {
                    TaskModel.ins().subTimeTask(this.curId, 3 * 60 * 1000)
                    ViewManager.ins().close(this)
                }).bind(this))
                break;
            case this.btnL:
                ViewManager.ins().close(this)
                break;
            case this.btnC:
                let mod = TaskModel.ins()
                let task = mod.getTask(this.curId)
                if (task.hasStart) {
                    let can = mod.canFinishTask(this.curId)
                    if (can) {
                        mod.finishTask(this.curId)
                    }
                }
                else {
                    TaskModel.ins().startTask(this.curId)
                }
                ViewManager.ins().close(this)
                break;
        }
    }

}
ViewManager.ins().reg(TaskSearchWin, LayerManager.UI_Popup);
window["TaskSearchWin"] = TaskSearchWin;