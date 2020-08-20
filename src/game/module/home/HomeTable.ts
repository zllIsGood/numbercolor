/*
 * @Author: zhoulanglang 
 * @Date: 2020-07-06 18:24:29 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-07-06 20:53:50
 */
class HomeTable extends eui.Component {

    tableImg: eui.Image
    mc: MovieClip
    tipItem: GoldTipItem
    goldItem: GoldItem
    goldXy = { x: 200, y: -116 }

    public constructor() {
        super();
        // this.skinName = 'HomeTableSkin'
        this.addEventListener(egret.TouchEvent.ADDED_TO_STAGE, this.open, this);
        this.addEventListener(egret.TouchEvent.REMOVED_FROM_STAGE, this.close, this);
    }


    public open(...param: any[]): void {
        this.removeEventListener(egret.TouchEvent.ADDED_TO_STAGE, this.open, this)
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this)
        this.upView()
    }

    public upView() {
        if (!this.mc) {
            this.mc = new MovieClip()
            this.mc.x = 200
            this.mc.y = -20
            this.addChild(this.mc)
            this.mc.playFile(App.ins().getResRoot() + 'resource/assets/am/' + 'rolemc_xx', -1)
        }
        if (!this.tableImg) {
            this.tableImg = new eui.Image()
            this.tableImg.source = 'home_table_png'
            this.addChild(this.tableImg)
        }
        if (!this.goldItem) {
            this.goldItem = new GoldItem()
            this.goldItem.x = this.goldXy.x
            this.goldItem.y = this.goldXy.y
            this.addChild(this.goldItem)

            let maxms = 24 * 3600 * 1000
            let curtime = UserModel.ins().getTableHasTime()
            curtime = curtime > maxms ? maxms : curtime
            let xn = XDataModel.ins().getXdataBeiSu()
            this.goldItem.data = { xn: xn, maxms: maxms, curtime: curtime, callFun: this.callGold.bind(this) }
        }
        else {
            let maxms = 24 * 3600 * 1000
            let curtime = UserModel.ins().getTableHasTime()
            curtime = curtime > maxms ? maxms : curtime
            let xn = XDataModel.ins().getXdataBeiSu()
            this.goldItem.data = { xn: xn, maxms: maxms, curtime: curtime, callFun: this.callGold.bind(this) }
        }

    }

    callGold() {
        DisplayUtils.removeFromParent(this.goldItem)
        this.goldItem = null
        let home = ViewManager.ins().getView(HomeWin) as HomeWin
        if (home) {
            let maxms = 24 * 3600 * 1000
            let tCfg = UserModel.ins().getTableCfg()
            let curtime = UserModel.ins().getTableHasTime()
            curtime = curtime > maxms ? maxms : curtime
            let xn = XDataModel.ins().getXdataBeiSu()
            let gold = tCfg.profit
            let tgold = Math.floor(xn * gold * curtime / maxms)
            let poi = this.localToGlobal(this.goldXy.x + 40, this.goldXy.y + 40)
            let obj = {
                num: tgold, sx: poi.x, sy: poi.y,
                callFun: this.callGold2.bind(this)
            }
            home.newGoldAm(obj)
        }
    }

    callGold2() {
        UserModel.ins().awardTable()
        this.upView()
    }

    private onClick(e: egret.TouchEvent) {
        if (this.tableImg != e.target) {
            return
        }
        if (this.tipItem && this.tipItem.parent) {
            DisplayUtils.removeFromParent(this.tipItem)
            this.tipItem = null
            return
        }

        this.tipItem = new GoldTipItem()
        this.tipItem.x = 150
        this.tipItem.y = -140
        this.addChild(this.tipItem)
        let upcfg = GlobalConfig.getUpgradeByType(UpgradeType.cost).data[UserModel.ins().getUpgradeByType(UpgradeType.cost)]

        let maxms = 24 * 3600 * 1000
        let xn = XDataModel.ins().getXdataBeiSu()
        let curtime = UserModel.ins().getTableHasTime()
        this.tipItem.data = { xn: xn, maxms: maxms, maxgold: upcfg.profit, curtime: curtime }

        TimerManager.ins().doTimer(5000, 1, this.clear, this)
    }

    private clear() {
        DisplayUtils.removeFromParent(this.tipItem)
        this.tipItem = null
    }

    public close(...param: any[]): void {
        this.removeEventListener(egret.TouchEvent.REMOVED_FROM_STAGE, this.close, this);
        this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this)

        TimerManager.ins().remove(this.clear, this)
    }
}
window["HomeTable"] = HomeTable;