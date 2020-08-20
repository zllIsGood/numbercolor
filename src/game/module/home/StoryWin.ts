/*
 * @Author: zhoulanglang 
 * @Date: 2020-07-14 11:14:29 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-07-17 21:02:49
 */
class StoryWin extends BaseEuiView {

    private img: eui.Image
    private arr1 = ["story2_00_png", "story2_01_png", "story2_03_png", 'story2_04_png', 'story2_06_png', 'story2_07_png', 'story2_09_png', 'story2_10_png', 'story2_12_png', 'story2_13_png', 'story2_15_png', 'story2_16_png', 'story2_18_png', 'story2_19_png', 'story2_21_png', 'story2_22_png', 'story2_24_png', 'story2_25_png', 'story2_27_png', 'story2_28_png', 'story2_30_png', 'story2_31_png', 'story2_33_png', 'story2_34_png',]
    private arr2 = ['story3_00_png', 'story3_02_png', 'story3_03_png', 'story3_05_png', 'story3_06_png', 'story3_08_png', 'story3_09_png', 'story3_11_png', 'story3_12_png', 'story3_14_png', 'story3_15_png', 'story3_17_png', 'story3_18_png', 'story3_20_png', 'story3_21_png', 'story3_23_png', 'story3_24_png', 'story3_26_png', 'story3_27_png', 'story3_29_png', 'story3_30_png', 'story3_32_png', 'story3_33_png', 'story3_35_png', 'story3_36_png', 'story3_38_png', 'story3_39_png', 'story3_41_png', 'story3_42_png', 'story3_44_png', 'story3_45_png', 'story3_47_png', 'story3_48_png']
    private arr3 = [
        'story4_00_png', 'story4_01_png', 'story4_02_png', 'story4_03_png', 'story4_04_png', 'story4_05_png', 'story4_06_png', 'story4_07_png', 'story4_08_png', 'story4_09_png', 'story4_10_png', 'story4_11_png', 'story4_12_png', 'story4_13_png', 'story4_14_png', 'story4_15_png', 'story4_16_png', 'story4_17_png', 'story4_18_png', 'story4_19_png', 'story4_20_png', 'story4_21_png', 'story4_22_png', 'story4_23_png', 'story4_24_png', 'story4_25_png', 'story4_26_png', 'story4_27_png', 'story4_28_png', 'story4_29_png', 'story4_30_png', 'story4_31_png', 'story4_32_png', 'story4_33_png', 'story4_34_png', 'story4_35_png', 'story4_36_png', 'story4_37_png', 'story4_38_png', 'story4_39_png', 'story4_40_png', 'story4_41_png', 'story4_42_png', 'story4_43_png', 'story4_44_png', 'story4_45_png', 'story4_46_png', 'story4_47_png', 'story4_48_png', 'story4_49_png', 'story4_50_png', 'story4_51_png', 'story4_52_png', 'story4_53_png', 'story4_54_png', 'story4_55_png', 'story4_56_png', 'story4_57_png', 'story4_58_png', 'story4_59_png', 'story4_60_png', 'story4_61_png', 'story4_62_png', 'story4_63_png', 'story4_64_png', 'story4_65_png', 'story4_66_png', 'story4_67_png', 'story4_68_png', 'story4_69_png', 'story4_70_png', 'story4_71_png', 'story4_72_png', 'story4_73_png', 'story4_74_png', 'story4_75_png'
    ]
    cur = 0
    next = 0
    callBack: Function

    public constructor() {
        super();
        this.skinName = 'StorySkin'
    }

    public open(...param: any[]): void {
        this.addTouchEvent(this.img, this.onClick);

        this.callBack = param[0]
        this.upView()
    }

    private async upView() {
        // await RES.loadGroup('storyGroup')
        ViewManager.ins().close(LoadingUI)
        this.cur = 0
        this.img.source = this.arr1[this.cur]
        TimerManager.ins().doTimer(1000 / 8, 0, this.fun, this)
    }

    fun() {
        this.cur++
        if (this.cur >= this.arr1.length) {
            TimerManager.ins().remove(this.fun, this)
            return
        }
        this.img.source = this.arr1[this.cur]
    }

    fun2() {
        this.cur++
        if (this.cur >= this.arr2.length) {
            TimerManager.ins().remove(this.fun2, this)
            return
        }
        this.img.source = this.arr2[this.cur]
    }

    fun3() {
        this.cur++
        if (this.cur >= this.arr3.length) {
            return
        }
        this.img.source = this.arr3[this.cur]
    }

    end() {
        TimerManager.ins().removeAll(this)
        this.callBack && this.callBack()
        ViewManager.ins().close(this)
        RES.destroyRes('storyGroup')
    }

    public close(...param: any[]): void {
        this.callBack = null
    }

    private onClick(e: egret.TouchEvent): void {
        switch (e.currentTarget) {
            case this.img:
                if (this.next == 0) {
                    if (this.cur >= this.arr1.length) {
                        this.next = 1
                        this.cur = 0
                        this.img.source = this.arr2[this.cur]
                        TimerManager.ins().doTimer(1000 / 8, 0, this.fun2, this)
                    }
                }
                else if (this.next == 1) {
                    if (this.cur >= this.arr2.length) {
                        this.next = 2
                        this.cur = 0
                        this.img.source = this.arr3[this.cur]
                        TimerManager.ins().doTimer(1000 / 8, 0, this.fun3, this)
                    }
                }
                else if (this.next == 2) {
                    if (this.cur >= this.arr3.length || this.cur >= 60) {
                        let obj = { isFinish: true }
                        CacheUtil.set(Constant.STORY_DATA, JSON.stringify(obj))
                        this.end()
                    }
                }
                break;
        }
    }

}
ViewManager.ins().reg(StoryWin, LayerManager.UI_Popup);
window["StoryWin"] = StoryWin;