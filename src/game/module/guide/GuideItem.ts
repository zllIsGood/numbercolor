/*
 * @Author: zhoulanglang 
 * @Date: 2020-07-07 17:22:59 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-07-07 17:35:06
 */
class GuideItem extends eui.Component {

    img: eui.Image

    public constructor() {
        super();
        this.skinName = 'GuideItemSkin'
        this.addEventListener(egret.TouchEvent.ADDED_TO_STAGE, this.open, this);
        this.addEventListener(egret.TouchEvent.REMOVED_FROM_STAGE, this.close, this);
    }


    public open(...param: any[]): void {
        this.removeEventListener(egret.TouchEvent.ADDED_TO_STAGE, this.open, this)
        // this.upView()
    }

    public upView(num: number) {
        egret.Tween.removeTweens(this.img)
        let tw = egret.Tween.get(this.img, { loop: true })
        if (num == 1) {
            this.img.source = 'guide_top_png'
            this.img.y = 20
            this.img.x = 11
            this.img.rotation = 0
            tw.to({ y: 0 }, 400).to({ y: 20 }, 400)
        }
        else if (num == 2) {
            this.img.source = 'guide_bottom_png'
            this.img.y = 0
            this.img.x = 11
            this.img.rotation = 0
            tw.to({ y: 20 }, 400).to({ y: 0 }, 400)
        }
        else if (num == 3) { //left
            this.img.source = 'guide_bottom_png'
            this.img.y = 0
            this.img.x = 112
            this.img.rotation = 90
            tw.to({ x: 92 }, 400).to({ x: 112 }, 400)
        }
        else if (num == 4) {  //right
            this.img.source = 'guide_bottom_png'
            this.img.y = 78
            this.img.x = 0
            this.img.rotation = -90
            tw.to({ x: 20 }, 400).to({ x: 0 }, 400)
        }
    }



    public close(...param: any[]): void {
        this.removeEventListener(egret.TouchEvent.REMOVED_FROM_STAGE, this.close, this);
        egret.Tween.removeTweens(this.img)
    }
}
window["GuideItem"] = GuideItem;