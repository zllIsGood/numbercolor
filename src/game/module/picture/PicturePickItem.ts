/*
 * @Author: zhoulanglang 
 * @Date: 2020-06-30 11:34:37 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-08-13 15:38:31
 */
class PicturePickItem extends eui.ItemRenderer {

    lab: eui.Label
    lab2: eui.Label
    lab3: eui.Label
    lab4: eui.Label
    btn: BaseBtn
    img1: eui.Image
    img2: eui.Image
    img3: eui.Image
    img4: eui.Image
    img5: eui.Image
    imgBar: eui.Image

    tgrp: eui.Group
    labG: eui.Label
    labT: eui.Label

    data: { isLast: boolean, picname: string, houseNum: number, isArt: boolean, isFirst: boolean }
    guideItem: GuideItem
    public constructor() {
        super();
        this.skinName = 'PicturePickItemSkin'
        this.addEventListener(egret.TouchEvent.ADDED_TO_STAGE, this.open, this);
        this.addEventListener(egret.TouchEvent.REMOVED_FROM_STAGE, this.close, this);
    }


    public open(...param: any[]): void {
        this.removeEventListener(egret.TouchEvent.ADDED_TO_STAGE, this.open, this)
        this.btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this)
    }

    protected dataChanged() {
        if (this.data.picname == '') {
            this.img5.visible = true
            this.lab4.visible = true
            this.lab.text = '前往创作更多的作品'
            this.btn.icon = 'btn_tocolor_png'
            this.imgBar.source = 'picture_bar2_png'

            this.img3.visible = false
            this.lab3.text = ''
            this.lab2.text = ''
            this.img1.visible = false
            this.img2.visible = false
            this.img4.visible = false
            this.tgrp.visible = false

            this.guideF()
            return
        }
        else {
            this.imgBar.source = 'picture_bar_png'
            this.img5.visible = false
            this.lab4.visible = false
        }

        let cfg = GlobalConfig.paintConfig.base[this.data.picname]
        this.lab.text = cfg.name
        let lv = DrawModel.ins().getDrawLv(this.data.picname)
        this.lab2.text = '等级' + lv

        let isPut = UserModel.ins().isPut(cfg.id)
        this.img4.source = cfg.minImg
        let dy = 0, dx = 0
        if (AuctionModel.isOfById(cfg.id)) {
            dy = 30
            dx = 6
        }
        this.img4.x = 41 + dx
        this.img4.y = -8 + dy
        if (cfg.isArt) {
            this.img3.visible = false
            this.lab3.text = ''
            this.img1.visible = true
            this.img2.visible = false

            this.btn.icon = !isPut ? 'btn_put_png' : 'btn_diaohui_png'
            this.tgrp.visible = true
            let cfg1 = GlobalConfig.config.drawCfg[lv - 1]
            let cfg2 = GlobalConfig.config.art[cfg.id - 1]
            let time = cfg2.timeMin * 60 * 1000
            let gold = cfg1.profit[cfg2.type - 1]
            this.labG.text = StringUtils.NumberToString(gold)
            this.labT.text = StringUtils.timeToString(time)
        }
        else {
            this.img3.visible = true
            this.lab3.text = cfg.add * 100 + '%'
            this.img1.visible = false
            this.img2.visible = true

            this.btn.icon = !isPut ? 'btn_anpai_png' : 'btn_diaohui_png'
            this.tgrp.visible = false
        }

        this.guideF()
    }

    private guideF() {
        /*+++++++guide+++++++*/
        if (!this.data.isFirst) {
            DisplayUtils.removeFromParent(this.guideItem)
            this.guideItem = null
            return
        }
        let guideData = GuideUtil.getPutGuide()
        let guideNeed = (this.data.isArt && guideData.needArtGuide) || (!this.data.isArt && guideData.needHeroGuide)
        if (guideNeed) {
            if (this.guideItem == null) {
                this.guideItem = new GuideItem()
                this.addChild(this.guideItem)
            }
            this.guideItem.x = 440 + 32
            this.guideItem.y = 10 - 8
            this.guideItem.upView(2)
        }
        else {
            DisplayUtils.removeFromParent(this.guideItem)
            this.guideItem = null
        }
        /*------------guide-------*/
    }

    private onClick() {
        if (this.data.picname == '') {
            ViewManager.ins().close(PicturePickWin)
            ViewManager.ins().close(PictureWin)
            if (this.data.isArt) {
                ViewManager.ins().open(DrawWin)
            }
            else {
                ViewManager.ins().open(HeroWin)
            }
            return
        }
        let cfg = GlobalConfig.paintConfig.base[this.data.picname]
        let isPut = UserModel.ins().isPut(cfg.id)
        if (cfg.isArt) {
            if (isPut) {
                UserModel.ins().putReturn(cfg.id)
            }
            else {
                UserModel.ins().setHousePut(this.data.houseNum, cfg.id, null)
            }
        }
        else {
            if (isPut) {
                UserModel.ins().putReturn(cfg.id)
            }
            else {
                UserModel.ins().setHousePut(this.data.houseNum, null, cfg.id)
            }
        }
        ViewManager.ins().close(PicturePickWin)
    }

    public close(...param: any[]): void {
        this.removeEventListener(egret.TouchEvent.REMOVED_FROM_STAGE, this.close, this);
        this.btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this)
    }
}
window["PicturePickItem"] = PicturePickItem;