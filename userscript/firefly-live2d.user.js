// ==UserScript==
// @name         流萤 Live2D 看板娘 (Firefly Live2D)
// @name:en      Firefly Live2D Companion
// @namespace    https://github.com/Iskongkongyo
// @version      6.6.2
// @description  在任意网站挂载流萤 Live2D 看板娘；支持双源容灾、严格 CSP、桌面与触摸端，并修复移动端未命中区域的轻触随机互动。
// @author       流萤看板娘 v6.6.2 / userscript 封装
// @match        *://*/*
// @run-at       document-idle
// @noframes
// @require      https://cdn.jsdelivr.net/gh/Iskongkongyo/Firefly-live2d@v6.5.0/load/live2dcubismcore.min.js#sha256=aoI4WxSE6nxODKxog4zsQKsQBNbZmKnJ/E5hPOcmRxY=
// @require      https://cdn.jsdelivr.net/gh/Iskongkongyo/Firefly-live2d@v6.5.0/load/pixi.min.js#sha256=R4xD+6phoN2xlviL5/y7co5IeTxMKOqFZqyKmTc2OwQ=
// @require      https://cdn.jsdelivr.net/gh/Iskongkongyo/Firefly-live2d@v6.5.0/load/firefly-glue.js#sha256=Xlgc75sVd5mX5sZwWNwA+6f/EqY3mkPixCfARDwEzig=
// @require      https://cdn.jsdelivr.net/gh/Iskongkongyo/Firefly-live2d@v6.5.0/load/cubism4.min.js#sha256=3Pa1Q5HYihpPYkAcm6hT1HHVBysuDANeIzdPdsl+Lf8=
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @connect      cdn.jsdelivr.net
// @connect      live2d.202132.xyz
// @icon         data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAUEBAQEAwUEBAQGBQUGCA0ICAcHCBALDAkNExAUExIQEhIUFx0ZFBYcFhISGiMaHB4fISEhFBkkJyQgJh0gISD/2wBDAQUGBggHCA8ICA8gFRIVICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICD/wAARCABAAEADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD7LoorC17XpdLsoorO08/Vr2UwWdrI20OwyS7EZ2xqo3MfTjqQCAX9S1fStHgWfVdQt7KNjtUzSBdx9BnqfYVgD4ieGJYXmspL6+jXPz29hMyHHX59oXj61mG3t9BZtSvdQhudZmQm41e+IRYYx12gnEUYJwsYIyTyScmuF1j41/CzTrlllvbjxBeodrz2dkGDEHjLHarYPTrUOXYtRuenQ+PtDktheT2mrWVn/FdXemzRRJ/vMVwB/tH5feuohmgubeO4t5UmhlUOkkbBldTyCCOCK+etO/aJ8Fi+QTz61DbuwV2vbVWMWf4g8bHgdwR06Hse/m0268PsfEXgm8ijspF+0XGlM2bK6Ujd5kWAfJYg53J8pzkqeTQpdwcGj0qivO/EHiGDVvAyPoWoXenanqF7Fbp5ZxPayo4eVWHI+VEcnqrDHUMM9R4T1efXPCtnqF2ipd/PDcKn3fNjdo3I9iykj2IpxlfR7kdbGrdZFuX81YlT5mZm2gADnJ7Vw2m202veIZPFl67m0aFLbTLZgV/cg7mnYesjbSF7KiE8nA2fGMsMlpYaTczCK0v5yLticD7PHG0sgJ9GCBT7Map+GNWOtaPDrRJ23rCeND0jjIBQD/gJBPuTWbilJy7lI8Pux4h+I/xk8UW9tZXF54f0snT4pNwSCGSMEM29gRu37idoZsccA1s6P+zF4YhzP4k8SXt47fN5FoRCi+24hnb65FdVqcgfwDD4S01o7KbVY5IHmB2+UjfNcS9ufn27s8tIK6bw1rA1PQ7MSlY7xLdfNizyCv7tjj0Dqw/D3pJq5r7OUVzrr+hxx+Afwmkglgj0y886FtjMuoTbuRkHk46H0rq/B+ixeFNOfwnbXVxc2NgFksmumDyJC+f3ZIAyFYMBx0IHauV8TeObLwf43W51DWre30ya2aO4tpZFVjIkgO6PP3nCyAlP4l6cgZ67TNX0/WdRs9X0q/ttQsrmxcJcWzhkcB0I+h5PB5FHNccoSSTezOTks00L4x20ETNCup6e6Wbuu6GNhKisSOnmBdsa56rsHatrwrpEenfEVrXT7+9u47G0uDePcTmQI80quiYB2qxIkcjAIyM8EV57+0fYrd+BEvjIyHTpobpXB+4C/lP+B3oceqCvTfgto1/oXwd0Oy1XTn06/ZHmmgcgsC7swJH8OQQdpyV6HkVcaf8Ay8v8jCW5e+Imj32qaLbGwtJLtxKbaaKPG7yJ1MMrDJH3Q+76Ke9ct4T1qytrW30aS6jjKy/Y7cn5BK8a4ULns8aLIv8AeBOOldt4u1VILMaUk/kvdITNLnHkw5wx/wB5s7VHXJJHSvJZ9PtfFvju7i1GB9P0vSjBaqSdm5kHmnevbG9QAeVAP3SxwTLp2vZmB4q+EzeLPHt5fa9rM80NtcAWliGWOGKzcBwcn1k81Sf7yr6iuq8H/Ca70jSVl0XWpLG6tLyU27SsZYjFJ5ZYdc4wuCo+VioyMjdVbxBqNx4e1221GTXHutL0kG4VbqXbuQ5Ur54UyFTgfKdwbjPQVb0L9oDwxrqywx6NqtjcWitNLHNPbxgRqDucl3GVUDJGMjg4pRlePJb/ADOyVRtXT/y+4i8U/CS11PWdU1HX7s3rXkKn7T5bokeAoJVF3BSFjUEk85B4AxWP8NdL8JeF/Ez2Xhm68ybV7WELBDKJFjSJN09yeflWWQBVHfG4DBrauPjM17r1z4Ss9DFjfwIv73U7hbkPuXdgCElWbac7S447cGsvRtJ1CDXrrV5L0W9rfGO2nvLe3WKcJ3VXHyxqX2/dXIAGCDkknJuKj0QlUUVru/PfsZPxi8QR+INH8S+E9NjW4uIYo4mIcEMIy1xcAAdCixqPdmAr1X4D60dd+CehXEupS6hcW6vazSSjlWRiNoPdQNuD3GK5n+xLDQvFurfY9Lt7MX9nby294i8wNCQux8/8sw4jYn1kO7Ocj2LRbtL/AEW3vIkESSrkRBdvlHoUPuCCK0g/dscc2m9DhviWLzSbjTPEGnT26XUk8dnGbgZWJzvxLg8NtRpDj1C++eDj13R4IfsNpqNv5aFjJLLcKXlcklmJJ5JYks3ck177eWNjqNv9n1Czgu4chvLnjDrkdDg8VAuiaKqhV0iyVVGABbpgD06UNJ7ka9D5V8Y3UvjO7sPCfh64glm1F0haRmBjESnkv2wzkAA+nqQDXh8K6H4e8U/bPEl1Yz6qs8Xk6MGWNLaJG/fToHbc23aRlsAh2+UYBH0vq3w98K6zqAvrnTzFKYfs8gtpDCs0W7dscLjIzk+tXF8FeD1WJV8MaWBEwdf9FTO4DGSccnHrUSppxaQ1Od9dvI+fvEtl4R1jVTpehPb6TqccUmoQ3Ej+VmdOPMKDGSudhGNxD4A+bNaNp410m50WGKLUEtLaVY/Ps7q4jys2cSDr0BOPwr3G88G+FL8H7R4esN5xiWOFY5Fx0w64Yfga0rfS9NtLSG0trGCOCBBHGgQYVQMAflUUqMacVHe39dROUm9WfPN1qkuopeWcet2t1bxSv9jfzVEkS/ZvMaMuD+8iJUxuDyBKgyeK9w8EK58EaZdSAK17H9tKBshPNJkC574DAZ74rTutF0a9CC80myudgIXzYEfbnrjI4q8qqiBEUKqjAAGABWyVg1P/2Q==
// @license      MIT
// ==/UserScript==

/*
 =============================================================================
  v6.6.2：双源容灾 + 移动端轻触随机互动（Greasy Fork SRI 兼容）
  --------------------------------------------------------------------------
  运行时资源默认从 jsDelivr 的固定 v6.5.0 标签加载；网络错误、超时、
  429 或 5xx 时自动切换到 https://live2d.202132.xyz/，不使用
  raw.githubusercontent.com。主源发生网络型故障后会暂时熔断，避免同一
  页面后续的 moc3、动作、表情、音频等资源逐个等待主源超时。

  注意：四个 @require 由油猴管理器在主脚本执行前加载，元数据层本身不支持
  JavaScript 自动回退；本版的双源容灾覆盖模型、纹理、动作、表情、物理、
  音频和恢复图标。若希望依赖库也完全避开 jsDelivr，可把四行 @require
  手动改成自建源地址，同时保留两行 @connect。

  提醒：Chrome 请到 chrome://extensions → Tampermonkey → 详细信息，
  打开「允许用户脚本 / Allow User Scripts」（或开发者模式）。
 =============================================================================
*/

(function () {
	"use strict";

	// ---  资源源配置 ---
	// 运行时资源始终使用固定版本作为主源，避免 main 分支更新和 CDN 缓存造成版本混用。
	// 备用源应保持与该标签相同的目录结构和文件内容。
	const RESOURCE_SOURCES = Object.freeze([
		Object.freeze({
			id: "jsdelivr",
			name: "jsDelivr",
			base: "https://cdn.jsdelivr.net/gh/Iskongkongyo/Firefly-live2d@v6.5.0/",
			timeout: 9000,
			binaryTimeout: 12000,
		}),
		Object.freeze({
			id: "selfhost",
			name: "自建源",
			base: "https://live2d.202132.xyz/",
			timeout: 15000,
			binaryTimeout: 25000,
		}),
	]);
	const RESOURCE_SOURCE_COOLDOWN = 5 * 60 * 1000;
	const BASE = RESOURCE_SOURCES[0].base; // 生成规范资源 URL；实际请求可自动切换备用源。

	// ---  用户配置 ---
	const USER_CONFIG = {
		side: "left", // left / right
		width: 420,
		height: 360,
		scale: 0.94,
		offsetX: -20,
		offsetY: 12,
		zIndex: 2147483000, // 盖在绝大多数网站的悬浮元素之上
		minWidth: 1025, // 仅控制非触摸桌面端的最小加载宽度
		allowTouch: true, // 是否允许在粗指针触摸设备加载
		touchWidth: 260,
		touchHeight: 360,
		touchScale: 0.9,
		touchOffsetX: -12,
		touchOffsetY: 8,
		touchControlsHideDelay: 3200,
		storageKey: `firefly-hidden:${location.hostname}`, // 每个网站独立保存隐藏状态
		welcome: "开拓者，我回来啦~",
		pageTitleMessage: true,
		pageTitleTemplate: "又在看 {title} 呀~",
		pageTitleMessageDelay: 3400,
		pageTitleChangeDelay: 700,
		titleMaxLength: 28,
		returnMessage: "欢迎回来~",
		returnMessageMinHidden: 1000,
		linkHoverMessage: true,
		linkHoverTemplate: "想去看看{label}吗？",
		linkHoverDelay: 1400,
		linkHoverDuration: 2800,
		linkHoverCooldown: 8000,
		linkLabelMaxLength: 22,
		linkLongPressDelay: 650,
		linkLongPressMoveTolerance: 12,
		copyMessage: "复制好啦，希望能帮到你~",
		copyMessageDuration: 2300,
		bottomMessage: "已经看到页面底部啦，辛苦了~",
		bottomMessageThreshold: 0.92,
		idleMessages: [
			"在忙什么呢？也要记得休息呀~",
			"累了的话，就稍微休息一下吧。",
			"我会一直陪着你的，开拓者。",
		],
		idleMessageDelay: 90000,
		idleMessageInterval: 120000,
		fallbackClick: true,
		touchTapMoveTolerance: 14,
		touchTapMaxDuration: 600,
		expressionDuration: 4200,
		dialogGap: 1,
		buttonHintDuration: 2600,
		controlsHideDelay: 180,
		homeUrl: "/", // 🔙 按钮：回到当前站点首页
		profileUrl: "https://baike.baidu.com/item/流萤/63849747",
		profileHint: "我叫流萤，想要更多了解我吗？",
		debug: false,
	};

	// 站点模式："blacklist" = 除黑名单外处处显示；"whitelist" = 只在白名单显示。
	const SITE_MODE = "blacklist";

	// ---  运行时  ---
	const W = window;
	const HOST = location.hostname;
	const LOG = (...a) => USER_CONFIG.debug && console.log("[Firefly US]", ...a);

	// @require 注入的库可能落在作用域里，也可能落在 window 上，两边都找。
	const glue = W.__fireflyGlue || null;
	const PX =
		W.PIXI || (typeof PIXI !== "undefined" ? PIXI : null); // eslint-disable-line
	const CUBISM =
		W.Live2DCubismCore ||
		(typeof Live2DCubismCore !== "undefined" ? Live2DCubismCore : null); // eslint-disable-line

	// 把被胶水临时藏起来的 module / exports / define 还给页面
	if (glue && glue.saved) {
		try {
			W.module = glue.saved.module;
			W.exports = glue.saved.exports;
			W.define = glue.saved.define;
		} catch (e) {}
	}

	const store = {
		get(key, fallback = null) {
			try {
				if (typeof GM_getValue === "function") return GM_getValue(key, fallback);
			} catch (e) {}
			try {
				const v = localStorage.getItem(key);
				return v === null ? fallback : v;
			} catch (e) {
				return fallback;
			}
		},
		set(key, value) {
			try {
				if (typeof GM_setValue === "function") return GM_setValue(key, value);
			} catch (e) {}
			try {
				localStorage.setItem(key, value);
			} catch (e) {}
		},
	};

	const siteList = () => {
		const raw = store.get("ff-site-list", "[]");
		try {
			const v = typeof raw === "string" ? JSON.parse(raw) : raw;
			return Array.isArray(v) ? v : [];
		} catch (e) {
			return [];
		}
	};
	const saveSiteList = (list) =>
		store.set("ff-site-list", JSON.stringify([...new Set(list)]));
	const listed = () => siteList().includes(HOST);
	const allowedHere = () => (SITE_MODE === "whitelist" ? listed() : !listed());

	// ---  GM 网络（绕过站点 CSP + 双源容灾）---
	const gmRequest =
		typeof GM_xmlhttpRequest === "function"
			? GM_xmlhttpRequest
			: typeof GM !== "undefined" && GM && GM.xmlHttpRequest
				? GM.xmlHttpRequest.bind(GM)
				: null;

	const sourceState = RESOURCE_SOURCES.map((source) => ({
		unhealthyUntil: Math.max(
			0,
			Number(store.get(`ff-resource-cooldown:${source.id}`, 0)) || 0,
		),
		lastError: "",
	}));
	const inFlightResources = new Map();
	let lastResourceSource = "尚未请求";

	function requestError(message, details = {}) {
		const error = new Error(message);
		Object.assign(error, details);
		return error;
	}

	function getManagedPath(url) {
		let absolute;
		try {
			absolute = new URL(url, location.href).href;
		} catch (_) {
			return null;
		}
		for (const source of RESOURCE_SOURCES) {
			if (absolute.startsWith(source.base)) return absolute.slice(source.base.length);
		}
		return null;
	}

	const managed = (url) => getManagedPath(url) !== null;

	function responseTimeout(source, responseType) {
		return responseType === "blob" || responseType === "arraybuffer"
			? source.binaryTimeout
			: source.timeout;
	}

	function shouldCooldown(error) {
		return (
			error?.kind === "timeout" ||
			error?.kind === "network" ||
			error?.status === 408 ||
			error?.status === 425 ||
			error?.status === 429 ||
			Number(error?.status) >= 500
		);
	}

	function markSourceFailure(index, error) {
		const source = RESOURCE_SOURCES[index];
		const state = sourceState[index];
		state.lastError = error?.message || String(error);
		if (!shouldCooldown(error)) return;
		state.unhealthyUntil = Date.now() + RESOURCE_SOURCE_COOLDOWN;
		store.set(`ff-resource-cooldown:${source.id}`, state.unhealthyUntil);
	}

	function markSourceSuccess(index) {
		const source = RESOURCE_SOURCES[index];
		const state = sourceState[index];
		state.lastError = "";
		state.unhealthyUntil = 0;
		lastResourceSource = source.name;
		store.set(`ff-resource-cooldown:${source.id}`, 0);
	}

	function sourceOrder() {
		const now = Date.now();
		return RESOURCE_SOURCES.map((_, index) => index).sort((a, b) => {
			const aCooling = sourceState[a].unhealthyUntil > now;
			const bCooling = sourceState[b].unhealthyUntil > now;
			if (aCooling !== bCooling) return aCooling ? 1 : -1;
			if (aCooling && bCooling)
				return sourceState[a].unhealthyUntil - sourceState[b].unhealthyUntil;
			return a - b;
		});
	}

	async function nativeFetchOnce(url, responseType, timeout) {
		const controller = typeof AbortController === "function" ? new AbortController() : null;
		const timer = controller
			? setTimeout(() => controller.abort(), Math.max(1, timeout))
			: 0;
		try {
			const response = await fetch(url, {
				credentials: "omit",
				cache: "default",
				signal: controller?.signal,
			});
			if (!response.ok)
				throw requestError(`HTTP ${response.status} ${url}`, {
					kind: "http",
					status: response.status,
					url,
				});
			if (responseType === "arraybuffer") return response.arrayBuffer();
			if (responseType === "blob") return response.blob();
			if (responseType === "json") return response.json();
			return response.text();
		} catch (error) {
			if (error?.name === "AbortError")
				throw requestError(`timeout ${url}`, { kind: "timeout", url });
			if (error?.kind) throw error;
			throw requestError(`network error ${url}`, {
				kind: "network",
				url,
				cause: error,
			});
		} finally {
			if (timer) clearTimeout(timer);
		}
	}

	function gmFetchOnce(url, responseType, timeout) {
		if (!gmRequest) return nativeFetchOnce(url, responseType, timeout);
		return new Promise((resolve, reject) => {
			gmRequest({
				method: "GET",
				url,
				timeout: Math.max(1, timeout),
				responseType: responseType === "text" ? undefined : responseType,
				onload: (res) => {
					const ok = res.status === 0 || (res.status >= 200 && res.status < 400);
					if (!ok)
						return reject(
							requestError(`HTTP ${res.status} ${url}`, {
								kind: "http",
								status: res.status,
								url,
							}),
						);
					if (responseType === "text") return resolve(res.responseText);
					if (responseType === "json") {
						if (res.response && typeof res.response === "object")
							return resolve(res.response);
						try {
							return resolve(JSON.parse(res.responseText));
						} catch (error) {
							return reject(
								requestError(`invalid json ${url}`, {
									kind: "parse",
									url,
									cause: error,
								}),
							);
						}
					}
					resolve(res.response);
				},
				onerror: () =>
					reject(requestError(`network error ${url}`, { kind: "network", url })),
				ontimeout: () =>
					reject(requestError(`timeout ${url}`, { kind: "timeout", url })),
			});
		});
	}

	async function fetchManaged(relativePath, responseType, transform = null) {
		const errors = [];
		for (const index of sourceOrder()) {
			const source = RESOURCE_SOURCES[index];
			const candidateUrl = new URL(relativePath, source.base).href;
			try {
				LOG("resource try", source.name, relativePath);
				const data = await gmFetchOnce(
					candidateUrl,
					responseType,
					responseTimeout(source, responseType),
				);
				let result = data;
				if (typeof transform === "function") {
					try {
						result = await transform(data, candidateUrl, source);
					} catch (error) {
						throw requestError(`资源解码失败 ${candidateUrl}`, {
							kind: "decode",
							url: candidateUrl,
							cause: error,
						});
					}
				}
				markSourceSuccess(index);
				LOG("resource ready", source.name, relativePath);
				return result;
			} catch (error) {
				errors.push(`${source.name}: ${error?.message || error}`);
				markSourceFailure(index, error);
				console.warn(
					`[Firefly US] ${source.name} 加载失败，尝试下一资源源：${relativePath}`,
					error,
				);
			}
		}
		throw requestError(`所有资源源均加载失败：${relativePath}\n${errors.join("\n")}`, {
			kind: "all-sources-failed",
			relativePath,
		});
	}

	function requestManaged(url, responseType, transform, cacheSuffix) {
		const relativePath = getManagedPath(url);
		if (relativePath === null) {
			const task = gmFetchOnce(url, responseType, 30000);
			return typeof transform === "function" ? task.then((data) => transform(data, url, null)) : task;
		}

		const key = `${responseType}:${relativePath}:${cacheSuffix}`;
		if (inFlightResources.has(key)) return inFlightResources.get(key);

		const task = fetchManaged(relativePath, responseType, transform).finally(() => {
			inFlightResources.delete(key);
		});
		inFlightResources.set(key, task);
		return task;
	}

	function gmFetch(url, responseType = "text") {
		return requestManaged(url, responseType, null, "raw");
	}

	function gmFetchTransformed(url, responseType, transform, cacheSuffix = "decoded") {
		return requestManaged(url, responseType, transform, cacheSuffix);
	}

	function getResourceStatus() {
		const now = Date.now();
		return RESOURCE_SOURCES.map((source, index) => {
			const remaining = Math.max(0, sourceState[index].unhealthyUntil - now);
			return {
				name: source.name,
				base: source.base,
				cooldownRemaining: remaining,
				lastError: sourceState[index].lastError,
			};
		});
	}

	// 让 pixi-live2d-display 的 XHRLoader 走 GM 通道（moc3 / motion / exp / physics）
	const NativeXHR = W.XMLHttpRequest;
	class ShimXHR {
		constructor() {
			this.readyState = 0;
			this.status = 0;
			this.statusText = "";
			this.response = null;
			this.responseText = "";
			this.responseType = "";
			this.timeout = 0;
			this.withCredentials = false;
			this.onload = null;
			this.onerror = null;
			this.onabort = null;
			this.onprogress = null;
			this.onreadystatechange = null;
			this._events = {};
			this._aborted = false;
			this._native = null;
		}
		open(method, url) {
			this._url = new URL(url, location.href).href;
			this._method = method || "GET";
			if (!managed(this._url)) {
				this._native = new NativeXHR();
				this._native.open(this._method, this._url, true);
			}
		}
		setRequestHeader(k, v) {
			if (this._native) this._native.setRequestHeader(k, v);
		}
		getAllResponseHeaders() {
			return this._native ? this._native.getAllResponseHeaders() : "";
		}
		addEventListener(type, fn) {
			(this._events[type] = this._events[type] || []).push(fn);
		}
		removeEventListener(type, fn) {
			this._events[type] = (this._events[type] || []).filter((f) => f !== fn);
		}
		_emit(type, detail) {
			const evt = detail || { type, target: this };
			const direct = this["on" + type];
			if (typeof direct === "function") direct.call(this, evt);
			(this._events[type] || []).forEach((fn) => fn.call(this, evt));
		}
		send() {
			if (this._native) {
				const n = this._native;
				n.responseType = this.responseType;
				n.onload = () => {
					this.status = n.status;
					this.response = n.response;
					this.responseText = n.responseType === "" ? n.responseText : "";
					this.readyState = 4;
					this._emit("readystatechange");
					this._emit("load");
				};
				n.onerror = () => this._emit("error");
				n.onabort = () => this._emit("abort");
				n.send();
				return;
			}
			const type =
				this.responseType === "" || this.responseType === "text"
					? "text"
					: this.responseType;
			gmFetch(this._url, type).then(
				(data) => {
					if (this._aborted) return;
					this.status = 200;
					this.statusText = "OK";
					this.readyState = 4;
					this.response = data;
					if (type === "text") this.responseText = data;
					this._emit("readystatechange");
					this._emit("load");
				},
				(err) => {
					if (this._aborted) return;
					LOG("xhr failed", this._url, err);
					this.status = 0;
					this.readyState = 4;
					this._emit("readystatechange");
					this._emit("error");
				},
			);
		}
		abort() {
			this._aborted = true;
			if (this._native) this._native.abort();
			this._emit("abort");
		}
	}

	// 音频：用 WebAudio 播放 GM 拉回来的 mp3，绕过 media-src CSP，
	// 并保持 loader 需要的 HTMLAudioElement 子集接口。
	let audioCtx = null;
	const bufferCache = new Map();
	function getCtx() {
		const Ctor = W.AudioContext || W.webkitAudioContext;
		if (!Ctor) return null;
		if (!audioCtx) audioCtx = new Ctor();
		return audioCtx;
	}
	class ShimAudio {
		constructor(url) {
			this.src = url || "";
			this.volume = 1;
			this.preload = "auto";
			this.currentTime = 0;
			this.paused = true;
			this._events = {};
			this._node = null;
			this._gain = null;
			this._token = 0;
		}
		addEventListener(type, fn, opts) {
			(this._events[type] = this._events[type] || []).push({
				fn,
				once: !!(opts && opts.once),
			});
		}
		removeEventListener(type, fn) {
			this._events[type] = (this._events[type] || []).filter((l) => l.fn !== fn);
		}
		_emit(type) {
			const evt = { type, target: this };
			const direct = this["on" + type];
			if (typeof direct === "function") direct.call(this, evt);
			const list = this._events[type] || [];
			this._events[type] = list.filter((l) => !l.once);
			list.forEach((l) => l.fn.call(this, evt));
		}
		async _buffer() {
			const ctx = getCtx();
			if (!ctx) throw new Error("no AudioContext");
			if (!bufferCache.has(this.src)) {
				bufferCache.set(
					this.src,
					gmFetchTransformed(
						this.src,
						"arraybuffer",
						(buf) =>
							new Promise((res, rej) =>
								ctx.decodeAudioData(buf.slice ? buf.slice(0) : buf, res, rej),
							),
						"audio-buffer",
					),
				);
			}
			return bufferCache.get(this.src);
		}
		play() {
			const token = ++this._token;
			const ctx = getCtx();
			if (!ctx) return Promise.reject(new Error("no AudioContext"));
			if (ctx.state === "suspended") ctx.resume().catch(() => {});
			this.paused = false;
			return this._buffer().then((buffer) => {
				if (token !== this._token) {
					const err = new Error("aborted");
					err.name = "AbortError";
					throw err;
				}
				this._stopNode();
				const gain = ctx.createGain();
				gain.gain.value = this.volume;
				const node = ctx.createBufferSource();
				node.buffer = buffer;
				node.connect(gain).connect(ctx.destination);
				node.onended = () => {
					if (token !== this._token) return;
					this.paused = true;
					this._emit("ended");
				};
				this._node = node;
				this._gain = gain;
				node.start(0);
			});
		}
		_stopNode() {
			if (!this._node) return;
			try {
				this._node.onended = null;
				this._node.stop(0);
				this._node.disconnect();
			} catch (e) {}
			this._node = null;
		}
		pause() {
			this._token++;
			this.paused = true;
			this._stopNode();
		}
	}

	// 样式：优先用 CSSOM 构造样式表（不受 style-src CSP 影响）
	const CSS = `
.ff-live2d-root {
  --ff-width: 420px;
  --ff-height: 620px;
  position: fixed;
  right: 0;
  bottom: 0;
  width: var(--ff-width);
  height: var(--ff-height);
  z-index: 52;
  pointer-events: none;
  overflow: visible;
  user-select: none;
  -webkit-user-select: none;
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
  transition: opacity .22s ease, transform .22s ease, visibility 0s linear 0s;
  will-change: opacity, transform;
}

.ff-live2d-root.ff-left {
  right: auto;
  left: 0;
}

.ff-live2d-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
  pointer-events: auto;
  cursor: pointer;
  opacity: 0;
  transition: opacity .35s ease;
}

.ff-live2d-root.ff-ready .ff-live2d-canvas {
  opacity: 1;
}

.ff-live2d-dialog {
  position: absolute;
  left: 50%;
  top: 8px;
  max-width: 250px;
  padding: 8px 12px;
  border: 1px solid rgba(255, 255, 255, .34);
  border-radius: 10px;
  background: rgba(20, 28, 32, .8);
  color: #fff;
  font: 13px/1.5 -apple-system, BlinkMacSystemFont, "Segoe UI", "Microsoft YaHei", sans-serif;
  text-align: center;
  white-space: normal;
  box-shadow: 0 6px 20px rgba(0, 0, 0, .18);
  backdrop-filter: blur(7px);
  -webkit-backdrop-filter: blur(7px);
  opacity: 0;
  transform: translateY(4px);
  transition: opacity .18s ease, transform .18s ease;
  pointer-events: none;
}

.ff-live2d-dialog.ff-visible {
  opacity: 1;
  transform: translateY(0);
}

.ff-live2d-controls {
  position: absolute;
  left: calc(100% - 42px);
  top: 210px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  opacity: 0;
  visibility: hidden;
  transform: translateX(-5px);
  transition:
    opacity .18s ease,
    transform .18s ease,
    visibility 0s linear .18s;
  pointer-events: none;
}

.ff-live2d-root.ff-controls-visible .ff-live2d-controls,
.ff-live2d-controls:focus-within {
  opacity: 1;
  visibility: visible;
  transform: translateX(2px);
  transition-delay: 0s;
  pointer-events: auto;
}

.ff-live2d-button {
  width: 34px;
  height: 34px;
  margin: 0;
  padding: 0;
  border: 0;
  border-radius: 0;
  background: transparent;
  color: inherit;
  font: 23px/34px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif;
  text-align: center;
  cursor: pointer;
  filter: drop-shadow(0 2px 3px rgba(0, 0, 0, .42));
}

.ff-live2d-button:hover {
  transform: scale(1.12);
}

.ff-live2d-button:focus-visible,
.ff-live2d-show:focus-visible {
  outline: 2px solid rgba(115, 205, 255, .95);
  outline-offset: 2px;
}

.ff-live2d-show {
  position: fixed;
  right: 12px;
  bottom: 12px;
  z-index: 52;
  display: none;
  width: 72px;
  height: 72px;
  margin: 0;
  padding: 4px;
  border: 1px solid rgba(255, 255, 255, .55);
  border-radius: 12px;
  background: rgba(255, 255, 255, .82);
  box-shadow: 0 5px 20px rgba(0, 0, 0, .2);
  cursor: pointer;
  pointer-events: auto;
  overflow: hidden;
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
}

.ff-live2d-show img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
  image-rendering: auto;
}

.ff-live2d-show.ff-left {
  right: auto;
  left: 12px;
}

/* 保持 WebGL Canvas 在布局树中，避免重新显示时模型局部 Drawable 丢失。 */
.ff-live2d-root.ff-hidden {
  opacity: 0;
  visibility: hidden;
  transform: translateY(8px);
  pointer-events: none;
  transition: opacity .18s ease, transform .18s ease, visibility 0s linear .18s;
}

.ff-live2d-root.ff-hidden .ff-live2d-canvas,
.ff-live2d-root.ff-hidden .ff-live2d-controls {
  pointer-events: none;
}

.ff-live2d-show.ff-visible {
  display: block;
}

/* 触摸模式由 allowTouch 控制；尺寸由 JS 写入 --ff-width / --ff-height。 */
.ff-live2d-root.ff-touch .ff-live2d-canvas {
  touch-action: manipulation;
}

.ff-live2d-root.ff-touch .ff-live2d-dialog {
  max-width: min(220px, calc(100% - 12px));
  padding: 7px 10px;
  font-size: 12px;
}

.ff-live2d-root.ff-touch .ff-live2d-controls {
  gap: 3px;
}

.ff-live2d-root.ff-touch .ff-live2d-button {
  width: 40px;
  height: 40px;
  font-size: 24px;
  line-height: 40px;
}

.ff-live2d-show.ff-touch {
  right: 8px;
  bottom: 8px;
  width: 56px;
  height: 56px;
  border-radius: 10px;
}

.ff-live2d-show.ff-touch.ff-left {
  right: auto;
  left: 8px;
}

/* 长按链接时关闭系统触摸呼出菜单，由流萤显示自定义提示。 */
.ff-live2d-longpress-link {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
}
`;
	function injectCSS(text) {
		try {
			if ("adoptedStyleSheets" in document && typeof CSSStyleSheet === "function") {
				const sheet = new CSSStyleSheet();
				sheet.replaceSync(text);
				document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
				return;
			}
		} catch (e) {
			LOG("adoptedStyleSheets failed", e);
		}
		try {
			if (typeof GM_addStyle === "function") return void GM_addStyle(text);
		} catch (e) {}
		const style = document.createElement("style");
		style.textContent = text;
		document.head.appendChild(style);
	}

	// 图标：用 ImageBitmap + canvas 代替 <img src>，绕过 img-src CSP
	function setIcon(imgEl, url) {
		gmFetchTransformed(url, "blob", (blob) => createImageBitmap(blob), "icon-bitmap")
			.then((bitmap) => {
				const canvas = document.createElement("canvas");
				canvas.width = bitmap.width;
				canvas.height = bitmap.height;
				canvas.getContext("2d").drawImage(bitmap, 0, 0);
				canvas.className = imgEl.className;
				canvas.style.width = "100%";
				canvas.style.height = "100%";
				canvas.style.objectFit = "cover";
				canvas.style.borderRadius = "inherit";
				canvas.style.display = "block";
				imgEl.replaceWith(canvas);
			})
			.catch((e) => LOG("icon failed", e));
	}

	const FF = { store, setIcon, getResourceStatus };

	// pixi-live2d-display 内部的 XHRLoader 用的是页面原生 XMLHttpRequest，
	// 在 X（Twitter）这类 connect-src 'self' 的站点上会被直接拦掉。
	// 这里把它的静态工厂换成 GM 通道版本，moc3 / physics / exp3 / motion3
	// 以及 model3.json 全部改走扩展特权网络。
	function patchXHRLoader(PIXI) {
		const XL = PIXI.live2d && PIXI.live2d.XHRLoader;
		if (!XL || typeof XL.createXHR !== "function") return false;
		XL.createXHR = function (target, url, type, onload, onerror) {
			const xhr = new ShimXHR();
			try {
				if (XL.allXhrSet) XL.allXhrSet.add(xhr);
				if (target && XL.xhrMap) {
					const set = XL.xhrMap.get(target);
					if (set) set.add(xhr);
					else XL.xhrMap.set(target, new Set([xhr]));
					if (
						typeof target.listeners === "function" &&
						typeof XL.cancelXHRs === "function" &&
						!target.listeners("destroy").includes(XL.cancelXHRs)
					)
						target.once("destroy", XL.cancelXHRs);
				}
			} catch (e) {
				LOG("xhrMap bookkeeping failed", e);
			}
			xhr.open("GET", url);
			xhr.responseType = type;
			xhr.onload = () => {
				if ((xhr.status === 200 || xhr.status === 0) && xhr.response)
					onload(xhr.response);
				else xhr.onerror();
			};
			xhr.onerror = () => onerror(new Error("加载失败（GM 通道）：" + url));
			xhr.onabort = () => onerror(new Error("已取消：" + url));
			xhr.onloadend = () => {
				try {
					if (XL.allXhrSet) XL.allXhrSet.delete(xhr);
					if (target && XL.xhrMap) {
						const set = XL.xhrMap.get(target);
						if (set) set.delete(xhr);
					}
				} catch (e) {}
			};
			return xhr;
		};
		return true;
	}

	function patchPixiUnsafeEval(PIXI) {
		const SS =
			PIXI.ShaderSystem || (PIXI.systems && PIXI.systems.ShaderSystem) || null;
		if (!SS) return "none";
		try {
			if (PIXI.unsafeEval && typeof PIXI.unsafeEval.install === "function") {
				PIXI.unsafeEval.install(PIXI);
				return "official";
			}
		} catch (e) {
			LOG("official unsafe-eval plugin failed", e);
		}
		// pixi 启动时会用 new Function 探测 unsafe-eval，失败就抛错 → 直接去掉
		SS.prototype.systemCheck = function () {};
		// 把“生成代码 + new Function”的 uniform 同步换成运行时遍历（等价于 @pixi/unsafe-eval）
		SS.prototype.syncUniforms = function (group, glProgram, syncData) {
			syncUniformsRuntime(
				glProgram.uniformData,
				group.uniforms,
				this.renderer,
				syncData,
			);
		};
		return "patched";
	}

	const SINGLE = {
		float: (gl, l, v) => gl.uniform1f(l, v),
		vec2: (gl, l, v) => gl.uniform2f(l, v[0], v[1]),
		vec3: (gl, l, v) => gl.uniform3f(l, v[0], v[1], v[2]),
		vec4: (gl, l, v) => gl.uniform4f(l, v[0], v[1], v[2], v[3]),
		int: (gl, l, v) => gl.uniform1i(l, v),
		ivec2: (gl, l, v) => gl.uniform2i(l, v[0], v[1]),
		ivec3: (gl, l, v) => gl.uniform3i(l, v[0], v[1], v[2]),
		ivec4: (gl, l, v) => gl.uniform4i(l, v[0], v[1], v[2], v[3]),
		bool: (gl, l, v) => gl.uniform1i(l, v),
		bvec2: (gl, l, v) => gl.uniform2i(l, v[0], v[1]),
		bvec3: (gl, l, v) => gl.uniform3i(l, v[0], v[1], v[2]),
		bvec4: (gl, l, v) => gl.uniform4i(l, v[0], v[1], v[2], v[3]),
		mat2: (gl, l, v) => gl.uniformMatrix2fv(l, false, v),
		mat3: (gl, l, v) => gl.uniformMatrix3fv(l, false, v),
		mat4: (gl, l, v) => gl.uniformMatrix4fv(l, false, v),
		sampler2D: (gl, l, v) => gl.uniform1i(l, v),
		samplerCube: (gl, l, v) => gl.uniform1i(l, v),
		sampler2DArray: (gl, l, v) => gl.uniform1i(l, v),
	};

	const ARRAY = {
		float: (gl, l, v) => gl.uniform1fv(l, v),
		vec2: (gl, l, v) => gl.uniform2fv(l, v),
		vec3: (gl, l, v) => gl.uniform3fv(l, v),
		vec4: (gl, l, v) => gl.uniform4fv(l, v),
		mat2: (gl, l, v) => gl.uniformMatrix2fv(l, false, v),
		mat3: (gl, l, v) => gl.uniformMatrix3fv(l, false, v),
		mat4: (gl, l, v) => gl.uniformMatrix4fv(l, false, v),
		int: (gl, l, v) => gl.uniform1iv(l, v),
		ivec2: (gl, l, v) => gl.uniform2iv(l, v),
		ivec3: (gl, l, v) => gl.uniform3iv(l, v),
		ivec4: (gl, l, v) => gl.uniform4iv(l, v),
		bool: (gl, l, v) => gl.uniform1iv(l, v),
		bvec2: (gl, l, v) => gl.uniform2iv(l, v),
		bvec3: (gl, l, v) => gl.uniform3iv(l, v),
		bvec4: (gl, l, v) => gl.uniform4iv(l, v),
		sampler2D: (gl, l, v) => gl.uniform1iv(l, v),
		samplerCube: (gl, l, v) => gl.uniform1iv(l, v),
		sampler2DArray: (gl, l, v) => gl.uniform1iv(l, v),
	};

	// 与 pixi 5.3 generateUniformsSync 生成的代码一一对应，只是不生成代码
	function syncUniformsRuntime(ud, uv, renderer, syncData) {
		const gl = renderer.gl;
		for (const name in uv) {
			const data = ud[name];
			const value = uv[name];
			if (!data) {
				if (value && value.group === true)
					renderer.shader.syncUniformGroup(value, syncData);
				continue;
			}
			const loc = data.location;
			const type = data.type;
			const single = data.size === 1 && !data.isArray;

			// 纹理：先绑定到贴图单元，再传单元编号
			if (
				single &&
				(type === "sampler2D" ||
					type === "samplerCube" ||
					type === "sampler2DArray")
			) {
				const unit = syncData ? syncData.textureCount++ : 0;
				renderer.texture.bind(value, unit);
				if (data.value !== unit) {
					data.value = unit;
					gl.uniform1i(loc, unit);
				}
				continue;
			}

			if (single && type === "float" && typeof value === "number") {
				if (data.value !== value) {
					data.value = value;
					gl.uniform1f(loc, value);
				}
				continue;
			}

			// PIXI.Matrix -> mat3
			if (single && type === "mat3" && value && value.a !== undefined) {
				gl.uniformMatrix3fv(loc, false, value.toArray(true));
				continue;
			}

			// PIXI.Point / ObservablePoint -> vec2
			if (single && type === "vec2" && value && value.x !== undefined) {
				gl.uniform2f(loc, value.x, value.y);
				continue;
			}

			// PIXI.Rectangle -> vec4
			if (single && type === "vec4" && value && value.width !== undefined) {
				gl.uniform4f(loc, value.x, value.y, value.width, value.height);
				continue;
			}

			const setter = (single ? SINGLE : ARRAY)[type];
			if (!setter) {
				LOG("unhandled uniform", name, type, data.size);
				continue;
			}
			setter(gl, loc, value);
		}
	}

	async function preloadTextures(PIXI, modelUrl, textures) {
		for (const rel of textures || []) {
			const url = new URL(rel, modelUrl).href;
			if (PIXI.utils.TextureCache[url]) continue;
			const bitmap = await gmFetchTransformed(
				url,
				"blob",
				(blob) => createImageBitmap(blob),
				"texture-bitmap",
			);
			const texture = PIXI.Texture.from(bitmap);
			PIXI.BaseTexture.addToCache(texture.baseTexture, url);
			PIXI.Texture.addToCache(texture, url);
			LOG("texture ready", url, texture.baseTexture.valid);
		}
	}

	// ------------------------------------------------------------- 主流程 ---
	async function main() {
		if (W.__fireflyLive2DLoading || W.FireflyLive2D) return;
		if (!allowedHere()) return LOG("site disabled", HOST);
		const coarsePointer = (() => {
			try {
				return !!window.matchMedia?.("(pointer: coarse)").matches;
			} catch (_) {
				return false;
			}
		})();
		const touchAllowed = Boolean(USER_CONFIG.allowTouch && coarsePointer);
		if (!touchAllowed && (coarsePointer || window.innerWidth < USER_CONFIG.minWidth)) return;

		if (!CUBISM) throw new Error("Live2DCubismCore 未加载，请检查 @require 地址");
		if (!PX) throw new Error("PixiJS 未加载，请检查 @require 地址");
		if (!PX.live2d || !PX.live2d.Live2DModel)
			throw new Error(
				"cubism4.min.js 未正确初始化：请确认 load/firefly-glue.js 已上传，" +
					"且 @require 顺序为 core → pixi → glue → cubism4",
			);

		if (!W.PIXI) W.PIXI = PX;
		if (!W.Live2DCubismCore) W.Live2DCubismCore = CUBISM;

		// PixiJS 5 自己也用 new Function 生成 uniform 同步代码，在 GitHub 这类
		// 不允许 unsafe-eval 的页面上会直接报错。这里提前打好补丁。
		patchPixiUnsafeEval(PX);
		LOG("XHRLoader patched:", patchXHRLoader(PX));

		injectCSS(CSS);

		const modelUrl = BASE + "model/Firefly.model3.json";
		const settings = await gmFetch(modelUrl, "json");
		await preloadTextures(PX, modelUrl, (settings.FileReferences || {}).Textures);

		W.FireflyLive2DConfig = Object.assign({ baseUrl: BASE }, USER_CONFIG);
		runLoader(PX, ShimAudio, ShimXHR, FF);

		// 如果页面本来就有自己的 PIXI（比如某些游戏站），启动完成后还回去，避免冲突
		if (glue && glue.prevPIXI && glue.prevPIXI !== PX) {
			const timer = setInterval(() => {
				if (!W.FireflyLive2D) return;
				clearInterval(timer);
				try {
					W.PIXI = glue.prevPIXI;
				} catch (e) {}
			}, 500);
			setTimeout(() => clearInterval(timer), 60000);
		}

		if (typeof GM_registerMenuCommand === "function") {
			GM_registerMenuCommand("🌟 显示流萤", () => W.FireflyLive2D?.show());
			GM_registerMenuCommand("🙈 隐藏流萤", () => W.FireflyLive2D?.hide());
			GM_registerMenuCommand("🎲 随机互动", () => W.FireflyLive2D?.randomAction());
			GM_registerMenuCommand("🕶 墨镜开关", () =>
				W.FireflyLive2D?.toggleSunglasses(),
			);
			GM_registerMenuCommand("🐱 猫耳开关", () => W.FireflyLive2D?.toggleCatEars());
			GM_registerMenuCommand("ℹ️ 当前加载模式", () => {
				const touch = !!W.FireflyLive2D?.config && window.matchMedia?.("(pointer: coarse)").matches;
				const status = getResourceStatus()
					.map((item) => {
						const cooldown = item.cooldownRemaining
							? `（熔断剩余 ${Math.ceil(item.cooldownRemaining / 1000)} 秒）`
							: "（可用）";
						return `${item.name}${cooldown}`;
					})
					.join("\n");
				alert(
					`流萤看板娘 v6.6.2\n当前网站：${HOST}\n模式：${touch ? "触摸端" : "桌面端"}\n最近成功资源源：${lastResourceSource}\n\n${status}`,
				);
			});
		}
	}

	// v6.4 网页内核通过参数拿到 PIXI / Audio / XMLHttpRequest 替身，
	// 同步触摸端与页面感知能力，同时继续绕过严格 CSP。
	function runLoader(PIXI, Audio, XMLHttpRequest, FF) {
	(() => {
	  "use strict";

	  if (window.__fireflyLive2DLoading || window.FireflyLive2D) return;
	  window.__fireflyLive2DLoading = true;

	  const currentScript = document.currentScript;
	  const scriptBase = currentScript?.src
	    ? new URL("./", currentScript.src).href
	    : new URL("./", location.href).href;

	  const defaults = {
	    baseUrl: scriptBase,
	    model: "model/Firefly.model3.json",
	    core: "load/live2dcubismcore.min.js",
	    pixi: "load/pixi.min.js",
	    live2d: "load/cubism4.min.js",
	    css: "firefly.css",
	    icon: "assets/firefly-icon.jpg",
	    side: "left",
	    width: 420,
	    height: 620,
	    scale: 0.94,
	    offsetX: -20,
	    offsetY: 12,
	    zIndex: 52,
	    minWidth: 1025,
	    allowTouch: false,
	    touchWidth: 260,
	    touchHeight: 360,
	    touchScale: 0.9,
	    touchOffsetX: -12,
	    touchOffsetY: 8,
	    touchControlsHideDelay: 3200,
	    storageKey: "alist-firefly-live2d-hidden",
	    welcome: "开拓者，我回来啦~",
	    pageTitleMessage: true,
	    pageTitleTemplate: "又在看 {title} 呀~",
	    pageTitleMessageDelay: 3400,
	    pageTitleChangeDelay: 700,
	    titleMaxLength: 28,
	    returnMessage: "欢迎回来~",
	    returnMessageMinHidden: 1000,
	    linkHoverMessage: true,
	    linkHoverTemplate: "想去看看{label}吗？",
	    linkHoverDelay: 1400,
	    linkHoverDuration: 2800,
	    linkHoverCooldown: 8000,
	    linkLabelMaxLength: 22,
	    linkLongPressDelay: 650,
	    linkLongPressMoveTolerance: 12,
	    copyMessage: "复制好啦，希望能帮到你~",
	    copyMessageDuration: 2300,
	    bottomMessage: "已经看到页面底部啦，辛苦了~",
	    bottomMessageThreshold: 0.92,
	    idleMessages: [
	      "在忙什么呢？也要记得休息呀~",
	      "累了的话，就稍微休息一下吧。",
	      "我会一直陪着你的，开拓者。",
	    ],
	    idleMessageDelay: 90000,
	    idleMessageInterval: 120000,
	    fallbackClick: true,
	    touchTapMoveTolerance: 14,
	    touchTapMaxDuration: 600,
	    expressionDuration: 4200,
	    dialogGap: 24,
	    buttonHintDuration: 2600,
	    controlsHideDelay: 180,
	    homeUrl: "/",
	    profileUrl: "https://bbs.mihoyo.com/sr/wiki/content/2674/detail?bbs_presentation_style=no_header",
	    profileHint: "我叫流萤，想要更多了解我吗？",
	    debug: false,
	  };

	  const cfg = Object.assign({}, defaults, window.FireflyLive2DConfig || {});
	  cfg.baseUrl = new URL(cfg.baseUrl, scriptBase).href;
	  const asset = (path) => new URL(path, cfg.baseUrl).href;
	  const log = (...args) => cfg.debug && console.log("[Firefly Live2D]", ...args);

	  const matchesMedia = (query) => {
	    try {
	      return !!window.matchMedia?.(query).matches;
	    } catch (_) {
	      return false;
	    }
	  };

	  const isCoarsePointer = () => matchesMedia("(pointer: coarse)");
	  const isPureTouchDevice = () =>
	    matchesMedia("(hover: none) and (pointer: coarse)");
	  const isTouchMode = () => Boolean(cfg.allowTouch && isCoarsePointer());
	  const canDisplay = () =>
	    isTouchMode() || (window.innerWidth >= Number(cfg.minWidth || 0) && !isCoarsePointer());

	  const finiteNumber = (value, fallback) => {
	    const parsed = Number(value);
	    return Number.isFinite(parsed) ? parsed : fallback;
	  };

	  const desktopLayout = Object.freeze({
	    width: Math.max(1, finiteNumber(cfg.width, defaults.width)),
	    height: Math.max(1, finiteNumber(cfg.height, defaults.height)),
	    scale: Math.max(0.01, finiteNumber(cfg.scale, defaults.scale)),
	    offsetX: finiteNumber(cfg.offsetX, defaults.offsetX),
	    offsetY: finiteNumber(cfg.offsetY, defaults.offsetY),
	    touch: false,
	  });

	  const createLayout = () => {
	    if (!isTouchMode()) return { ...desktopLayout };

	    const viewportWidth = Math.max(1, finiteNumber(
	      window.visualViewport?.width,
	      window.innerWidth || desktopLayout.width,
	    ));
	    const viewportHeight = Math.max(1, finiteNumber(
	      window.visualViewport?.height,
	      window.innerHeight || desktopLayout.height,
	    ));

	    return {
	      width: Math.min(
	        viewportWidth,
	        Math.max(1, finiteNumber(cfg.touchWidth, defaults.touchWidth)),
	      ),
	      height: Math.min(
	        viewportHeight,
	        Math.max(1, finiteNumber(cfg.touchHeight, defaults.touchHeight)),
	      ),
	      scale: Math.max(0.01, finiteNumber(cfg.touchScale, defaults.touchScale)),
	      offsetX: finiteNumber(cfg.touchOffsetX, defaults.touchOffsetX),
	      offsetY: finiteNumber(cfg.touchOffsetY, defaults.touchOffsetY),
	      touch: true,
	    };
	  };

	  let layout = createLayout();

	  if (!canDisplay()) {
	    window.__fireflyLive2DLoading = false;
	    return;
	  }

	  function loadStyle() {
	    // userscript：CSS 已通过 GM_addStyle / CSSOM 注入，避免页面 style-src CSP。
	  }

	  function loadScript(url, readyCheck) {
	    if (readyCheck?.()) return Promise.resolve();
	    return Promise.reject(new Error(`油猴 @require 依赖尚未就绪：${url}`));
	  }

	  function createElements() {
	    const root = document.createElement("div");
	    root.className = `ff-live2d-root${cfg.side === "left" ? " ff-left" : ""}${layout.touch ? " ff-touch" : ""}`;
	    root.style.setProperty("--ff-width", `${layout.width}px`);
	    root.style.setProperty("--ff-height", `${layout.height}px`);
	    root.style.zIndex = String(cfg.zIndex);

	    const canvas = document.createElement("canvas");
	    canvas.className = "ff-live2d-canvas";
	    canvas.setAttribute("aria-label", "流萤 Live2D 看板娘");

	    const dialog = document.createElement("div");
	    dialog.className = "ff-live2d-dialog";

	    const controls = document.createElement("div");
	    controls.className = "ff-live2d-controls";

	    const homeButton = document.createElement("button");
	    homeButton.className = "ff-live2d-button";
	    homeButton.type = "button";
	    homeButton.setAttribute("aria-label", "返回首页");
	    homeButton.textContent = "🔙";

	    const randomButton = document.createElement("button");
	    randomButton.className = "ff-live2d-button";
	    randomButton.type = "button";
	    randomButton.setAttribute("aria-label", "随机动作或表情");
	    randomButton.textContent = "😊";

	    const profileButton = document.createElement("button");
	    profileButton.className = "ff-live2d-button";
	    profileButton.type = "button";
	    profileButton.setAttribute("aria-label", "了解流萤");
	    profileButton.textContent = "🔗";

	    const closeButton = document.createElement("button");
	    closeButton.className = "ff-live2d-button";
	    closeButton.type = "button";
	    closeButton.setAttribute("aria-label", "隐藏流萤");
	    closeButton.textContent = "❌";

	    controls.append(homeButton, randomButton, profileButton, closeButton);
	    root.append(canvas, dialog, controls);
	    document.body.appendChild(root);

	    const showButton = document.createElement("button");
	    showButton.className = `ff-live2d-show${cfg.side === "left" ? " ff-left" : ""}${layout.touch ? " ff-touch" : ""}`;
	    showButton.type = "button";
	    showButton.title = "显示流萤";
	    showButton.setAttribute("aria-label", "显示流萤");
	    showButton.style.zIndex = String(cfg.zIndex);

	    const showIcon = document.createElement("img");
	    FF.setIcon(showIcon, asset(cfg.icon));
	    showIcon.alt = "流萤";
	    showIcon.draggable = false;
	    showButton.appendChild(showIcon);
	    document.body.appendChild(showButton);

	    return {
	      root,
	      canvas,
	      dialog,
	      controls,
	      homeButton,
	      randomButton,
	      profileButton,
	      closeButton,
	      showButton,
	    };
	  }

	  async function boot() {
	    loadStyle(asset(cfg.css));

	    await loadScript(asset(cfg.core), () => !!window.Live2DCubismCore);
	    await loadScript(asset(cfg.pixi), () => !!window.PIXI);
	    await loadScript(asset(cfg.live2d), () => !!window.PIXI?.live2d?.Live2DModel);

	    const {
	      root,
	      canvas,
	      dialog,
	      controls,
	      homeButton,
	      randomButton,
	      profileButton,
	      closeButton,
	      showButton,
	    } = createElements();

	    let dialogTimer = 0;
	    let dialogVisibleUntil = 0;
	    let expressionTimer = 0;
	    let model = null;
	    let modelNaturalWidth = 0;
	    let modelNaturalHeight = 0;
	    let lastHitAt = 0;
	    let hitSerial = 0;
	    let destroyed = false;
	    let actionSerial = 0;
	    let lastRandomIndex = -1;
	    let controlsHideTimer = 0;
	    let pointerOverModel = false;
	    let pointerOverControls = false;
	    let currentActionAudio = null;
	    let dialogResizeObserver = null;
	    let pageInteractionCleanup = () => {};
	    const motionSoundFiles = new Map();

	    const app = new PIXI.Application({
	      view: canvas,
	      width: layout.width,
	      height: layout.height,
	      transparent: true,
	      antialias: true,
	      autoDensity: true,
	      resolution: Math.min(window.devicePixelRatio || 1, 2),
	      autoStart: true,
	    });

	    if (PIXI.Ticker && PIXI.live2d.Live2DModel.registerTicker) {
	      PIXI.live2d.Live2DModel.registerTicker(PIXI.Ticker);
	    }

	    const expressionName = {
	      normal: "expression00.exp3",
	      upset: "expression3.exp3",
	      disdain: "expression4.exp3",
	      angry: "expression5.exp3",
	      puzzled: "expression6.exp3",
	      crying: "expression7.exp3",
	      sweating: "expression8.exp3",
	      stunned: "expression9.exp3",
	      giggle: "expression10.exp3",
	    };

	    // 墨镜和猫耳分别由 Param / Param40 控制。它们必须独立于
	    // ExpressionManager 保存，否则切换表情或播放动作时会相互覆盖。
	    const accessories = {
	      sunglasses: false,
	      catEars: false,
	    };

	    const accessoryParameters = {
	      sunglasses: "Param",
	      catEars: "Param40",
	    };

	    const applyAccessories = () => {
	      const coreModel = model?.internalModel?.coreModel;
	      if (!coreModel) return;
	      coreModel.setParameterValueById(
	        accessoryParameters.sunglasses,
	        accessories.sunglasses ? 1 : 0,
	      );
	      coreModel.setParameterValueById(
	        accessoryParameters.catEars,
	        accessories.catEars ? 1 : 0,
	      );
	    };

	    const getModelBounds = () => {
	      if (!model) return null;
	      try {
	        const bounds = model.getBounds();
	        if (
	          Number.isFinite(bounds.x) &&
	          Number.isFinite(bounds.y) &&
	          Number.isFinite(bounds.width) &&
	          Number.isFinite(bounds.height)
	        ) {
	          return bounds;
	        }
	      } catch (error) {
	        log("getBounds failed", error);
	      }
	      return null;
	    };

	    const positionControls = () => {
	      const bounds = getModelBounds();
	      if (!bounds) return;

	      // 控件靠近模型右侧，不再悬在模型上方。
	      const controlWidth = controls.offsetWidth || 34;
	      const controlHeight = controls.offsetHeight || 151;
	      const desiredLeft = bounds.x + bounds.width + 2;
	      const left = Math.max(
	        4,
	        Math.min(layout.width - controlWidth - 4, desiredLeft),
	      );
	      const minimumTop = layout.touch ? 4 : 70;
	      const top = Math.max(
	        minimumTop,
	        Math.min(layout.height - controlHeight - 4, bounds.y + bounds.height * 0.30),
	      );
	      controls.style.left = `${Math.round(left)}px`;
	      controls.style.top = `${Math.round(top)}px`;
	    };

	    const setControlsVisible = (visible) => {
	      clearTimeout(controlsHideTimer);
	      root.classList.toggle("ff-controls-visible", visible);
	    };

	    const scheduleControlsHide = (delay = cfg.controlsHideDelay) => {
	      clearTimeout(controlsHideTimer);
	      controlsHideTimer = window.setTimeout(() => {
	        if (!pointerOverModel && !pointerOverControls) {
	          setControlsVisible(false);
	        }
	      }, Math.max(0, finiteNumber(delay, cfg.controlsHideDelay)));
	    };

	    const pointerIsOverModel = (event) => {
	      const bounds = getModelBounds();
	      const rect = canvas.getBoundingClientRect();
	      if (!bounds || !rect.width || !rect.height) return false;

	      const x = (event.clientX - rect.left) * (layout.width / rect.width);
	      const y = (event.clientY - rect.top) * (layout.height / rect.height);
	      return (
	        x >= bounds.x &&
	        x <= bounds.x + bounds.width &&
	        y >= bounds.y &&
	        y <= bounds.y + bounds.height
	      );
	    };

	    const getHitAreaCanvasBounds = (names) => {
	      const internalModel = model?.internalModel;
	      if (
	        !internalModel?.hitAreas ||
	        typeof internalModel.getDrawableBounds !== "function" ||
	        typeof model?.toGlobal !== "function"
	      ) return null;

	      let minX = Infinity;
	      let minY = Infinity;
	      let maxX = -Infinity;
	      let maxY = -Infinity;
	      let found = false;

	      for (const name of names) {
	        const hitArea = internalModel.hitAreas[name];
	        if (!hitArea || hitArea.index < 0) continue;

	        let bounds;
	        try {
	          bounds = internalModel.getDrawableBounds(hitArea.index, {});
	        } catch (error) {
	          log(`getDrawableBounds failed: ${name}`, error);
	          continue;
	        }

	        const corners = [
	          [bounds.x, bounds.y],
	          [bounds.x + bounds.width, bounds.y],
	          [bounds.x, bounds.y + bounds.height],
	          [bounds.x + bounds.width, bounds.y + bounds.height],
	        ];

	        for (const [x, y] of corners) {
	          const point = new PIXI.Point(x, y);
	          internalModel.localTransform.apply(point, point);
	          const global = model.toGlobal(point);
	          if (!Number.isFinite(global.x) || !Number.isFinite(global.y)) continue;
	          minX = Math.min(minX, global.x);
	          minY = Math.min(minY, global.y);
	          maxX = Math.max(maxX, global.x);
	          maxY = Math.max(maxY, global.y);
	          found = true;
	        }
	      }

	      if (!found) return null;
	      return {
	        x: minX,
	        y: minY,
	        width: maxX - minX,
	        height: maxY - minY,
	      };
	    };

	    const getVisibleArtworkCanvasBounds = (horizontalRange = null) => {
	      const internalModel = model?.internalModel;
	      const coreModel = internalModel?.coreModel;
	      const drawableCount = coreModel?.getDrawableCount?.();
	      if (
	        !Number.isFinite(drawableCount) ||
	        drawableCount <= 0 ||
	        typeof internalModel?.getDrawableBounds !== "function" ||
	        typeof model?.toGlobal !== "function"
	      ) return null;

	      let minX = Infinity;
	      let minY = Infinity;
	      let maxX = -Infinity;
	      let maxY = -Infinity;
	      let found = false;

	      for (let index = 0; index < drawableCount; index += 1) {
	        try {
	          const opacity = coreModel.getDrawableOpacity?.(index);
	          if (Number.isFinite(opacity) && opacity <= 0.01) continue;

	          const visible = coreModel.getDrawableDynamicFlagIsVisible?.(index);
	          if (visible === false) continue;

	          const bounds = internalModel.getDrawableBounds(index, {});
	          if (
	            !bounds ||
	            !Number.isFinite(bounds.x) ||
	            !Number.isFinite(bounds.y) ||
	            !Number.isFinite(bounds.width) ||
	            !Number.isFinite(bounds.height) ||
	            bounds.width <= 0 ||
	            bounds.height <= 0
	          ) continue;

	          const corners = [
	            [bounds.x, bounds.y],
	            [bounds.x + bounds.width, bounds.y],
	            [bounds.x, bounds.y + bounds.height],
	            [bounds.x + bounds.width, bounds.y + bounds.height],
	          ];

	          let drawableMinX = Infinity;
	          let drawableMinY = Infinity;
	          let drawableMaxX = -Infinity;
	          let drawableMaxY = -Infinity;

	          for (const [x, y] of corners) {
	            const point = new PIXI.Point(x, y);
	            internalModel.localTransform.apply(point, point);
	            const global = model.toGlobal(point);
	            if (!Number.isFinite(global.x) || !Number.isFinite(global.y)) continue;
	            drawableMinX = Math.min(drawableMinX, global.x);
	            drawableMinY = Math.min(drawableMinY, global.y);
	            drawableMaxX = Math.max(drawableMaxX, global.x);
	            drawableMaxY = Math.max(drawableMaxY, global.y);
	          }

	          if (!Number.isFinite(drawableMinX) || !Number.isFinite(drawableMinY)) continue;
	          if (
	            horizontalRange &&
	            (drawableMaxX < horizontalRange.minX || drawableMinX > horizontalRange.maxX)
	          ) continue;

	          minX = Math.min(minX, drawableMinX);
	          minY = Math.min(minY, drawableMinY);
	          maxX = Math.max(maxX, drawableMaxX);
	          maxY = Math.max(maxY, drawableMaxY);
	          found = true;
	        } catch (error) {
	          log(`get visible drawable bounds failed: ${index}`, error);
	        }
	      }

	      if (!found) return null;
	      return {
	        x: minX,
	        y: minY,
	        width: maxX - minX,
	        height: maxY - minY,
	      };
	    };

	    const positionDialog = () => {
	      const modelBounds = getModelBounds();
	      if (!modelBounds || !dialog.classList.contains("ff-visible")) return;

	      // 三个点击区域适合确定头部的横向中心，但“刘海”Drawable 的上边缘
	      // 实际位于额头附近，并不是角色发顶。旧版把它误当作头顶，所以消息框
	      // 会向下压进约 20～30px 的头发区域。
	      const headBounds = getHitAreaCanvasBounds([
	        "刘海",
	        "左侧后发",
	        "右侧后发",
	      ]) || modelBounds;

	      // 在头部横向范围内遍历当前真正可见的 Drawable，取得实际发顶/猫耳
	      // 的最高点。这样既不会被透明画布留白抬得过高，也不会再以额头为锚点。
	      const headHorizontalPadding = Math.max(20, headBounds.width * 0.16);
	      const visibleHeadArtwork = getVisibleArtworkCanvasBounds({
	        minX: headBounds.x - headHorizontalPadding,
	        maxX: headBounds.x + headBounds.width + headHorizontalPadding,
	      });
	      const headTop = visibleHeadArtwork
	        ? Math.min(headBounds.y, visibleHeadArtwork.y)
	        : Math.min(headBounds.y, modelBounds.y);

	      const width = dialog.offsetWidth || 220;
	      const height = dialog.offsetHeight || 42;
	      const centerX = headBounds.x + headBounds.width * 0.5;
	      const left = Math.max(6, Math.min(layout.width - width - 6, centerX - width / 2));

	      // 始终保留 6px 基础安全距离，同时让 dialogGap 从 0 开始逐像素生效。
	      const configuredGap = Number.isFinite(Number(cfg.dialogGap))
	        ? Math.max(0, Number(cfg.dialogGap))
	        : 0;
	      const safeGap = 6 + configuredGap;
	      const desiredTop = headTop - height - safeGap;

	      // 允许消息框向根容器上方溢出；只有接近浏览器顶部时才做视口限制。
	      const rootRect = root.getBoundingClientRect();
	      const minTop = 6 - rootRect.top;
	      const maxTop = window.innerHeight - rootRect.top - height - 6;
	      const top = maxTop >= minTop
	        ? Math.max(minTop, Math.min(maxTop, desiredTop))
	        : desiredTop;

	      dialog.style.left = `${Math.round(left)}px`;
	      dialog.style.top = `${Math.round(top)}px`;
	    };

	    const say = (text, duration = 3000) => {
	      const message = String(text || "").trim();
	      if (!message) return false;

	      const parsedDuration = Number(duration);
	      const visibleDuration = Number.isFinite(parsedDuration)
	        ? Math.max(300, parsedDuration)
	        : 3000;

	      dialog.textContent = message;
	      dialog.classList.add("ff-visible");
	      dialogVisibleUntil = Date.now() + visibleDuration;
	      requestAnimationFrame(positionDialog);
	      clearTimeout(dialogTimer);
	      dialogTimer = window.setTimeout(() => {
	        dialog.classList.remove("ff-visible");
	        dialogVisibleUntil = 0;
	      }, visibleDuration);
	      return true;
	    };

	    const bindPageInteractions = () => {
	      const cleanups = [];
	      const timers = new Set();
	      let titleObserver = null;
	      let linkHoverTimer = 0;
	      let linkLongPressTimer = 0;
	      let linkLongPressAnchor = null;
	      let linkLongPressPointerId = null;
	      let linkLongPressStartX = 0;
	      let linkLongPressStartY = 0;
	      let linkLongPressTriggered = false;
	      let suppressLinkClickAnchor = null;
	      let suppressLinkClickUntil = 0;
	      let titleMessageTimer = 0;
	      let idleTimer = 0;
	      let scrollFrame = 0;
	      let activeLink = null;
	      let hiddenAt = document.hidden ? Date.now() : 0;
	      let lastCopyMessageAt = 0;
	      let lastIdleIndex = -1;
	      let bottomMessageShown = false;
	      let lastKnownTitle = "";
	      const linkShownAt = new WeakMap();

	      const addTimer = (callback, delay) => {
	        const timer = window.setTimeout(() => {
	          timers.delete(timer);
	          callback();
	        }, Math.max(0, Number(delay) || 0));
	        timers.add(timer);
	        return timer;
	      };

	      const clearManagedTimer = (timer) => {
	        if (!timer) return;
	        clearTimeout(timer);
	        timers.delete(timer);
	      };

	      const listen = (target, type, handler, options) => {
	        target.addEventListener(type, handler, options);
	        cleanups.push(() => target.removeEventListener(type, handler, options));
	      };

	      const normalizeText = (value) => String(value || "")
	        .replace(/[\u200B-\u200D\uFEFF]/g, "")
	        .replace(/\s+/g, " ")
	        .trim();

	      const truncateText = (value, maxLength) => {
	        const text = normalizeText(value);
	        const parsed = Number(maxLength);
	        const limit = Number.isFinite(parsed) ? Math.max(4, parsed) : 24;
	        return text.length > limit ? `${text.slice(0, limit - 1)}…` : text;
	      };

	      const applyTemplate = (template, values) => {
	        let result = String(template || "");
	        for (const [key, value] of Object.entries(values)) {
	          result = result.split(`{${key}}`).join(value);
	        }
	        return result;
	      };

	      const canSpeak = () => (
	        !destroyed &&
	        !document.hidden &&
	        root.classList.contains("ff-ready") &&
	        !root.classList.contains("ff-hidden")
	      );

	      const dialogIsBusy = () => (
	        dialog.classList.contains("ff-visible") &&
	        dialogVisibleUntil > Date.now() + 80
	      );

	      const getPageTitle = () => {
	        const title = normalizeText(document.title);
	        const fallback = normalizeText(
	          document.querySelector("h1")?.textContent ||
	          document.querySelector('[role="heading"][aria-level="1"]')?.textContent,
	        );
	        return truncateText(title || fallback, cfg.titleMaxLength);
	      };

	      const speakTitle = (title, delay = 0) => {
	        clearManagedTimer(titleMessageTimer);
	        if (!cfg.pageTitleMessage || !title) return;

	        const attempt = () => {
	          if (!canSpeak()) return;
	          if (dialogIsBusy()) {
	            titleMessageTimer = addTimer(
	              attempt,
	              Math.min(4000, Math.max(180, dialogVisibleUntil - Date.now() + 120)),
	            );
	            return;
	          }
	          say(applyTemplate(cfg.pageTitleTemplate, { title }), 3000);
	        };
	        titleMessageTimer = addTimer(attempt, delay);
	      };

	      const labelFromHashTarget = (anchor) => {
	        let url;
	        try {
	          url = new URL(anchor.href, window.location.href);
	        } catch (_) {
	          return "";
	        }
	        if (!url.hash || url.origin !== location.origin || url.pathname !== location.pathname) {
	          return "";
	        }
	        let id = url.hash.slice(1);
	        try { id = decodeURIComponent(id); } catch (_) { /* 保留原值 */ }
	        const target = document.getElementById(id);
	        if (!target) return "";
	        return normalizeText(
	          target.getAttribute("aria-label") ||
	          target.querySelector("h1, h2, h3, [role='heading']")?.textContent ||
	          target.textContent,
	        );
	      };

	      const getLinkLabel = (anchor) => {
	        const explicit = normalizeText(
	          anchor.dataset.fireflyLabel ||
	          anchor.getAttribute("aria-label") ||
	          anchor.getAttribute("title"),
	        );
	        const visibleText = normalizeText(anchor.innerText || anchor.textContent);
	        const imageAlt = normalizeText(anchor.querySelector("img[alt]")?.alt);
	        const hashLabel = labelFromHashTarget(anchor);

	        let urlLabel = "";
	        try {
	          const url = new URL(anchor.href, window.location.href);
	          if (url.protocol === "mailto:") urlLabel = "邮件";
	          else if (url.protocol === "tel:") urlLabel = "联系电话";
	          else if (url.origin !== location.origin) urlLabel = url.hostname.replace(/^www\./i, "");
	          else urlLabel = normalizeText(url.pathname.split("/").filter(Boolean).pop());
	        } catch (_) {
	          urlLabel = "";
	        }

	        return truncateText(
	          explicit || visibleText || imageAlt || hashLabel || urlLabel || "这个链接",
	          cfg.linkLabelMaxLength,
	        );
	      };

	      const getEligibleLink = (target) => {
	        const element = target instanceof Element ? target : target?.parentElement;
	        const anchor = element?.closest?.("a[href]");
	        if (!anchor || root.contains(anchor) || showButton.contains(anchor)) return null;
	        const rawHref = normalizeText(anchor.getAttribute("href"));
	        if (!rawHref || /^javascript:/i.test(rawHref)) return null;
	        return anchor;
	      };

	      const cancelLinkHover = (anchor = null) => {
	        if (anchor && activeLink !== anchor) return;
	        activeLink = null;
	        clearManagedTimer(linkHoverTimer);
	        linkHoverTimer = 0;
	      };

	      const beginLinkHover = (anchor, delay = cfg.linkHoverDelay) => {
	        if (!cfg.linkHoverMessage || !anchor || activeLink === anchor) return;
	        cancelLinkHover();
	        activeLink = anchor;

	        const attempt = () => {
	          if (activeLink !== anchor || !canSpeak()) return;
	          const lastShown = linkShownAt.get(anchor) || 0;
	          if (Date.now() - lastShown < Math.max(0, Number(cfg.linkHoverCooldown) || 0)) return;
	          if (dialogIsBusy()) {
	            linkHoverTimer = addTimer(
	              attempt,
	              Math.min(3000, Math.max(160, dialogVisibleUntil - Date.now() + 100)),
	            );
	            return;
	          }

	          const label = getLinkLabel(anchor);
	          const message = applyTemplate(cfg.linkHoverTemplate, { label });
	          if (say(message, cfg.linkHoverDuration)) linkShownAt.set(anchor, Date.now());
	        };

	        linkHoverTimer = addTimer(attempt, delay);
	      };

	      const clearLinkLongPress = (cancelMessage = true) => {
	        clearManagedTimer(linkLongPressTimer);
	        linkLongPressTimer = 0;
	        linkLongPressAnchor?.classList?.remove("ff-live2d-longpress-link");
	        if (cancelMessage && !linkLongPressTriggered && linkLongPressAnchor) {
	          cancelLinkHover(linkLongPressAnchor);
	        }
	        linkLongPressAnchor = null;
	        linkLongPressPointerId = null;
	        linkLongPressTriggered = false;
	      };

	      const triggerLinkLongPress = () => {
	        const anchor = linkLongPressAnchor;
	        if (!anchor) return false;
	        if (linkLongPressTriggered) return true;
	        if (!canSpeak()) return false;

	        const lastShown = linkShownAt.get(anchor) || 0;
	        if (
	          Date.now() - lastShown <
	          Math.max(0, finiteNumber(cfg.linkHoverCooldown, defaults.linkHoverCooldown))
	        ) return false;

	        linkLongPressTriggered = true;
	        suppressLinkClickAnchor = anchor;
	        suppressLinkClickUntil = Date.now() + 1200;
	        cancelLinkHover(anchor);
	        beginLinkHover(anchor, 0);
	        return true;
	      };

	      const onLinkPointerDown = (event) => {
	        if (event.pointerType !== "touch" || !isPureTouchDevice()) return;
	        const anchor = getEligibleLink(event.target);
	        if (!cfg.linkHoverMessage || !anchor) return;

	        clearLinkLongPress();
	        cancelLinkHover();
	        linkLongPressAnchor = anchor;
	        linkLongPressPointerId = event.pointerId;
	        linkLongPressStartX = event.clientX;
	        linkLongPressStartY = event.clientY;
	        anchor.classList.add("ff-live2d-longpress-link");
	        linkLongPressTimer = addTimer(
	          triggerLinkLongPress,
	          Math.max(250, finiteNumber(cfg.linkLongPressDelay, defaults.linkLongPressDelay)),
	        );
	      };

	      const onLinkPointerMove = (event) => {
	        if (event.pointerId !== linkLongPressPointerId || !linkLongPressAnchor) return;
	        const tolerance = Math.max(2, finiteNumber(
	          cfg.linkLongPressMoveTolerance,
	          defaults.linkLongPressMoveTolerance,
	        ));
	        if (Math.hypot(
	          event.clientX - linkLongPressStartX,
	          event.clientY - linkLongPressStartY,
	        ) > tolerance) {
	          clearLinkLongPress();
	        }
	      };

	      const onLinkPointerEnd = (event) => {
	        if (event.pointerId !== linkLongPressPointerId) return;
	        const wasTriggered = linkLongPressTriggered;
	        if (wasTriggered) suppressLinkClickUntil = Date.now() + 800;
	        clearLinkLongPress(!wasTriggered);
	      };

	      const onLinkContextMenu = (event) => {
	        const anchor = getEligibleLink(event.target);
	        if (!anchor || anchor !== linkLongPressAnchor || !isPureTouchDevice()) return;
	        if (triggerLinkLongPress()) event.preventDefault();
	      };

	      const onLinkClick = (event) => {
	        const anchor = getEligibleLink(event.target);
	        if (
	          !anchor ||
	          anchor !== suppressLinkClickAnchor ||
	          Date.now() > suppressLinkClickUntil
	        ) return;

	        suppressLinkClickAnchor = null;
	        suppressLinkClickUntil = 0;
	        event.preventDefault();
	        event.stopImmediatePropagation();
	      };

	      const resetIdleTimer = (delay = cfg.idleMessageDelay) => {
	        clearManagedTimer(idleTimer);
	        idleTimer = 0;
	        const messages = Array.isArray(cfg.idleMessages)
	          ? cfg.idleMessages.map(normalizeText).filter(Boolean)
	          : [];
	        if (!messages.length || Number(delay) <= 0) return;

	        idleTimer = addTimer(() => {
	          if (!canSpeak()) {
	            resetIdleTimer(cfg.idleMessageDelay);
	            return;
	          }
	          if (dialogIsBusy()) {
	            resetIdleTimer(5000);
	            return;
	          }
	          let index = Math.floor(Math.random() * messages.length);
	          if (messages.length > 1 && index === lastIdleIndex) {
	            index = (index + 1 + Math.floor(Math.random() * (messages.length - 1))) % messages.length;
	          }
	          lastIdleIndex = index;
	          say(messages[index], 3200);
	          resetIdleTimer(cfg.idleMessageInterval);
	        }, delay);
	      };

	      const onVisibilityChange = () => {
	        clearLinkLongPress();
	        cancelLinkHover();
	        if (document.hidden) {
	          hiddenAt = Date.now();
	          clearManagedTimer(idleTimer);
	          idleTimer = 0;
	          return;
	        }

	        const hiddenDuration = hiddenAt ? Date.now() - hiddenAt : 0;
	        hiddenAt = 0;
	        if (
	          cfg.returnMessage &&
	          hiddenDuration >= Math.max(0, Number(cfg.returnMessageMinHidden) || 0) &&
	          canSpeak()
	        ) {
	          say(cfg.returnMessage, 2800);
	        }
	        resetIdleTimer();
	      };

	      const onPointerOver = (event) => {
	        if (event.pointerType === "touch") return;
	        const anchor = getEligibleLink(event.target);
	        if (!anchor) return;
	        if (event.relatedTarget instanceof Node && anchor.contains(event.relatedTarget)) return;
	        beginLinkHover(anchor);
	      };

	      const onPointerOut = (event) => {
	        if (event.pointerType === "touch") return;
	        const anchor = getEligibleLink(event.target);
	        if (!anchor || activeLink !== anchor) return;
	        if (event.relatedTarget instanceof Node && anchor.contains(event.relatedTarget)) return;
	        cancelLinkHover(anchor);
	      };

	      const onFocusIn = (event) => beginLinkHover(getEligibleLink(event.target));
	      const onFocusOut = (event) => {
	        const anchor = getEligibleLink(event.target);
	        if (anchor) cancelLinkHover(anchor);
	      };

	      const onCopy = () => {
	        if (!cfg.copyMessage || !canSpeak()) return;
	        const now = Date.now();
	        if (now - lastCopyMessageAt < 4000) return;
	        lastCopyMessageAt = now;
	        say(cfg.copyMessage, cfg.copyMessageDuration);
	      };

	      const checkBottom = () => {
	        scrollFrame = 0;
	        if (bottomMessageShown || !cfg.bottomMessage || !canSpeak()) return;
	        const doc = document.documentElement;
	        const pageHeight = Math.max(doc.scrollHeight, document.body?.scrollHeight || 0);
	        if (pageHeight <= window.innerHeight * 1.35 || window.scrollY < 160) return;
	        const progress = (window.scrollY + window.innerHeight) / pageHeight;
	        const threshold = Math.min(1, Math.max(0.5, Number(cfg.bottomMessageThreshold) || 0.92));
	        if (progress < threshold || dialogIsBusy()) return;
	        bottomMessageShown = say(cfg.bottomMessage, 3000);
	      };

	      const onScroll = () => {
	        resetIdleTimer();
	        if (!scrollFrame) scrollFrame = requestAnimationFrame(checkBottom);
	      };

	      const onActivity = () => resetIdleTimer();

	      listen(document, "visibilitychange", onVisibilityChange);
	      listen(document, "pointerover", onPointerOver, true);
	      listen(document, "pointerout", onPointerOut, true);
	      listen(document, "pointerdown", onLinkPointerDown, true);
	      listen(document, "pointermove", onLinkPointerMove, { passive: true, capture: true });
	      listen(document, "pointerup", onLinkPointerEnd, true);
	      listen(document, "pointercancel", onLinkPointerEnd, true);
	      listen(document, "contextmenu", onLinkContextMenu, true);
	      listen(document, "click", onLinkClick, true);
	      listen(document, "focusin", onFocusIn, true);
	      listen(document, "focusout", onFocusOut, true);
	      listen(document, "copy", onCopy, true);
	      listen(window, "scroll", onScroll, { passive: true });
	      listen(document, "pointerdown", onActivity, { passive: true, capture: true });
	      listen(document, "keydown", onActivity, true);
	      listen(window, "wheel", onActivity, { passive: true });

	      if (document.head && "MutationObserver" in window) {
	        lastKnownTitle = getPageTitle();
	        titleObserver = new MutationObserver(() => {
	          const currentTitle = getPageTitle();
	          if (!currentTitle || currentTitle === lastKnownTitle) return;
	          lastKnownTitle = currentTitle;
	          speakTitle(currentTitle, cfg.pageTitleChangeDelay);
	        });
	        titleObserver.observe(document.head, {
	          subtree: true,
	          childList: true,
	          characterData: true,
	        });
	      } else {
	        lastKnownTitle = getPageTitle();
	      }

	      if (lastKnownTitle) speakTitle(lastKnownTitle, cfg.pageTitleMessageDelay);
	      resetIdleTimer();

	      return () => {
	        clearLinkLongPress();
	        cancelLinkHover();
	        clearManagedTimer(titleMessageTimer);
	        clearManagedTimer(idleTimer);
	        timers.forEach((timer) => clearTimeout(timer));
	        timers.clear();
	        titleObserver?.disconnect?.();
	        if (scrollFrame) cancelAnimationFrame(scrollFrame);
	        cleanups.splice(0).forEach((cleanup) => cleanup());
	      };
	    };

	    if ("ResizeObserver" in window) {
	      dialogResizeObserver = new ResizeObserver(() => {
	        if (dialog.classList.contains("ff-visible")) positionDialog();
	      });
	      dialogResizeObserver.observe(dialog);
	    }

	    const bindButtonHint = (button, text) => {
	      const showHint = () => say(text, cfg.buttonHintDuration);
	      button.addEventListener("mouseenter", showHint);
	      button.addEventListener("focus", showHint);
	    };

	    bindButtonHint(homeButton, "点击这里返回首页！");
	    bindButtonHint(randomButton, "点击这里，看看我会做什么吧！");
	    bindButtonHint(profileButton, cfg.profileHint);
	    bindButtonHint(closeButton, "点击这里暂时隐藏我。");

	    // 按钮默认隐藏：鼠标进入模型边界时显示；从模型移动到按钮区时
	    // 保持显示，离开两者后延迟收起，避免跨越间隙时闪烁。
	    canvas.addEventListener("pointermove", (event) => {
	      const inside = pointerIsOverModel(event);
	      if (inside) {
	        pointerOverModel = true;
	        setControlsVisible(true);
	      } else if (pointerOverModel) {
	        pointerOverModel = false;
	        scheduleControlsHide();
	      }
	    }, { passive: true });

	    canvas.addEventListener("pointerdown", (event) => {
	      if (event.pointerType !== "touch" || !layout.touch || !pointerIsOverModel(event)) return;
	      pointerOverModel = true;
	      setControlsVisible(true);
	    }, { passive: true });

	    canvas.addEventListener("pointerup", (event) => {
	      if (event.pointerType !== "touch" || !layout.touch) return;
	      pointerOverModel = false;
	      scheduleControlsHide(cfg.touchControlsHideDelay);
	    }, { passive: true });

	    canvas.addEventListener("pointercancel", (event) => {
	      if (event.pointerType !== "touch" || !layout.touch) return;
	      pointerOverModel = false;
	      scheduleControlsHide(cfg.touchControlsHideDelay);
	    }, { passive: true });

	    canvas.addEventListener("pointerleave", (event) => {
	      pointerOverModel = false;
	      scheduleControlsHide(
	        event.pointerType === "touch" && layout.touch
	          ? cfg.touchControlsHideDelay
	          : cfg.controlsHideDelay,
	      );
	    });

	    controls.addEventListener("mouseenter", () => {
	      pointerOverControls = true;
	      setControlsVisible(true);
	    });

	    controls.addEventListener("mouseleave", () => {
	      pointerOverControls = false;
	      scheduleControlsHide();
	    });

	    controls.addEventListener("focusin", () => {
	      pointerOverControls = true;
	      setControlsVisible(true);
	    });

	    controls.addEventListener("focusout", () => {
	      pointerOverControls = false;
	      scheduleControlsHide();
	    });

	    const applyModelLayout = () => {
	      if (!model || !modelNaturalWidth || !modelNaturalHeight) return;
	      const fit = Math.min(
	        layout.width / modelNaturalWidth,
	        layout.height / modelNaturalHeight,
	      ) * layout.scale;
	      model.scale.set(fit);
	      model.anchor.set(0.5, 1);
	      model.x = layout.width / 2 + layout.offsetX;
	      model.y = layout.height + layout.offsetY;
	    };

	    const applyResponsiveLayout = () => {
	      const nextLayout = createLayout();
	      const changed = Object.keys(nextLayout).some((key) => nextLayout[key] !== layout[key]);
	      layout = nextLayout;

	      root.classList.toggle("ff-touch", layout.touch);
	      showButton.classList.toggle("ff-touch", layout.touch);
	      root.style.setProperty("--ff-width", `${layout.width}px`);
	      root.style.setProperty("--ff-height", `${layout.height}px`);

	      if (changed) app.renderer.resize(layout.width, layout.height);
	      applyModelLayout();
	    };

	    const refreshRenderer = () => {
	      if (!model || destroyed) return;
	      requestAnimationFrame(() => {
	        applyResponsiveLayout();
	        model.visible = true;
	        applyAccessories();
	        positionControls();
	        if (dialog.classList.contains("ff-visible")) positionDialog();
	        try {
	          app.renderer.render(app.stage);
	        } catch (error) {
	          log("forced render failed", error);
	        }
	      });
	    };

	    // 不再使用 display:none 隐藏 Canvas。部分 WebGL/Live2D 环境在重新显示
	    // display:none 的画布后会出现局部 Drawable（常见为头部）未恢复的问题。
	    const setHidden = (hidden, persist = true) => {
	      const wasHidden = root.classList.contains("ff-hidden");
	      root.classList.toggle("ff-hidden", hidden);
	      root.setAttribute("aria-hidden", hidden ? "true" : "false");
	      showButton.classList.toggle("ff-visible", hidden && canDisplay());
	      if (persist) FF.store.set(cfg.storageKey, hidden ? "1" : "0");

	      if (hidden && !wasHidden && model) {
	        actionSerial += 1;
	        clearTimeout(expressionTimer);
	        stopActionAudio();
	        stopCurrentMotion();
	      } else if (!hidden) {
	        refreshRenderer();
	        if (wasHidden) model?.motion("Idle").catch?.(() => false);
	      }
	    };

	    const motionKey = (group, index) => `${group}:${index}`;

	    const captureMotionSounds = () => {
	      const motionManager = model?.internalModel?.motionManager;
	      const settings = model?.internalModel?.settings;
	      if (!motionManager?.definitions || !settings) return;

	      // pixi-live2d-display 0.3.1 的 SoundManager 在快速重播时会先 pause()
	      // 尚未完成 play() 的旧音频，产生 AbortError；旧音频的异步回调还可能
	      // 清空新音频状态。只对当前模型移除内置 Sound，并由下方播放器接管。
	      for (const [group, definitions] of Object.entries(motionManager.definitions)) {
	        if (!Array.isArray(definitions)) continue;
	        definitions.forEach((definition, index) => {
	          if (!definition?.Sound) return;
	          motionSoundFiles.set(
	            motionKey(group, index),
	            settings.resolveURL(definition.Sound),
	          );
	          delete definition.Sound;
	        });
	      }
	    };

	    const releaseActionAudio = (audio = currentActionAudio) => {
	      if (!audio) return;
	      if (currentActionAudio === audio) currentActionAudio = null;
	      audio.__fireflyStopped = true;
	      try { audio.pause(); } catch (error) { log("audio pause failed", error); }
	      try { audio.currentTime = 0; } catch (error) { log("audio rewind failed", error); }
	    };

	    const stopActionAudio = () => releaseActionAudio(currentActionAudio);

	    const startActionAudio = (group, index, serial) => {
	      const url = motionSoundFiles.get(motionKey(group, index));
	      if (!url) return null;

	      const audio = new Audio(url);
	      audio.preload = "auto";
	      audio.volume = 0.5;
	      audio.__fireflyStopped = false;
	      currentActionAudio = audio;

	      const clearCurrent = () => {
	        if (currentActionAudio === audio) currentActionAudio = null;
	      };
	      audio.addEventListener("ended", clearCurrent, { once: true });

	      const playPromise = audio.play();
	      playPromise?.catch?.((error) => {
	        // 快速重播时主动停止旧音频会令它的 play() Promise 以 AbortError
	        // 结束，这是正常中断，不应污染控制台，也不能影响新音频。
	        if (
	          audio.__fireflyStopped ||
	          serial !== actionSerial ||
	          error?.name === "AbortError"
	        ) return;
	        clearCurrent();
	        console.warn("[Firefly Live2D] 音频播放失败", url, error);
	      });

	      return audio;
	    };

	    const stopCurrentMotion = () => {
	      model?.internalModel?.motionManager?.stopAllMotions?.();
	    };

	    const beginAction = () => {
	      actionSerial += 1;
	      clearTimeout(expressionTimer);
	      return actionSerial;
	    };

	    const setNormalExpression = async () => {
	      if (!model) return false;
	      const ok = await model.expression(expressionName.normal).catch?.(() => false);
	      applyAccessories();
	      return !!ok;
	    };

	    const playMotion = async ({ group, index, text }) => {
	      if (!model) return false;
	      const serial = beginAction();
	      if (text) say(text);

	      // 每次都先终止旧动作和旧音频，再从 0 秒开始播放新音频。音频先在
	      // 当前点击手势内启动，避免 await 之后丢失浏览器的媒体播放授权。
	      stopCurrentMotion();
	      stopActionAudio();
	      const audio = startActionAudio(group, index, serial);

	      await setNormalExpression();
	      if (serial !== actionSerial || destroyed) {
	        releaseActionAudio(audio);
	        return false;
	      }

	      const ok = await model.motion(group, index, 3).catch?.(() => false);
	      if (serial !== actionSerial || destroyed) return false;
	      if (!ok) {
	        releaseActionAudio(audio);
	        log("motion start rejected", group, index);
	      }
	      applyAccessories();
	      return !!ok;
	    };

	    const playExpression = async ({ name, text, duration = cfg.expressionDuration }) => {
	      if (!model || !name) return false;
	      const serial = beginAction();
	      if (text) say(text, Math.min(duration, 3500));

	      // 表情属于新的交互动作，也应立即停止正在唱歌的音频与旧动作。
	      stopActionAudio();
	      stopCurrentMotion();

	      // 原桌宠把这些项目标为“按键”：本质上是回正动作叠加一个表情。
	      // Web 版不要求真实键盘绑定，随机按钮可直接调用它们。
	      await setNormalExpression();
	      if (serial !== actionSerial || destroyed) return false;
	      await model.motion("Reset", 0, 3).catch?.(() => false);
	      if (serial !== actionSerial || destroyed) return false;
	      const ok = await model.expression(name).catch?.(() => false);
	      if (serial !== actionSerial || destroyed) return false;
	      applyAccessories();

	      expressionTimer = window.setTimeout(async () => {
	        if (serial !== actionSerial || destroyed) return;
	        await setNormalExpression();
	      }, duration);

	      return !!ok;
	    };

	    const toggleAccessory = (name, textOn, textOff) => {
	      if (!model || !(name in accessories)) return false;
	      accessories[name] = !accessories[name];
	      say(accessories[name] ? textOn : textOff);
	      applyAccessories();
	      return accessories[name];
	    };

	    const hitActions = {
	      "饮料": () => playMotion({
	        group: "Reset",
	        index: 0,
	        text: "恢复精神，继续出发吧！",
	      }),
	      "蛋糕": () => playMotion({
	        group: "Tap",
	        index: 0,
	        text: "愿这一刻，使一颗心免于哀伤。",
	      }),
	      "左侧后发": () => playMotion({
	        group: "Tap",
	        index: 1,
	        text: "我将，点燃星海！",
	      }),
	      "刘海": () => toggleAccessory(
	        "sunglasses",
	        "墨镜模式启动！",
	        "墨镜收好啦~",
	      ),
	      "右侧后发": () => toggleAccessory(
	        "catEars",
	        "猫耳也很适合我吗？",
	        "猫耳先收起来啦~",
	      ),
	    };

	    const randomActions = [
	      {
	        name: "唱歌",
	        run: () => playMotion({
	          group: "Tap",
	          index: 0,
	          text: "愿这一刻，使一颗心免于哀伤。",
	        }),
	      },
	      {
	        name: "点燃星海",
	        run: () => playMotion({
	          group: "Tap",
	          index: 1,
	          text: "我将，点燃星海！",
	        }),
	      },
	      {
	        name: "难受",
	        run: () => playExpression({ name: expressionName.upset, text: "难受……" }),
	      },
	      {
	        name: "鄙夷",
	        run: () => playExpression({ name: expressionName.disdain, text: "鄙夷。" }),
	      },
	      {
	        name: "生气",
	        run: () => playExpression({ name: expressionName.angry, text: "生气了！" }),
	      },
	      {
	        name: "疑问",
	        run: () => playExpression({ name: expressionName.puzzled, text: "疑问？" }),
	      },
	      {
	        name: "哭泣",
	        run: () => playExpression({ name: expressionName.crying, text: "哭泣……" }),
	      },
	      {
	        name: "流汗",
	        run: () => playExpression({ name: expressionName.sweating, text: "流汗……" }),
	      },
	      {
	        name: "呆愣",
	        run: () => playExpression({ name: expressionName.stunned, text: "呆愣……" }),
	      },
	      {
	        name: "嘻嘻",
	        run: () => playExpression({ name: expressionName.giggle, text: "嘻嘻~" }),
	      },
	    ];

	    const randomAction = () => {
	      if (!randomActions.length) return false;
	      let index = Math.floor(Math.random() * randomActions.length);
	      if (randomActions.length > 1 && index === lastRandomIndex) {
	        index = (index + 1 + Math.floor(Math.random() * (randomActions.length - 1))) % randomActions.length;
	      }
	      lastRandomIndex = index;
	      log("random action", randomActions[index].name);
	      return randomActions[index].run();
	    };

	    model = PIXI.live2d.Live2DModel.fromSync(asset(cfg.model), {
	      autoInteract: true,
	      autoUpdate: true,
	      idleMotionGroup: "Idle",
	      motionPreload: "ALL",
	    });

	    model.once("load", async () => {
	      if (destroyed) return;
	      app.stage.addChild(model);

	      modelNaturalWidth = model.width;
	      modelNaturalHeight = model.height;
	      applyResponsiveLayout();

	      const motionManager = model.internalModel.motionManager;
	      motionManager.groups.idle = "Idle";
	      captureMotionSounds();
	      await setNormalExpression();
	      model.internalModel.on("beforeModelUpdate", applyAccessories);

	      model.on("hit", (hitAreas) => {
	        hitSerial += 1;
	        lastHitAt = performance.now();
	        const hit = hitAreas.find((name) => hitActions[name]);
	        if (hit) hitActions[hit]();
	      });

	      // 桌面端继续使用 click 兜底。触摸端不依赖浏览器合成 click，
	      // 而是单独识别一次未滑动、未长按的 pointer 轻触，避免部分
	      // 移动浏览器因 PIXI 命中处理或滚动手势而不派发 click。
	      canvas.addEventListener("click", () => {
	        if (!cfg.fallbackClick || layout.touch) return;
	        window.setTimeout(() => {
	          if (performance.now() - lastHitAt > 80) randomAction();
	        }, 0);
	      });

	      let touchTapPointerId = null;
	      let touchTapStartX = 0;
	      let touchTapStartY = 0;
	      let touchTapStartedAt = 0;
	      let touchTapHitSerial = 0;
	      let touchTapMoved = false;

	      const resetTouchFallbackTap = () => {
	        touchTapPointerId = null;
	        touchTapStartX = 0;
	        touchTapStartY = 0;
	        touchTapStartedAt = 0;
	        touchTapHitSerial = hitSerial;
	        touchTapMoved = false;
	      };

	      canvas.addEventListener("pointerdown", (event) => {
	        if (
	          !cfg.fallbackClick ||
	          !layout.touch ||
	          event.pointerType !== "touch" ||
	          event.isPrimary === false
	        ) return;

	        touchTapPointerId = event.pointerId;
	        touchTapStartX = event.clientX;
	        touchTapStartY = event.clientY;
	        touchTapStartedAt = performance.now();
	        touchTapHitSerial = hitSerial;
	        touchTapMoved = false;
	      }, { passive: true });

	      canvas.addEventListener("pointermove", (event) => {
	        if (event.pointerId !== touchTapPointerId || touchTapMoved) return;
	        const tolerance = Math.max(0, finiteNumber(
	          cfg.touchTapMoveTolerance,
	          defaults.touchTapMoveTolerance,
	        ));
	        if (
	          Math.hypot(
	            event.clientX - touchTapStartX,
	            event.clientY - touchTapStartY,
	          ) > tolerance
	        ) touchTapMoved = true;
	      }, { passive: true });

	      const finishTouchFallbackTap = (event) => {
	        if (event.pointerId !== touchTapPointerId) return;

	        const elapsed = performance.now() - touchTapStartedAt;
	        const maxDuration = Math.max(0, finiteNumber(
	          cfg.touchTapMaxDuration,
	          defaults.touchTapMaxDuration,
	        ));
	        const hitSerialAtStart = touchTapHitSerial;
	        const shouldTrigger =
	          event.type === "pointerup" &&
	          !touchTapMoved &&
	          elapsed <= maxDuration;

	        resetTouchFallbackTap();
	        if (!shouldTrigger) return;

	        // 等待 PIXI 的 pointertap / hit 先完成。若命中了饮料、蛋糕、
	        // 刘海或后发等专属区域，hitSerial 会变化，此处不会再随机一次。
	        window.setTimeout(() => {
	          if (
	            destroyed ||
	            !cfg.fallbackClick ||
	            !layout.touch ||
	            hitSerial !== hitSerialAtStart
	          ) return;
	          randomAction();
	        }, 120);
	      };

	      canvas.addEventListener("pointerup", finishTouchFallbackTap, { passive: true });
	      canvas.addEventListener("pointercancel", finishTouchFallbackTap, { passive: true });
	      canvas.addEventListener("lostpointercapture", finishTouchFallbackTap, { passive: true });

	      homeButton.addEventListener("click", (event) => {
	        event.stopPropagation();
	        const target = new URL(cfg.homeUrl, window.location.href).href;
	        window.location.assign(target);
	      });

	      randomButton.addEventListener("click", (event) => {
	        event.stopPropagation();
	        randomAction();
	      });

	      profileButton.addEventListener("click", (event) => {
	        event.stopPropagation();
	        const target = new URL(cfg.profileUrl, window.location.href).href;
	        const opened = window.open(target, "_blank", "noopener,noreferrer");
	        if (opened) opened.opener = null;
	      });

	      root.classList.add("ff-ready");
	      positionControls();
	      setHidden(FF.store.get(cfg.storageKey) === "1", false);
	      if (!root.classList.contains("ff-hidden")) say(cfg.welcome);
	      pageInteractionCleanup = bindPageInteractions();
	      model.motion("Idle").catch?.(() => false);
	      log("loaded", model.internalModel.settings.name);
	    });

	    model.once("error", (error) => {
	      console.error("[Firefly Live2D] 模型加载失败", error);
	      say("流萤模型加载失败，请检查资源路径和 CORS。", 6000);
	    });

	    closeButton.addEventListener("click", (event) => {
	      event.stopPropagation();
	      setHidden(true);
	    });

	    showButton.addEventListener("click", (event) => {
	      event.stopPropagation();
	      setHidden(false);
	      say("我回来啦~");
	    });

	    const onResize = () => {
	      if (!canDisplay()) {
	        setHidden(true, false);
	        return;
	      }
	      if (FF.store.get(cfg.storageKey) !== "1") setHidden(false, false);
	      refreshRenderer();
	    };
	    window.addEventListener("resize", onResize, { passive: true });
	    window.visualViewport?.addEventListener("resize", onResize, { passive: true });

	    window.FireflyLive2D = {
	      app,
	      get model() { return model; },
	      config: cfg,
	      show() {
	        setHidden(false);
	        say("我回来啦~");
	      },
	      hide() { setHidden(true); },
	      say,
	      goHome() {
	        window.location.assign(new URL(cfg.homeUrl, window.location.href).href);
	      },
	      openProfile() {
	        const target = new URL(cfg.profileUrl, window.location.href).href;
	        const opened = window.open(target, "_blank", "noopener,noreferrer");
	        if (opened) opened.opener = null;
	        return opened;
	      },
	      randomAction,
	      play(group, index = 0) { return playMotion({ group, index }); },
	      setExpression(name) { return model?.expression(name); },
	      playExpression(name, duration = cfg.expressionDuration) {
	        return playExpression({ name, text: name, duration });
	      },
	      listRandomActions() { return randomActions.map((action) => action.name); },
	      toggleSunglasses() {
	        return toggleAccessory("sunglasses", "墨镜模式启动！", "墨镜收好啦~");
	      },
	      toggleCatEars() {
	        return toggleAccessory("catEars", "猫耳也很适合我吗？", "猫耳先收起来啦~");
	      },
	      getAccessories() { return { ...accessories }; },
	      destroy() {
	        destroyed = true;
	        actionSerial += 1;
	        window.removeEventListener("resize", onResize);
	        window.visualViewport?.removeEventListener("resize", onResize);
	        clearTimeout(dialogTimer);
	        clearTimeout(expressionTimer);
	        clearTimeout(controlsHideTimer);
	        dialogResizeObserver?.disconnect?.();
	        pageInteractionCleanup();
	        stopActionAudio();
	        stopCurrentMotion();
	        model?.destroy?.();
	        app.destroy(true, { children: true, texture: true, baseTexture: true });
	        root.remove();
	        showButton.remove();
	        delete window.FireflyLive2D;
	        window.__fireflyLive2DLoading = false;
	      },
	    };
	  }

	  const start = () => boot().catch((error) => {
	    window.__fireflyLive2DLoading = false;
	    console.error("[Firefly Live2D] 初始化失败", error);
	  });

	  if (document.readyState === "loading") {
	    document.addEventListener("DOMContentLoaded", start, { once: true });
	  } else {
	    start();
	  }
	})();
	}

	if (typeof GM_registerMenuCommand === "function") {
		const inList = listed();
		const label =
			SITE_MODE === "whitelist"
				? inList
					? "➖ 本站不再显示流萤"
					: "➕ 本站启用流萤"
				: inList
					? "➕ 本站重新启用流萤"
					: "➖ 本站停用流萤";
		GM_registerMenuCommand(label, () => {
			const list = siteList();
			saveSiteList(
				list.includes(HOST) ? list.filter((h) => h !== HOST) : [...list, HOST],
			);
			location.reload();
		});
	}

	main().catch((error) => {
		W.__fireflyLive2DLoading = false;
		console.error("[Firefly Live2D] 加载失败", error);
	});
})();
