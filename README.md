# 🧠 EconAI - 经济学AI知识库

专业的经济学AI对话平台，支持多个AI模型，帮助用户深入理解经济学理论和政策。

## ✨ 特性

- 🤖 **多AI模型支持** - ChatGPT、DeepSeek、Gemini
- 📚 **专业资源推荐** - 合法、权威的经济学文档来源
- 💡 **智能对话指导** - 提供最佳实践和问题示例
- 🎯 **学派覆盖全面** - 新古典、凯恩斯、奥地利、制度经济学
- 📖 **完整帮助中心** - 从资源收集到AI对话的全流程指导

## 🚀 快速开始

### 本地开发

1. **克隆项目**
```bash
git clone https://github.com/yourusername/econai.git
cd econai
```

2. **安装依赖**
```bash
npm install
```

3. **启动开发服务器**
```bash
npm run dev
```

4. **访问应用**
打开 [http://localhost:3000](http://localhost:3000)

### 构建和部署

1. **构建静态文件**
```bash
npm run build
```

2. **部署到GitHub Pages**
- 推送代码到 `main` 分支
- GitHub Actions 会自动构建和部署
- 访问 `https://yourusername.github.io/econai`

## 📁 项目结构

```
econai/
├── app/                    # Next.js App Router
│   ├── page.tsx           # 主页面
│   ├── layout.tsx         # 布局组件
│   └── globals.css        # 全局样式
├── components/            # React组件
│   ├── ui/               # UI基础组件
│   ├── ResourceRecommendations.tsx  # 资源推荐
│   ├── UsageTips.tsx     # 使用提示
│   └── HelpCenter.tsx    # 帮助中心
├── .github/workflows/     # GitHub Actions
│   └── deploy.yml        # 自动部署配置
├── ECONOMICS_SETUP.md     # 经济学资源设置指南
└── README.md             # 项目说明
```

## 🎯 使用指南

### 推荐的经济学资源

#### 政府和国际组织
- 美联储经济报告
- 世界银行开放知识库  
- IMF出版物
- 中国人民银行工作论文
- OECD经济展望

#### 公有领域经典著作
- 亚当·斯密《国富论》(1776)
- 大卫·李嘉图《政治经济学及赋税原理》(1817)
- 约翰·穆勒《政治经济学原理》(1848)
- 马克思《资本论》(部分版本)

### 最佳实践

1. **文档选择**: 每次对话选择3-5个相关文档
2. **问题设计**: 提出具体明确的问题
3. **信息验证**: 对比多个AI模型的回答
4. **合规使用**: 仅使用合法授权的资源

### 问题示例

- "根据美联储报告，当前货币政策的主要目标是什么？"
- "亚当·斯密在《国富论》中如何解释分工的作用？"
- "比较凯恩斯主义和新古典主义对失业问题的不同观点"

## 🛠️ 技术栈

- **框架**: Next.js 13 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **UI组件**: Radix UI + shadcn/ui
- **图标**: Lucide React
- **部署**: GitHub Pages (静态导出)

## 📄 许可证

MIT License - 查看 [LICENSE](LICENSE) 文件了解详情

## 👨‍💻 作者

**fangxin**
- Email: fangin1230@gmail.com
- GitHub: [@fangixn](https://github.com/fangixn)

## 🤝 贡献

欢迎提交 Issues 和 Pull Requests！

---

© 2025 EconAI by fangxin. 专业的经济学AI知识库平台。 