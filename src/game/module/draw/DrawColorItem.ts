/*
 * @Author: zhoulanglang 
 * @Date: 2020-06-15 14:25:18 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-07-09 14:53:40
 */
class DrawColorItem extends eui.ItemRenderer {

    img: eui.Image
    lab: eui.Label

    data: { idata: { colorNum: number, imgs: string[], color: string }, curString: string }
    public constructor() {
        super();
        this.skinName = 'DrawColorItemSkin'
        this.addEventListener(egret.TouchEvent.ADDED_TO_STAGE, this.open, this);
        this.addEventListener(egret.TouchEvent.REMOVED_FROM_STAGE, this.close, this);
    }


    public open(...param: any[]): void {
        this.removeEventListener(egret.TouchEvent.ADDED_TO_STAGE, this.open, this)
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this)
    }

    protected dataChanged() {
        if (this.data == null || this.data.idata == null) {
            return
        }
        let idata = this.data.idata
        let color = Number(idata.color)

        this.lab.text = idata.colorNum + ''
        let colorFlilter = new egret.ColorMatrixFilter(ColorUtil.getMatByColor(color))
        this.img.filters = [colorFlilter]
    }

    private onClick() {

    }

    public close(...param: any[]): void {
        this.removeEventListener(egret.TouchEvent.REMOVED_FROM_STAGE, this.close, this);
        this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this)
    }
}
window["DrawColorItem"] = DrawColorItem;