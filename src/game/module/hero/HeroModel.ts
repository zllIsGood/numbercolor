/*
 * @Author: zhoulanglang 
 * @Date: 2020-06-24 18:02:27 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-07-03 21:32:51
 */
class HeroModel extends BaseClass {
    public static ins(): HeroModel {
        return super.ins();
    }

    public constructor() {
        super();
        this.initData()
        TimerManager.ins().doTimer(10 * 1000, 0, this.fresh, this)
    }

    private newAward() {
        let index = UserModel.ins().getUpgradeByType(UpgradeType.hero)
        let cfg = GlobalConfig.getUpgradeByType(UpgradeType.hero)
        let data = cfg.data[index]
        let p1 = (<any>data).gratuityProbability
        let p2 = (<any>data).ad
        let ran = Math.random()
        if (ran <= p1) {
            return 1
        }
        else if (ran <= p1 + p2) {
            let ads = (<any>data).ads
            let ret = Math.random() > 0.5 ? 2 : 4
            return ret
        }
        else {
            return 0
        }
    }
    /**type 0  1  2  4*/
    public heros: { type: number, time: number }[] = []

    public finish(role: number) {
        if (this.heros[role]) {
            this.heros[role].type = 0
            this.cacheData()
            this.postData()
        }
    }

    private fresh() {
        let need = false
        for (let i in this.heros) {
            if (this.heros[i].type == 0) {
                let time = new Date().getTime()
                let dtime = time - this.heros[i].time
                if (dtime >= 60 * 1000) {
                    this.heros[i].type = this.newAward()
                    this.heros[i].time = time
                    need = true
                }
            }
        }
        if (need) {
            this.cacheData()
            this.postData()
        }
    }

    private initData() {
        let s = CacheUtil.get(Constant.HERO_DATA)
        if (s && s != '') {
            let obj = JSON.parse(s)
            this.heros = obj
        }

        let time = new Date().getTime()
        for (let i = 0; i < 4; i++) {
            if (!this.heros[i]) {
                let type = this.newAward()
                this.heros[i] = { type: type, time: time }
            }
        }
        this.cacheData()
    }

    public cacheData() {
        let obj = this.heros
        CacheUtil.set(Constant.HERO_DATA, JSON.stringify(obj))
    }

    public postData() {

    }
}
MessageCenter.compile(HeroModel);
window["HeroModel"] = HeroModel;