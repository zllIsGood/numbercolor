/*
 * @Author: zhoulanglang 
 * @Date: 2020-06-23 20:14:12 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-07-03 23:03:09
 */
class DrawModel extends BaseClass {
    public static ins(): DrawModel {
        return super.ins();
    }

    public constructor() {
        super();
        this.initData()
        this.freshTime()
        this.initDrawData()
    }

    private _freeTipCount: number = 3
    public get freeTipCount() {
        return this._freeTipCount
    }
    public set freeTipCount(c: number) {
        this._freeTipCount = c
        this.cacheData()
    }

    private freshTime() {
        let day = DateUtils.nowDay()
        let s = CacheUtil.get(Constant.FRESH_DAY)
        if (s && Number(s) == day) {
        }
        else {
            CacheUtil.set(Constant.FRESH_DAY, String(day))
            this._freeTipCount = 3
            this.cacheData()
        }
        let ms = DateUtils.getSecondDayTime()
        TimerManager.ins().doTimer(ms, 1, this.freshTime, this)
    }

    public getHasArt(): string[] {
        let ret = []
        let base = GlobalConfig.paintConfig.base
        for (let i in this.drawData) {
            let item = this.drawData[i]
            if (item.has && base[i].isArt) {
                ret.push(i)
            }
        }
        return ret
    }

    public getHasNotArt(): string[] {
        let ret = []
        let base = GlobalConfig.paintConfig.base
        let isTT = Main.gamePlatform == Main.platformTT
        for (let i in this.drawData) {
            let item = this.drawData[i]
            if (item.has && !base[i].isArt) {
                if (!(isTT && i == 'hmjz')) {
                    ret.push(i)
                }
            }
        }
        return ret
    }

    public hasHeroNumByStar(star): number {
        let ids = []
        for (let item of GlobalConfig.config.hero) {
            if (item.star == star) {
                ids = item.heroId
                break;
            }
        }
        let c = 0
        for (let id of ids) {
            let str = GlobalConfig.getBaseName(id)
            let item = this.drawData[str]
            if (item && item.has) {
                c++
            }
        }
        return c
    }

    public hasPicNumByType(type): number {
        let ids = []
        for (let item of GlobalConfig.config.draw) {
            if (item.type == type) {
                ids = item.pic
                break;
            }
        }
        let c = 0
        for (let id of ids) {
            let str = GlobalConfig.getBaseName(id)
            let item = this.drawData[str]
            if (item && item.has) {
                c++
            }
        }
        return c
    }

    public getDrawLv(name: string) {
        let lv = 1
        if (this.drawData[name]) {
            lv = this.drawData[name].level
        }
        return lv
    }

    private drawData = {}
    public getDrawData() {
        return this.drawData
    }
    /**画完解锁*/
    public finishLock(s: string) {
        if (this.drawData[s] && !this.drawData[s].hasDraw) {
            this.drawData[s].hasDraw = true
            if (!this.drawData[s].lock) {
                this.drawData[s].has = true
            }
            this.cacheData()
            this.postData()
            GuideUtil.checkHome()
        }
    }
    /**花金币解锁*/
    public costLock(s: string) {
        if (this.drawData[s] && this.drawData[s].lock) {
            let cost = this.drawData[s].cost
            if (cost <= 0) {
                return
            }
            let bool = UserModel.ins().costGold(cost)
            if (bool) {
                this.drawData[s].lock = false
                if (this.drawData[s].hasDraw) {
                    this.drawData[s].has = true
                }
                this.cacheData()
                this.postData()
            }
            else {
                wx.showToast({ icon: 'none', title: `金币不足` })
            }
        }
    }

    public isDraw(str: string): boolean {
        if (this.drawData[str]) {
            return this.drawData[str].hasDraw
        }
        return false
    }

    public isFinish(str: string) {
        let bool = false
        if (this.drawData[str]) {
            bool = true
            let colorPic = this.drawData[str].colorPic as any[]
            let arr = GlobalConfig.paintConfig.paintGroup[str]
            for (let i in arr) {
                if (colorPic.indexOf(arr[i]) < 0) {
                    bool = false
                    break;
                }
            }
        }
        return bool
    }

    public colorPic(str, pic) {
        if (this.drawData[str]) {
            if (this.drawData[str].colorPic.indexOf(pic) < 0) {
                this.drawData[str].colorPic.push(pic)
                this.cacheData()
                this.postColorPic()
            }
        }
    }
    /**升级展品*/
    public upgradeArt(str) {
        let art = GlobalConfig.paintConfig.base[str]
        if (!art.isArt) {
            return false
        }
        let maxLv = GlobalConfig.config.drawCfg.length
        let lv = this.drawData[str].level
        if (lv >= maxLv) {
            return false
        }
        let nest = GlobalConfig.config.drawCfg[lv - 1 + 1]
        if (UserModel.ins().costGold(nest.cost)) {
            this.drawData[str].level++
            this.cacheData()
            return true
        }
        else {
            wx.showToast({ icon: 'none', title: `金币不足` })
            return false
        }
    }

    private initDrawData() {
        let cfg = GlobalConfig.paintConfig.base
        let need = false
        for (let i in cfg) {
            if (this.drawData[i] == null) {
                // lock 是否解锁  cost解锁条件    has 是否已有   colorPic 已着色的图片名
                this.drawData[i] = { lock: cfg[i].lock, cost: cfg[i].cost, has: false, hasDraw: false, colorPic: [], level: 1 }
                need = true
            }
        }
        need && this.cacheData()
    }

    private initData() {
        let s = CacheUtil.get(Constant.DRAW_DATA)
        if (s && s != '') {
            let obj = JSON.parse(s)
            this._freeTipCount = obj.freeTipCount == null ? this._freeTipCount : obj.freeTipCount
            this.drawData = obj.drawData
        }
        else {
            this._freeTipCount = 3
            this.cacheData()
        }
    }

    public cacheData() {
        let obj = {
            freeTipCount: this.freeTipCount,
            drawData: this.drawData
        }
        CacheUtil.set(Constant.DRAW_DATA, JSON.stringify(obj))
    }

    public postData() {

    }
    public postColorPic() {

    }
}
MessageCenter.compile(DrawModel);
window["DrawModel"] = DrawModel;