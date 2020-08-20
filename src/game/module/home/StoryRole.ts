/*
 * @Author: zhoulanglang 
 * @Date: 2020-07-15 17:48:47 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-07-15 17:49:44
 */
class StoryRole extends eui.Component {

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
            this.addChild(this.mc)
            this.mc.anchorOffsetX = 60
            this.mc.anchorOffsetY = 90
        }
    }

    public freshGoldAm(cuerrole: number) {
        this.curRole = cuerrole
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
window["StoryRole"] = StoryRole;