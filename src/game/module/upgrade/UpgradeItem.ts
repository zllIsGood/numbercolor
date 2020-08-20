/*
 * @Author: zhoulanglang 
 * @Date: 2020-06-04 16:30:09 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-08-14 18:16:44
 */
class UpgradeItem extends eui.ItemRenderer {
    btn: BaseBtn
    img: eui.Image
    lab0: eui.Label
    lab1: eui.Label
    lab2: eui.Label

    data: { itemData: { type: number, data: { level: number, cost: number, profit: number }[], name: string, label: string }, isLast: boolean }
    public constructor() {
        super();
        this.skinName = 'UpgradeItemSkin'
        this.addEventListener(egret.TouchEvent.ADDED_TO_STAGE, this.open, this);
        this.addEventListener(egret.TouchEvent.REMOVED_FROM_STAGE, this.close, this);
    }


    public open(...param: any[]): void {
        this.removeEventListener(egret.TouchEvent.ADDED_TO_STAGE, this.open, this)
        this.btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this)
    }

    protected dataChanged() {
        let itemData = this.data.itemData
        let imgsrc
        if (itemData.type == UpgradeType.house) { //艺术馆扩建
            imgsrc = 'scene_cion_png'
        }
        else if (itemData.type == UpgradeType.cost) {  //增加入场费
            imgsrc = 'cost_icon_png'
        }
        else if (itemData.type == UpgradeType.hero) {  //访客的心意
            imgsrc = 'heroincome_icon_png'
        }
        let lv = UserModel.ins().getUpgradeByType(itemData.type)
        let lvData = itemData.data[lv]
        let profit = itemData.type == UpgradeType.house ? lvData.profit : StringUtils.NumberToString(lvData.profit)
        let lab2 = `${itemData.label}\n<font  color=0xFFCC00>${profit}</font>`

        this.lab0.text = itemData.name
        this.lab1.text = '等级' + lvData.level
        this.lab2.textFlow = new egret.HtmlTextParser().parser(lab2)
        this.img.source = imgsrc

        let next = itemData.data[lv + 1]
        if (next) {
            this.btn.label = StringUtils.NumberToString(next.cost)
            this.btn.visible = true
        }
        else {
            this.btn.visible = false
        }
    }

    private onClick() {
        let itemData = this.data.itemData
        let lv = UserModel.ins().getUpgradeByType(itemData.type)
        let lvData = itemData.data[lv + 1]
        if (lvData == null) {
            wx.showToast({ icon: 'none', title: `已达最大等级` })
            return
        }
        let bool = UserModel.ins().setUpgradeByType(this.data.itemData.type)
        bool && this.dataChanged()
    }

    public close(...param: any[]): void {
        this.removeEventListener(egret.TouchEvent.REMOVED_FROM_STAGE, this.close, this);
        this.btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this)
    }
}
window["UpgradeItem"] = UpgradeItem;