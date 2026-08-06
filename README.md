# 流萤 Live2D 看板娘：网页部署与油猴脚本

<p align="center">
  <img src="https://img.shields.io/badge/version-6.5-blue.svg" alt="Version">
  <img src="https://img.shields.io/badge/platform-Web%20%7C%20Tampermonkey%20%7C%20Violentmonkey-orange.svg" alt="Platform">
  <img src="https://img.shields.io/badge/Language-JS-pink" alt="Language">
  <img src="https://img.shields.io/badge/License-MIT-brightgreen" alt="License">
</p>

一套可直接嵌入 **AList、博客、个人主页、静态站点与文档站**，也可通过 **Tampermonkey / Violentmonkey** 挂载到第三方网页的流萤 Live2D 看板娘。

它使用 PixiJS 与 Cubism 4 在浏览器中加载模型，支持动作、表情、语音、消息框、配件切换、隐藏恢复和 JavaScript API。整个项目不依赖前端框架，只需保持目录结构并引入一个脚本即可使用。

> 当前版本：**v6.5**  
> 推荐环境：桌面端与现代触摸屏浏览器，通过 HTTP(S) 访问

![项目展示背景](./assets/live2d.png)

## 功能特性

- 默认固定在页面左下角，也可配置为右下角。
- 支持唱歌、“点燃星海”以及八种表情，共十项随机互动。
- 唱歌或动作可连续触发，新动作会中断旧动作并从头播放对应音频。
- 点击刘海切换墨镜，点击右侧后发切换猫耳，两种配件互不影响。
- 消息框根据当前帧实际可见的发顶或猫耳位置自动定位。
- 鼠标靠近模型时显示返回首页、随机互动、资料页和隐藏按钮。
- 自动读取页面标题并问候；标题变化时也能感知，适配单页应用。
- 从其他标签页切回时显示“欢迎回来~”。
- 桌面端链接悬停、键盘聚焦或纯触摸设备长按链接后询问是否前往，并支持动态插入的链接。
- 复制内容、阅读到页面底部和长时间停留时提供轻量反馈。
- 网页版隐藏状态保存到 `localStorage`；油猴版使用 GM 存储并按网站分别保存，恢复时保留 WebGL Canvas。
- 支持自定义尺寸、缩放、偏移、显示位置、提示文字和链接。
- 默认仍仅在桌面端加载；设置 `allowTouch: true` 后启用独立的触摸端尺寸、缩放与交互。
- 提供 `window.FireflyLive2D` API，方便页面脚本主动控制。

## 适用场景

- **AList 文件站**：放入自定义头部或页脚，为文件页面增加互动角色。
- **个人主页 / 博客**：作为固定在页面边缘的看板娘。
- **项目展示页**：用消息和随机动作引导访客了解项目。
- **文档站 / 导航页**：无需构建工具，静态部署即可使用。

## 目录结构

```text
firefly-alist-loader-v6/
├─ index.html                 # 项目展示与使用文档页面
├─ README.md                  # 使用说明
├─ alist-snippet.html         # AList 接入代码片段
├─ firefly-loader.js          # 主加载器
├─ firefly.css                # 看板娘样式
├─ assets/
│  ├─ firefly-icon.jpg        # 隐藏后的恢复图标
│  └─ firefly-background.jpg  # 示例页背景图
├─ load/                      # PixiJS、Cubism Core 与油猴胶水
├─ userscript/
│  ├─ firefly-live2d.user.js  # 油猴脚本
│  ├─ firefly-glue.js         # @require 作用域兼容胶水
│  └─ README.md               # 油猴脚本说明
└─ model/                     # 模型、纹理、动作、表情与音频
```

## 方式一：自行部署到网页

### 1. 上传完整目录

请保持所有文件的相对目录不变。模型会从 `model/` 加载纹理、动作、表情与音频，加载器会从 `load/` 引入运行依赖。

### 2. 在页面中引入

配置对象必须放在 `firefly-loader.js` **之前**：

```html
<script>
window.FireflyLive2DConfig = {
  side: "left",             // left / right
  width: 420,
  height: 360,
  scale: 0.94,
  offsetX: -20,
  offsetY: 12,
  allowTouch: true,         // 是否在粗指针触摸设备加载
  touchWidth: 260,          // 触摸端独立画布尺寸
  touchHeight: 360,
  touchScale: 0.90,         // 触摸端独立模型缩放
  touchOffsetX: -12,
  touchOffsetY: 8,
  expressionDuration: 4200, // 八个表情维持时间（毫秒）
  dialogGap: 1,             // 实际安全距离约为 6px + 此值
  pageTitleMessage: true,   // 自动读取标题并问候
  returnMessage: "欢迎回来~",
  linkHoverMessage: true,
  linkHoverDelay: 1400,     // 桌面端悬停链接 1.4 秒后提示
  linkLongPressDelay: 650,  // 纯触摸设备长按链接提示
  copyMessage: "复制好啦，希望能帮到你~",
  bottomMessage: "已经看到页面底部啦，辛苦了~",
  idleMessageDelay: 90000,  // 90 秒无操作后显示陪伴语
  buttonHintDuration: 2600, // 按钮悬停消息显示时间（毫秒）
  controlsHideDelay: 180,   // 离开模型和按钮后延迟隐藏（毫秒）
  homeUrl: "/",            // 返回首页按钮目标
  profileUrl: "https://example.com/about-firefly",
  profileHint: "我叫流萤，想要更多了解我吗？",
  minWidth: 1025,          // 仅控制非触摸桌面端的最小宽度
  debug: false
};
</script>
<script src="https://你的域名/firefly-loader.js" defer></script>
```

当加载器与当前页面位于同一目录时，可以直接写：

```html
<script src="./firefly-loader.js" defer></script>
```

### 3. 使用 Web 服务器访问

请通过 `http://` 或 `https://` 访问页面，不建议直接双击 `index.html` 以 `file://` 方式打开。

浏览器对本地文件之间的音频、脚本、模型资源和跨目录访问有额外限制，可能出现请求看似成功但没有声音，或模型资源被拦截的问题。

本地测试可使用任意静态服务器，例如：

```bash
python -m http.server 8080
```

然后访问：

```text
http://127.0.0.1:8080/
```

## 方式二：使用油猴脚本

1. 安装 Tampermonkey、Violentmonkey 等用户脚本管理器。
2. 通过 HTTP(S) 打开 `userscript/firefly-live2d.user.js` 并确认安装。
3. 在脚本管理器菜单中可对当前网站启用/停用，并可调用显示、隐藏、随机互动和配件开关。

油猴版默认：

- `allowTouch: true`，会在粗指针触摸设备使用独立的移动端尺寸。
- 使用页面标题、标签页切换、复制、页面底部、空闲陪伴和链接提示。
- 纯触摸设备长按链接约 650ms 后显示提示；滑动超过容差会取消，不妨碍滚动。
- `@connect` 仅允许默认资源域名，不再使用 `*`。
- 每个网站分别保存隐藏状态，不会在一个网站隐藏后影响所有网站。

自行托管资源时，必须同步修改脚本中的 `BASE`、四行 `@require` 和 `@connect`。完整说明见 `userscript/README.md`。

## AList 接入

将整个目录部署到可公开访问的静态地址，然后把以下内容加入 AList 的自定义头部或自定义页脚：

```html
<script>
window.FireflyLive2DConfig = {
  side: "left",
  width: 420,
  height: 360,
  scale: 0.94,
  offsetX: -20,
  offsetY: 12,
  allowTouch: true,
  touchWidth: 260,
  touchHeight: 360,
  touchScale: 0.90,
  touchOffsetX: -12,
  touchOffsetY: 8,
  dialogGap: 1,
  homeUrl: "/",
  minWidth: 1025
};
</script>
<script src="https://live2d.example.com/firefly-loader.js" defer></script>
```

若 AList 页面和模型资源不在同一域名，请确保静态资源服务器允许跨域请求，并且以下文件均可直接访问：

- `firefly-loader.js`
- `firefly.css`
- `load/*.js`
- `model/Firefly.model3.json`
- 模型引用的纹理、动作、表情和音频文件

## 参数说明

### 资源路径

| 参数 | 默认值 | 说明 |
|---|---|---|
| `baseUrl` | 加载器所在目录 | 所有相对资源的基准路径。通常无需手动填写。 |
| `model` | `model/Firefly.model3.json` | 模型配置文件路径。 |
| `core` | `load/live2dcubismcore.min.js` | Live2D Cubism Core 路径。 |
| `pixi` | `load/pixi.min.js` | PixiJS 路径。 |
| `live2d` | `load/cubism4.min.js` | pixi-live2d-display Cubism 4 构建路径。 |
| `css` | `firefly.css` | 看板娘样式文件路径。 |
| `icon` | `assets/firefly-icon.jpg` | 隐藏后恢复按钮使用的图标。 |

### 布局与显示

| 参数 | 默认值 | 说明 |
|---|---|---|
| `side` | `"left"` | 固定在左侧或右侧，可填写 `left` / `right`。 |
| `width` | `420` | Canvas 宽度，单位 px。 |
| `height` | `360` | Canvas 高度，单位 px；示例页面覆盖为 `360`。 |
| `scale` | `0.94` | 模型缩放倍率。 |
| `offsetX` | `-20` | 模型水平偏移，正值向右。 |
| `offsetY` | `12` | 模型垂直偏移，正值向下。 |
| `zIndex` | `52` | 看板娘和恢复按钮的层级。 |
| `minWidth` | `1025` | 非触摸桌面端视口宽度低于此值时不加载；不再用于开启移动端。 |
| `allowTouch` | `false` | 是否允许在主指针为粗指针的触摸设备加载模型。 |
| `touchWidth` | `260` | 触摸模式画布宽度；超过视口时会自动收缩。 |
| `touchHeight` | `360` | 触摸模式画布高度；超过视口时会自动收缩。 |
| `touchScale` | `0.9` | 触摸模式模型缩放倍率。 |
| `touchOffsetX` | `-12` | 触摸模式水平偏移。 |
| `touchOffsetY` | `8` | 触摸模式垂直偏移。 |
| `touchControlsHideDelay` | `3200` | 触摸模型后，控制按钮继续显示的时间。 |

### 交互与消息

| 参数 | 默认值 | 说明 |
|---|---|---|
| `welcome` | `开拓者，我回来啦~` | 模型首次显示时的欢迎语。 |
| `pageTitleMessage` | `true` | 自动读取页面标题；标题变化时也会重新问候。 |
| `pageTitleTemplate` | `又在看 {title} 呀~` | 标题问候模板，`{title}` 会替换为当前标题。 |
| `pageTitleMessageDelay` | `3400` | 首次标题问候延迟，避免盖掉欢迎语。 |
| `pageTitleChangeDelay` | `700` | 页面标题变化后的提示延迟。 |
| `titleMaxLength` | `28` | 标题在消息框中的最大字符数。 |
| `returnMessage` | `欢迎回来~` | 从其他标签页切回时显示；空字符串关闭。 |
| `returnMessageMinHidden` | `1000` | 标签页至少隐藏多久才触发欢迎消息。 |
| `linkHoverMessage` | `true` | 是否启用桌面悬停、键盘聚焦与纯触摸设备长按链接提示。 |
| `linkHoverTemplate` | `想去看看{label}吗？` | 链接提示模板，`{label}` 会替换为链接名称。 |
| `linkHoverDelay` | `1400` | 桌面端链接悬停多久后提示，单位毫秒。 |
| `linkHoverDuration` | `2800` | 链接提示显示时长。 |
| `linkHoverCooldown` | `8000` | 同一链接重复提示的冷却时间。 |
| `linkLabelMaxLength` | `22` | 链接名称最大字符数。 |
| `linkLongPressDelay` | `650` | 纯触摸设备长按链接多久后提示，单位毫秒。 |
| `linkLongPressMoveTolerance` | `12` | 长按期间允许的手指移动距离，超过后按滚动处理并取消提示。 |
| `copyMessage` | `复制好啦，希望能帮到你~` | 复制页面内容后的反馈；空字符串关闭。 |
| `bottomMessage` | `已经看到页面底部啦，辛苦了~` | 首次接近页面底部时显示；空字符串关闭。 |
| `bottomMessageThreshold` | `0.92` | 阅读进度达到多少时视为接近底部。 |
| `idleMessages` | 3 条内置消息 | 空闲时随机显示；设为 `[]` 关闭。 |
| `idleMessageDelay` | `90000` | 首次空闲提示等待时间。 |
| `idleMessageInterval` | `120000` | 后续空闲提示间隔。 |
| `fallbackClick` | `true` | 点击未命中指定区域时是否随机互动。 |
| `expressionDuration` | `4200` | 表情持续时间，单位毫秒。 |
| `dialogGap` | `24` | 消息框额外间距；实际安全距离约为 `6px + dialogGap`。 |
| `buttonHintDuration` | `2600` | 控制按钮提示消息显示时长，单位毫秒。 |
| `controlsHideDelay` | `180` | 鼠标离开模型和控制按钮后延迟隐藏的时间。 |
| `storageKey` | `alist-firefly-live2d-hidden` | 网页版保存到 localStorage；油猴版保存到 GM 存储。 |
| `homeUrl` | `/` | 🔙 按钮的跳转地址。 |
| `profileUrl` | 流萤资料页 | 🔗 按钮打开的地址。 |
| `profileHint` | 流萤自我介绍 | 悬停 🔗 按钮时显示的消息。 |
| `debug` | `false` | 是否输出调试日志。 |

## 模型互动

| 点击位置 / 按钮 | 行为 |
|---|---|
| 蛋糕 | 唱歌 |
| 左侧后发 | 播放“点燃星海”动作与语音 |
| 刘海 | 开关墨镜 |
| 右侧后发 | 开关猫耳 |
| 饮料 | 回正动作 |
| 其他模型区域 | 随机动作或表情 |
| 🔙 | 返回 `homeUrl` |
| 😊 | 随机动作或表情 |
| 🔗 | 打开 `profileUrl` |
| ❌ | 隐藏看板娘 |

## JavaScript API

模型加载成功后，会创建：

```js
window.FireflyLive2D
```

常用方法：

```js
// 显示与隐藏
FireflyLive2D.show();
FireflyLive2D.hide();

// 显示消息，第二个参数为持续时间（毫秒）
FireflyLive2D.say("欢迎回来，开拓者！", 3000);

// 随机动作或表情
FireflyLive2D.randomAction();

// 配件
FireflyLive2D.toggleSunglasses();
FireflyLive2D.toggleCatEars();
FireflyLive2D.getAccessories();

// 指定动作组与索引
FireflyLive2D.play("Tap", 0);

// 销毁组件并释放资源
FireflyLive2D.destroy();
```

更多可用属性和方法：

- `app`：PIXI Application 实例
- `model`：Live2DModel 实例
- `config`：合并后的最终配置
- `goHome()`：跳转到首页
- `openProfile()`：打开资料链接
- `setExpression(name)`：直接切换表情
- `playExpression(name, duration)`：播放表情并定时恢复
- `listRandomActions()`：返回随机池项目名称

## 常见问题

### 模型没有显示

1. 桌面端确认当前视口宽度不低于 `minWidth`。
2. 触摸设备确认已设置 `allowTouch: true`；无需降低 `minWidth`。
3. 打开浏览器控制台检查模型、纹理和依赖脚本是否返回 200。
4. 确认目录结构没有被改变。

### 模型显示但没有声音

1. 使用 HTTP(S) 页面，不要使用 `file://`。
2. 确认浏览器未静音当前标签页。
3. 确认页面已发生一次用户点击；浏览器通常禁止页面自动播放音频。
4. 检查 `model/sounds/ignite.mp3` 与 `model/sounds/sing.mp3` 是否可访问。

### 修改文件后页面仍是旧版本

浏览器或 CDN 可能缓存了脚本。可强制刷新，或在脚本 URL 后加版本参数：

```html
<script src="./firefly-loader.js?v=6.4" defer></script>
```

### 消息框离头太远或太近

调整：

```js
dialogGap: 1
```

实际安全距离约为：

```text
6px + dialogGap
```

建议保持非负值。

## 致谢

特别感谢：

- [Scighost/Firefly](https://github.com/Scighost/Firefly) —— 桌面端流萤 Live2D 项目与相关实现、资源参考。
- [PixiJS](https://pixijs.com/) —— WebGL / Canvas 渲染引擎。
- [pixi-live2d-display](https://github.com/guansss/pixi-live2d-display) —— 在 PixiJS 中显示 Live2D 模型。
- [Live2D Cubism](https://www.live2d.com/) —— Live2D 运行时与模型生态。
- 模型作者、动作与素材创作者，以及所有参与测试和反馈的使用者。

上游 `Scighost/Firefly` 项目说明其用途为个人学习与技术研究，并明确禁止商业使用。部署本适配包时，请同时遵守上游项目、模型素材、Live2D SDK 与相关第三方库的授权条款。

## 使用与版权提醒

- 本项目适合个人学习、技术研究和非商业展示。
- 模型、角色、图片、音频及相关素材版权归各自权利方所有。
- 请勿将本适配包或其中素材用于商业获利、付费分发或未经授权的再发布。
- 第三方库的许可条款以其各自项目为准。

---

❤️愿这一刻，使一颗心免于哀伤。
