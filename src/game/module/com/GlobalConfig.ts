/*
 * @Author: zhoualnglang 
 * @Date: 2020-03-31 11:27:54 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-08-13 18:27:45
 */
class GlobalConfig {

    public static init(data) {
        // console.log(data)
        this.picConfig = data
    }

    public static initPaint(data) {
        this.paintConfig = data
        if (Main.gamePlatform == Main.platformTT) {
            this.config.hero[0] = { star: 3, heroId: [/*106,*//* 107,*/ 108, 109, 110] }
        }
    }

    public static picConfig: { xydata }
    public static paintConfig: { paintGroup, paintColorGroup, base, }

    public static config = {
        /**员工*/
        hero: [
            { star: 3, heroId: [/*106,*/ 107, 108, 109, 110] },
            { star: 2, heroId: [103, 104, 105] },
            { star: 1, heroId: [101, 102, 111] },
        ],
        /**升级*/
        upgrade: [
            {
                type: UpgradeType.house, name: '艺术馆扩建', label: '增加博物馆展厅至',
                data: [
                    { level: 1, cost: 0, profit: 3 },
                    { level: 2, cost: 462000, profit: 4 },
                    { level: 3, cost: 2580000, profit: 5 },
                    { level: 4, cost: 5912000, profit: 6 },
                    { level: 5, cost: 11438000, profit: 7 },
                    { level: 6, cost: 26040000, profit: 8 },
                    { level: 7, cost: 63072000, profit: 9 },
                    { level: 8, cost: 85600000, profit: 10 },
                ]
            },
            {
                type: UpgradeType.cost, name: '增加入场费', label: '增加售票处总收入至',
                data: [
                    { level: 1, cost: 0, profit: 1152000 },
                    { level: 2, cost: 92400, profit: 1440000 },
                    { level: 3, cost: 309600, profit: 2610000 },
                    { level: 4, cost: 443400, profit: 2880000 },
                    { level: 5, cost: 653600, profit: 3600000 },
                    { level: 6, cost: 1085000, profit: 4320000 },
                    { level: 7, cost: 1178000, profit: 5760000 },
                    { level: 8, cost: 1286000, profit: 7200000 },
                    { level: 9, cost: 1954800, profit: 8640000 },
                    { level: 10, cost: 2102400, profit: 10080000 }
                ],
                time: 24 * 3600 * 1000 //ms 门票产出（24小时）
            },
            {
                type: UpgradeType.hero, name: '访客的心意', label: '增加游客给的小费最多至',
                data: [ //每分钟出现人数
                    { level: 1, cost: 0, profit: 533, numRole: 6, gratuityProbability: 0.5, ad: 0.1, ads: [2, 4] },
                    { level: 2, cost: 92400, profit: 567, numRole: 6, gratuityProbability: 0.5, ad: 0.1, ads: [2, 4] },
                    { level: 3, cost: 206400, profit: 600, numRole: 6, gratuityProbability: 0.5, ad: 0.1, ads: [2, 4] },
                    { level: 4, cost: 295600, profit: 633, numRole: 6, gratuityProbability: 0.5, ad: 0.1, ads: [2, 4] },
                    { level: 5, cost: 490200, profit: 667, numRole: 6, gratuityProbability: 0.5, ad: 0.1, ads: [2, 4] },
                    { level: 6, cost: 651000, profit: 700, numRole: 6, gratuityProbability: 0.5, ad: 0.1, ads: [2, 4] },
                    { level: 7, cost: 942400, profit: 733, numRole: 6, gratuityProbability: 0.5, ad: 0.1, ads: [2, 4] },
                    { level: 8, cost: 1028800, profit: 767, numRole: 6, gratuityProbability: 0.5, ad: 0.1, ads: [2, 4] },
                    { level: 9, cost: 1303200, profit: 800, numRole: 6, gratuityProbability: 0.5, ad: 0.1, ads: [2, 4] },
                    { level: 10, cost: 1752000, profit: 833, numRole: 6, gratuityProbability: 0.5, ad: 0.1, ads: [2, 4] }
                ]
            },
        ],
        /**画作*/
        draw: [
            { type: 0, name: '雕像', pic: [13, 1, 2, 3, 4] },
            { type: 1, name: '画作', pic: [5, 6, 7, 8,] },
            { type: 2, name: '珠宝', pic: [9, 10, 11, 12] },
            { type: 3, name: '十二生肖', pic: [14, 15, 16, 17, 22, 23, 18, 19, 24, 20, 25, 21] },
        ],
        /**画作升级与产出*/
        drawCfg: [
            { level: 1, cost: 0, profit: [40000, 180000, 600000] },
            { level: 2, cost: 92400, profit: [42500, 210000, 750000] },
            { level: 3, cost: 309600, profit: [45000, 240000, 900000] },
            { level: 4, cost: 443400, profit: [47500, 270000, 1050000] },
            { level: 5, cost: 653600, profit: [50000, 300000, 1200000] },
            { level: 6, cost: 1085000, profit: [52500, 330000, 1350000] },
            { level: 7, cost: 1178000, profit: [55000, 360000, 1500000] },
            { level: 8, cost: 1286000, profit: [57500, 390000, 1650000] },
            { level: 9, cost: 1954800, profit: [60000, 420000, 1800000] },
            { level: 10, cost: 2102400, profit: [62500, 450000, 1950000] }
        ],
        /**任务*/
        task: [  //任务出现规则->最多同时出现两个任务；在目前列出的8任务每10分钟随机出现一个，最多同时再线的任务只有两个，2个同时在线任务未完成情况下，不进行新任务的刷新
            { id: 1, name: '摆放艺术品（明）', award: 100000, type: 1, data: [9, 10, 11], need: '摆放id:9、10、11', fresh: 60, lab: '摆放<font  color=0x00FF00>3件</font>艺术品', imgs: [] },
            { id: 2, name: '摆放艺术品（唐）', award: 100000, type: 1, data: [4, 8, 12], need: '摆放id:4、8、12', fresh: 60, lab: '摆放<font  color=0x00FF00>3件</font>艺术品', imgs: [] },
            { id: 3, name: '摆放艺术品（清）', award: 80000, type: 1, data: [2, 6], need: '摆放id:2、6', fresh: 30, lab: '摆放<font  color=0x00FF00>2件</font>艺术品', imgs: [] },
            { id: 4, name: '摆放艺术品（传世名画）', award: 100000, type: 1, data: [5, 7, 8], need: '摆放id:5、7、8', fresh: 60, lab: '摆放<font  color=0x00FF00>3件</font>艺术品', imgs: [] },
            { id: 5, name: '巡逻任务（秦）', award: 100000, type: 2, data: [], need: '寻找秦代艺术品，巡逻5小时', fresh: 5 * 60, lab: '寻找秦代艺术品，巡逻<font  color=0xE1F1FF>5小时</font>', imgs: ['bmy_art_png', 'qinshihuang_home_png'] },
            { id: 6, name: '巡逻任务（唐）', award: 250000, type: 2, data: [], need: '寻找唐代艺术品，巡逻2小时', fresh: 2 * 60, lab: '寻找唐代艺术品，巡逻<font  color=0xE1F1FF>2小时</font>', imgs: ['tsc_art_png', 'lr_02_home_png'] },
            { id: 7, name: '巡逻任务（明）', award: 250000, type: 2, data: [], need: '寻找明代艺术品，巡逻1小时', fresh: 60, lab: '寻找明代艺术品，巡逻<font  color=0xE1F1FF>1小时</font>', imgs: ['jysg_art_png', 'lr_01_home_png'] },
            { id: 8, name: '巡逻任务（清）', award: 50000, type: 2, data: [], need: '寻找清代艺术品，巡逻5分钟', fresh: 5, lab: '寻找清代艺术品，巡逻<font  color=0xE1F1FF>5分钟</font>', imgs: ['joygb_art_png', 'lr_01_home_png'] },
        ],
        art: [
            { id: 1, type: 1, timeMin: 5, info: '兵马俑，即秦始皇兵马俑,于1974年3月被发现，被誉为世界十大古墓稀世珍宝之一', },
            { id: 2, type: 3, timeMin: 300, info: '清乾隆金嵌宝金瓯永固杯，是清乾隆时期的故宫金器', },
            { id: 3, type: 2, timeMin: 60, info: '日晷，就是白天通过测日影定时间的仪器', },
            { id: 4, type: 3, timeMin: 300, info: '中国古代陶瓷烧制工艺的珍品，全名唐代三彩釉陶器，是盛行于唐代的一种低温釉陶器，釉彩有黄、绿、白、褐、蓝、黑等色彩', },
            { id: 5, type: 1, timeMin: 5, info: '敦煌飞天就是画在敦煌石窟中的飞神，后来成为中国敦煌壁画艺术的一个专用名词。', },
            { id: 6, type: 2, timeMin: 60, info: '是一部颇具世界影响力的人情小说，举世公认的中国古典小说巅峰之作', },
            { id: 7, type: 3, timeMin: 300, info: '《千里江山图》是中国十大传世名画之一，集北宋以来水墨山水之大成', },
            { id: 8, type: 2, timeMin: 60, info: '画描述了唐代女子众生相，尤其表现唐代贵族妇女的生活情调，成为唐代仕女画的主要特征，被称为中国十大传世名画之一', },
            { id: 9, type: 2, timeMin: 60, info: '大明时代的国家级瑰宝', },
            { id: 10, type: 3, timeMin: 300, info: '明神宗万历皇帝的皇冠', },
            { id: 11, type: 3, timeMin: 300, info: '明孝端皇后的头饰，龙全系金制，凤系点翠工艺（以翠鸟羽毛贴饰的一种工艺）制成。', },
            { id: 12, type: 1, timeMin: 5, info: '这件铜龙是铁质的，通体鎏金，身体细长，两只有力的前脚紧扣地面，体现出盛唐的手工艺之高', },
            { id: 13, type: 1, timeMin: 5, info: '为南宋玉器，璧形，透明水晶，厚薄均匀，光索无痕。', },
            { id: 14, type: 1, timeMin: 5, info: '十二生肖，又叫属相，是中国与十二地支相配以人出生年份的十二种动物', }, //鼠
            { id: 15, type: 2, timeMin: 60, info: '十二生肖，又叫属相，是中国与十二地支相配以人出生年份的十二种动物', }, //牛
            { id: 16, type: 3, timeMin: 300, info: '十二生肖，又叫属相，是中国与十二地支相配以人出生年份的十二种动物', }, //虎
            { id: 17, type: 2, timeMin: 60, info: '十二生肖，又叫属相，是中国与十二地支相配以人出生年份的十二种动物', }, //兔
            { id: 18, type: 2, timeMin: 60, info: '十二生肖，又叫属相，是中国与十二地支相配以人出生年份的十二种动物', }, //马
            { id: 19, type: 2, timeMin: 60, info: '十二生肖，又叫属相，是中国与十二地支相配以人出生年份的十二种动物', }, //羊
            { id: 20, type: 1, timeMin: 5, info: '十二生肖，又叫属相，是中国与十二地支相配以人出生年份的十二种动物', }, //鸡
            { id: 21, type: 1, timeMin: 5, info: '十二生肖，又叫属相，是中国与十二地支相配以人出生年份的十二种动物', }, //猪
            { id: 22, type: 3, timeMin: 300, info: '十二生肖，又叫属相，是中国与十二地支相配以人出生年份的十二种动物', }, //龙
            { id: 23, type: 3, timeMin: 300, info: '十二生肖，又叫属相，是中国与十二地支相配以人出生年份的十二种动物', }, //蛇
            { id: 24, type: 1, timeMin: 5, info: '十二生肖，又叫属相，是中国与十二地支相配以人出生年份的十二种动物', }, //猴
            { id: 25, type: 1, timeMin: 5, info: '十二生肖，又叫属相，是中国与十二地支相配以人出生年份的十二种动物', }, //狗
        ]
    }

    public static getBaseName(id: number) {
        let data = this.paintConfig.base
        for (let i in data) {
            if (data[i].id == id) {
                return i
            }
        }
    }

    public static getArtBase(ids: number[]) {
        let data = this.paintConfig.base
        let ret = []
        for (let i in data) {
            if (ids.indexOf(data[i].id) >= 0) {
                ret.push(data[i])
            }
        }
        return ret
    }

    public static getHero() {
        return this.config.hero
    }

    public static getUpgrade() {
        return this.config.upgrade
    }

    public static getUpgradeByType(type) {
        let data = this.config.upgrade
        for (let i in data) {
            let ret = data[i]
            if (ret.type == type) {
                return ret
            }
        }
    }

    public static getDraw() {
        return this.config.draw
    }

    public static helpImgUrl = '' // './resource/assets/other/help_cover.png'
}
window["GlobalConfig"] = GlobalConfig