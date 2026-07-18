# Date Box Development Status

## Invite Stage 4A：访客会话与隔离恢复

- 已新增玩家 B 会话模型，复用 `date-box-async-session-v1` 命名空间并以 `:guest:<inviteId>` 隔离每份邀请，不覆盖主持人会话或其他邀请。
- 恢复时校验邀请 ID、步骤、逐题答案和下游计划状态；玩家 A 答案与固定偏好始终以当前邀请链接为准，不信任本机缓存副本。
- 已支持从 `AsyncResultPayload` 建立结果态，为结果链接和完成后的刷新恢复保留统一数据入口。
- 新增 `test:async-guest` 12 项检查，覆盖键隔离、局部答题恢复、损坏数据、邀请 ID 错配、非法答案和结果态初始化。
- 本阶段 `test:async-guest`、`npx tsc --noEmit` 与 `npm run build` 均通过；构建在沙箱内因 Windows `spawn EPERM` 无法启动 TypeScript 子进程，按既有环境规则在沙箱外重跑后完成静态生成。

## Invite Stage 4B：玩家 B 答题、揭晓与共同计划

- 已用正式 `InviteLandingScreen` 替换邀请占位页：展示邀请人称呼、约 2 分钟、无需登录、提交前答案密封和精确有效时间，不展示玩家 A 答案、心情、默契预测或推荐计划。
- 玩家 B 仅完成五道默契题，复用 `QuizScreen` 并使用“轮到你写下期待”“不要猜TA的答案，只选你真正想要的。”和“一起揭晓答案”文案；不重复选择时间、预算、距离或关系阶段。
- 完成后继续调用既有 `calculateCompatibility` 与 `generateDatePlan`，结果包含默契度、共同期待、互补期待、今晚建议和确定性的推荐计划；算法仅增加可选双方称呼参数，原单设备调用保持默认文案。
- 已新增约 2 秒双轨汇合过渡，依次显示三条指定分析文案；随后结果页展示双方称呼并直接进入现有 `MysteryBoxScreen`、`DatePlanScreen`、`ActiveDateScreen` 与 `MemoryCardScreen`，不会进入 Handoff。
- 玩家 B 完成后将当前 Hash 替换为校验过的 `#result=v1.*`，本机会话同时保存结果、盲盒、计划、进行中约会与回忆进度；邀请 Hash 和结果 Hash 刷新均可恢复。
- 过期与损坏链接使用正式阻断文案和指定按钮，不挂载答题流程。
- 本阶段 `npm run lint`、`npx tsc --noEmit`、19 项邀请协议测试、20 项主机会话测试、12 项访客会话测试、13 项计划算法测试与 `npm run build` 均通过。

## Invite Stage 4C：最终回归与验收说明

- 完整命令行回归通过：13 项计划生成、10 项进行中约会、15 项存储与回忆卡、15 项浏览器边界、12 项单设备流程边界、19 项邀请协议、20 项主机会话、12 项访客会话及 14 项分享检查。
- 最终 `npm run lint`、`npx tsc --noEmit`、`git diff --check` 与 `npm run build` 均通过；Next.js 16.2.10 完成 TypeScript 检查并静态生成 4/4 页面。
- 应用内浏览器已成功连接，但打开 `127.0.0.1` 邀请链接时浏览器审批服务中断并阻止导航；已按安全规则停止浏览器尝试，因此本阶段不声明完成 390×844 / 1440×900 的真实视觉、溢出、布局跳动、控制台、键盘焦点或完整点击验收。
- React 复核确认新增交互使用语义元素、计时器均清理、无新增 `any` 或模块顶层 `window` / `localStorage`；新增页面组件均低于 300 行。

## Invite Stage 3A：正式分享能力

- 已使用隔离无头 Edge 完成真实浏览器验证：375×812、390×844 与 1440×900 均无横向溢出或控制台错误；手机截图模式中的 3:4 卡片为 330×440，完整位于一屏内，二维码为 122×122 的清晰 SVG，导航和卡外操作隐藏且底部退出有效。
- 已验证中文、英文及空称呼回退、长链接不进入卡片正文、系统分享失败后的手动复制降级，以及修改邀请返回介绍页并显示旧链接仍可能访问的提示。
- Stage 3 最终回归包含原有 5 组单设备测试、19 项邀请协议测试、20 项主持人会话测试及 14 项分享测试；`npm run lint`、`npx tsc --noEmit` 和最终 `npm run build` 均通过，`out` 静态目录已重新生成。

- 已安装唯一新增依赖 `qrcode.react@4.2.0`；未引入截图、海报、Canvas 编辑器或其他大型库。安装使用的仓库内临时 npm 缓存已删除。
- 已新增 3:4 `InviteShareCard`：包含品牌、空称呼“有人”回退、双轨迹视觉、邀请提示、有效时间、实际站点短域名和完整邀请 URL 的 SVG 二维码；不显示玩家 A 答案或完整长链接。
- 已新增正式 `InviteShareScreen`：支持复制链接、Web Share、失败自动复制、手动复制输入、微信环境建议、截图模式和“修改我的选择”。
- 截图模式使用页面内固定布局，不依赖 Fullscreen API；隐藏导航/操作区、垂直居中卡片，并提供底部退出区域。
- 修改邀请会保留称呼、偏好和五道答案，清空当前链接并重新生成新 ID/时间；会话持久化旧链接风险标记并展示提示。
- 新增 `test:sharing` 14 项检查，覆盖固定分享数据、Web Share 成功/失败、微信 UA、站点域名、有效时间和带白边高对比度 SVG 二维码输出。

## Invite Stage 2A：主持人会话基础

- 已定义 `create-intro → mood → preferences → host-quiz → generating → share-placeholder` 主持人流程状态，继续使用独立键 `date-box-async-session-v1`。
- 已实现异步会话序列化、损坏数据拒绝、称呼 trim/长度限制、偏好与逐题答案 ID 校验，以及刷新后的步骤修正。
- 已实现 `crypto.randomUUID()` 优先、`crypto.getRandomValues()` UUID v4 降级的安全前端邀请 ID 生成；不使用 `Math.random()`。
- 根据 Stage 2 的可选字段要求，空称呼现在是合法 payload，填写后的称呼仍限制为最多 12 个字符。

## Invite Stage 2B：首页与玩家 A 创建流程

- Welcome 主标题已更新为“今晚，想和TA怎么度过？”，新增视觉主入口“邀请TA一起计划”和次入口“一起用这部手机”；移动端纵向排列、桌面端双卡并排。
- 普通入口仍进入现有 `DateGame` 单设备状态机；邀请入口进入独立 `AsyncHostFlow`，返回首页不会清空任一模式的进度。
- 已新增可选称呼介绍页，双方称呼最多 12 个字符、提交时 trim，并展示链接包含固定选择及不得填写敏感信息的隐私说明。
- 玩家 A 依次完成心情、四项条件和五道问答；通过可选文案 props 直接复用 `MoodScreen`、`PreferencesScreen` 与 `QuizScreen`。
- 完成后生成唯一 ID、48 小时有效 payload 与 `#invite=v1.*` 链接，保存到独立异步会话并进入分享页占位；未实现正式分享卡或玩家 B 页面。
- 顶层入口在无 Hash 时可恢复有意义的异步会话；服务器与 hydration 首帧继续使用统一 loading 状态。

## Invite Stage 2 验证说明

- `test:async-host` 覆盖会话初始化、中文称呼 trim、损坏/错误版本/超长称呼/非法答案拒绝、生成中恢复、原生与安全降级 UUID、48 小时 payload、邀请 URL 还原和两类存储键隔离。
- `npm run lint`、`npx tsc --noEmit`、`test:async-invite` 以及原有五组回归脚本全部通过；Stage 2A、Stage 2B 与提交前最终 `npm run build` 均成功，`out/index.html` 已重新生成。
- 当前环境未提供可调用的浏览器控制工具或 `agent-browser` CLI，因此未执行真实的 390×844 / 1440×900 点击与视觉验收，也不声明已检查视觉溢出、布局跳动或浏览器控制台。

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
