/*
 * @Author: zhoulanglang 
 * @Date: 2020-06-24 15:51:49 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-08-13 14:50:44
 */
class TaskModel extends BaseClass {
    public static ins(): TaskModel {
        return super.ins();
    }

    public constructor() {
        super();
        this.initData()
        this.timer()
        this.timerSure()
    }
    /** leftTime剩余时间毫秒ms*/
    private task: { id: number, finish: boolean, running: boolean, freshTime: number, leftTime: number, hasStart: boolean }[] = []
    private lastTime = 0

    public getTask(id) {
        return this.task[id - 1]
    }

    public getNowTask(): { id: number, finish: boolean, running: boolean, freshTime: number, leftTime: number, hasStart: boolean }[] {
        let ret = []
        for (let i in this.task) {
            let item = this.task[i]
            if (item.running && !item.finish) {
                ret.push(item)
            }
        }
        return ret
    }

    public freshTask() {
        let arr = []
        let nowing = 0
        let freshTime = new Date().getTime()
        let start = false
        for (let i in this.task) {
            let item = this.task[i]
            if (item.running) {
                if (!item.finish) {
                    nowing++
                }
                start = true
            }
            if (item.running && item.hasStart) {
                item.leftTime = item.leftTime - (freshTime - item.freshTime)
                item.leftTime = item.leftTime < 0 ? 0 : item.leftTime
                item.freshTime = freshTime
            }
            if (!item.finish && !item.running) {
                arr.push(item)
            }
        }
        this.cacheData()
        this.postTask()
        if (nowing >= 2 || arr.length == 0) {
            return
        }
        if (start && ((freshTime - this.lastTime) < 10 * 60 * 1000)) { //每10分钟随机出现一个
            return
        }
        //刷新的任务
        let n = MathUtils.limitInteger(0, arr.length - 1)
        arr[n].running = true
        arr[n].freshTime = freshTime
        arr[n].leftTime = GlobalConfig.config.task[arr[n].id - 1].fresh * 60 * 1000
        this.lastTime = freshTime
        this.cacheData()
    }

    public startTask(id: number) {
        let item = this.getTask(id)
        if (item && !item.hasStart) {
            item.hasStart = true
            item.freshTime = new Date().getTime()
            this.cacheData()
            this.postTask()
        }
    }
    /**减少时间 ms毫秒*/
    public subTimeTask(id: number, ms: number) {
        let item = this.getTask(id)
        if (item && item.hasStart) {
            let nowtime = new Date().getTime()
            let t = nowtime - item.freshTime + ms
            t = item.leftTime - t
            item.leftTime = t > 0 ? t : 0
            item.freshTime = nowtime
            this.cacheData()
            this.postTask()
        }
    }

    public getPutFinish(id: number) {
        let cfg = GlobalConfig.config.task[id - 1]
        let cur = 0
        let all = 0
        for (let i in cfg.data) {
            all++
            if (UserModel.ins().isPut(cfg.data[i])) {
                cur++
            }
        }
        return { cur: cur, all: all }
    }

    public canFinishTask(id: number) {
        let cfg = GlobalConfig.config.task[id - 1]
        if (cfg.type == 1) {
            let can = true
            for (let i in cfg.data) {
                if (!UserModel.ins().isPut(cfg.data[i])) {
                    can = false
                }
            }
            return can
        }
        let nowtime = new Date().getTime()
        for (let i in this.task) {
            let item = this.task[i]
            if (item.id == id) {
                let lt = item.leftTime - (nowtime - item.freshTime)
                return item.hasStart && lt <= 0
            }
        }
    }

    public finishTask(id: number) {
        for (let i in this.task) {
            let item = this.task[i]
            if (item.id == id && item.finish == false) {
                item.finish = true
                this.cacheData()
                let cfg = GlobalConfig.config.task[id - 1]
                UserModel.ins().addGold(cfg.award)
                this.timerSure()
                this.postTask()
                return
            }
        }
    }
    /**任务都完成就移除刷新*/
    private timerSure() {
        for (let i in this.task) {
            let item = this.task[i]
            if (!item.finish) {
                return
            }
        }
        TimerManager.ins().remove(this.timer, this)
    }

    private timer() {
        this.freshTask()
        TimerManager.ins().doTimer(60 * 1000, 0, this.timer, this)
    }

    private initData() {
        let s = CacheUtil.get(Constant.TASK_DATA)
        if (s && s != '') {
            let obj = JSON.parse(s)
            this.task = obj.task == null ? this.task : obj.task
            if (obj.lastTime == null) {
                this.lastTime = new Date().getTime()
                this.cacheData()
            }
            else {
                this.lastTime = obj.lastTime
            }
        }
        else {
            this.task = []
            let cfgs = GlobalConfig.config.task
            for (let item of cfgs) {
                let obj = {
                    id: item.id,
                    finish: false,
                    running: false,
                    freshTime: 0,
                    leftTime: 0,
                    hasStart: false
                }
                this.task.push(obj)
            }
            this.lastTime = new Date().getTime()
            this.cacheData()
        }
    }

    public cacheData() {
        let obj = {
            task: this.task,
            lastTime: this.lastTime
        }
        CacheUtil.set(Constant.TASK_DATA, JSON.stringify(obj))
    }

    public postTask() {

    }
}
MessageCenter.compile(TaskModel);
window["TaskModel"] = TaskModel;