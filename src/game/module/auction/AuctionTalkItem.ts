/*
 * @Author: zhoulanglang 
 * @Date: 2020-08-13 10:38:49 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-08-13 11:04:26
 */
class AuctionTalkItem extends eui.Component {

    headImg: eui.Image
    dialogGrp: eui.Group

    data: number
    public constructor() {
        super();
        this.skinName = 'AuctionTalkItemSkin'
        this.addEventListener(egret.TouchEvent.ADDED_TO_STAGE, this.open, this);
        this.addEventListener(egret.TouchEvent.REMOVED_FROM_STAGE, this.close, this);
        this.anchorOffsetX = 61
        this.anchorOffsetY = 66
        this.headImg.visible = false
        this.dialogGrp.visible = false
    }


    public open(...param: any[]): void {
        this.removeEventListener(egret.TouchEvent.ADDED_TO_STAGE, this.open, this)
    }

    public upView(data: number) {
        this.data = data
        if (this.data == 0) {
            this.dialogGrp.visible = true
        }
        else if (this.data == 1) {
            this.headImg.visible = true
            this.headImg.source = 'auction_head1_png'
        }
        else if (this.data == 2) {
            this.headImg.visible = true
            this.headImg.source = 'auction_head2_png'
        }
        this.scaleX = 0
        this.scaleY = 0
        let tw = egret.Tween.get(this, { loop: true })
        tw.to({ scaleX: 1, scaleY: 1, }, 300).wait(500)
            .to({ scaleX: 0, scaleY: 0, }, 300)
            .call(this.finish.bind(this))
    }


    private finish() {
        DisplayUtils.removeFromParent(this)
    }

    public close(...param: any[]): void {
        this.removeEventListener(egret.TouchEvent.REMOVED_FROM_STAGE, this.close, this);
        egret.Tween.removeTweens(this)
    }
}