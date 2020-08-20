/* 剧情
 * @Author: zhoulanglang 
 * @Date: 2020-07-14 11:14:07 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-07-17 21:01:50
 */
class StoryUtil {
    /**是否已完成*/
    public static isFinish = false
    public static playStory(fun: Function) {
        let s = CacheUtil.get(Constant.STORY_DATA)
        if (s && s != '') {
            let obj = JSON.parse(s)
            this.isFinish = obj.isFinish
        }
        else {
            let obj = { isFinish: this.isFinish }
            CacheUtil.set(Constant.STORY_DATA, JSON.stringify(obj))
        }

        if (this.isFinish) {
            fun()
        }
        else {
            ViewManager.ins().open(StoryWin1, fun)
        }
    }
}
window["StoryUtil"] = StoryUtil;