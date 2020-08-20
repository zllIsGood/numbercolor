/*
 * @Author: zhoulanglang 
 * @Date: 2020-06-09 10:29:20 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-06-29 18:26:35
 */
class StringUtils {

	/**添加换行*/
	public static addChangeLine(str: string): string {
		let s = ''
		for (let i = 0; i < str.length; i++) {
			s += str[i]
			if (i != str.length - 1) {
				s += '\n'
			}
		}
		return s
	}

	/**去掉换行*/
	public static deleteChangeLine(str: string): string {
		let s = str.replace('\r\n', '')
		s = s.replace('\r', '')
		return s
	}

	/**
	 * 去掉前后空格
	 * @param str
	 * @returns {string}
	 */
	public static trimSpace(str: string): string {
		return str.replace(/^\s*(.*?)[\s\n]*$/g, '$1');
	}

	/**
	 * 获取字符串长度，中文为2
	 * @param str
	 */
	public static getStringLength(str: string): number {
		let strArr = str.split("");
		let length = 0;
		for (let i = 0; i < strArr.length; i++) {
			let s = strArr[i];
			if (this.isChinese(s)) {
				length += 2;
			} else {
				length += 1;
			}
		}
		return length;
	}

	/**
	 * 判断一个字符串是否包含中文
	 * @param str
	 * @returns {boolean}
	 */
	public static isChinese(str: string): boolean {
		let reg = /^[\u4E00-\u9FA5]+$/;
		if (!reg.test(str)) {
			return true;
		}
		return false;
	}


	/**
	 * 获取字符串的字节长度
	 * 一个中文算2两个字节
	 * @param str
	 * @return
	 */
	public static strByteLen(str: string): number {
		let byteLen: number = 0;
		let strLen: number = str.length;
		for (let i: number = 0; i < strLen; i++) {
			byteLen += str.charCodeAt(i) >= 0x7F ? 2 : 1;
		}
		return byteLen;
	}

	/**
	 * 为文字添加颜色
	 * */
	public static addColor(content: string, color: any): string {
		let colorStr: string;
		if (typeof (color) == "string")
			colorStr = String(color)
		else if (typeof (color) == "number")
			colorStr = Number(color).toString(10);
		return `<font color=\"${colorStr}\">${content}</font>`;
	}

	/**
	 * 匹配替换字符串
	 * @param 需要匹配替换的字符串
	 * @param 匹配的字符串
	 * @param 需要替换成的字符串
	 * **/
	public static replaceStr(src: string, tar: string, des: string) {
		if (src.indexOf(tar) == -1)
			return src;

		let list = src.split(tar);
		return list[0] + des + list[1];
	}

	/**
	 * 字符串匹配拼接
	 * @param 需要拼接的字符串
	 * @param 匹配项
	 * @returns {string}
	 */
	public static replace(str: string, ...args: any[]): string {
		for (let i = 0; i < args.length; i++) {
			str = str.replace("%s", args[i] + "");
		}
		return str;
	}
	/**ms毫秒*/
	public static timeToString(ms: number): string {
		let ret
		if (ms > 60 * 60 * 1000) {
			let h = Math.floor(ms / (60 * 60 * 1000))
			let m = Math.round((ms - h * 60 * 60 * 1000) / (60 * 1000))
			ret = h + 'h'
			if (m > 0) {
				ret += m + 'm'
			}
		}
		else if (ms > 60 * 1000) {
			let m = Math.floor(ms / (60 * 1000))
			let s = Math.round((ms - m * 60 * 1000) / 1000)
			ret = m + 'm'
			if (s > 0) {
				ret += s + 's'
			}
		}
		else {
			let s = Math.round(ms / 1000)
			ret = s + 's'
		}
		return ret
	}
	/**数字转字符串 K M  G T*/
	public static NumberToString(num: number): string {
		if (num < 1000) {
			return String(this.getFix2(num))
		}
		else if (num < 1000000) {
			return this.getFix2(num / 1000) + 'K'
		}
		else if (num < 1000000000) {
			return this.getFix2(num / 1000000) + 'M'
		}
		else if (num < 1000000000000) {
			return this.getFix2(num / 1000000000) + 'G'
		}
		else {
			return this.getFix2(num / 1000000000000) + 'T'
		}
	}
	//保留2位小数
	private static getFix2(num: number) {
		let s = Math.round(num * 100)
		return s / 100
	}

	/**
	* 数字转中文
	* 例子:
	* StringUtils.NumberToChinese(325) = "三百二十五" (string）
	* */
	private static chnNumChar = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
	private static chnUnitSection = ["", "万", "亿", "万亿", "亿亿"];
	private static chnUnitChar = ["", "十", "百", "千"];
	public static NumberToChinese(num: number) {
		let unitPos = 0;
		let strIns = '', chnStr = '';
		let needZero = false;
		let chnNumChar = StringUtils.chnNumChar;
		let chnUnitSection = StringUtils.chnUnitSection;
		let bit = num;
		if (num === 0) {
			return chnNumChar[0];
		}

		while (num > 0) {
			let section = num % 10000;
			if (needZero) {
				chnStr = chnNumChar[0] + chnStr;
			}
			strIns = StringUtils.SectionToChinese(section);
			strIns += (section !== 0) ? chnUnitSection[unitPos] : chnUnitSection[0];
			chnStr = strIns + chnStr;
			needZero = (section < 1000) && (section > 0);
			num = Math.floor(num / 10000);
			unitPos++;
		}

		if ((bit / 100) >> 0 == 0 && (bit / 10) >> 0 != 0 && chnStr[0] == "一")
			chnStr = chnStr.substr(1)

		return chnStr;
	}

	//转万单位以下
	private static SectionToChinese(section: number) {
		let strIns = '', chnStr = '';
		let unitPos = 0;
		let zero = true;
		let chnNumChar = StringUtils.chnNumChar;
		let chnUnitChar = StringUtils.chnUnitChar;
		while (section > 0) {
			let v = section % 10;
			if (v === 0) {
				if (!zero) {
					zero = true;
					chnStr = chnNumChar[v] + chnStr;
				}
			} else {
				zero = false;
				strIns = chnNumChar[v];
				strIns += chnUnitChar[unitPos];
				chnStr = strIns + chnStr;
			}
			unitPos++;
			section = Math.floor(section / 10);
		}
		return chnStr;
	}

	/**大于 999 显示 999+*/
	public static NumberToMaxString(num: number) {
		if (num >= 999) {
			return '999+'
		}
		return num.toString()
	}

	public static isNotBlank(str: string) {
		return str !== null && str !== undefined && str !== "";
	}
}
window["StringUtils"] = StringUtils