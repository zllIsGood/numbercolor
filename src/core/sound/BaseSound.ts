/**
 * Created by yangsong on 15-1-14.
 * Sound基类
 */
class BaseSound {
	public _cache: any;
	public _loadingCache: Array<string>;

	/**
	 * 构造函数
	 */
	public constructor() {
		this._cache = {};
		this._loadingCache = new Array<string>();

		TimerManager.ins().doTimer(1 * 60 * 1000, 0, this.dealSoundTimer, this);
	}

	/**
	 * 处理音乐文件的清理
	 */
	private dealSoundTimer(): void {
		let currTime: number = egret.getTimer();
		let keys = Object.keys(this._cache);
		for (let i: number = 0, len = keys.length; i < len; i++) {
			let key = keys[i];
			if (!this.checkCanClear(key))
				continue;
			if (currTime - this._cache[key] >= SoundManager.CLEAR_TIME) {
				// console.log(key + "已clear")
				delete this._cache[key];
				RES.destroyRes(key);
			}
		}
	}

	/**
	 * 获取Sound
	 * @param key
	 * @returns {egret.Sound}
	 */
	public getSound(key: string): egret.Sound {
		if (!RES.hasRes(key)) {
			if (this._loadingCache.indexOf(key) != -1) { //避免未加载完多次播放
				return null;
			}
			this._loadingCache.push(key);
			RES.getResByUrl(key, this.onResourceLoadComplete2, this, RES.ResourceItem.TYPE_SOUND);
			return
		}
		let sound: egret.Sound = RES.getRes(key);
		if (sound) {
			if (this._cache[key]) {
				this._cache[key] = egret.getTimer();
			}
		} else {
			if (this._loadingCache.indexOf(key) != -1) {
				return null;
			}

			this._loadingCache.push(key);
			RES.getResAsync(key, this.onResourceLoadComplete, this);
		}
		return sound;
	}

	/**
	 * 资源加载完成
	 * @param event
	 */
	private onResourceLoadComplete(data: any, key: string): void {
		let index: number = this._loadingCache.indexOf(key);
		if (index != -1) {
			this._loadingCache.splice(index, 1);
			this._cache[key] = egret.getTimer();
			this.loadedPlay(key);
		}
	}

	public onResourceLoadComplete2(data, key: string) {
		// console.log(data, key)
		let index: number = this._loadingCache.indexOf(key);
		if (index != -1) {
			this._loadingCache.splice(index, 1);
			this._cache[key] = egret.getTimer();
			this.loadedPlay(key);
		}
	}

	/**
	 * 资源加载完成后处理播放，子类重写
	 * @param key
	 */
	public loadedPlay(key: string): void {

	}

	/**
	 * 检测一个文件是否要清除，子类重写
	 * @param key
	 * @returns {boolean}
	 */
	public checkCanClear(key: string): boolean {
		return true;
	}
}
window["BaseSound"] = BaseSound