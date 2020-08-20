/*
 * @Author: zhoulanglang 
 * @Date: 2020-06-04 16:30:09 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-07-03 11:56:06
 */
class DrawItem extends eui.ItemRenderer {

    frameGrp: eui.Group
    imgs: eui.Group
    lab: eui.Label
    title: eui.Label

    data: { type: number, name: string, pic: number[] }
    picId: number[] = []
    guideItem: GuideItem
    public constructor() {
        super();
        this.skinName = 'DrawItemSkin'
        this.addEventListener(egret.TouchEvent.ADDED_TO_STAGE, this.open, this);
        this.addEventListener(egret.TouchEvent.REMOVED_FROM_STAGE, this.close, this);
    }


    public open(...param: any[]): void {
        this.removeEventListener(egret.TouchEvent.ADDED_TO_STAGE, this.open, this)
        this.frameGrp.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this)
    }

    protected dataChanged() {
        let data = this.data
        let num = 0//data.pic.length
        this.picId = []
        for (let id of data.pic) {
            if (GlobalConfig.getBaseName(id)) {
                num++
                this.picId.push(id)
            }
        }

        this.frameGrp.removeChildren()
        for (let i = 0; i < num; i++) {
            let img = new eui.Image()
            img.source = 'bigblue_frame_png'
            this.frameGrp.addChild(img)
        }

        this.imgs.removeChildren()
        let paintCfg = GlobalConfig.paintConfig
        let dw = 194 + 6
        let dh = 208 + 6
        let dn = 4
        let x = 20, y = 0
        let dx = 0, dy = 0
        if (this.data.type == 3) {
            dx = 8
            dy = 25
        }
        for (let i = 0; i < num; i++) {
            let img = new eui.Image()
            let curString = GlobalConfig.getBaseName(this.picId[i])
            if (!curString) {
                continue;
            }

            img.source = paintCfg.base[curString].minImg
            img.x = x + dx
            img.y = y + dy
            x += dw
            if (x > 2 * dw + 20) {
                x = 20
                y += dh
            }
            this.imgs.addChild(img)

            let isDraw = DrawModel.ins().isDraw(curString)
            if (isDraw) {
                img.filters = null
            }
            else {
                let colorFlilter = new egret.ColorMatrixFilter(ColorUtil.getMatGray())
                img.filters = [colorFlilter]
            }
        }

        this.title.text = data.name
        let hasNum = DrawModel.ins().hasPicNumByType(data.type)
        this.lab.text = hasNum + '/' + num

        let guideNeed = this.picId.indexOf(13) >= 0 && !GuideUtil.hasArt()
        if (guideNeed) {
            if (this.guideItem == null) {
                this.guideItem = new GuideItem()
                this.guideItem.x = 150
                this.guideItem.y = 130
                this.addChild(this.guideItem)
            }
            this.guideItem.upView(3)
        }
        else {
            DisplayUtils.removeFromParent(this.guideItem)
            this.guideItem = null
        }
    }

    private onClick(e: egret.TouchEvent) {
        let obj = e.target
        if (!(obj instanceof eui.Image)) {
            return
        }
        let index = this.frameGrp.getChildIndex(obj)
        if (index < 0) {
            return
        }
        let id = this.picId[index]

        let name = GlobalConfig.getBaseName(id)
        if (name) {
            ViewManager.ins().open(PictureInfoWin, id)
        }
    }

    public close(...param: any[]): void {
        this.removeEventListener(egret.TouchEvent.REMOVED_FROM_STAGE, this.close, this);
        this.frameGrp.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this)
    }
}
window["DrawItem"] = DrawItem;