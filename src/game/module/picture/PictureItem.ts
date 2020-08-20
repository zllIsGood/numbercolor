/*
 * @Author: zhoulanglang 
 * @Date: 2020-06-04 16:30:09 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-08-13 15:44:47
 */
class PictureItem extends eui.ItemRenderer {

    lab: eui.Label
    lab2: eui.Label
    lab3: eui.Label
    btn: BaseBtn
    img1: eui.Image
    img2: eui.Image
    img3: eui.Image
    labG: eui.Label
    labT: eui.Label

    data: { isLast: boolean, housePut: { pic: number, person: number }, houseNum: number, isFirst: boolean }
    guideItem: GuideItem
    public constructor() {
        super();
        this.skinName = 'PictureItemSkin'
        this.addEventListener(egret.TouchEvent.ADDED_TO_STAGE, this.open, this);
        this.addEventListener(egret.TouchEvent.REMOVED_FROM_STAGE, this.close, this);
    }


    public open(...param: any[]): void {
        this.removeEventListener(egret.TouchEvent.ADDED_TO_STAGE, this.open, this)
        this.btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this)
        this.img1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onPic, this)
        this.img2.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onPerson, this)
    }

    protected dataChanged() {
        let put = this.data.housePut
        let bi = 1
        if (put.person == -1) {
            this.img3.visible = false
            this.lab3.text = ''
            this.img2.source = 'add_frame_png'
            DisplayUtils.setScale(this.img2, 0.6)
            this.img2.x = 209 + 26
            this.img2.y = 114 - 7
        }
        else {
            this.img3.visible = true
            let curname = GlobalConfig.getBaseName(put.person)
            let cfg = GlobalConfig.paintConfig.base[curname]
            this.lab3.text = cfg.add * 100 + '%'
            this.img2.source = cfg.minImg
            DisplayUtils.setScale(this.img2, 0.6)
            this.img2.x = 175 + 26
            this.img2.y = 78 - 7

            bi += cfg.add
        }
        if (put.pic == -1) {
            this.lab.text = '场地空置中'
            this.lab2.text = ''
            this.btn.label = ''
            this.btn.visible = false
            this.img1.source = 'add_frame_png'
            DisplayUtils.setScale(this.img1, 1)
            this.img1.x = 62 + 26
            this.img1.y = 70 - 7

            this.labG.text = '---'
            this.labT.text = '---'
        }
        else {
            let dy = 0, dx = 0
            if (AuctionModel.isOfById(put.pic)) {
                dy = 25
                dx = 11
            }
            let picname = GlobalConfig.getBaseName(put.pic)
            let cfg = GlobalConfig.paintConfig.base[picname]
            this.lab.text = cfg.name
            let lv = DrawModel.ins().getDrawLv(picname)
            this.lab2.text = '等级' + lv
            this.img1.source = cfg.minImg
            DisplayUtils.setScale(this.img1, 0.8)
            this.img1.x = 23 + 26 + dx
            this.img1.y = 27 - 7 + dy

            let isMaxLv = !GlobalConfig.config.drawCfg[lv]
            if (isMaxLv) {
                this.btn.label = ''
                this.btn.visible = false
            }
            else {
                let cost = GlobalConfig.config.drawCfg[lv].cost
                this.btn.label = StringUtils.NumberToString(cost)
                this.btn.visible = true
            }

            let cfg1 = GlobalConfig.config.drawCfg[lv - 1]
            let cfg2 = GlobalConfig.config.art[put.pic - 1]
            let time = cfg2.timeMin * 60 * 1000
            let gold = cfg1.profit[cfg2.type - 1]
            this.labG.text = StringUtils.NumberToString(gold * bi)
            this.labT.text = StringUtils.timeToString(time)
        }
        /*+++++++guide+++++++*/
        if (!this.data.isFirst) {
            DisplayUtils.removeFromParent(this.guideItem)
            this.guideItem = null
            return
        }
        let guideData = GuideUtil.getPutGuide()
        if (guideData.needArtGuide) {
            if (this.guideItem == null) {
                this.guideItem = new GuideItem()
                this.addChild(this.guideItem)
            }
            this.guideItem.x = 120 + 26
            this.guideItem.y = 56 - 7
            this.guideItem.upView(3)
        }
        else if (guideData.needHeroGuide) {
            if (this.guideItem == null) {
                this.guideItem = new GuideItem()
                this.addChild(this.guideItem)
            }
            this.guideItem.x = 240 + 26
            this.guideItem.y = 90 - 7
            this.guideItem.upView(3)
        }
        else {
            DisplayUtils.removeFromParent(this.guideItem)
            this.guideItem = null
        }
        /*------------guide-------*/
    }

    private onPic() {
        ViewManager.ins().open(PicturePickWin, true, this.data.houseNum)
    }

    private onPerson() {
        ViewManager.ins().open(PicturePickWin, false, this.data.houseNum)
    }

    private onClick() {
        let put = this.data.housePut
        if (put.pic == -1) {
            return
        }
        let picname = GlobalConfig.getBaseName(put.pic)
        let bool = DrawModel.ins().upgradeArt(picname)
        bool && this.dataChanged()
    }

    public close(...param: any[]): void {
        this.removeEventListener(egret.TouchEvent.REMOVED_FROM_STAGE, this.close, this);
        this.btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this)
        this.img1.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onPic, this)
        this.img2.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onPerson, this)
    }
}
window["PictureItem"] = PictureItem;