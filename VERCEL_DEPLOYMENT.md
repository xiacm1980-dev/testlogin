# Vercel部署指南

## 前提条件
- GitHub账户
- Vercel账户（可以用GitHub登录）
- 项目已推送到GitHub

## 部署步骤

### 1. 推送代码到GitHub

```bash
# 如果push失败，请重试或检查网络
git push origin main
```

### 2. 登录Vercel

访问: https://vercel.com
使用GitHub账户登录

### 3. 导入项目

1. 点击 "Add New Project"
2. 选择 "Import Git Repository"
3. 找到你的仓库: `xiacm1980-dev/testlogin`
4. 点击 "Import"

### 4. 配置项目

Vercel会自动检测到这是Vite项目，配置如下：

```
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

**无需修改，保持默认即可！**

### 5. 部署

点击 "Deploy" 按钮，等待几分钟。

部署完成后，你会得到一个URL，类似：
```
https://your-project-name.vercel.app
```

## 环境变量配置

当前项目**不需要**配置环境变量（已移除GEMINI_API_KEY）

将来如果需要后端API地址，可以在Vercel添加：

1. 进入项目设置
2. 找到 "Environment Variables"
3. 添加：
   - `VITE_BACKEND_URL` = `https://your-backend-api.com`

## 自动部署

每次push到main分支，Vercel会自动重新部署！

## 自定义域名（可选）

在Vercel项目设置中可以添加自己的域名。

## 故障排除

### 部署失败
1. 检查 `package.json` 中的依赖
2. 本地运行 `npm run build` 测试
3. 查看Vercel部署日志

### 页面404
确保 `vercel.json` 中有正确的rewrites配置（已包含）

### 性能优化
Vercel自动提供：
- CDN加速
- 自动压缩
- HTTP/2支持

## 下一步

部署完成后：
1. 测试所有功能
2. 配置后端服务器URL（在API Settings页面）
3. 部署后端服务（见BACKEND_ARCHITECTURE.md）
