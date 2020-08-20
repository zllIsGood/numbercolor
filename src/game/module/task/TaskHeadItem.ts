/*
 * @Author: zhoulanglang 
 * @Date: 2020-07-03 10:19:10 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-07-04 02:18:52
 */
class TaskHeadItem extends eui.ItemRenderer {

    head: eui.Image
    img: eui.Image

    data: { taskId: number, bool }
    public constructor() {
        super();
        this.skinName = 'TaskHeadItemSkin'
        this.addEventListener(egret.TouchEvent.ADDED_TO_STAGE, this.open, this);
        this.addEventListener(egret.TouchEvent.REMOVED_FROM_STAGE, this.close, this);
    }


    public open(...param: any[]): void {
        this.removeEventListener(egret.TouchEvent.ADDED_TO_STAGE, this.open, this)
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this)
    }

    protected dataChanged() {
        if (this.data == null) {
            return
        }
        let task = TaskModel.ins().getTask(this.data.taskId)
        let state = 0
        if (task.hasStart) {
            state = TaskModel.ins().canFinishTask(this.data.taskId) ? -1 : 1
        }
        if (state == 0) {
            this.img.source = 'task_img3_png'
        }
        else if (state == 1) {
            this.img.source = 'task_img1_png'
        }
        else if (state == -1) {
            this.img.source = 'task_img2_png'
        }
        this.head.source = this.data.bool ? 'lr_01_rolehas_png' : 'lr_02_rolehas_png'
    }


    private onClick(e: egret.TouchEvent) {
        let taskId = this.data.taskId
        let cfg = GlobalConfig.config.task[taskId - 1]
        if (cfg.type == 1) {
            ViewManager.ins().open(TaskWin, taskId)
        }
        else if (cfg.type == 2) {
            ViewManager.ins().open(TaskSearchWin, taskId)
        }
    }

    public close(...param: any[]): void {
        this.removeEventListener(egret.TouchEvent.REMOVED_FROM_STAGE, this.close, this);
        this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this)
    }
}
window["TaskHeadItem"] = TaskHeadItem;