# Date Box Development Status

## Invite Stage 1A：数据协议与编解码

- 已新增异步邀请与结果 payload 类型、48 小时默认有效期，以及独立存储键 `date-box-async-session-v1`；普通模式继续使用 `date-box-game-state-v1`。
- 已实现 JSON + UTF-8 + Base64 URL-safe 编解码、固定 `#invite=v1.*` / `#result=v1.*` Hash 协议、显式 base URL 链接生成和原 Hash 移除。
- 已对字段完整性、昵称长度、五题答案、偏好 ID、计划 ID、版本、时间与过期状态进行入口前校验；错误只返回用户可读原因。
- 已新增 `test:async-invite`，覆盖中英文昵称、空昵称、损坏数据、过期数据、错误版本、非法答案、超长昵称和正常结果 payload。
- 本阶段尚未开发玩家 A / 玩家 B 正式异步页面，也未写入任何异步会话数据。

## Invite Stage 1B：Hash 入口识别

- 已新增顶层 `AppEntry` 客户端边界；服务端预渲染与首次客户端渲染都使用相同加载占位，挂载后才读取 `window.location.hash`，避免 hydration 错误。
- 无 Hash 和无关 Hash 继续挂载现有 `DateGame`，因此原有 localStorage 恢复逻辑与欢迎页到回忆卡的单设备流程保持不变。
- 有效 `invite`、有效 `result`、过期邀请和无效链接分别显示 Stage 1 占位内容；尚未开发正式异步玩家页面。
- 入口识别只读取 URL，不写入 `date-box-game-state-v1` 或预留的 `date-box-async-session-v1`。

## Invite Stage 1 验证

- `npm run test:async-invite`：19 项通过，覆盖中英文昵称、空/超长昵称、损坏 Base64、损坏 JSON、过期数据、错误版本、答案数量、非法答案 ID、非法计划 ID、URL 原 Hash 移除与正常结果还原。
- 原有 `test:plans`、`test:active-date`、`test:memory-storage`、`test:browser-boundaries`、`test:flow-boundaries` 全部通过，单设备状态、恢复和完整流程边界未回归。
- `npm run lint`：通过；`npx tsc --noEmit`：通过。
- 两个开发阶段均执行 `npm run build` 并通过；最终 Next.js 16.2.10 静态生成 4/4 页面，`out/index.html` 已生成。
- 本阶段未进行真实浏览器视觉验收，因此不声明完成 390×844 或 1440×900 视口检查；占位 UI 的正式视觉精修不在 Invite Stage 1 范围内。

## Current stage

当前版本：v1.0.0

当前状态：单设备模式稳定版

部署状态：CloudBase 已部署，微信链接可正常打开并完整体验

下一版本：v1.1.0 异步邀请模式（仅规划，尚未开始开发）

手机端优化阶段 D — 实现与命令行验证完成；真实浏览器视觉验收受环境策略阻塞

## 阶段 D：逐页面 UI 精修

### D1 — Welcome / Mood / Preferences

- Welcome：移动端重组票据核心视觉，压缩装饰占高与文案间距；品牌、2 行主标题、副标题、核心视觉和主按钮可在首屏顺序完整出现；“看看怎么玩”降为文字级操作。
- Mood：根据现有中长描述采用单列紧凑卡片；移动端卡片高度 68–86px，六种心情保留独立图标底色、统一选中反馈、最多两行描述和底部 sticky 主操作。
- Preferences：四组条件改为渐进选择；当前组展开，已选组折叠成摘要且可重新编辑，选择后推进到下一未完成组；底部持续显示完成度或生成短句，四组完成后才可继续。
- D1 `npm run build`：退出码 0。Next.js 16.2.10 编译、TypeScript 检查、4/4 静态页面生成完成。
- 沙箱内首次构建在编译成功后因 Windows `spawn EPERM` 无法启动 TypeScript 工作进程；获批在沙箱外重跑后完整通过。

### D2 — Quiz / Handoff / Compatibility / Mystery Box

- Quiz：移动端改为顶部玩家标识与 `01 / 05`、轻量进度，中部问题、拇指区四选项和底部下一题；选项最小高度 56px，不自动跳题，切题动画 300ms；上一题答案继续保留。玩家 A 使用粉色、玩家 B 使用紫色的轻微差异。
- Handoff：压缩为无滚动交接场景，中央密封信封保持动作焦点；点击进入玩家 B 后增加“手机已经交给 TA 了吗？”确认，且不展示玩家 A 答案。
- Compatibility：移动端顺序调整为轨迹汇合、默契分数、标题说明、共同期待、互补期待、今晚建议和 sticky 开盲盒操作；三类分析继续使用不同视觉结构。
- Mystery Box：主体在移动端向屏幕中下部落位，长按区限制在可视高度 45% 内；进度与提示贴近触控区，文字级“直接开启”保留；成功揭晓延迟 760ms。
- D2 `npm run build`：退出码 0。编译、TypeScript 检查与 4/4 静态页面生成完成。

### D3 — Date Plan / Active Date / Memory

- Date Plan：路线继续采用自然纵向时间线，时间为小标签、节点由路径连接；隐藏任务保持独立信封区；移动端开始操作与换计划收进 sticky 操作区，剩余次数使用低权重小字。
- Active Date：手机端只展示总进度与当前任务主卡，完整路线明细仅在桌面显示；临时彩蛋入口放在完成/跳过之前；完成反馈 520ms、跳过反馈 280ms，不阻塞后续操作。
- Memory：页面明确分为“可截图回忆卡”和“编辑区域”；移动回忆卡使用 3:4 比例并限制在屏幕宽度内，日期、计划名和默契度重新压缩层级；用户文字实时融入卡片并限制溢出，保存/复制/重新开始继续保持主次关系。
- D3 `npm run build`：退出码 0。编译、TypeScript 检查与 4/4 静态页面生成完成。

## 范围约束

- 未新增邀请、认证、数据库、API、地图、支付、管理页、小程序或新玩法。
- 保留从欢迎页到回忆卡的完整 MVP 流程。
- 文案继续使用“TA、你们、对方”等中性表达；低默契结果不描述为失败或不合适。

## 最终验证

- 目标视口：计划检查 360×800、375×812、390×844、412×915、430×932、1440×900；应用内浏览器被企业网络策略明确禁止访问 `127.0.0.1:3000`，并禁止改用其他浏览器或绕行方式，因此未声称完成真实视觉检查。
- 完整流程：状态与恢复边界自动测试通过；真实浏览器点击走查因上述策略未完成。
- React 复核：交互元素继续使用原生语义；未新增 `any`、模块顶层 `window` / `localStorage`、不稳定列表键或缺少清理的计时器。
- `npm run lint`：退出码 0，无 ESLint 错误或警告。
- `npx tsc --noEmit`：退出码 0，无 TypeScript 错误。
- `npm run test:plans`：13 项通过。
- `npm run test:active-date`：10 项通过。
- `npm run test:memory-storage`：15 项通过。
- `npm run test:browser-boundaries`：15 项通过。
- `npm run test:flow-boundaries`：12 项通过。
- 最终 `npm run build`：退出码 0；Next.js 16.2.10 编译、TypeScript 检查与 4/4 静态页面生成完成。

## 已知环境限制

- 本阶段重新尝试应用内浏览器，企业网络策略明确禁止访问 localhost / `127.0.0.1`，且要求不得改用其他浏览器或间接绕行；需在允许访问本地站点或实际部署地址的环境中补测六个目标视口、横向溢出、布局跳动、控制台、键盘焦点与完整点击流程。
