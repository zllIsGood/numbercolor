/* loading界面
 * @Author: zhoualnglang 
 * @Date: 2020-04-09 12:38:22 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-07-17 20:25:58
 */

class LoadingUI extends BaseEuiView {

    // public bg: eui.Image;
    // public loadingBar: eui.Rect;
    // public loadingStatus: eui.Rect;

    private loadingBanner: any;
    private isLoaded = false
    lab: eui.Label
    cimgN = 0

    public constructor() {
        super();
        this.skinName = "LoadingUISkin";
    }

    public open(...param: any[]): void {
        this.observe(UserModel.ins().postUserProto, this.startGame)

        // StageUtils.ins().adaptationIpx(this.bg)
        // this.upView()
        this.playTw()
    }

    private playTw() {
        this.cimgN = 0
        this.twOnChange()
        TimerManager.ins().doTimer(300, 0, this.twOnChange, this)
    }

    twOnChange() {
        let labt = '加载中'
        for (let i = 0; i < this.cimgN; i++) {
            labt += '.'
        }
        this.lab.text = labt
        this.cimgN++
        if (this.cimgN > 6) {
            this.cimgN = 0
        }
    }

    /**开始loading*/
    public static start() {
        let view = ViewManager.ins().getView(LoadingUI) as LoadingUI
        if (view) {
            view.upView()
            App.ins().playBannerAd(Ad.loadingBanner)
        }
    }
    /**设置进度*/
    public static setLoadingState(p: number) {
        // let view = ViewManager.ins().getView(LoadingUI) as LoadingUI
        // if (view) {
        //     view.setLoadingState(p)
        // }
    }

    private async upView() {
        let loading = new MyLoading(this);

        await this.loadCfg()
        // let name = 'preload_main'
        // RES.createGroup(name, ['preload', 'main'])
        // RES.loadGroup(name, 0, loading)
        RES.loadGroup('preload', 0, loading)
    }

    private urls = []
    private remoteNum = 0
    private preNum = 0
    private currentNum
    public next() {
        this.setLoadingState(this.currentNum / (this.preNum + this.remoteNum) * 0.7 + 0.3)
        this.currentNum++
        let source = this.urls.pop()
        if (source) {
            if (RES.hasRes(source)) {
                let data = RES.getRes(source);
                if (data) {
                    this.next()
                }
                else {
                    RES.getResAsync(source, this.next, this);
                }
            }
            else {
                RES.getResByUrl(source, this.next, this, RES.ResourceItem.TYPE_IMAGE);
            }
        }
        else {
            this.isLoaded = true
            if (!App.ins().getShowUserProto()) {
                Main.startGame()
            }
            else {
                this.startGame()
            }
            // Main.startGame()
        }
    }

    private startGame() {
        if (this.isLoaded) {
            let view = ViewManager.ins().isShow(UserProtoWin)
            if (!view) {
                Main.startGame()
            }
        }
    }

    public close(...param: any[]): void {
        App.ins().destoryBanner()
        this.isLoaded = false
        egret.Tween.removeTweens(this)
    }

    public onProgress(current: number, total: number, isLast?: boolean) {

        this.setLoadingState(current / (total + this.remoteNum) * 0.7 + 0.3)
        if (current >= total) {
            console.log('加载完')
            this.preNum = total
            this.currentNum = total
            // 最后一个加载完
            // this.startGame()
            this.next()
        }
    }

    public async loadCfg() {
        // let data = await RES.getResByUrl(Main.res_url + '?' + Math.random(), null, null, RES.ResourceItem.TYPE_JSON) //确保不受缓存的影响
        // await RES.loadConfig("another.res.json", 'https://cdnzmg.zmfamily.cn/artgame/minigame/' + 'resource/');
        await RES.loadConfig("another.res.json" + '?' + Main.version, App.ins().getAnotherResRoot() + 'resource/');
        await RES.loadGroup('home_art_group')
        this.setLoadingState(0.2)
    }

    public setLoadingState(p: number) {
        // this.loadingStatus.width = p * (this.loadingBar.width - 6);
    }

    protected onComplete(): void {

    }

}
ViewManager.ins().reg(LoadingUI, LayerManager.UI_LOADING);
window["LoadingUI"] = LoadingUI;