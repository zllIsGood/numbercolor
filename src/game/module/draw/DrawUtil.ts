/*
 * @Author: zhoulanglang 
 * @Date: 2020-07-10 17:05:24 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-07-10 17:15:28
 */
class DrawUtil {
    public static hasLoad: string[] = []

    public static async loadGroup(groupName: string) {
        if (this.hasLoad.indexOf(groupName) >= 0) {
            // callfun.call(thisobj)
        }
        else {
            ViewManager.ins().open(DrawLoadingWin)
            await RES.loadGroup(groupName)
            this.hasLoad.push(groupName)
            ViewManager.ins().close(DrawLoadingWin)
            // callfun.call(thisobj)
        }
    }
}
window["DrawUtil"] = DrawUtil;