/*
 * @Author: zhoulanglang 
 * @Date: 2020-07-03 16:33:01 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-07-15 17:44:06
 */
class RoleItem extends eui.Component {

    goldAd: GoldAd
    goldItem: GoldItem2
    mc: MovieClip
    curRole: number
    mcstr = [
        ['role1mc', 'role1bmc'],
        ['role2mc', 'role2bmc'],
        ['role3mc', 'role3bmc'],
        ['role4mc', 'role4bmc'],
    ]
    public constructor() {
        super();
        // this.skinName = 'RoleItemSkin'
        this.addEventListener(egret.TouchEvent.ADDED_TO_STAGE, this.open, this);
        this.addEventListener(egret.TouchEvent.REMOVED_FROM_STAGE, this.close, this);
    }


    public open(...param: any[]): void {
        this.removeEventListener(egret.TouchEvent.ADDED_TO_STAGE, this.open, this)
        this.upView()
    }

    public upView() {
        if (this.mc == null) {
            this.mc = new MovieClip()
            this.addChildAt(this.mc, 0)
            this.mc.anchorOffsetX = 60
            this.mc.anchorOffsetY = 90
        }
    }

    public freshGoldAm(cuerrole: number) {
        this.curRole = cuerrole
        let cfg = HeroModel.ins().heros[cuerrole]
        if (cfg) {
            if (cfg.type == 0) {
                DisplayUtils.removeFromParent(this.goldAd)
                DisplayUtils.removeFromParent(this.goldItem)
                this.goldAd = null
                this.goldItem = null
            }
            else if (cfg.type == 1) {
                DisplayUtils.removeFromParent(this.goldAd)
                this.goldAd = null
                if (!this.goldItem) {
                    this.goldItem = new GoldItem2()
                }
                this.goldItem.x = -50
                this.goldItem.y = -180
                this.addChild(this.goldItem)

                let maxms = 1// 60 * 1000
                let curtime = 1// new Date().getTime() - cfg.time
                curtime = curtime > maxms ? maxms : curtime
                let xn = XDataModel.ins().getXdataBeiSu()
                this.goldItem.data = { xn: xn, maxms: maxms, curtime: curtime, callFun: this.callGold.bind(this) }
            }
            else if (cfg.type == 2 || cfg.type == 4) {
                DisplayUtils.removeFromParent(this.goldItem)
                this.goldItem = null
                if (!this.goldAd) {
                    this.goldAd = new GoldAd()
                }
                this.goldAd.x = -50
                this.goldAd.y = -180
                this.addChild(this.goldAd)
                this.goldAd.data = { xn: cfg.type, callFun: this.callAd.bind(this) }
            }
        }


        // let file = this.mcstr[this.curRole]
        // this.mc.playFile(App.ins().getResRoot() + 'resource/assets/am/' + file[this.curRota - 1], -1)
    }

    callGold() {
        DisplayUtils.removeFromParent(this.goldItem)
        this.goldItem = null
        let home = ViewManager.ins().getView(HomeWin) as HomeWin
        let cfg = HeroModel.ins().heros[this.curRole]
        if (home && cfg) {
            let maxms = 60 * 1000
            let curtime = new Date().getTime() - cfg.time
            curtime = curtime > maxms ? maxms : curtime
            let upcfg = GlobalConfig.getUpgradeByType(UpgradeType.hero).data[UserModel.ins().getUpgradeByType(UpgradeType.hero)]
            let gold = upcfg.profit
            let xn = XDataModel.ins().getXdataBeiSu()
            let tgold = Math.floor(xn * gold /** curtime / maxms*/)
            let poi = this.localToGlobal(-50 + 40, -180 + 40)
            let obj = {
                num: tgold, sx: poi.x, sy: poi.y,
                callFun: this.callGold2.bind(this)
            }
            home.newGoldAm(obj)
        }
    }

    callGold2() {
        HeroModel.ins().finish(this.curRole)
    }

    callAd() {
        let cfg = HeroModel.ins().heros[this.curRole]
        if (cfg) {
            ViewManager.ins().open(WatchAdWin, cfg.type, this.curRole)
        }
    }

    curRota = 0

    upRota(n: number) {
        if (this.curRota == n) {
            return
        }
        this.curRota = n
        let file = this.mcstr[this.curRole]
        this.mc.playFile(App.ins().getResRoot() + 'resource/assets/am/' + file[this.curRota - 1], -1)
        if (this.curRole == 2 && this.curRota == 1) {
            this.mc.anchorOffsetX = 80
        }
        else {
            this.mc.anchorOffsetX = 60
        }
    }


    private clear() {

    }

    public close(...param: any[]): void {
        this.removeEventListener(egret.TouchEvent.REMOVED_FROM_STAGE, this.close, this);
        this.clear()
    }
}
window["RoleItem"] = RoleItem;