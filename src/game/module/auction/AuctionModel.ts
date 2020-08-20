/* 拍卖行
 * @Author: zhoulanglang 
 * @Date: 2020-08-08 15:41:52 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-08-13 12:26:06
 */
class AuctionModel extends BaseClass {
    public static ins(): AuctionModel {
        return super.ins();
    }

    public constructor() {
        super();

    }

    public static talks = [
        '这是\n%s', //0
        '这个展品的估价\n是%s.',  //1
        '找出真品吧！', //2
        '拍卖会即将开始...', //3
        '拍卖开始！', //4
        '拍卖完结！\n现在发表结果...', //5
        '你什么都没有投到...', //6
        '%s\n成功投得这件艺术品', //7
        '%s\n第一次!', //8
        '%s\n第二次!', //9
        '%s\n第三次!', //10
        '%s\n%s', //11
    ]

    private static _guests = [
        { name: '花大娘', mc: 'auction_guest1' },
        { name: '朱小妹', mc: 'auction_guest2' },
        { name: '李大爷', mc: 'auction_guest3' },
    ]
    public static get guests() {
        let len = this._guests.length
        for (let i = len - 1; i > 0; i--) {
            let n = Math.floor(Math.random() * len)
            let temp = this._guests[i]
            this._guests[i] = this._guests[n]
            this._guests[n] = temp
        }
        return this._guests
    }
    /**是否是拍卖的*/
    public static isOfById(id) {
        let list = AuctionModel.auctionList
        for (let item of list) {
            for (let detail of item.detail) {
                if (detail.id == id) {
                    return true
                }
            }
        }
        return false
    }
    public static auctionList = [{
        type: 1, name: '十二生肖拍卖场', img: 'auction_shengxiao_png', gold: 200000, maxtime: 60000,
        detail: [ //basePrice 起拍价  targetPrice 估价  maxPrice 最大价 probability 超过估值停叫概率
            { id: 14, basePrice: 20000, targetPrice: 400000, maxPrice: 1500000, probability: 0.85, name: '食荔图', imgs: ['shilitu_true_png', 'shilitu_false1_png', 'shilitu_false2_png', 'shilitu_false3_png'] },
            { id: 15, basePrice: 20000, targetPrice: 400000, maxPrice: 1500000, probability: 0.85, name: '牧牛图', imgs: ['mnt_true_png', 'mnt_false1_png', 'mnt_false2_png', 'mnt_false3_png'] },
            { id: 16, basePrice: 20000, targetPrice: 500000, maxPrice: 1900000, probability: 0.85, name: '虎将军', imgs: ['hjj_true_png', 'hjj_false1_png', 'hjj_false2_png', 'hjj_false3_png'] },
            { id: 17, basePrice: 20000, targetPrice: 300000, maxPrice: 1100000, probability: 0.85, name: '三兔图', imgs: ['stt_true_png', 'stt_false1_png', 'stt_false2_png', 'stt_false3_png'] },
            { id: 18, basePrice: 20000, targetPrice: 300000, maxPrice: 1100000, probability: 0.85, name: '白蹄乌', imgs: ['btw_true_png', 'btw_false1_png', 'btw_false2_png', 'btw_false3_png'] },
            { id: 19, basePrice: 20000, targetPrice: 300000, maxPrice: 1100000, probability: 0.85, name: '三阳开泰', imgs: ['sykt_true_png', 'sykt_false1_png', 'sykt_false2_png', 'sykt_false3_png'] },
            { id: 20, basePrice: 20000, targetPrice: 200000, maxPrice: 1000000, probability: 0.85, name: '芙蓉锦鸡图', imgs: ['frjjt_true_png', 'frjjt_false1_png', 'frjjt_false2_png', 'frjjt_false3_png'] },
            { id: 21, basePrice: 20000, targetPrice: 200000, maxPrice: 1000000, probability: 0.85, name: '花猪与喜鹊', imgs: ['zhu_true_png', 'zhu_false1_png', 'zhu_false2_png', 'zhu_false3_png'] },
            { id: 22, basePrice: 20000, targetPrice: 500000, maxPrice: 1900000, probability: 0.85, name: '九龙壁', imgs: ['jlb_true_png', 'jlb_false1_png', 'jlb_false2_png', 'jlb_false3_png'] },
            { id: 23, basePrice: 20000, targetPrice: 500000, maxPrice: 1900000, probability: 0.85, name: '画蛇图', imgs: ['hst_true_png', 'hst_false1_png', 'hst_false2_png', 'hst_false3_png'] },
            { id: 24, basePrice: 20000, targetPrice: 400000, maxPrice: 1500000, probability: 0.85, name: '缚猴窃果图', imgs: ['fhqgt_true_png', 'fhqgt_false1_png', 'fhqgt_false2_png', 'fhqgt_false3_png'] },
            { id: 25, basePrice: 20000, targetPrice: 200000, maxPrice: 1000000, probability: 0.85, name: '春园犬戏图', imgs: ['cyqxt_true_png', 'cyqxt_false1_png', 'cyqxt_false2_png', 'cyqxt_false3_png'] },
        ]
    }];
    public static getDetailByType(type) {
        let data = AuctionModel.ins().getAuctionSingleData(type)
        for (let i in this.auctionList) {
            if (this.auctionList[i].type == type) {
                let arr = this.auctionList[i].detail
                let details = []
                for (let i in arr) {
                    if (data.ids.indexOf(arr[i].id) < 0) {
                        details.push(arr[i])
                    }
                }
                let id = MathUtils.limitInteger(0, details.length - 1)
                return details[id]
            }
        }
    }
    public static getDetailLenByType(type) {
        for (let i in this.auctionList) {
            if (this.auctionList[i].type == type) {
                return this.auctionList[i].detail.length
            }
        }
    }

    /**获取进度*/
    public getCurByType(type: number) {
        let data = this.getAuctionSingleData(type)
        let len = AuctionModel.getDetailLenByType(type)
        if (type == 1) {
            return { cur: data.ids.length, all: len }
        }
        return
    }
    public getTimeByType(type: number) {
        let data = this.getAuctionSingleData(type)
        let time = new Date().getTime()
        let dtime = 10 * 60 * 1000 - (time - data.lastTime)
        if (type == 1) {
            return dtime / 1000
        }
        return 0
    }
    public resetTime(type) {
        let data = this.getAuctionSingleData(type)
        data.lastTime = new Date().getTime()
        CacheUtil.set(Constant.AUCTION_DATA, JSON.stringify(this.auctionData))
    }
    public addAuction(type, id) {
        let data = this.getAuctionSingleData(type)
        if (data.ids.indexOf(id) < 0) {
            data.ids.push(id)
            CacheUtil.set(Constant.AUCTION_DATA, JSON.stringify(this.auctionData))
        }
    }
    /** -1非拍卖  0未拍卖得到 1已拍卖得到*/
    public getStateById(id: number) {
        let bool = AuctionModel.isOfById(id)
        if (!bool) {
            return -1
        }
        let data = this.getAuctionData()
        for (let i in data) {
            if (data[i].ids.indexOf(id) >= 0) {
                return 1
            }
        }
        return 0
    }

    public getAuctionSingleData(type): { lastTime: number, ids: number[], type: number } {
        return this.getAuctionData()[type]
    }
    private auctionData = null
    public getAuctionData() {
        if (this.auctionData == null) {
            let s = CacheUtil.get(Constant.AUCTION_DATA)
            if (s && s != '') {
                let obj = JSON.parse(s)
                this.auctionData = obj
            }
            else {
                this.auctionData = {}
            }
            let needCache = true
            let lastTime = new Date().getTime()
            for (let item of AuctionModel.auctionList) {
                if (this.auctionData[item.type] == null) {
                    this.auctionData[item.type] = { lastTime: lastTime, ids: [], type: item.type }
                    needCache = false
                }
            }
            needCache && CacheUtil.set(Constant.AUCTION_DATA, JSON.stringify(this.auctionData))
        }
        return this.auctionData
    }
}
MessageCenter.compile(AuctionModel);