# 流萤看板娘油猴脚本 v6.6.2

## 安装

1. 安装 Tampermonkey、Violentmonkey 等用户脚本管理器。
2. 通过 HTTP(S) 打开 `firefly-live2d.user.js`，脚本管理器会显示安装页面。
3. 默认启用触摸屏移动端，并使用双资源源加载运行时文件。

## 双资源源

运行时资源按以下顺序加载：

1. `https://cdn.jsdelivr.net/gh/Iskongkongyo/Firefly-live2d@v6.5.0/`
2. `https://live2d.202132.xyz/`

覆盖范围包括模型 JSON、纹理、MOC、物理、动作、表情、音频和恢复图标。脚本不会把 `raw.githubusercontent.com` 作为备用源。

主源发生网络错误、超时、HTTP 429 或 5xx 时，会自动尝试备用源。网络型故障会让该源熔断 5 分钟；熔断状态通过 GM 存储跨页面保留，避免打开新网页后再次逐个等待同一资源源超时。HTTP 404 等路径错误仍会尝试另一个资源源，但不会把整个源判定为网络故障。

默认超时：

| 资源源 | JSON/文本 | 图片、MOC、动作、音频等二进制 |
| --- | ---: | ---: |
| jsDelivr | 9 秒 | 12 秒 |
| 自建源 | 15 秒 | 25 秒 |

可在脚本顶部的 `RESOURCE_SOURCES` 和 `RESOURCE_SOURCE_COOLDOWN` 中修改。

## `@require` 的限制

四个运行库仍由油猴元数据中的 `@require` 预先加载。油猴管理器会在主脚本执行前处理它们，因此 JavaScript 无法为 `@require` 实现自动回退。

默认使用固定标签：

```text
https://cdn.jsdelivr.net/gh/Iskongkongyo/Firefly-live2d@v6.5.0/load/...
```

若所在网络连 jsDelivr 的运行库也无法加载，可把四行 `@require` 手动替换为：

```text
https://live2d.202132.xyz/load/...
```

两行 `@connect` 都应保留：

```text
// @connect      cdn.jsdelivr.net
// @connect      live2d.202132.xyz
```

## 更换或增加资源源

编辑脚本顶部：

```js
const RESOURCE_SOURCES = [
  {
    id: "jsdelivr",
    name: "jsDelivr",
    base: "https://cdn.jsdelivr.net/gh/Iskongkongyo/Firefly-live2d@v6.5.0/",
    timeout: 9000,
    binaryTimeout: 12000,
  },
  {
    id: "selfhost",
    name: "自建源",
    base: "https://live2d.202132.xyz/",
    timeout: 15000,
    binaryTimeout: 25000,
  },
];
```

每个资源源必须保持相同的目录结构。新增域名时，同时增加对应的 `@connect`；修改四个依赖库的来源时，还需同步修改四行 `@require`。

## 查看当前状态

油猴菜单中的“当前加载模式”会显示：

- 当前是桌面端还是触摸端。
- 最近一次成功加载资源的来源。
- jsDelivr 和自建源是否处于熔断状态及剩余时间。

## 站点开关

默认使用黑名单模式：所有网站显示，菜单中可对当前域名单独停用。将 `SITE_MODE` 改为 `whitelist` 后，则只在菜单启用过的网站显示。

## 触摸端

`USER_CONFIG.allowTouch` 控制是否在粗指针触摸设备加载；触摸端尺寸、缩放和偏移由 `touchWidth`、`touchHeight`、`touchScale`、`touchOffsetX`、`touchOffsetY` 独立控制。


## v6.6.2 移动端轻触随机互动

触摸端现在直接识别有效轻触：手指未明显移动、持续时间不超过 600ms，并且没有命中模型预设部位时，随机播放一个动作或表情。滑动、长按、控制按钮点击以及命中特定部位都不会重复触发。可通过 `fallbackClick`、`touchTapMoveTolerance` 和 `touchTapMaxDuration` 调整。
