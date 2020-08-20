/*
 * @Author: zhoulanglang 
 * @Date: 2020-06-04 16:30:09 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-07-03 11:55:21
 */
class HeroItem extends eui.ItemRenderer {

    frameGrp: eui.Group
    starGrp: eui.Group
    lab: eui.Label
    headGrp: eui.Group

    data: { star: number, heroId: number[], type: number }
    public constructor() {
        super();
        this.skinName = 'HeroItemSkin'
        this.addEventListener(egret.TouchEvent.ADDED_TO_STAGE, this.open, this);
        this.addEventListener(egret.TouchEvent.REMOVED_FROM_STAGE, this.close, this);
    }


    public open(...param: any[]): void {
        this.removeEventListener(egret.TouchEvent.ADDED_TO_STAGE, this.open, this)
        this.frameGrp.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this)
    }

    protected dataChanged() {
        let data = this.data
        let star = data.star
        let num = data.heroId.length

        this.starGrp.removeChildren()
        for (let i = 0; i < star; i++) {
            let img = new eui.Image()
            img.source = 'star_png'
            this.starGrp.addChild(img)
        }

        this.frameGrp.removeChildren()
        for (let i = 0; i < num; i++) {
            let img = new eui.Image()
            img.source = 'gray_frame2_png'
            this.frameGrp.addChild(img)
        }

        let hasNum = DrawModel.ins().hasHeroNumByStar(this.data.star)
        this.lab.text = hasNum + '/' + num

        this.headGrp.removeChildren()
        let w = 145, h = 130, gap = 6, x = 0, y = -20, maxx = 504;
        let paintCfg = GlobalConfig.paintConfig
        for (let i = 0; i < num; i++) {
            let img = new eui.Image()
            let curString = GlobalConfig.getBaseName(this.data.heroId[i])
            if (!curString) {
                continue;
            }
            img.source = paintCfg.base[curString].minImg
            img.x = x
            img.y = y
            this.headGrp.addChild(img)
            DisplayUtils.setScale(img, 0.8)

            x += w + gap
            if (x >= maxx) {
                x = 0
                y += h + gap
            }

            let isDraw = DrawModel.ins().isDraw(curString)
            if (isDraw) {
                img.filters = null
            }
            else {
                let colorFlilter = new egret.ColorMatrixFilter(ColorUtil.getMatGray())
                img.filters = [colorFlilter]
            }
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
        let id = this.data.heroId[index]
        let name = GlobalConfig.getBaseName(id)
        name && ViewManager.ins().open(HeroInfoWin, id)
    }

    public close(...param: any[]): void {
        this.removeEventListener(egret.TouchEvent.REMOVED_FROM_STAGE, this.close, this);
        this.frameGrp.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this)
    }
}
window["HeroItem"] = HeroItem;