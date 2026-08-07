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

  function loadStyle(url) {
    if ([...document.styleSheets].some((sheet) => sheet.href === url)) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = url;
    document.head.appendChild(link);
  }

  function loadScript(url, readyCheck) {
    if (readyCheck?.()) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const existing = [...document.scripts].find((script) => script.src === url);
      if (existing) {
        if (readyCheck?.()) return resolve();
        existing.addEventListener("load", resolve, { once: true });
        existing.addEventListener(
          "error",
          () => reject(new Error(`加载失败：${url}`)),
          { once: true },
        );
        return;
      }

      const script = document.createElement("script");
      script.src = url;
      script.async = false;
      script.onload = resolve;
      script.onerror = () => reject(new Error(`加载失败：${url}`));
      document.head.appendChild(script);
    });
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
    showIcon.src = asset(cfg.icon);
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
      if (persist) localStorage.setItem(cfg.storageKey, hidden ? "1" : "0");

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
      setHidden(localStorage.getItem(cfg.storageKey) === "1", false);
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
      if (localStorage.getItem(cfg.storageKey) !== "1") setHidden(false, false);
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
