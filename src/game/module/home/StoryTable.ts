/*
 * @Author: zhoulanglang 
 * @Date: 2020-07-15 15:38:46 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-07-15 15:39:57
 */
class StoryTable extends eui.Component {

    tableImg: eui.Image
    mc: MovieClip

    public constructor() {
        super();
        // this.skinName = 'HomeTableSkin'
        this.addEventListener(egret.TouchEvent.ADDED_TO_STAGE, this.open, this);
        this.addEventListener(egret.TouchEvent.REMOVED_FROM_STAGE, this.close, this);
    }


    public open(...param: any[]): void {
        this.removeEventListener(egret.TouchEvent.ADDED_TO_STAGE, this.open, this)
        // this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this)
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

    }


    private onClick(e: egret.TouchEvent) {

    }

    public close(...param: any[]): void {
        this.removeEventListener(egret.TouchEvent.REMOVED_FROM_STAGE, this.close, this);
        // this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this)

    }
}
window["StoryTable"] = StoryTable;