# 流萤看板娘油猴脚本 v6.5

## 安装

1. 安装 Tampermonkey、Violentmonkey 等用户脚本管理器。
2. 通过 HTTP(S) 打开 `firefly-live2d.user.js`，脚本管理器会显示安装页面。
3. 默认资源地址为 `https://live2d.202132.xyz/`，并默认启用触摸屏移动端。

## 自行托管资源

编辑脚本顶部：

- `BASE`
- 四行 `@require`
- `@connect`

它们必须指向同一套已部署资源。`load/firefly-glue.js` 必须位于 PixiJS 与 `cubism4.min.js` 之间加载。

## 站点开关

默认使用黑名单模式：所有网站显示，菜单中可对当前域名单独停用。将 `SITE_MODE` 改为 `whitelist` 后，则只在菜单启用过的网站显示。

## 触摸端

`USER_CONFIG.allowTouch` 控制是否在粗指针触摸设备加载；触摸端尺寸、缩放和偏移由 `touchWidth`、`touchHeight`、`touchScale`、`touchOffsetX`、`touchOffsetY` 独立控制。
