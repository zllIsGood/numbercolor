/* 收益倍率
 * @Author: zhoulanglang 
 * @Date: 2020-06-30 11:23:33 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-07-06 19:49:05
 */
class XDataModel extends BaseClass {
    public static ins(): XDataModel {
        return super.ins();
    }

    public constructor() {
        super();
    }

    private timerRun = false

    private checkTimer() {
        if (this.timerRun) {
            return
        }
        let xdata = this.xdata
        let mint = xdata.x2
        if (mint == 0 || (xdata.x4 > 0 && xdata.x4 < mint)) {
            mint = xdata.x4
        }
        if (mint == 0 || (xdata.x2x > 0 && xdata.x2x < mint)) {
            mint = xdata.x2x
        }
        if (mint > 0) {
            this.timerRun = true
            TimerManager.ins().doTimer(mint, 1, this.timer, this)
        }
    }
    private timer() {
        this.timerRun = false
        this.postData()
        this.setXdataInit()
    }

    /**收益倍率 毫秒*/
    public xdata: { x2: number, x4, x2x, freshTime: number } = null
    private setXdataInit() {
        if (this.xdata == null) {
            let s = CacheUtil.get(Constant.X_DATA)
            if (s && s != '') {
                let obj = JSON.parse(s)
                this.xdata = obj
            }
            else {
                this.xdata = {
                    x2: 0,
                    x4: 0,
                    x2x: 0,
                    freshTime: new Date().getTime()
                }
                CacheUtil.set(Constant.X_DATA, JSON.stringify(this.xdata))
                return
            }
        }

        let time = new Date().getTime()
        if (this.xdata.freshTime == null) {
            this.xdata.freshTime = time
        }
        let dtime = time - this.xdata.freshTime
        this.xdata.freshTime = time
        this.xdata.x2 = this.xdata.x2 - dtime
        this.xdata.x2 = this.xdata.x2 < 0 ? 0 : this.xdata.x2
        this.xdata.x4 = this.xdata.x4 - dtime
        this.xdata.x4 = this.xdata.x4 < 0 ? 0 : this.xdata.x4
        this.xdata.x2x = this.xdata.x2x - dtime
        this.xdata.x2x = this.xdata.x2x < 0 ? 0 : this.xdata.x2x
        CacheUtil.set(Constant.X_DATA, JSON.stringify(this.xdata))

        this.checkTimer()
    }
    /**获取收益倍数*/
    public getXdataBeiSu() {
        let xn = 0
        let xdata = this.getXdata()
        xdata.x2 > 0 && (xn += 2)
        xdata.x4 > 0 && (xn += 4)
        xdata.x2x > 0 && (xn += 2)
        xn = xn == 0 ? 1 : xn
        return xn
    }
    public getXdata() {
        this.setXdataInit()
        return this.xdata
    }
    public addXdata(x2, x4, x2x) {
        this.setXdataInit()
        if (x2 > 0) {
            this.xdata.x2 += x2
        }
        if (x4 > 0) {
            this.xdata.x4 += x4
        }
        if (x2x > 0) {
            this.xdata.x2x += x2x
        }
        CacheUtil.set(Constant.X_DATA, JSON.stringify(this.xdata))
        this.postData()
    }

    public postData() {

    }
}
MessageCenter.compile(XDataModel);
window["XDataModel"] = XDataModel;