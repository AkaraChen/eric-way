# Guided Review

Guided Review 是一种把 PR diff 读成“故事线”的 review 交付物：先完整读完 diff，再把变更拆成几条可追踪的线，最后输出一份带阅读顺序、风险判断和验证重点的导读，让人类 reviewer 能快速理解这个 PR 到底在改什么、为什么这么改、哪里最值得盯。

它不是把 diff 重新摘要一遍，也不是替代 reviewer 下结论。它的目标是降低理解成本，让后续的代码审查更准、更快、更少漏线。

## 行业实践压缩版

- Google 的核心标准是 code health：只要 CL 明确改善系统整体健康，就不要为“不完美”无限拖延；reviewer 要看设计、功能、复杂度、测试、命名、注释、风格、文档，并在通常情况下看完每一行。
- Google 也建议先看变更是否成立，再看最重要的文件，最后按合理顺序读完剩余 diff；如果主设计有问题，先反馈，不要把时间花在会被重写的细节上。
- Microsoft 的 reviewer guidance 把自动化和人工分工说得很清楚：lint 等自动化覆盖低价值检查，人类重点看业务逻辑正确性、测试正确性、架构和可维护性；读不懂上下文时要打开全文件或 checkout。
- GitHub 的 PR 指南强调小 PR、清晰标题和描述、作者先自审、给 reviewer 指定阅读顺序、提前看安全风险；Copilot code review 现在可以做非阻塞的建议型初审，但不会替代 required approval。
- GitLab 把 review 责任分层：author 是方案 DRI，reviewer 看具体方案，maintainer 负责代码库整体健康；复杂 MR 要找 domain expert，并用 checklist 覆盖质量、性能、可靠性、安全、可观测性、文档和部署风险。
- Meta 的 Sapling/ReviewStack 代表了另一条路线：把大功能拆成可堆叠的小 diff，让每个变化都能独立讨论和批准，避免一个巨大 PR 混在一起读。
- 2025-2026 的新趋势是 AI 让写代码更快，但 review/integration 变成瓶颈；AI 适合先扫 routine issue、补上下文、生成初稿，人类仍然要负责语义、取舍、风险和最终判断。

## Guided Review 的输出

一份 Guided Review 至少包含这几块：

1. **一句话主线**：这个 PR 最核心的行为变化是什么。
2. **阅读路线**：建议 reviewer 按什么文件/commit/模块顺序读，为什么。
3. **线索地图**：把 diff 拆成明线、暗线和横切线。
4. **风险焦点**：最可能出问题的路径、边界、迁移点和回滚点。
5. **验证焦点**：哪些测试/截图/日志/手测证明了主线，哪些还没证明。
6. **Review 问题清单**：真正需要作者回答的问题，不写低价值风格偏好。
7. **建议结论**：approve、request changes、comment-only，分别说明 blocker 和非 blocker。

## 线索模型

### 明线

明线是 PR 自己声明出来的主故事。

- 用户可见行为：页面、接口、CLI、权限、状态、错误文案发生了什么变化。
- 需求映射：diff 里的改动分别满足 issue/设计稿/事故复盘里的哪条要求。
- 正向路径：最常见、最希望发生的执行流是什么。
- 删除路径：删掉了什么旧行为，为什么可以删。

### 暗线

暗线是 diff 没有明说、但 reviewer 必须补出来的约束和假设。

- 隐含不变量：作者默认哪些状态永远存在、哪些字段永远非空、哪些顺序永远成立。
- 耦合变化：一个模块的小改动是否改变了别的模块的语义。
- 历史包袱：这段代码原来为什么长这样，这次是否绕过了老约束。
- 迁移风险：旧数据、旧客户端、旧配置、旧 feature flag 是否还能跑。
- 运维后果：日志、指标、告警、回滚、灰度、容量是否跟得上。
- 社会风险：PR 是否把多个争议点绑在一起，导致 reviewer 很难局部批准。

### 横切线

横切线是穿过多个文件的工程主题。

- 数据线：输入、校验、转换、持久化、输出。
- 状态线：加载、缓存、刷新、失效、并发、重试。
- 权限线：身份、授权、租户隔离、审计。
- 错误线：失败分类、错误传播、用户提示、重试/降级。
- 测试线：新增测试证明了什么，没证明什么，哪些测试只是锁实现细节。
- 复杂度线：是否为未来假设引入了当前不需要的抽象。

## 流程

### 0. 先定范围

- 读 PR 标题、描述、issue、设计稿、事故链接和 CI 状态。
- 标出 PR 声称要解决的问题，先不要下结论。
- 如果描述缺上下文，先把缺口写下来，读 diff 时验证它是否能自己补上。

### 1. 全量盘点 diff

- 列出文件清单：新增、修改、删除、重命名、生成文件、配置、测试、文档。
- 按职责分组，而不是按工具默认顺序直接读。
- 找主文件：通常是业务入口、核心 service、schema/migration、状态管理、公共 API。
- 生成文件、大数据文件可以抽样，但人工写的逻辑不要跳读。

### 2. 重建变更图

把 diff 还原成调用链和数据流：

```text
入口 -> 校验 -> 核心决策 -> 状态/存储 -> 副作用 -> 输出 -> 测试证明
```

每条链都问三件事：

- 这个变化从哪里进入系统？
- 它改了哪个事实或不变量？
- 谁会在后面依赖这个新事实？

### 3. 抽线

先抽明线，再抽暗线，最后抽横切线。

- 明线用用户语言写：这个 PR 让谁能做什么。
- 暗线用工程约束写：这个 PR 默认什么永远成立。
- 横切线用 reviewer 关注点写：安全、并发、性能、兼容、可观测、测试、回滚。

不要为了显得完整硬凑线。没有证据的线，标成“未覆盖/需要作者确认”。

### 4. 按线回读

第二遍读 diff 时，不再逐文件散读，而是沿每条线追到底。

- 追明线：入口、核心逻辑、UI/API 输出、测试是否闭环。
- 追暗线：边界条件、旧数据、异常路径、权限、并发是否被处理。
- 追测试线：测试名、fixture、assertion 是否真的会在主线坏掉时失败。
- 追删除线：删掉的代码有没有仍被配置、文档、调用方或用户习惯依赖。

### 5. 分级风险

把问题分成三档：

- **Blocker**：会破坏正确性、安全、数据、兼容、发布、回滚，或主目标根本没实现。
- **Should fix**：不一定立即出事故，但会明显增加维护成本、测试盲区或误用概率。
- **Nit / follow-up**：不阻塞合并的局部改善，必须明确标成可选或后续。

Eric way 下，尤其要盯过度防御、未来式抽象、重复运行时类型校验、大组件条件分支、手写 className 拼接、无意义 `useMemo`/`useCallback`、不该存在的 `useEffect`。

### 6. 写 Guided Review

推荐格式：

```md
## Guided Review

### 主线
一句话说明这个 PR 的核心变化。

### 建议阅读顺序
1. `path/to/main`：先看入口和业务意图。
2. `path/to/core`：再看核心决策和状态变化。
3. `path/to/tests`：最后看测试是否锁住行为。

### 线索地图
- 明线：...
- 数据线：...
- 状态线：...
- 边界线：...
- 测试线：...
- 暗线：...

### 关键风险
- Blocker：...
- Should fix：...
- Follow-up：...

### 需要作者确认
- ...

### Review 结论
Approve / Request changes / Comment only：理由。
```

## 写法要求

- 先说判断，再给证据；不要先铺一页背景。
- 每条风险都绑定文件、函数、行为或测试缺口。
- 对大 PR 给阅读路线，对小 PR 不硬写长文。
- 对不确定内容用问题，不用猜测当结论。
- 对风格和偏好使用 `Nit:` 或 follow-up，不阻塞主线。
- AI 初稿必须人工复核：它可以帮你列线，但不能替你确认语义正确。

## 反模式

- 只复述每个文件改了什么，没有还原系统行为。
- 没看完 diff 就先抓局部命名和格式。
- 把自动化能检查的 lint/style 当成人工 review 主体。
- 把多个 unrelated change 合在一个“主线”里强行解释。
- 只看新增代码，不看删除代码、配置、测试和文档。
- 只有问题没有导读，导致下一个 reviewer 还是得从零读。
- 只有导读没有判断，回避 approve/request changes 的责任。

## Sources

- [Google Engineering Practices: The Standard of Code Review](https://google.github.io/eng-practices/review/reviewer/standard.html)
- [Google Engineering Practices: What to look for in a code review](https://google.github.io/eng-practices/review/reviewer/looking-for.html)
- [Google Engineering Practices: Navigating a CL in review](https://google.github.io/eng-practices/review/reviewer/navigate.html)
- [Google Research: Modern Code Review, a Case Study at Google](https://research.google/pubs/modern-code-review-a-case-study-at-google/)
- [Microsoft Engineering Fundamentals: Reviewer Guidance](https://microsoft.github.io/code-with-engineering-playbook/code-reviews/process-guidance/reviewer-guidance/)
- [Microsoft Engineering: Enhancing Code Quality at Scale with AI-Powered Code Reviews](https://devblogs.microsoft.com/engineering-at-microsoft/enhancing-code-quality-at-scale-with-ai-powered-code-reviews/)
- [GitHub Docs: Helping others review your changes](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/getting-started/helping-others-review-your-changes)
- [GitHub Docs: Using GitHub Copilot code review](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/request-a-code-review/use-code-review)
- [GitLab Docs: Code Review Guidelines](https://docs.gitlab.com/development/code_review/)
- [Meta Engineering: Sapling source control](https://engineering.fb.com/2022/11/15/open-source/sapling-source-control-scalable/)
- [Google Cloud: When AI writes the code, who reviews it?](https://cloud.google.com/transform/when-ai-writes-the-code-who-reviews-it-cto-google-cloud)
