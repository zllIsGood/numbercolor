/*
 * @Author: zhoulanglang 
 * @Date: 2020-07-07 17:38:06 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-07-17 20:45:18
 */
class GuideUtil {
    public static labs = [
        '让我们一起来为失去颜色的画作恢复他们的颜色吧\n点击下方箭头跟我一起来恢复',  //0 home1  
        '点击上方的灰色部分 为1号颜色进行上色', //1
        '让我们再为画作的守护者完成一次上色吧\n点击下方箭头进入守护者页面',  //2  home2
        '让我们把展品和守护者配置上去吧\n点击下方箭头进入配置页面',  //3  home3
        '跟着箭头的点击 首先让我们摆放上我们的作品', //4
        '跟着箭头点击 然后让我们摆放上我们的守护者', //5
        '点击关闭按钮 让我们一起浏览一下我们的画作',  //6 引导用户向着左边滑动
        '这就是我们刚展出的作品，通过展出作品可以获得金币，金币可以换取更多的作品哦\n让我们一起努力恢复有色彩的世界吧', //7
    ]
    /*
第三段引导内容
小仙
让我们一起来为失去颜色的画作恢复他们的颜色吧
点击下方箭头跟我一起来恢复

进入到填色页面后
小仙
点击上方的灰色部分 为1号颜色进行上色

小仙
让我们再为画作的守护者完成一次上色吧
点击下方箭头进入守护者页面

小仙
让我们把展品和守护者配置上去吧
点击下方箭头进入配置页面

小仙
跟着箭头的点击 首先让我们摆放上我们的作品

跟着箭头点击 然后让我们摆放上我们的守护者

小仙
点击关闭按钮 让我们一起浏览一下我们的画作

引导用户向着左边滑动

小仙
这就是我们刚展出的作品，通过展出作品可以获得金币，金币可以换取更多的作品哦
让我们一起努力恢复有色彩的世界吧
*/
    public static checkHome() {
        let home = ViewManager.ins().getView(HomeWin) as HomeWin
        if (!home) {
            return
        }
        let vn = ViewManager.ins().getViewNum()
        let dialog = ViewManager.ins().getView(GuideDialog) as GuideDialog
        let nview = ViewManager.ins().getView(NavigationWin) as NavigationWin
        dialog && vn--
        nview && vn--
        if (vn > 1) {
            home.guide(4)
            this.hideDialog()
            return
        }
        let hasArt = this.hasArt()
        if (!hasArt) {
            home.guide(1)
            this.showDialog(0)
            return
        }
        let hasHero = this.hasHero()
        if (!hasHero) {
            home.guide(2)
            this.showDialog(2)
            return
        }
        let putGuide = this.getPutGuide()
        if (putGuide.needArtGuide || putGuide.needHeroGuide) {
            home.guide(3)
            this.showDialog(3)
        }
        else {
            home.guide(4)
            this.hideDialog()
        }
    }

    private static showN: number = -1
    public static showDialog(n: number) {
        this.showN = n
        ViewManager.ins().open(GuideDialog, n)
    }
    public static hideDialog() {
        let arr = [0, 2, 3]
        if (arr.indexOf(this.showN) >= 0) {
            this.showN = -1
            ViewManager.ins().close(GuideDialog)
        }
    }

    public static hasArt() {
        let arr = DrawModel.ins().getHasArt()
        return arr.length > 0
    }

    public static hasHero() {
        let arr = DrawModel.ins().getHasNotArt()
        return arr.length > 0
    }

    public static getPutGuide() {
        let putGuide = this.getData()
        let arr = UserModel.ins().getHousePut()
        let pic = 0
        let person = 0
        for (let i in arr) {
            if (arr[i].pic != -1) {
                pic++
            }
            if (arr[i].person != -1) {
                person++
            }
        }
        let guideNeed1 = pic == 0 && GuideUtil.hasArt()
        let guideNeed2 = person == 0 && GuideUtil.hasHero()
        return { needArtGuide: !putGuide[0] && guideNeed1, needHeroGuide: !putGuide[1] && guideNeed2 }
    }

    private static data: boolean[] = null
    private static getData(): boolean[] {
        if (this.data == null) {
            let s = CacheUtil.get(Constant.GUIDE_DATA)
            if (s && s != '') {
                let obj = JSON.parse(s)
                this.data = obj
            }
            else {
                this.data = [false, false]
                CacheUtil.set(Constant.GUIDE_DATA, JSON.stringify(this.data))
            }
        }
        return this.data
    }

    public static checkPutGuide() {
        let putGuide = this.getData()

        let arr = UserModel.ins().getHousePut()
        let pic = 0
        let person = 0
        for (let i in arr) {
            if (arr[i].pic != -1) {
                pic++
            }
            if (arr[i].person != -1) {
                person++
            }
        }

        let needCache = false
        if (!putGuide[0] && pic > 0) {
            putGuide[0] = true
            needCache = true
        }
        if (!putGuide[1] && person > 0) {
            putGuide[1] = true
            needCache = true
        }
        needCache && CacheUtil.set(Constant.GUIDE_DATA, JSON.stringify(putGuide))
    }
}
window["GuideUtil"] = GuideUtil;