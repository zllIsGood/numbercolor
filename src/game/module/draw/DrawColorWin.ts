/*
 * @Author: zhoulanglang 
 * @Date: 2020-06-12 18:00:28 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-08-14 17:53:33
 */

class DrawColorWin extends BaseEuiView {

    private eventGrp: eui.Group
    private clickGrp: eui.Group;
    private imgGrp: eui.Group;
    private bigImg: eui.Image
    private colorList: eui.Group
    private list: eui.List
    private scrol: eui.Scroller
    private mainGrp: eui.Group
    private viewGrp: eui.Group
    private img: eui.Image
    private ret: eui.Image
    private tip: eui.Group
    private tipLab: eui.Label
    private imgAd: eui.Image

    private numGrp: eui.Group

    private curId: string
    private imgobjs: eui.Image[] = []
    private grayImg: string[] = []
    private grayNum = -1
    private blankColor = 0xffffff
    private grayColor = 0xc5c5c5
    private scaleNum = 1
    private listsrc = []
    private isDraw = false

    constructor() {
        super();
        this.skinName = `DrawColorSkin`;
        this.list.itemRenderer = DrawColorItem
    }

    public initUI(): void {
        super.initUI();
    }

    public open(...param: any[]): void {
        this.addTouchEvent(this.ret, this.onClick);
        this.addTouchEvent(this.tip, this.onClick);
        this.addTouchEvent(this.list, this.onList);

        this.list.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.listMove, this)
        EventManger.ins().add(this.eventGrp, this, new EventObj(this, this.onTapRecognized, this.onMove, this.onTap, this.onEnd))

        this.curId = param[0]
        this.finish(false)

        this.upWin()
        App.ins().playBannerAd2(Ad.loadingBanner)
        if (Main.gamePlatform == Main.platformTT) {
            this.ret.y = 150
            this.tip.y = 150
        }
        else {
            this.ret.y = 19
            this.tip.y = 19
        }
    }

    async upWin() {
        let groupName = this.curId + 'Group'
        // await RES.loadGroup(groupName)
        await DrawUtil.loadGroup(groupName)
        TimerManager.ins().doFrame(1, 1, () => {
            this.upView()
            this.upNum()
            this.upTipGrp()
            this.guide()
        }, this)
    }

    private guide() {
        if (this.curId != 'NSSJB') {
            return
        }
        if (GuideUtil.hasArt()) {
            return
        }
        if (this.listsrc[this.grayNum] && this.listsrc[this.grayNum].idata.colorNum == 1) {
            GuideUtil.showDialog(1)
        }
    }

    private onMove(dx: number, dy: number) {
        this.clickGrp.x += dx
        this.clickGrp.y += dy
    }

    private onTap(e: egret.TouchEvent) {
        // console.log(e)
        if (this.isDraw || this.grayNum < 0) {
            return
        }
        let xy = this.clickGrp.globalToLocal(e.stageX, e.stageY)
        this.hit(xy.x, xy.y)
    }

    private onEnd(e: egret.TouchEvent) {
        this.upNum()
    }

    private onTapRecognized(e: GestureEvent, beginXY: number[]): void {
        // console.log('onTapRecognized:', e, beginXY)
        let scaleX = this.clickGrp.scaleX
        let scaleY = this.clickGrp.scaleY
        let sx = this.clickGrp.x
        let sy = this.clickGrp.y
        let point = this.mainGrp.globalToLocal((beginXY[0] + beginXY[2]) / 2, (beginXY[1] + beginXY[3]) / 2)
        let anx = (point.x - sx) / scaleX
        let any = (point.y - sy) / scaleY
        let dScale = Math.ceil(scaleX) * 0.01
        dScale = dScale > 0.3 ? 0.3 : dScale
        if (e.dScale < 1) {
            if (this.clickGrp.scaleX < 0.1) {
                return
            }
            this.clickGrp.scaleX -= dScale
            this.clickGrp.scaleY -= dScale;
        }
        else if (e.dScale > 1) {
            this.clickGrp.scaleX += dScale
            this.clickGrp.scaleY += dScale
        }
        let x = point.x - anx * this.clickGrp.scaleX
        let y = point.y - any * this.clickGrp.scaleY
        this.clickGrp.x = x
        this.clickGrp.y = y
    }

    private upTipGrp() {
        let c = DrawModel.ins().freeTipCount
        if (c > 0) {
            this.tipLab.text = String(c)
            this.imgAd.visible = false
        }
        else {
            this.tipLab.text = ''
            this.imgAd.visible = true
        }
    }

    private upNum() {
        this.numGrp.removeChildren()
        if (this.scaleNum >= this.clickGrp.scaleX || this.isDraw) {
            return
        }
        let paintCfg = GlobalConfig.paintConfig
        let curString = this.curId
        let jsons = GlobalConfig.picConfig.xydata
        let numColors = paintCfg.paintColorGroup[curString] as { colorNum: number, imgs: string[] }[]
        for (let item of numColors) {
            let numstr = item.colorNum + ''
            let len = numstr.length
            for (let src of item.imgs) {
                let imgobj: eui.Image
                for (let img of this.imgobjs) {
                    if (img.source == src) {
                        imgobj = img
                        break;
                    }
                }
                if (imgobj.filters == null) {
                    continue;
                }
                let cfg = jsons[src]
                let lab = new eui.Label()
                lab.size = 26
                lab.text = numstr
                lab.x = cfg.x + cfg.numx - len * 16 / 2
                lab.y = cfg.y + cfg.numy - 13
                lab.textColor = 0x000000
                this.numGrp.addChild(lab)
            }
        }
    }

    private upView() {
        let paintCfg = GlobalConfig.paintConfig
        let curString = this.curId
        let data = paintCfg.paintGroup[curString]
        let jsons = GlobalConfig.picConfig.xydata
        let drawData = DrawModel.ins().getDrawData()[curString]
        if (data) {
            this.imgGrp.removeChildren()
            this.imgobjs.length = 0
            for (let i in data) {
                let src = data[i]
                let json = jsons[src]
                let img = new eui.Image()
                img.source = src
                img.x = json.x
                img.y = json.y

                if (!(drawData.colorPic && drawData.colorPic.indexOf(src) >= 0)) {
                    let colorFlilter = new egret.ColorMatrixFilter(ColorUtil.getMatByColor(this.blankColor))
                    img.filters = [colorFlilter]
                }
                this.imgGrp.addChild(img)
                this.imgobjs.push(img)
            }
        }
        let basedata = paintCfg.base[curString]
        this.bigImg.source = basedata.bigImg
        let w1 = this.mainGrp.width - 30
        let h1 = this.mainGrp.height - 30
        let scale = w1 / h1 > basedata.w / basedata.h ? h1 / basedata.h : w1 / basedata.w
        DisplayUtils.setScale(this.clickGrp, scale)
        this.clickGrp.x = (this.mainGrp.width - basedata.w * scale) / 2
        this.clickGrp.y = (this.mainGrp.height - basedata.h * scale) / 2
        this.scaleNum = scale

        this.setList()
        let index = 0
        this.list.selectedIndex = index
        this.setIndex(index)
        this.listMove()
    }

    private setList() {
        let paintCfg = GlobalConfig.paintConfig
        let curString = this.curId
        let drawData = DrawModel.ins().getDrawData()[curString]

        let arr = paintCfg.paintColorGroup[curString]
        let darr = []
        for (let i in arr) {
            let bool = false
            for (let item of arr[i].imgs) {
                if (drawData.colorPic.indexOf(item) < 0) {
                    bool = true
                }
            }
            if (bool) {
                let obj = { idata: arr[i], paintStr: curString }
                darr.push(obj)
            }
        }
        this.listsrc = darr
        this.list.dataProvider = new eui.ArrayCollection(darr)
        if (this.grayNum > darr.length - 1) {
            this.setIndex(0)
        }
        else {
            this.setIndex(this.grayNum)
        }
        this.listMove()
    }

    private listMove() {
        let index = this.grayNum
        if (index < 0) {
            this.img.visible = false
            return
        }
        this.img.visible = true
        let dx = (77 + 17) * index - this.scrol.viewport.scrollH + 77 / 2
        this.img.x = dx + this.scrol.x
    }

    private onList(e: egret.Event) {
        // console.log(e)
        let index = this.list.selectedIndex
        this.setIndex(index)
        this.listMove()
    }

    private setIndex(index: number) {
        if (index < 0 /*|| index == this.grayNum*/) {
            return
        }
        this.grayNum = index
        this.resetGray()

        let paintCfg = GlobalConfig.paintConfig
        let curString = this.curId
        let arr = paintCfg.paintColorGroup[curString]

        let item = this.list.dataProvider.getItemAt(this.grayNum)
        if (!item) {
            return
        }
        let colorNum = item.idata.colorNum - 1
        let imgs = arr[colorNum].imgs as string[]
        for (let i in imgs) {
            let src = imgs[i]
            this.setImgFilters(src)
        }
    }

    private setImgFilters(src: string) {
        for (let i in this.imgobjs) {
            let img = this.imgobjs[i]
            if (img.source != src) {
                continue
            }
            if (img.filters && this.grayImg.indexOf(src) < 0) {
                let colorFlilter = new egret.ColorMatrixFilter(ColorUtil.getMatByColor(this.grayColor))
                img.filters = [colorFlilter]
                this.grayImg.push(src)
                return
            }
        }
    }

    private resetGray() {
        for (let i in this.imgobjs) {
            let img = this.imgobjs[i]
            if (img.filters && this.grayImg.indexOf(img.source as any) >= 0) {
                let colorFlilter = new egret.ColorMatrixFilter(ColorUtil.getMatByColor(this.blankColor))
                img.filters = [colorFlilter]
            }
        }
        this.grayImg.length = 0
    }

    private removeGray(src) {
        let index = this.grayImg.indexOf(src)
        index >= 0 && this.grayImg.splice(index, 1)
    }

    private isGrayBySource(src) {
        if (this.grayNum < 0) {
            return false
        }
        let paintCfg = GlobalConfig.paintConfig
        let curString = this.curId
        let arr = paintCfg.paintColorGroup[curString]

        let item = this.list.dataProvider.getItemAt(this.grayNum)
        let colorNum = item.idata.colorNum - 1
        let imgs = arr[colorNum].imgs as string[]
        for (let i in imgs) {
            if (src == imgs[i]) {
                return true
            }
        }
        return false
    }

    private hit(touch_x: number, touch_y: number) {
        touch_x = touch_x << 0
        touch_y = touch_y << 0
        let dxy = Math.ceil(1 / this.clickGrp.scaleX)
        for (let i = this.imgobjs.length - 1; i >= 0; i--) {
            let img = this.imgobjs[i]
            if (!this.isGrayBySource(img.source)) {
                continue
            }
            if (img.filters == null) {
                continue
            }
            if (img.x <= touch_x && touch_x < img.x + img.width &&
                img.y <= touch_y && touch_y < img.y + img.height) {
                let dx = touch_x - img.x
                let dy = img.height - (touch_y - img.y)  //Y坐标 webgl颠倒了
                for (let i = 0; i < dxy; i++) {
                    for (let j = 0; j < dxy; j++) {
                        let pixel32 = img.texture.getPixels(dx + i, dy - j)
                        if (pixel32 && pixel32[3] > 255 * 0.5) {
                            img.filters = null
                            this.removeGray(img.source)
                            DrawModel.ins().colorPic(this.curId, img.source)
                            if (this.curId == 'NSSJB') {
                                ViewManager.ins().close(GuideDialog)
                            }
                            this.upNum()
                            this.setList()
                            this.finish()
                            return
                        }
                    }
                }
            }
        }
    }

    private finish(close = true) {
        if (DrawModel.ins().isFinish(this.curId)) {
            DrawModel.ins().finishLock(this.curId)
            this.isDraw = true
            if (close) {
                ViewManager.ins().close(this)
                ViewManager.ins().open(DrawFinishWin, this.curId)
            }
        }
    }

    public close(...param: any[]): void {
        this.imgGrp.removeChildren()
        this.imgobjs = []
        this.grayNum = -1
        EventManger.ins().removeAll(this.eventGrp)
        App.ins().destoryBanner()
    }

    /**点击 */
    private onClick(e: egret.TouchEvent): void {
        switch (e.currentTarget) {
            case this.ret:
                ViewManager.ins().close(this)
                break;
            case this.tip:
                let mod = DrawModel.ins()
                if (mod.freeTipCount > 0) {
                    mod.freeTipCount--
                    this.showTip()
                }
                else {
                    // this.showTip()
                    App.ins().watchAdCall(AwardType.TIP_VIDEO, this.showTip.bind(this))
                }
                break;
        }
    }
    /**提示*/
    private showTip() {
        this.upTipGrp()

        let paintCfg = GlobalConfig.paintConfig
        let curString = this.curId
        let arr = paintCfg.paintColorGroup[curString] as any[]
        let colorPic = DrawModel.ins().getDrawData()[curString].colorPic
        if (this.grayNum < 0) {

        }
        else {
            let item = this.list.dataProvider.getItemAt(this.grayNum)
            if (item == null) {
                return
            }
            let colorNum = item.idata.colorNum - 1
            let imgs = arr[colorNum].imgs as string[]
            let tipImg = null
            for (let i in imgs) {
                if (colorPic.indexOf(imgs[i]) < 0) {
                    tipImg = imgs[i]
                    return this.tipImg(this.grayNum, tipImg)
                }
            }
        }
        let list = this.listsrc
        for (let index = 0; index < list.length; index++) {
            let imgs = list[index].imgs as string[]
            let tipImg = null
            for (let i in imgs) {
                if (colorPic.indexOf(imgs[i]) < 0) {
                    tipImg = imgs[i]
                    return this.tipImg(index, tipImg)
                }
            }
        }
    }

    private tipImg(index, src) {
        console.log('tipImg: ' + src)
        if (index != this.grayNum) {
            this.list.selectedIndex = index
            this.setIndex(index)
            this.listMove()
        }
        let jsons = GlobalConfig.picConfig.xydata
        let cfg = jsons[src]
        for (let img of this.imgobjs) {
            if (img.source == src) {
                let scale = this.clickGrp.scaleX
                let mw = this.mainGrp.width
                let mh = this.mainGrp.height

                let pxnum = 60
                if (img.width * scale > pxnum || img.height * scale > pxnum) {

                }
                else {
                    scale = img.width > img.height ? pxnum / img.width : pxnum / img.height
                    DisplayUtils.setScale(this.clickGrp, scale)
                }
                let w = scale * img.width
                let h = scale * img.height
                // let sx = mw / 2 - w / 2 - scale * img.x
                // let sy = mh / 2 - h / 2 - scale * img.y
                let sx = mw / 2 - scale * (cfg.x + cfg.numx)
                let sy = mh / 2 - scale * (cfg.y + cfg.numy)
                this.clickGrp.x = sx
                this.clickGrp.y = sy
                this.upNum()
                return
            }
        }
    }
}
ViewManager.ins().reg(DrawColorWin, LayerManager.UI_Popup);
window["DrawColorWin"] = DrawColorWin;