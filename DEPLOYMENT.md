# 🚀 EconAI 部署指南

本指南将帮助您将 EconAI 项目成功部署到 GitHub Pages 或其他静态托管平台。

## 📋 部署前检查清单

### ✅ 必要条件
- [x] Node.js 18+ 已安装
- [x] Git 已安装并配置
- [x] GitHub 账户
- [x] 项目已推送到 GitHub 仓库

### ✅ 项目配置验证
- [x] `next.config.js` 配置了静态导出
- [x] `package.json` 包含部署脚本
- [x] GitHub Actions 工作流已设置
- [x] 所有依赖已正确安装

## 🎯 部署方案

### 方案一：GitHub Pages（推荐）

#### 1. 仓库设置
```bash
# 1. 创建 GitHub 仓库
# 2. 克隆到本地
git clone https://github.com/yourusername/econai.git
cd econai

# 3. 推送代码
git add .
git commit -m "Initial commit"
git push origin main
```

#### 2. 启用 GitHub Pages
1. 进入 GitHub 仓库设置页面
2. 滚动到 "Pages" 部分
3. 选择 "GitHub Actions" 作为源
4. GitHub Actions 会自动触发部署

#### 3. 访问网站
- 部署成功后，访问：`https://yourusername.github.io/econai`
- 或使用自定义域名（如已配置）

### 方案二：Vercel（替代方案）

#### 1. 导入项目
1. 访问 [vercel.com](https://vercel.com)
2. 使用 GitHub 账户登录
3. 点击 "Import Project"
4. 选择 `econai` 仓库

#### 2. 配置设置
```bash
# 构建命令
npm run build

# 输出目录
out

# 安装命令
npm install
```

#### 3. 部署
- Vercel 会自动部署
- 获得 `.vercel.app` 域名

### 方案三：Netlify（替代方案）

#### 1. 连接仓库
1. 访问 [netlify.com](https://netlify.com)
2. 点击 "New site from Git"
3. 连接 GitHub 并选择仓库

#### 2. 构建设置
```bash
# 构建命令
npm run build

# 发布目录
out

# 环境变量
NODE_VERSION=18
```

## 🔧 高级配置

### 自定义域名设置

#### GitHub Pages
1. 在仓库根目录创建 `CNAME` 文件
2. 添加域名：`econai.yourdomain.com`
3. 在域名 DNS 设置中添加 CNAME 记录

#### DNS 配置
```
Type: CNAME
Name: econai (或其他子域名)
Value: yourusername.github.io
```

### 环境变量配置

如果项目需要环境变量，在 GitHub Actions 中设置：

1. 进入仓库 Settings > Secrets and variables > Actions
2. 添加所需的环境变量：
   ```
   NEXT_PUBLIC_API_URL=your_api_url
   ```

### SSL 证书
- GitHub Pages：自动提供 HTTPS
- Vercel：自动提供 HTTPS  
- Netlify：自动提供 HTTPS

## 🐛 常见问题排查

### 构建失败

#### 问题：依赖安装失败
```bash
# 解决方案：清理并重新安装
rm -rf node_modules package-lock.json
npm install
```

#### 问题：TypeScript 错误
```bash
# 解决方案：检查类型错误
npm run lint
npm run build
```

#### 问题：路径问题
确保 `next.config.js` 中的 `basePath` 和 `assetPrefix` 正确设置。

### 部署后访问问题

#### 问题：404 错误
- 检查 GitHub Pages 设置
- 确认 `out` 目录包含 `index.html`
- 验证 URL 路径正确

#### 问题：样式不加载
- 检查 `next.config.js` 中的 `assetPrefix`
- 确认静态资源路径正确

#### 问题：JavaScript 不执行
- 检查浏览器控制台错误
- 确认 `.nojekyll` 文件存在

## 📊 性能优化

### 构建优化
```javascript
// next.config.js
const nextConfig = {
  // 启用压缩
  compress: true,
  
  // 优化包大小
  experimental: {
    optimizeCss: true
  },
  
  // 静态资源优化
  images: {
    unoptimized: true,
    loader: 'custom'
  }
};
```

### CDN 加速
考虑使用 Cloudflare 等 CDN 服务加速全球访问。

## 🔄 持续部署

### 自动部署触发条件
当前配置在以下情况触发部署：
- 推送到 `main` 分支
- 创建 Pull Request

### 部署监控
- GitHub Actions 提供构建日志
- 可以设置邮件通知

## 📞 支持

如果遇到部署问题：

1. 检查 GitHub Actions 日志
2. 查看 [Next.js 部署文档](https://nextjs.org/docs/deployment)
3. 参考 [GitHub Pages 文档](https://docs.github.com/en/pages)
4. 提交 Issue 到项目仓库

---

🎉 **恭喜！** 您的 EconAI 项目现在已成功部署上线！ 