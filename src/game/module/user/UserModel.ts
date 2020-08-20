/* 用户数据模块
 * @Author: zhoulanglang 
 * @Date: 2020-06-12 14:29:05 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-07-06 20:23:10
 */
class UserModel extends BaseClass {
    public static ins(): UserModel {
        return super.ins();
    }

    public constructor() {
        super();
        this.initData()
    }

    public gold: number = 0 // 100000000000
    public addGold(n: number) {
        this.gold += n
        this.postGold()
        this.cacheData()
    }
    public costGold(n: number): boolean {
        if (this.gold < n) {
            return false
        }
        this.gold -= n
        this.postGold()
        this.cacheData()
        return true
    }

    private housePut: { pic: number, person: number, stime: number }[] = []
    private checkHousePut() {
        let num = this.houseNum()
        if (this.housePut.length == num) {
            return
        }
        let start = 0
        let s = CacheUtil.get(Constant.HOUSE_PUT)
        if (s && s != '') {
            let obj = JSON.parse(s) as any[]
            this.housePut = obj
            start = obj.length
        }
        else {
            start = 0
        }
        for (let i = start; i < num; i++) {
            this.housePut[i] = { pic: -1, person: -1, stime: 0 }
        }
        CacheUtil.set(Constant.HOUSE_PUT, JSON.stringify(this.housePut))
    }
    /**获取房间摆放*/
    public getHousePut() {
        this.checkHousePut()
        return this.housePut
    }
    /**house房间号*/
    public setHousePut(house: number, pic: number = null, person: number = null) {
        this.checkHousePut()
        if (!this.housePut[house]) {
            return
        }
        if (pic != null) {
            this.housePut[house].pic = pic
            this.housePut[house].stime = new Date().getTime()
        }
        if (person != null) {
            this.housePut[house].person = person
        }
        CacheUtil.set(Constant.HOUSE_PUT, JSON.stringify(this.housePut))
        this.postPut()
        GuideUtil.checkPutGuide()
        GuideUtil.checkHome()
    }
    public putReturn(id: number) {
        let put = this.getHousePut()
        let bool = false
        for (let i in put) {
            let item = put[i]
            if (item.person == id) {
                item.person = -1
                item.stime = 0
                bool = true
                break;
            }
            if (item.pic == id) {
                item.pic = -1
                bool = true
                break;
            }
        }
        if (bool) {
            CacheUtil.set(Constant.HOUSE_PUT, JSON.stringify(this.housePut))
            this.postPut()
        }
        return
    }
    public isPut(id: number) {
        let put = this.getHousePut()
        for (let i in put) {
            let item = put[i]
            if (item.person == id || item.pic == id) {
                return true
            }
        }
        return false
    }
    public freshPutTime(id: number) {
        let put = this.getHousePut()
        for (let i in put) {
            let item = put[i]
            if (item.pic == id) {
                item.stime = new Date().getTime()
                CacheUtil.set(Constant.HOUSE_PUT, JSON.stringify(this.housePut))
                return
            }
        }
        return
    }

    public houseNum() {
        let cfg = GlobalConfig.getUpgradeByType(UpgradeType.house)
        let i = this.upgradeData[UpgradeType.house]
        return cfg.data[i].profit
    }

    private table: { freshTime: number } = null
    public getTable() {
        if (this.table == null) {
            let s = CacheUtil.get(Constant.TABLE_DATA)
            if (s && s != '') {
                let obj = JSON.parse(s)
                this.table = obj
            }
            else {
                this.table = { freshTime: new Date().getTime() }
                CacheUtil.set(Constant.TABLE_DATA, JSON.stringify(this.table))
            }
        }
        return this.table
    }
    public getTableCfg() {
        let cfg = GlobalConfig.getUpgradeByType(UpgradeType.cost).data[this.getUpgradeByType(UpgradeType.cost)]
        return cfg
    }
    public getTableHasTime() {
        let dt = new Date().getTime() - this.getTable().freshTime
        return dt
    }
    public awardTable() {
        if (this.table == null) {
            this.table = { freshTime: new Date().getTime() }
        }
        else {
            this.table.freshTime = new Date().getTime()
        }
        CacheUtil.set(Constant.TABLE_DATA, JSON.stringify(this.table))
    }

    private upgradeData = {}
    public getUpgradeByType(type: number) {
        let lv = this.upgradeData[type]
        return lv
    }
    public setUpgradeByType(type: number) {
        let cfg = GlobalConfig.getUpgradeByType(type)
        if (cfg == null) {
            return
        }
        let inext = this.upgradeData[type] + 1
        let next = cfg.data[inext]
        if (!next) {
            wx.showToast({ icon: 'none', title: `已达最大等级` })
            return false
        }
        let cost = next.cost
        if (this.costGold(cost)) {  //足够
            this.upgradeData[type]++
            this.cacheData()
            this.postUpgrade()
            return true
        }
        else {
            wx.showToast({ icon: 'none', title: `金币不足` })
            return false
        }
    }

    private initData() {
        let need = false
        let s = CacheUtil.get(Constant.USER_DATA)
        if (s && s != '') {
            let obj = JSON.parse(s)
            this.gold = obj.gold == null ? this.gold : obj.gold
            this.upgradeData = obj.upgradeData == null ? this.upgradeData : obj.upgradeData
        }
        else {
            need = true
        }
        let arr = [UpgradeType.house, UpgradeType.cost, UpgradeType.hero]
        for (let n of arr) {
            if (this.upgradeData[n] == null) {
                this.upgradeData[n] = 0
                need = true
            }
        }
        need && this.cacheData()
    }

    public cacheData() {
        let obj = {
            gold: this.gold,
            upgradeData: this.upgradeData,
        }
        CacheUtil.set(Constant.USER_DATA, JSON.stringify(obj))
    }

    public postGold() {

    }
    public postUpgrade() {

    }
    public postPut() {

    }

    public postUserProto() {

    }
}
MessageCenter.compile(UserModel);
window["UserModel"] = UserModel;