/*!
 * firefly-glue.js — 油猴脚本专用胶水，必须作为 @require 放在
 * pixi.min.js 之后、cubism4.min.js 之前。
 *
 * 作用：
 * 1. 油猴把所有 @require 放在同一个函数作用域里，导致 pixi 的
 *    `var PIXI = ...` 成为局部变量，不会挂到 window 上；
 *    而 cubism4.min.js 是 UMD，它只会去 window.PIXI 找依赖，于是报错。
 *    这里把作用域里的 PIXI / Live2DCubismCore 转写到 window 上。
 * 2. 有些页面自己定义了 module / exports / define，会让 cubism4 的 UMD
 *    走错 CommonJS / AMD 分支，这里先把它们藏起来，之后由主脚本还原。
 */
;(function () {
	var W = typeof window !== "undefined" ? window : this
	try {
		if (typeof Live2DCubismCore !== "undefined" && !W.Live2DCubismCore) {
			W.Live2DCubismCore = Live2DCubismCore
		}
	} catch (e) {}
	try {
		if (typeof PIXI !== "undefined" && !W.PIXI) {
			W.PIXI = PIXI
		}
	} catch (e) {}
	try {
		W.__fireflyGlue = {
			ok: true,
			prevPIXI: W.PIXI,
			saved: { module: W.module, exports: W.exports, define: W.define },
		}
		W.module = undefined
		W.exports = undefined
		W.define = undefined
	} catch (e) {}
})()
