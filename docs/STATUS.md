# Date Box Development Status

## Current version

v1.1.0

## Current branch

main

## Release status

Production deployed

## Deployment

CloudBase static hosting

## Supported modes

- Single-device mode
- Asynchronous invite mode

## Completed

- 梦幻心动风格的双人约会计划完整体验。
- 单设备模式：双方轮流问答、默契结果、约会盲盒、计划、任务与回忆卡。
- 异步邀请模式：玩家 A 创建邀请，玩家 B 跨设备答题并手动回传结果。
- 微信截图邀请卡与结果卡、二维码、复制链接、Web Share 与手动复制降级。
- URL Hash + Base64 URL-safe 的无数据库邀请协议，以及 48 小时有效期校验。
- 玩家 B 会话按 `inviteId` 隔离，支持答题与后续约会进度刷新恢复。
- 玩家 A 结果入口重新调用纯函数计算默契与推荐计划，不信任展示结果。
- 微信内置浏览器适配与 CloudBase 国内静态部署。
- 玩家 B 首题恢复、上一题导航和第 5 题揭晓的阻断性 Bug 修复。

## Verification

- `npm run lint`：通过。
- `npx tsc --noEmit`：通过。
- `npm run build`：通过，Next.js 静态导出完成。
- 静态 `out`：入口、404 页面与 `_next` 资源验证通过。
- 微信内置浏览器：人工验收通过。
- 双设备异步邀请流程：人工验收通过。
- 邀请会话按 `inviteId` 隔离：自动化与人工验证通过。
- 玩家 B 答题导航修复：自动化与人工验证通过。
- CloudBase 线上正式版本：人工验收通过，与发布时 `main` 一致。

## Release commit

- v1.1.0 tag target: `d5bef3b6ca0bfc37aeed7344ae2c6efeb29cfefe`
- release `main` commit: `d5bef3b6ca0bfc37aeed7344ae2c6efeb29cfefe`
- annotated tag object: `dc0435ad3975c6703aab1b03edef713f39d7a72a`

## Known limitations

- 不支持实时在线状态或实时房间。
- 已发出的邀请无法主动撤回。
- 不支持多设备自动同步，结果需要玩家 B 手动分享回玩家 A。
- 数据主要存在邀请/结果链接和当前浏览器 localStorage 中；清除浏览器数据可能导致本地进度丢失。
- Web Share 与 Clipboard 能力取决于浏览器权限和安全上下文。
- Hash 数据经过编码但没有加密，持有完整链接的人可能读取其中内容。
- 计划和任务来自静态内容，不包含地图、商家营业状态或实时地点信息。

## Rollback artifact

- Version: v1.1.0
- Commit: `d5bef3b6ca0bfc37aeed7344ae2c6efeb29cfefe`
- Directory: `D:\Code\Date Box Releases\v1.1.0-out`
- ZIP: `D:\Code\Date Box Releases\DateBox-v1.1.0-out.zip`
- Created at: `2026-07-19 18:35:20 +08:00`
- ZIP size: `341266 bytes`
- ZIP SHA256: `5B9B93138FD65CBB7550455004F5827CD30539F36D5A36BB88F62C331F6EFDC8`
- Verification: `index.html`, `404.html`, `icon.svg` and `_next` are present at the archive root; no nested `out/` directory or development files are included.

## Next action

Collect feedback from 3–5 real user pairs before planning v1.1.1.
