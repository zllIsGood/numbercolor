/*
 * @Author: zhoulanglang 
 * @Date: 2020-07-15 10:27:33 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-07-17 20:04:55
 */
class StoryWin1 extends BaseEuiView {

    private bgGrp: eui.Group
    mc: MovieClip
    nextImg: eui.Image
    img1: eui.Image

    callBack: Function
    isFinsh = false
    private dXY = 0
    showIds = [2, 7, 8, 4, 6]

    public constructor() {
        super();
        this.skinName = 'Story1Skin'
    }

    public open(...param: any[]): void {
        this.addTouchEvent(this, this.onClick);

        StageUtils.ins().adaptationIpx2(this.bgGrp)
        this.dXY = this.bgGrp.height - 1334
        this.callBack = param[0]
        this.isFinsh = false
        this.upView()
    }

    private async upView() {
        this.nextImg.visible = false
        await RES.loadGroup('storyGroup')
        ViewManager.ins().close(LoadingUI)

        this.bgGrp.removeChildren()
        this.bgGrp.x = 750
        let data = GlobalConfig.getArtBase(this.showIds)
        for (let i = -1; i < data.length; i++) {
            let grp = new eui.Group()
            grp.x = i * 750
            grp.width = 750
            grp.top = 0
            grp.bottom = 0
            this.bgGrp.addChild(grp)

            let bgimg = new eui.Image()
            bgimg.source = 'mainbg_jpg'
            bgimg.bottom = 0
            bgimg.top = 0
            bgimg.scale9Grid = new egret.Rectangle(93, 1314, 564, 20) // "93,1314,564,20"
            grp.addChild(bgimg)

            let img2 = new eui.Image()
            img2.source = 'qiangdun_png'
            img2.x = 47
            img2.bottom = 137
            grp.addChild(img2)

            if (i == -1) {
                let img3 = new eui.Image()
                img3.source = 'home_door_png'
                img3.y = 490
                img3.horizontalCenter = 0
                grp.addChild(img3)
            }
            else {
                let img3 = new eui.Image()
                img3.source = data[i].homeImg
                img3.horizontalCenter = 0
                img3.y = 400
                grp.addChild(img3)
            }

            if (i == -1) {
                let table = new StoryTable()
                table.x = (750 - 470) / 2
                table.y = 900 - 100 + this.dXY / 2
                grp.addChild(table)
            }
            else {
                let flower = new eui.Image()
                flower.source = 'home_flower_png'
                flower.horizontalCenter = 0
                flower.y = 870 + this.dXY / 2
                grp.addChild(flower)
            }
        }

        if (this.mc == null) {
            this.mc = new MovieClip()
            this.mc.x = 415
            this.mc.y = 40
            this.talkGrp.addChild(this.mc)
        }
        this.img1.x = 1
        this.nextImg.x = this.img1.x + 400
        this.talkLab.x = this.img1.x + 67
        this.img1.source = 'story_frame1_png'
        this.upTalk()
        this.upRole()
    }

    playTw() {
        let tw = egret.Tween.get(this.bgGrp, { loop: false })
        let tox = 750 - this.showIds.length * 750
        let tot = this.showIds.length * 750 * 6
        tw.to({ x: tox }, tot).call(this.finish, this)
    }

    showNext() {
        this.nextImg.visible = true
        egret.Tween.removeTweens(this.nextImg)
        this.nextImg.y = 240
        let tw = egret.Tween.get(this.nextImg, { loop: true })
        tw.to({ y: 260 }, 500).to({ y: 240 }, 500)
    }
    hideNext() {
        this.nextImg.visible = false
        egret.Tween.removeTweens(this.nextImg)
    }

    labText1 = [
        '你好，神秘的旅人，欢迎来到神奇的画展。',
        '我是这里的创始人李辟。',
        '这个神奇的画展拥有着数不尽的宝贝，这里的每一件展品都拥有着时代印记所赋予的神秘力量。',
        '这些展品串联记录了整个华夏文明，是每一个时代最杰出的文化代表。',
        '为了收集这些宝物，我常年穿越于各个历史朝代之间。',
        '仙仙是这里的守护者，接下来就由她带你游览这个神奇的画展吧。',
    ]
    labText2 = [
        '你好，我是神奇画展的守护者仙仙。',
        '很高兴认识你。',
        '我们这就出发吧~',
    ]
    talkGrp: eui.Group
    talkLab: eui.Label
    curTalk = 0
    talkN = 0
    upTalk() {
        this.mc.playFile('story_role1_mc', 1, null, false) //
        this.talkLab.text = this.labText1[this.curTalk]
        if (this.curTalk == 2) {
            this.playTw()
        }
        this.curTalk++
        if (this.curTalk == 2) {
            TimerManager.ins().doTimer(3000, 1, () => {
                this.talkN = 1
                this.showNext()
            }, this)
            return
        }
        if (this.curTalk >= this.labText1.length) {
            TimerManager.ins().doTimer(3000, 1, () => {
                this.curTalk = 0
                this.talkN = 2
                this.showNext()
            }, this)
        }
        else {
            TimerManager.ins().doTimer(3000, 1, this.upTalk, this)
        }
    }
    upTalk2() {
        if (this.curTalk == 0) {
            this.mc.playFile('story_role2_mc', 1, null, false) //
        }
        else if (this.curTalk == 1) {
            this.mc.playFile('story_role3_mc', 1, null, false) //
            this.mc.x = 415
            this.img1.x = 1
            this.nextImg.x = this.img1.x + 400
            this.talkLab.x = this.img1.x + 67
            this.img1.source = 'story_frame1_png'
        }
        else {
            this.mc.playFile('story_role3_mc', 1, null, false) //
        }
        this.talkLab.text = this.labText2[this.curTalk]
        this.curTalk++
        if (this.curTalk >= this.labText2.length) {
            TimerManager.ins().doTimer(3000, 1, this.finish, this)
        }
        else {
            TimerManager.ins().doTimer(3000, 1, this.upTalk2, this)
        }
    }

    roles: StoryRole[] = []
    roleXY
    async upRole() {
        this.roleXY = { x: -200 - 750, y: 900 + 100 + this.dXY / 2 + this.dXY / 4 }
        for (let i = 0; i < 4; i++) {
            let mc = new StoryRole()
            mc.freshGoldAm(i)
            this.bgGrp.addChild(mc)
            this.roles.push(mc)
            this.twRole(i)
            await TimerManager.ins().deleyPromisse(5000)
        }
    }
    private twRole(n) {
        let obj = this.roles[n]
        let houseNum = this.showIds.length
        if (obj) {
            let tx = (houseNum + 1 - 1) * 750
            obj.x = this.roleXY.x
            obj.y = this.roleXY.y
            let bi = 5
            egret.Tween.removeTweens(obj)
            let tw = egret.Tween.get(obj, { loop: false })
            obj.upRota(1)
            let distan = MathUtils.getDistance(2 * 50, 100 + this.dXY / 4, 0, 0) * bi
            let time2 = (tx - 50 - this.roleXY.x) * bi
            tw.to({ x: tx - 50 }, time2).call(obj.upRota, obj, [1])
                .to({ x: tx + 50, y: 900 + this.dXY / 2 }, distan).call(obj.upRota, obj, [2])
                .to({ x: tx - 50, y: 900 - 100 + this.dXY / 2 - this.dXY / 4 }, distan).call(obj.upRota, obj, [2])
                .to({ x: this.roleXY.x, y: 900 - 100 + this.dXY / 2 - this.dXY / 4 }, time2).call(obj.upRota, obj, [2])
                .to({ x: this.roleXY.x - 100, y: 900 + this.dXY / 2 }, distan).call(obj.upRota, obj, [1])
                .to({ x: this.roleXY.x, y: 900 + 100 + this.dXY / 2 + this.dXY / 4 }, distan).call(this.twRole, this, [n])
        }
    }

    finish() {
        this.isFinsh = true
        this.showNext()
    }

    end() {
        // this.callBack && this.callBack()
        ViewManager.ins().open(StoryWin, this.callBack)
        ViewManager.ins().close(this)
    }

    public close(...param: any[]): void {
        TimerManager.ins().removeAll(this)
        this.callBack = null
        DisplayUtils.removeFromParent(this.mc)
        egret.Tween.removeTweens(this.nextImg)
        egret.Tween.removeTweens(this.playTw)
    }

    private onClick(e: egret.TouchEvent): void {
        switch (e.currentTarget) {
            case this:
                if (this.isFinsh) {
                    this.end()
                }
                else {
                    if (this.nextImg.visible) {
                        if (this.talkN == 1) {
                            this.hideNext()
                            this.upTalk()
                        }
                        else if (this.talkN == 2) {
                            this.mc.x = -50
                            this.img1.x = 210
                            this.nextImg.x = this.img1.x + 410
                            this.talkLab.x = this.img1.x + 67
                            this.img1.source = 'story_frame2_png'

                            this.hideNext()
                            this.upTalk2()
                            this.talkN++
                        }
                    }
                }
                break;
        }
    }

}
ViewManager.ins().reg(StoryWin1, LayerManager.UI_Popup);
window["StoryWin1"] = StoryWin1;