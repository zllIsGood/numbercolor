/* 仙仙对话
 * @Author: zhoulanglang 
 * @Date: 2020-07-17 15:56:18 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-07-17 18:15:05
 */
class GuideDialog extends BaseEuiView {

    private img: eui.Image
    private talkLab: eui.Label
    private mc: MovieClip
    talkGrp: eui.Group

    private labId: number
    private yns = [330, 290, 330, 330, 400, 400, 400, 330]
    public constructor() {
        super();
        this.skinName = 'GuideDialogSkin'
        this.talkGrp.touchEnabled = false
    }

    public open(...param: any[]): void {
        this.labId = param[0]
        this.upView()
    }

    private upView() {
        this.talkGrp.bottom = this.yns[this.labId]
        if (this.mc == null) {
            this.mc = new MovieClip()
            this.mc.x = 430
            this.mc.y = 40
            this.talkGrp.addChild(this.mc)
        }
        this.mc.playFile('story_role3_mc', 1, null, false) //
        this.talkLab.text = GuideUtil.labs[this.labId]
    }

    public close(...param: any[]): void {
        DisplayUtils.removeFromParent(this.mc)
    }

}
ViewManager.ins().reg(GuideDialog, LayerManager.UI_Tips);
window["GuideDialog"] = GuideDialog;