/* 主页
 * @Author: zhoualnglang 
 * @Date: 2020-03-31 10:27:29 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-08-13 16:47:39
 */
class HomeWin extends BaseEuiView {

    private bgGrp: eui.Group
    private curGrp: eui.Group
    private preGrp: eui.Group
    private nestGrp: eui.Group
    private bg: eui.Image
    private bgL: eui.Image
    private bgR: eui.Image
    private upgradeBtn: BaseBtn
    private auctionBtn: BaseBtn
    private pictureBtn: BaseBtn
    private heroBtn: BaseBtn
    private drawBtn: BaseBtn
    private setBtn: BaseBtn

    private bottomGrp: eui.Group
    private topGrp: eui.Group
    private picGrp: eui.Group
    private goldImg: eui.Image
    private goldLab: eui.Label
    private picNumLab: eui.Label
    private ximg: eui.Image
    private leftGrp: eui.Group
    private roleGrp: eui.Group


    private hasMove = false
    private curHouse = -1
    private oldHouse = -1
    private dXY = 0

    constructor() {
        super();
        this.skinName = `HomeSkin`;
    }

    public initUI(): void {
        super.initUI();
    }

    public open(...param: any[]): void {
        this.addTouchEvent(this.upgradeBtn, this.onClick);
        this.addTouchEvent(this.auctionBtn, this.onClick);
        this.addTouchEvent(this.pictureBtn, this.onClick);
        this.addTouchEvent(this.heroBtn, this.onClick);
        this.addTouchEvent(this.drawBtn, this.onClick);
        this.addTouchEvent(this.picGrp, this.onClick);
        this.addTouchEvent(this.ximg, this.onClick);
        this.addTouchEvent(this.setBtn, this.onClick);

        this.bgGrp.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTMove, this)
        this.bgGrp.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onEnd, this)
        this.bgGrp.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onEnd, this)
        this.observe(UserModel.ins().postGold, this.upTop);
        this.observe(UserModel.ins().postPut, this.upMap);
        this.observe(DrawModel.ins().postData, this.upTop);
        this.observe(XDataModel.ins().postData, this.upTop);
        this.observe(XDataModel.ins().postData, this.upgoldItem);
        this.observe(XDataModel.ins().postData, this.upRole);
        this.observe(XDataModel.ins().postData, this.upTable);
        this.observe(TaskModel.ins().postTask, this.upLeft);
        this.observe(HeroModel.ins().postData, this.upRole);

        StageUtils.ins().adaptationIpx2(this.bgGrp)
        this.dXY = this.bgGrp.height - 1334
        this.hasMove = false
        this.curHouse = -1
        this.upView()
        SoundManager.ins().playBg()

        TimerManager.ins().doFrame(1, 0, this.timerLayer, this)
        // GuideUtil.checkHome()
        this.setBtn.visible = Main.gamePlatform == Main.platformApp
    }

    private lastX = null
    private onTMove(e: egret.TouchEvent) {
        if (this.goldAmCount > 0) {
            this.hasMove = true
        }
        if (this.hasMove) {
            return
        }
        if (this.lastX == null) {
            this.lastX = e.stageX
            return
        }
        let dx = e.stageX - this.lastX
        this.lastX = e.stageX
        this.onMove(dx, 0)
    }
    private onMove(dx: number, dy: number) {
        // console.log('onMove.hasMove:' + this.hasMove)
        if (this.goldAmCount > 0) {
            this.hasMove = true
        }
        if (this.hasMove) {
            return
        }
        let oldx = this.curGrp.x
        this.curGrp.x += dx
        this.roleGrp.x = -750 - this.curHouse * 750 + this.curGrp.x
        let width = 750 * 0.3
        if (oldx > -width && this.curGrp.x <= -width) {
            this.hasMove = true
            this.playTw(-1)
        }
        else if (oldx < width && this.curGrp.x >= width) {
            this.hasMove = true
            this.playTw(1)
        }
        else {
            this.preGrp.x = this.curGrp.x - 750
            this.nestGrp.x = this.curGrp.x + 750
        }
    }
    private onEnd(e: egret.TouchEvent) {
        // console.log('onEnd.hasMove:' + this.hasMove)
        if (this.hasMove) {
            this.hasMove = false
            return
        }
        let width = 750 * 0.3
        if (this.curGrp.x > -width && this.curGrp.x < width) {
            this.playTw(0)
        }
        else if (this.curGrp.x <= -width) {
            this.playTw(-1)
        }
        else if (this.curGrp.x >= width) {
            this.playTw(1)
        }
    }
    /**-1左滑  0回原位  1右滑*/
    private playTw(mode = 0) {
        if (!this.hasTwCall) {
            return
        }
        let tx = mode == 0 ? 0 : (mode == -1 ? -750 : 750)
        if (mode == -1 && this.curHouse >= UserModel.ins().houseNum() - 1 + 1) {
            mode = 0
            tx = 0
        }
        if (mode == 1 && this.curHouse == -1) {
            tx = 0
            mode = 0
        }
        this.oldHouse = this.curHouse
        this.curHouse -= mode
        let ms = Math.abs(tx - this.curGrp.x) * 0.5
        let needUp = mode != 0
        egret.Tween.removeTweens(this.curGrp)
        let tw = egret.Tween.get(this.curGrp, { loop: false, onChange: this.twChange, onChangeObj: this })

        this.lastX = null
        this.hasTwCall = false
        tw.to({ x: tx }, ms).call(() => {
            this.hasMove = false
            this.curGrp.x = 0
            this.preGrp.x = this.curGrp.x - 750
            this.nestGrp.x = this.curGrp.x + 750
            this.roleGrp.x = -750 - this.curHouse * 750
            // console.log(this.roleGrp.x, this.curHouse, this.curGrp.x)
            this.hasTwCall = true
            needUp && this.upMap()
        }, this)
    }
    private hasTwCall = true
    private twChange() {
        if (this.hasTwCall) {
            return
        }
        this.preGrp.x = this.curGrp.x - 750
        this.nestGrp.x = this.curGrp.x + 750
        this.roleGrp.x = -750 - this.oldHouse * 750 + this.curGrp.x
        // console.log(this.roleGrp.x, this.oldHouse, this.curGrp.x)
    }

    private upView() {
        this.upMap()
        this.upTop()
        this.upLeft()
        this.upRole()
    }

    private upMap() {
        this.roleGrp.x = -750 - this.curHouse * 750
        let numChildren = this.curGrp.numChildren
        let houseN = UserModel.ins().houseNum()
        if (numChildren > 2) {
            for (let i = numChildren - 1; i > 1; i--) {
                this.curGrp.removeChildAt(i)
            }
        }
        let needFlower = false
        if (this.curHouse == houseN) {
            let img = new eui.Image()
            img.source = 'weikaifang_png'
            img.x = 750 / 2 - 372 / 2
            img.y = 360
            this.curGrp.addChild(img)
            needFlower = true
        }
        else if (this.curHouse == -1) {
            let img = new eui.Image()
            img.source = 'home_door_png'
            img.horizontalCenter = 0
            img.y = 490
            this.curGrp.addChild(img)
        }
        else {
            needFlower = true
        }
        this.clearLis()
        this.upPut()
        if (needFlower) {
            let img = new eui.Image()
            img.source = 'home_flower_png'
            img.horizontalCenter = 0
            img.y = 870 + this.dXY / 2
            this.curGrp.addChild(img)
        }

        let puts = UserModel.ins().getHousePut()

        let numChildren1 = this.preGrp.numChildren
        if (numChildren1 > 2) {
            for (let i = numChildren1 - 1; i > 1; i--) {
                this.preGrp.removeChildAt(i)
            }
        }
        if (this.curHouse == 0) {
            let img = new eui.Image()
            img.source = 'home_door_png'
            img.horizontalCenter = 0
            img.y = 490
            this.preGrp.addChild(img)
        }
        if (this.curHouse > 0) {
            let put = puts[this.curHouse - 1]
            if (put && put.pic != -1) {
                let basename = GlobalConfig.getBaseName(put.pic)
                if (basename) {
                    let base = GlobalConfig.paintConfig.base[basename]
                    let img = new eui.Image()
                    img.source = base.homeImg
                    this.preGrp.addChild(img)

                    let isPic = GlobalConfig.config.draw[1].pic.indexOf(put.pic) >= 0
                    img.horizontalCenter = 0
                    img.y = isPic ? 400 : 400//440

                    let cfg2 = GlobalConfig.config.art[put.pic - 1]
                    let time = cfg2.timeMin * 60 * 1000
                    let xn = XDataModel.ins().getXdataBeiSu()
                    let curtime = new Date().getTime() - put.stime
                    curtime = curtime >= time ? time : curtime
                    let obj = new GoldItem()
                    obj.data = { xn: xn, maxms: time, curtime: curtime, callFun: this.callGold.bind(this) }
                    obj.x = 750 / 2 - 50
                    obj.y = 315
                    this.preGrp.addChild(obj)
                }
            }
            if (put.person != -1) {
                let basename = GlobalConfig.getBaseName(put.person)
                if (basename) {
                    let base = GlobalConfig.paintConfig.base[basename]
                    if (base.mc) {
                        let mc = new MovieClip()
                        this.preGrp.addChild(mc)
                        mc.x = 40
                        mc.y = 650
                        if (base.smc) {
                            this.preMcArr = [base.mc, base.smc]
                            this.preMc = mc
                            this.setPreCurMc()
                        }
                        else {
                            mc.playFile(App.ins().getMCResRoot() + 'resource/mc/' + base.mc, -1)
                        }
                    }
                    else {
                        let img = new eui.Image()
                        img.source = base.homeImg
                        this.preGrp.addChild(img)
                        img.x = 40
                        img.y = 650
                    }
                }
            }
        }
        if (this.curHouse > 0) {
            let img = new eui.Image()
            img.source = 'home_flower_png'
            img.horizontalCenter = 0
            img.y = 870 + this.dXY / 2
            this.preGrp.addChild(img)
        }

        let numChildren2 = this.nestGrp.numChildren
        if (numChildren2 > 2) {
            for (let i = numChildren2 - 1; i > 1; i--) {
                this.nestGrp.removeChildAt(i)
            }
        }
        if (this.curHouse + 1 == houseN) {
            let img = new eui.Image()
            img.source = 'weikaifang_png'
            img.x = 750 / 2 - 372 / 2
            img.y = 360
            this.nestGrp.addChild(img)
        }
        let put = puts[this.curHouse + 1]
        if (put) {
            if (put.pic != -1) {
                let basename = GlobalConfig.getBaseName(put.pic)
                if (basename) {
                    let base = GlobalConfig.paintConfig.base[basename]
                    let img = new eui.Image()
                    img.source = base.homeImg
                    this.nestGrp.addChild(img)

                    let isPic = GlobalConfig.config.draw[1].pic.indexOf(put.pic) >= 0
                    img.horizontalCenter = 0
                    img.y = isPic ? 400 : 400//440

                    let cfg2 = GlobalConfig.config.art[put.pic - 1]
                    let time = cfg2.timeMin * 60 * 1000
                    let xn = XDataModel.ins().getXdataBeiSu()
                    let curtime = new Date().getTime() - put.stime
                    curtime = curtime >= time ? time : curtime
                    let obj = new GoldItem()
                    obj.data = { xn: xn, maxms: time, curtime: curtime, callFun: this.callGold.bind(this) }
                    obj.x = 750 / 2 - 50
                    obj.y = 315
                    this.nestGrp.addChild(obj)
                }
            }
            if (put.person != -1) {
                let basename = GlobalConfig.getBaseName(put.person)
                if (basename) {
                    let base = GlobalConfig.paintConfig.base[basename]
                    if (base.mc) {
                        let mc = new MovieClip()
                        this.nestGrp.addChild(mc)
                        mc.x = 40
                        mc.y = 650
                        if (base.smc) {
                            this.nestMcArr = [base.mc, base.smc]
                            this.nestMc = mc
                            this.setNestMc()
                        }
                        else {
                            mc.playFile(App.ins().getMCResRoot() + 'resource/mc/' + base.mc, -1)
                        }
                    }
                    else {
                        let img = new eui.Image()
                        img.source = base.homeImg
                        this.nestGrp.addChild(img)
                        img.x = 40
                        img.y = 650
                    }
                }
            }
        }
        if (this.curHouse + 1 <= houseN) {
            let img = new eui.Image()
            img.source = 'home_flower_png'
            img.horizontalCenter = 0
            img.y = 870 + this.dXY / 2
            this.nestGrp.addChild(img)
        }

    }

    private upPut() {
        let puts = UserModel.ins().getHousePut()
        let put = puts[this.curHouse]
        if (!put) {
            return
        }
        if (put.pic != -1) {
            let basename = GlobalConfig.getBaseName(put.pic)
            if (basename) {
                let base = GlobalConfig.paintConfig.base[basename]
                let img = new eui.Image()
                img.source = base.homeImg
                this.curGrp.addChild(img)

                let isPic = GlobalConfig.config.draw[1].pic.indexOf(put.pic) >= 0
                img.horizontalCenter = 0
                img.y = isPic ? 400 : 400//440

                this.setLis(img)

                let cfg2 = GlobalConfig.config.art[put.pic - 1]
                let time = cfg2.timeMin * 60 * 1000

                let xn = XDataModel.ins().getXdataBeiSu()
                let curtime = new Date().getTime() - put.stime
                curtime = curtime >= time ? time : curtime
                let obj = new GoldItem()
                obj.data = { xn: xn, maxms: time, curtime: curtime, callFun: this.callGold.bind(this) }
                obj.x = 750 / 2 - 50
                obj.y = 315
                this.curGrp.addChild(obj)
                this.goldItem = obj
            }
        }
        if (put.person != -1) {
            let basename = GlobalConfig.getBaseName(put.person)
            if (basename) {
                let base = GlobalConfig.paintConfig.base[basename]
                if (base.mc) {
                    let mc = new MovieClip()
                    this.curGrp.addChild(mc)
                    mc.x = 40
                    mc.y = 650
                    if (base.smc) {
                        this.curMcArr = [base.mc, base.smc]
                        this.curMc = mc
                        this.setCurMc()
                    }
                    else {
                        mc.playFile(App.ins().getMCResRoot() + 'resource/mc/' + base.mc, -1)
                    }
                }
                else {
                    let img = new eui.Image()
                    img.source = base.homeImg
                    this.curGrp.addChild(img)
                    img.x = 40
                    img.y = 650
                }
            }
        }
    }
    private curMc: MovieClip
    private curMcArr: string[]
    private setCurMc() {
        this.curMc.playFile(App.ins().getMCResRoot() + 'resource/mc/' + this.curMcArr[0], 5, (() => {
            this.curMc.playFile(App.ins().getMCResRoot() + 'resource/mc/' + this.curMcArr[1], 1, this.setCurMc.bind(this), false)
        }).bind(this), false)
    }
    private preMc: MovieClip
    private preMcArr: string[]
    private setPreCurMc() {
        this.preMc.playFile(App.ins().getMCResRoot() + 'resource/mc/' + this.preMcArr[0], 5, (() => {
            this.preMc.playFile(App.ins().getMCResRoot() + 'resource/mc/' + this.preMcArr[1], 1, this.setPreCurMc.bind(this), false)
        }).bind(this), false)
    }
    private nestMc: MovieClip
    private nestMcArr: string[]
    private setNestMc() {
        this.nestMc.playFile(App.ins().getMCResRoot() + 'resource/mc/' + this.nestMcArr[0], 5, (() => {
            this.nestMc.playFile(App.ins().getMCResRoot() + 'resource/mc/' + this.nestMcArr[1], 1, this.setNestMc.bind(this), false)
        }).bind(this), false)
    }

    private openGoldTip() {
        if (this.goldTipItem && this.goldTipItem.parent) {
            DisplayUtils.removeFromParent(this.goldTipItem)
            this.goldTipItem = null
            return
        }
        let puts = UserModel.ins().getHousePut()
        let put = puts[this.curHouse]
        if (put && put.pic != -1) {
            let basename = GlobalConfig.getBaseName(put.pic)
            if (basename) {
                let base = GlobalConfig.paintConfig.base[basename]
                let piclv = DrawModel.ins().getDrawLv(basename)
                let cfg1 = GlobalConfig.config.drawCfg[piclv - 1]
                let cfg2 = GlobalConfig.config.art[put.pic - 1]
                let time = cfg2.timeMin * 60 * 1000
                let gold = cfg1.profit[cfg2.type - 1]

                let xn = XDataModel.ins().getXdataBeiSu()
                let curtime = new Date().getTime() - put.stime
                curtime = curtime >= time ? time : curtime
                let bi = 1
                if (put.person != -1) {
                    let personname = GlobalConfig.getBaseName(put.person)
                    if (personname) {
                        let person = GlobalConfig.paintConfig.base[personname]
                        bi += person.add
                    }
                }
                let tgold = Math.floor(xn * gold * bi)
                let obj = new GoldTipItem()
                obj.data = { xn: xn, maxms: time, curtime: curtime, maxgold: tgold }
                obj.x = 750 / 2 - 100
                obj.y = 350
                this.curGrp.addChild(obj)
                this.goldTipItem = obj
            }
        }
    }
    private goldTipItem: GoldTipItem
    private lisList: eui.Image[] = []
    private setLis(img: eui.Image) {
        img.addEventListener(egret.TouchEvent.TOUCH_TAP, this.openGoldTip, this)
        this.lisList.push(img)
    }
    private clearLis() {
        for (let i in this.lisList) {
            this.lisList[i].removeEventListener(egret.TouchEvent.TOUCH_TAP, this.openGoldTip, this)
        }
        this.lisList = []
    }

    private goldItem: GoldItem
    private callGold() {
        this.goldItem.visible = false
        let puts = UserModel.ins().getHousePut()
        let put = puts[this.curHouse]
        if (put.pic != -1) {
            let basename = GlobalConfig.getBaseName(put.pic)
            if (basename) {
                let piclv = DrawModel.ins().getDrawLv(basename)
                let cfg1 = GlobalConfig.config.drawCfg[piclv - 1]
                let cfg2 = GlobalConfig.config.art[put.pic - 1]
                let time = cfg2.timeMin * 60 * 1000
                let gold = cfg1.profit[cfg2.type - 1]

                let xn = XDataModel.ins().getXdataBeiSu()
                let curtime = new Date().getTime() - put.stime
                curtime = curtime >= time ? time : curtime

                let bi = 1
                if (put.person != -1) {
                    let personname = GlobalConfig.getBaseName(put.person)
                    if (personname) {
                        let person = GlobalConfig.paintConfig.base[personname]
                        bi += person.add
                    }
                }
                let tgold = Math.floor(xn * gold * bi * curtime / time)
                let obj = {
                    num: tgold, sx: 750 / 2, sy: 400,
                    callFun: this.callGold2.bind(this)
                }
                this.newGoldAm(obj)
            }
        }
    }
    private callGold2() {
        this.goldItem.visible = true
        let puts = UserModel.ins().getHousePut()
        let put = puts[this.curHouse]
        if (put.pic != -1) {
            let basename = GlobalConfig.getBaseName(put.pic)
            if (basename) {
                let xn = XDataModel.ins().getXdataBeiSu()
                UserModel.ins().freshPutTime(put.pic)
                this.goldItem.data = { xn: xn, maxms: this.goldItem.data.maxms, curtime: 0, callFun: this.callGold.bind(this) }
            }
        }
    }
    private upgoldItem() {
        if (this.goldItem && this.goldItem.visible && this.goldItem.parent) {
            let xn = XDataModel.ins().getXdataBeiSu()
            this.goldItem.data.xn = xn
            this.goldItem.upView()
        }
    }

    private upTop() {
        let mod = UserModel.ins()
        this.goldLab.text = StringUtils.NumberToString(mod.gold)
        this.picNumLab.text = DrawModel.ins().getHasArt().length.toString()

        let xn = XDataModel.ins().getXdataBeiSu()
        let src = 'bs_w_png'
        xn == 1 && (src = 'bs_w_png')
        xn == 2 && (src = 'bs_2x_png')
        xn == 4 && (src = 'bs_4x_png')
        xn == 6 && (src = 'bs_6x_png')
        xn == 8 && (src = 'bs_8x_png')
        this.ximg.source = src
    }

    private upLeft() {
        let dtask = TaskModel.ins().getNowTask()
        this.leftGrp.removeChildren()
        for (let i in dtask) {
            let obj = new TaskHeadItem()
            obj.data = { taskId: dtask[i].id, bool: Number(i) == 0 }
            this.leftGrp.addChild(obj)
        }
    }

    public newGoldAm(obj: { num: number, sx, sy, callFun?} = null) {
        this.goldAmCount++
        if (obj == null) {
            obj = { num: 999, sx: MathUtils.limitInteger(100, 500), sy: MathUtils.limitInteger(400, 900) }
        }
        let am = new GoldAm()
        am.x = obj.sx
        am.y = obj.sy
        this.addChild(am)
        let data = { num: obj.num, x: this.goldImg.x, y: this.goldImg.y + this.topGrp.y, callFun: obj.callFun }
        am.upView(data)
    }

    private goldAmCount = 0
    public subGoldAmCount() {
        this.goldAmCount = this.goldAmCount <= 0 ? 0 : (this.goldAmCount - 1)
    }

    private table: HomeTable
    private timerLayer() {
        if (!this.table) {
            this.table = new HomeTable()
            this.table.x = (750 - 470) / 2
            this.table.y = 900 - 100 + this.dXY / 2
            this.roleGrp.addChild(this.table)
        }
        let children = this.roleGrp.$children
        if (children.length < 2) {
            return
        }
        let objs = [] as egret.DisplayObject[]

        for (let i = 0; i < children.length; i++) {
            objs.push(children[i])
        }
        for (let i = 0; i < objs.length - 1; i++) {
            for (let j = i + 1; j < objs.length; j++) {
                let y1 = objs[i] instanceof RoleItem ? 900 - 100 + this.dXY / 4 : 800 + this.dXY / 2 - 75
                let y2 = objs[j] instanceof RoleItem ? 900 - 100 + this.dXY / 4 : 800 + this.dXY / 2 - 75
                if (objs[i].y - y1 > objs[j].y - y2) {
                    let temp = objs[i]
                    objs[i] = objs[j]
                    objs[j] = temp
                }
            }
        }
        for (let k = 0; k < objs.length; k++) {
            this.roleGrp.addChildAt(objs[k], k)
        }
    }
    private upTable() {
        if (this.table) {
            this.table.upView()
        }
    }

    private async upRole() {
        if (this.roleItems.length == 0) {
            let obj = new RoleItem()
            this.roleGrp.addChild(obj)
            this.roleItems.push(obj)
            obj.freshGoldAm(0)
            this.startXY(0)
        }
        else {
            this.roleItems[0].freshGoldAm(0)
        }
        if (this.roleItems[1]) {
            this.roleItems[1].freshGoldAm(1)
        }
        else {
            await TimerManager.ins().deleyPromisse(5000)
            let obj = new RoleItem()
            this.roleGrp.addChild(obj)
            this.roleItems.push(obj)
            obj.freshGoldAm(1)
            this.startXY(1)
        }
        if (this.roleItems[2]) {
            this.roleItems[2].freshGoldAm(2)
        }
        else {
            await TimerManager.ins().deleyPromisse(5000 * 2)
            let obj = new RoleItem()
            this.roleGrp.addChild(obj)
            this.roleItems.push(obj)
            obj.freshGoldAm(2)
            this.startXY(2)
        }
        if (this.roleItems[3]) {
            this.roleItems[3].freshGoldAm(3)
        }
        else {
            await TimerManager.ins().deleyPromisse(5000 * 3)
            let obj = new RoleItem()
            this.roleGrp.addChild(obj)
            this.roleItems.push(obj)
            obj.freshGoldAm(3)
            this.startXY(3)
        }
    }
    private roleItems: RoleItem[] = []
    private roleXYs = []
    private startXY(n) {
        if (!this.roleXYs[n]) {
            this.roleXYs[n] = { x: -200, y: 900 + 100 + this.dXY / 2 + this.dXY / 4 }

            let obj = this.roleItems[n]
            if (obj) {
                this.twRole(n)
            }
        }
    }
    private twstarttime0 = 0
    private twstarttime1 = 0
    private twstarttime2 = 0
    twRole1() {
        this.twRole(1)
    }
    twRole2() {
        this.twRole(2)
    }
    twRole3() {
        this.twRole(3)
    }

    private twRole(n) {
        if (n == 0) {
            this.twstarttime0 = new Date().getTime()
        }
        else /*if (n == 1)*/ {
            let curtime = new Date().getTime()
            let dt: number
            if (n == 1) {
                dt = curtime - this.twstarttime0
                if (dt < 5000) {
                    TimerManager.ins().doTimer(dt, 1, this.twRole1, this)
                    return
                }
                this.twstarttime1 = curtime
            }
            if (n == 2) {
                dt = curtime - this.twstarttime1
                if (curtime - this.twstarttime0 < 5000 * 2) { //错开
                    TimerManager.ins().doTimer(1000, 1, this.twRole2, this)
                    return
                }
                if (dt < 5000) {
                    TimerManager.ins().doTimer(dt, 1, this.twRole2, this)
                    return
                }
                this.twstarttime2 = curtime
            }
            if (n == 3) {
                dt = curtime - this.twstarttime2
                if (curtime - this.twstarttime0 < 5000 * 3) { //错开
                    TimerManager.ins().doTimer(1000, 1, this.twRole3, this)
                    return
                }
                if (dt < 5000) {
                    TimerManager.ins().doTimer(dt, 1, this.twRole3, this)
                    return
                }
            }
        }
        let obj = this.roleItems[n]
        let houseNum = UserModel.ins().houseNum()
        if (obj) {
            let tx = (houseNum + 1 + 1) * 750
            obj.x = this.roleXYs[n].x
            obj.y = this.roleXYs[n].y
            let bi = 5
            egret.Tween.removeTweens(obj)
            let tw = egret.Tween.get(obj, { loop: false })
            obj.upRota(1)
            let distan = MathUtils.getDistance(2 * 50, 100 + this.dXY / 4, 0, 0) * bi
            let time2 = (tx - 50 - this.roleXYs[n].x) * bi
            tw.to({ x: tx - 50 }, time2).call(obj.upRota, obj, [1])
                .to({ x: tx + 50, y: 900 + this.dXY / 2 }, distan).call(obj.upRota, obj, [2])
                .to({ x: tx - 50, y: 900 - 100 + this.dXY / 2 - this.dXY / 4 }, distan).call(obj.upRota, obj, [2])
                .to({ x: this.roleXYs[n].x, y: 900 - 100 + this.dXY / 2 - this.dXY / 4 }, time2).call(obj.upRota, obj, [2])
                .to({ x: this.roleXYs[n].x - 100, y: 900 + this.dXY / 2 }, distan).call(obj.upRota, obj, [1])
                .to({ x: this.roleXYs[n].x, y: 900 + 100 + this.dXY / 2 + this.dXY / 4 }, distan).call(this.twRole, this, [n])
        }
    }

    private guideItem: GuideItem
    public guide(type: number) {
        if (type == 4) {
            DisplayUtils.removeFromParent(this.guideItem)
            this.guideItem = null
            return
        }
        if (this.guideItem == null) {
            this.guideItem = new GuideItem()
            this.bottomGrp.addChild(this.guideItem)
            this.guideItem.y = -100
            this.guideItem.upView(2)
        }
        if (type == 1) {
            this.guideItem.x = 600//600
        }
        else if (type == 2) {
            this.guideItem.x = 460//415
        }
        else if (type == 3) {
            this.guideItem.x = 330//230
        }
    }

    public close(...param: any[]): void {
        egret.Tween.removeTweens(this.curGrp)
        TimerManager.ins().remove(this.timerLayer, this)
    }


    private onClick(e: egret.TouchEvent): void {
        switch (e.currentTarget) {
            case this.upgradeBtn:
                ViewManager.ins().open(UpgradeWin)
                break;
            case this.auctionBtn:
                ViewManager.ins().open(AuctionEntranceWin)
                break;
            case this.pictureBtn:
                ViewManager.ins().open(PictureWin)
                break;
            case this.heroBtn:
                ViewManager.ins().open(HeroWin)
                break;
            case this.drawBtn:
                ViewManager.ins().open(DrawWin)
                break;
            case this.picGrp:
                // UserModel.ins().addGold(10000000)
                break;
            case this.ximg:
                ViewManager.ins().open(GoldXWin)
                break;
            case this.setBtn:
                if (Main.gamePlatform == Main.platformApp) {
                    ViewManager.ins().open(SetWin)
                }
                break;
        }
    }

}
ViewManager.ins().reg(HomeWin, LayerManager.UI_Main);
window["HomeWin"] = HomeWin;