# 谷歌登录配置指南

本项目已集成谷歌登录功能。要使用此功能，需要完成以下配置步骤：

## 1. 获取谷歌客户端ID

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建新项目或选择现有项目
3. 启用 Google+ API
4. 在"凭据"页面创建 OAuth 2.0 客户端ID
5. 配置授权的 JavaScript 来源和重定向URI

## 2. 环境变量配置

在项目根目录创建 `.env` 文件（如果不存在），或在现有环境配置文件中添加：

```bash
# 谷歌登录客户端ID
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

## 3. 后端API接口

确保后端提供以下接口：

### 谷歌登录接口
```
POST /auth/google-login
Content-Type: application/json

{
  "grantType": "google",
  "clientId": "your-app-client-id", 
  "host": "your-domain.com",
  "googleToken": "google-access-token",
  "salesmanId": "推荐人ID（可选）",
  "parentId": "上级ID（可选）",
  "isBlogger": "true/false（可选）"
}
```

### 谷歌注册接口
```
POST /auth/google-register
Content-Type: application/json

{
  "grantType": "google",
  "clientId": "your-app-client-id",
  "host": "your-domain.com", 
  "googleToken": "google-access-token",
  "salesmanId": "推荐人ID（可选）",
  "parentId": "上级ID（可选）",
  "isBlogger": "true/false（可选）"
}
```

## 4. 功能特性

- **智能登录/注册**：自动判断用户是否存在，存在则登录，不存在则注册
- **推荐系统集成**：支持推荐人ID和上级ID传递
- **多语言支持**：支持中文、英文、葡萄牙语
- **错误处理**：完整的错误提示和处理机制
- **状态管理**：与现有登录系统完全集成

## 5. 使用方式

用户在登录弹窗中点击谷歌登录按钮即可触发谷歌OAuth流程。登录成功后会自动：

1. 保存用户token和信息
2. 关闭登录弹窗
3. 跳转到首页
4. 刷新用户相关数据

## 6. 错误码处理

- `100004`: 用户不存在，自动触发注册流程
- 其他错误码：显示对应的错误提示

## 7. 安全考虑

- 谷歌token仅用于后端验证，不会在前端长期存储
- 使用HTTPS确保token传输安全
- 遵循OAuth 2.0最佳实践

## 8. 调试

开发环境中，控制台会输出详细的谷歌登录流程日志，便于调试和排查问题。 