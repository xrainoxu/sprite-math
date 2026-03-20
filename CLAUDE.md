# Claude Code 项目配置

本文件用于为 Claude Code 提供项目特定的上下文和指令。

## 项目概述

这是一个面向小朋友的数学学习项目（sprite-math / MathFun），提供趣味算术训练，包括20以内加减法、大小判断等题型。

## Git 使用规范

- **允许操作**：可以执行 `git commit` 提交代码
- **禁止操作**：禁止执行 `git push` 推送到远程仓库

### 提交约定

使用 Conventional Commits 格式：

```
<type>: <subject>

<optional body>
```

**Type 类型：**
- `feat`: 新功能
- `fix`: 修复 bug
- `refactor`: 代码重构
- `style`: 样式调整
- `docs`: 文档更新

**示例：**
```
feat: add timer component for timed challenge mode
fix: resolve answer validation issue
style: unify color scheme for detail pages
```

## 技术栈

- Language: TypeScript
- Framework: React 19
- Build Tool: Vite
- Animation: Framer Motion
- Routing: React Router DOM (HashRouter)
- Styling: Tailwind CSS

## 项目结构

```
sprite-math/
├── sprite-math/src/
│   ├── main.tsx                 # 入口文件
│   ├── App.tsx                  # 主应用组件（路由配置）
│   ├── index.css                # 全局样式（渐变背景）
│   │
│   ├── pages/                   # 页面组件
│   │   ├── Home.tsx             # 首页（模式选择）
│   │   ├── TimedMode.tsx        # 计时挑战详情页（选择时长）
│   │   ├── TimedPlay.tsx        # 计时挑战游戏页
│   │   ├── ChallengeMode.tsx    # 闯关模式详情页
│   │   ├── ChallengePlay.tsx    # 闯关模式游戏页
│   │   └── PracticeMode.tsx     # 自由练习（选择题型+游戏）
│   │
│   ├── components/              # 公共组件
│   │   ├── AnswerInput.tsx      # 答案输入组件
│   │   ├── GameHeader.tsx       # 游戏顶部栏组件
│   │   ├── GameProgressBar.tsx  # 游戏进度条组件
│   │   ├── Icon.tsx             # 图标组件（iconify）
│   │   ├── ProgressBar.tsx      # 进度条组件（已废弃，请使用 GameProgressBar）
│   │   ├── QuestionCard.tsx     # 题目卡片组件
│   │   ├── ScoreDisplay.tsx     # 分数显示组件
│   │   ├── StatsPanel.tsx       # 统计面板组件
│   │   └── Timer.tsx            # 计时器组件
│   │
│   └── utils/                   # 工具函数
│       ├── math.ts              # 题目生成与答案检查
│       ├── sound.ts             # 音效播放（Web Audio API）
│       └── storage.ts           # 本地存储（localStorage）
│
└── package.json
```

## 路由结构

| 路径 | 页面 | 说明 |
|------|------|------|
| `/` | Home | 首页，选择游戏模式 |
| `/timed` | TimedMode | 计时挑战详情页，选择时长 |
| `/timed/play` | TimedPlay | 计时挑战游戏页 |
| `/challenge` | ChallengeMode | 闯关模式详情页 |
| `/challenge/play` | ChallengePlay | 闯关模式游戏页 |
| `/practice` | PracticeMode | 自由练习详情页，选择题型 |
| `/practice/play` | PracticePlay | 自由练习游戏页 |

## 闯关详情页（三种模式）

三种模式的详情页结构相似，都是用户开始游戏前的配置页面：

1. **TimedMode** (`/timed`) - 计时挑战详情页
   - 选择时长：1分钟、2分钟、3分钟、5分钟
   - 显示最高分记录

2. **ChallengeMode** (`/challenge`) - 闯关模式详情页
   - 显示生命值、能量值说明

3. **PracticeMode** (`/practice`) - 自由练习详情页
   - 选择题型：加法、减法、大小判断

**当前配色方案**：统一使用温暖的米黄色调（Amber色系）
- 退出按钮：`bg-amber-200`，`text-amber-800`
- 标题：`text-amber-800`
- 描述：`text-amber-700`
- 信息卡片：`bg-amber-100/80`，`border-amber-300`
- 开始按钮：`bg-gradient-to-r from-amber-400 to-orange-400`

## 题目类型

项目支持三种题目类型（定义在 `utils/math.ts`）：

- `addition` - 加法（20以内）
- `subtraction` - 减法（结果非负）
- `comparison` - 大小判断（比较两个表达式结果）

## 数据存储

使用 localStorage 存储用户数据（`utils/storage.ts`）：
- 最高分（计时挑战）
- 最长连击
- 总答题数、正确数
- 最近30天的练习记录

## 常用命令

> 注意：所有依赖安装必须使用 **PNPM**，禁止使用 npm 或 yarn。

```bash
# 安装依赖（必须使用 pnpm）
pnpm install

# 开发服务器
pnpm dev

# 构建
pnpm build
```

## 代码规范

- 组件文件使用大驼峰命名（如 `QuestionCard.tsx`）
- 页面放在 `pages/` 目录
- 公共组件放在 `components/` 目录
- 工具函数放在 `utils/` 目录
- 使用 HashRouter 进行路由（兼容 GitHub Pages）

## 其他说明

- 背景使用温暖的浅色渐变：`linear-gradient(180deg, #FFF8E7 0%, #FFFBF0 50%, #FFF5E6 100%)`
- 动画效果使用 Framer Motion
- 图标使用 Iconify（iconify-react）
- 音效使用 Web Audio API 生成

## 游戏页面组件

### GameHeader 组件

游戏页面的统一顶部栏组件，整合了退出按钮、计时器/关卡/生命值、分数显示、进度条等功能。

**位置**：`src/components/GameHeader.tsx`

**属性接口**：
```typescript
interface GameHeaderProps {
  onExit: () => void;                    // 退出按钮回调
  timerSeconds?: number;                 // 计时器倒计时秒数
  onTimeUp?: () => void;                 // 计时器结束回调
  score: number;                         // 当前分数
  streak: number;                        // 当前连击数
  level?: number;                        // 当前关卡
  health?: number;                       // 当前生命值
  maxHealth?: number;                    // 最大生命值（默认3）
  progressValue?: number;                // 进度条当前值
  progressMax?: number;                 // 进度条最大值
  progressLabel?: string;               // 进度条标签（默认"进度"）
  theme?: 'rose' | 'violet' | 'orange'; // 主题颜色
  leftContent?: ReactNode;               // 自定义左侧内容
  rightContent?: ReactNode;              // 自定义右侧内容
}
```

**使用示例**：
```tsx
<GameHeader
  onExit={() => navigate('/timed')}
  timerSeconds={300}
  onTimeUp={handleTimeUp}
  score={score}
  streak={streak}
  progressValue={correctCount}
  progressMax={20}
  theme="rose"
/>
```

**布局结构**：
```
[左侧: 计时器/关卡+生命值/自定义] [中间: 进度条] [右侧: 分数 + 退出按钮]
```

### GameProgressBar 组件

游戏页面使用的进度条组件，文字显示在进度条内部。

**位置**：`src/components/GameProgressBar.tsx`

**属性接口**：
```typescript
interface GameProgressBarProps {
  value: number;    // 当前值
  max?: number;     // 最大值（不传则只显示数值，无进度填充）
  label?: string;   // 标签文字（默认"进度"）
}
```

**视觉效果**：
- 高度：`h-8` (mobile) / `h-9` (md)
- 圆角：`rounded-xl`
- 边框：`border-2 border-white/50`
- 背景：`bg-white/30`（半透明白色）
- 进度填充：渐变色 `from-violet-400 to-purple-500`
- 文字：居中显示 `text-xs font-bold text-purple-700`

**显示效果**：
```
┌─────────────────────────────────────────┐
│ ████████████ 答题进度: 5/20  ██████████│
└─────────────────────────────────────────┘
```

**使用示例**：
```tsx
// 带最大值（显示进度条填充）
<GameProgressBar value={5} max={20} label="答题进度" />

// 无最大值（只显示数值）
<GameProgressBar value={10} label="答对题数" />
```

### 三个游戏页面的顶部栏配置

| 页面 | 左侧 | 中间 | 右侧 |
|------|------|------|------|
| TimedPlay | 计时器 | 进度条(答题数/20) | 分数 + 退出 |
| ChallengePlay | 关卡 + 生命值 | 进度条(能量/100) | 分数 + 退出 |
| PracticePlay | 正确率 | 进度条(答对数/总数) | 分数 + 退出 |
