# Aegis CDR System - 代码修复指令

## 项目背景
这是一个React + TypeScript的安全管理系统，使用Vite构建。目前存在多个安全和架构问题需要修复。

## 优先级1：安全修复（必须立即完成）

### 1.1 实现密码哈希存储
**目标**: 不再以明文存储密码

**具体任务**:
1. 安装bcryptjs库：`npm install bcryptjs @types/bcryptjs`
2. 在 `services/backend.ts` 中：
   - 导入bcrypt：`import bcrypt from 'bcryptjs';`
   - 修改 `initializeData()` 方法（约254行）：
     ```typescript
     // 将所有明文密码hash
     { id: 'user01', name: 'John Doe',
       password: bcrypt.hashSync('password', 10), // 替换明文
       unit: 'Headquarters', department: 'Finance', contact: '555-0101',
       createdAt: new Date().toISOString()
     }

     // admin users也需要hash
     { role: Role.SYSADMIN, password: bcrypt.hashSync('123456', 10) },
     { role: Role.SECADMIN, password: bcrypt.hashSync('123456', 10) },
     { role: Role.LOGADMIN, password: bcrypt.hashSync('123456', 10) }
     ```
   - 修改 `authenticateGeneralUser()` 方法（约555行）：
     ```typescript
     const user = this.generalUsers.find(u => u.id === id);
     return (user && bcrypt.compareSync(pass, user.password)) ? user : null;
     ```
   - 修改 `authenticateAdmin()` 方法（约561行）：
     ```typescript
     const admin = this.adminUsers.find(a => a.role === role);
     return admin ? bcrypt.compareSync(pass, admin.password) : false;
     ```
   - 修改 `changePassword()` 方法（约569行）：
     ```typescript
     // 验证旧密码
     if (user && bcrypt.compareSync(oldPass, user.password)) {
         user.password = bcrypt.hashSync(newPass, 10); // hash新密码
         ...
     }
     ```
   - 删除 `isDefaultAdminPassword()` 方法（不再需要）

3. 在 `components/Login.tsx` 中删除对 `isDefaultAdminPassword()` 的调用（约53行）

### 1.2 添加密码强度验证
**目标**: 确保新密码符合安全标准

**具体任务**:
1. 在 `services/backend.ts` 中添加密码验证函数：
   ```typescript
   public validatePasswordStrength(password: string): { valid: boolean; error?: string } {
       if (password.length < 8) {
           return { valid: false, error: 'Password must be at least 8 characters' };
       }
       if (!/[A-Z]/.test(password)) {
           return { valid: false, error: 'Password must contain uppercase letter' };
       }
       if (!/[a-z]/.test(password)) {
           return { valid: false, error: 'Password must contain lowercase letter' };
       }
       if (!/[0-9]/.test(password)) {
           return { valid: false, error: 'Password must contain number' };
       }
       return { valid: true };
   }
   ```

2. 在 `App.tsx` 的 `handlePasswordSubmit()` 方法（约224行）中添加验证：
   ```typescript
   const validation = backend.validatePasswordStrength(newPass);
   if (!validation.valid) {
       setPassError(validation.error || 'Invalid password');
       return;
   }
   ```

3. 在 `components/views/UserManagement.tsx` 的 `handleSubmit()` 方法（约50行）添加验证

4. 在 `i18n.tsx` 添加错误消息翻译键（约305和609行附近）：
   ```typescript
   // English
   'error.password_length': 'Password must be at least 8 characters',
   'error.password_uppercase': 'Password must contain uppercase letter',
   'error.password_lowercase': 'Password must contain lowercase letter',
   'error.password_number': 'Password must contain number',

   // Chinese
   'error.password_length': '密码长度至少8个字符',
   'error.password_uppercase': '密码必须包含大写字母',
   'error.password_lowercase': '密码必须包含小写字母',
   'error.password_number': '密码必须包含数字',
   ```

### 1.3 清理无效Session
**目标**: 防止损坏的session数据导致错误

**具体任务**:
在 `App.tsx` 的 useEffect（约25行）中改进错误处理：
```typescript
useEffect(() => {
    const storedUser = sessionStorage.getItem('aegis_user_session');
    if (storedUser) {
        try {
            const u = JSON.parse(storedUser);
            // 验证session数据完整性
            if (u && u.username && u.role && Object.values(Role).includes(u.role)) {
                setUser(u);
                if (u.role === Role.USER) {
                    setCurrentView(View.FILE_CLEANING);
                }
            } else {
                // 清理无效session
                sessionStorage.removeItem('aegis_user_session');
            }
        } catch(e) {
            console.error('Failed to restore session', e);
            sessionStorage.removeItem('aegis_user_session'); // 清理
        }
    }
}, []);
```

## 优先级2：数据持久化（重要）

### 2.1 实现LocalStorage持久化
**目标**: 数据在页面刷新后保持

**具体任务**:
在 `services/backend.ts` 中：

1. 修改所有数据修改方法，在操作后调用保存：
   ```typescript
   private saveToStorage(key: string, data: any): void {
       try {
           localStorage.setItem(key, JSON.stringify(data));
       } catch (e) {
           console.error(`Failed to save ${key}:`, e);
       }
   }

   private loadFromStorage<T>(key: string, defaultValue: T): T {
       try {
           const item = localStorage.getItem(key);
           return item ? JSON.parse(item) : defaultValue;
       } catch (e) {
           console.error(`Failed to load ${key}:`, e);
           return defaultValue;
       }
   }
   ```

2. 修改 `initializeData()` 方法（约240行）：
   ```typescript
   private initializeData(): void {
       // 先尝试从localStorage加载
       this.generalUsers = this.loadFromStorage(STORAGE_KEYS.USERS, []);
       this.adminUsers = this.loadFromStorage(STORAGE_KEYS.ADMINS, []);
       this.tasks = this.loadFromStorage(STORAGE_KEYS.TASKS, []);
       // ... 其他数据

       // 只有在空的时候才初始化默认数据
       if (this.generalUsers.length === 0) {
           this.generalUsers = [
               { id: 'user01', name: 'John Doe',
                 password: bcrypt.hashSync('password', 10), ... }
           ];
           this.saveToStorage(STORAGE_KEYS.USERS, this.generalUsers);
       }

       if (this.adminUsers.length === 0) {
           this.adminUsers = [
               { role: Role.SYSADMIN, password: bcrypt.hashSync('123456', 10) },
               // ...
           ];
           this.saveToStorage(STORAGE_KEYS.ADMINS, this.adminUsers);
       }
       // ... 其他数据同理
   }
   ```

3. 在所有修改数据的方法后添加保存调用：
   - `addTask()`: `this.saveToStorage(STORAGE_KEYS.TASKS, this.tasks);`
   - `addGeneralUser()`: `this.saveToStorage(STORAGE_KEYS.USERS, this.generalUsers);`
   - `updateGeneralUser()`: `this.saveToStorage(STORAGE_KEYS.USERS, this.generalUsers);`
   - `deleteGeneralUser()`: `this.saveToStorage(STORAGE_KEYS.USERS, this.generalUsers);`
   - `changePassword()`: 保存对应的USERS或ADMINS
   - 等等所有修改方法

## 优先级3：代码组织（重要）

### 3.1 统一类型定义
**目标**: 消除重复的interface定义

**具体任务**:
1. 从 `services/backend.ts` 中删除以下重复定义（约49-76行）：
   - `PolicyRule` - 使用 types.ts 中的
   - `LogEntry` - 使用 types.ts 中的

2. 在 `types.ts` 中添加缺失的interface（从backend.ts迁移）：
   ```typescript
   export interface Task {
     id: string;
     name: string;
     size: string;
     sizeBytes: number;
     status: 'CLEAN' | 'MALICIOUS' | 'SCANNING' | 'UPLOADING';
     type: 'DOC' | 'IMG' | 'AV' | 'OTHER';
     progress: number;
     currentStep: string;
     submittedAt: string;
     completedAt?: string;
     submittedBy: string;
   }

   export interface ThreatStats {
     pps: number;
     dropped: number;
     sources: number;
     mitigating: boolean;
     malware_detected: number;
     total_attacks: number;
     active_rules: number;
     uptime_start: number;
     active_video_tasks: number;
     active_file_tasks: number;
   }

   export interface ServiceStatus {
     name: string;
     status: 'running' | 'degraded' | 'stopped';
     load: 'low' | 'medium' | 'high';
     lastCheck: string;
   }

   export interface ThreatConfig {
     synThreshold: number;
     udpThreshold: number;
     synAction: 'drop' | 'blacklist';
     udpAction: 'drop' | 'ratelimit';
     whitelist: string[];
   }

   export interface Report {
     id: string;
     name: string;
     type: 'AUDIT' | 'TRAFFIC' | 'COMPLIANCE';
     dateRange: string;
     generatedBy: string;
     generatedAt: string;
     content: string;
   }

   export interface ArchiveFile {
     id: string;
     filename: string;
     month: string;
     size: string;
     createdAt: string;
   }

   export interface BackupFile {
     id: string;
     name: string;
     createdAt: string;
     size: string;
     type: 'MANUAL' | 'AUTO';
     data: string;
   }

   export interface NetworkConfig {
     hostname: string;
     ipAddress: string;
     netmask: string;
     gateway: string;
     dns1: string;
     ntpServer: string;
   }

   export interface LogConfig {
     retentionDays: number;
     diskCleanupThreshold: number;
     autoArchive: boolean;
   }
   ```

3. 统一 `SystemStats` 定义（types.ts中已有但结构不同）：
   - 删除 types.ts:61-67 的旧定义
   - 使用 backend.ts 中更完整的版本（42-47行）

4. 在 `services/backend.ts` 顶部更新导入：
   ```typescript
   import {
       GeneralUser, Role, LogEntry, PolicyRule, SystemStats,
       Task, ThreatStats, ServiceStatus, ThreatConfig, Report,
       ArchiveFile, BackupFile, NetworkConfig, LogConfig
   } from '../types';
   ```

### 3.2 拆分AccountModal组件
**目标**: 减少App.tsx的复杂度

**具体任务**:
1. 创建新文件 `components/AccountModal.tsx`
2. 将 `App.tsx` 的 201-343 行的 AccountModal 组件完整移动到新文件
3. 添加必要的导入：
   ```typescript
   import React, { useState, useEffect } from 'react';
   import { User, Role } from '../types';
   import { X } from 'lucide-react';
   import { backend } from '../services/backend';
   ```
4. 导出组件：`export default AccountModal;`
5. 在 `App.tsx` 中导入并使用：
   ```typescript
   import AccountModal from './components/AccountModal';
   ```

### 3.3 创建constants文件存放Magic Strings
**目标**: 集中管理常量

**具体任务**:
在 `constants.ts` 中添加：
```typescript
export const DEFAULT_ADMIN_PASSWORD = '123456'; // 仅用于初始化
export const PASSWORD_MIN_LENGTH = 8;
export const SESSION_STORAGE_KEY = 'aegis_user_session';
export const DEV_SERVER_PORT = 3000;
```

然后在相关文件中引用这些常量替换硬编码字符串。

## 优先级4：用户体验改进（建议）

### 4.1 添加Toast通知组件
**目标**: 替换alert()为现代UI

**具体任务**:
1. 安装react-hot-toast：`npm install react-hot-toast`
2. 在 `App.tsx` 顶部添加：
   ```typescript
   import { Toaster, toast } from 'react-hot-toast';
   ```
3. 在主返回的JSX中添加：`<Toaster position="top-right" />`
4. 替换所有 `alert()` 调用：
   - `alert(t('common.password_changed'))` → `toast.success(t('common.password_changed'))`
   - `alert(t('user.update_success'))` → `toast.success(t('user.update_success'))`
   - 其他文件中的alert同理

### 4.2 移除window.location.reload()
**目标**: 避免强制刷新页面

**具体任务**:
在 `App.tsx` 的 `handleInfoSubmit()` 方法（约253行）：
```typescript
const handleInfoSubmit = () => {
    if (!userInfo) return;
    backend.updateGeneralUser(userInfo);
    toast.success(t('user.update_success')); // 使用toast

    // 更新本地状态而不是刷新
    const currentSession = JSON.parse(sessionStorage.getItem('aegis_user_session') || '{}');
    currentSession.name = userInfo.name;
    sessionStorage.setItem('aegis_user_session', JSON.stringify(currentSession));
    setUser(currentSession); // 更新状态触发重渲染
    onClose();
};
```

## 优先级5：清理工作（建议）

### 5.1 移除未使用的GEMINI_API_KEY
**具体任务**:
1. 从 `vite.config.ts` 中删除第14-15行：
   ```typescript
   // 删除这两行
   'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
   'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
   ```
2. 从 `README.md` 中删除第18行关于GEMINI_API_KEY的说明
3. 删除 `.env.local` 文件（如果存在）

### 5.2 完善i18n翻译键
**具体任务**:
在 `constants.ts` 中修改硬编码的日志消息（约4-10行）：
```typescript
export const MOCK_LOGS: LogEntry[] = [
  { id: 101, timestamp: '2023-10-27 10:42:01', severity: 'FATAL',
    module: 'THREAT', messageKey: 'log.msg.sql_injection', // 修改
    sourceIp: '192.168.1.55' },
  // ... 其他类似修改
  { id: 103, timestamp: '2023-10-27 10:40:12', severity: 'WARN',
    module: 'SYSTEM', messageKey: 'log.msg.high_memory', // 修改
    params: { percent: 85 } },
  // ...
];
```

然后在 `i18n.tsx` 添加对应的翻译。

## 验证清单

完成所有修改后，请确保：
- [ ] `npm install` 安装新依赖成功
- [ ] `npm run dev` 启动无错误
- [ ] 登录功能正常（管理员和普通用户）
- [ ] 修改密码功能正常，弱密码被拒绝
- [ ] 刷新页面后数据保持（用户、任务等）
- [ ] 不再有TypeScript类型错误
- [ ] 不再有浏览器console错误
- [ ] Toast通知显示正常（不再是alert弹窗）

## 注意事项

1. **逐步执行**: 建议按优先级顺序执行，每完成一个优先级就测试一次
2. **备份**: 开始前建议创建git分支：`git checkout -b security-improvements`
3. **依赖版本**: bcryptjs使用稳定版本，react-hot-toast使用最新版本
4. **不要删除功能**: 只修复和改进，不要删除现有功能
5. **保持翻译完整**: 添加新的翻译键时确保英文和中文都添加

## 完成后报告

请提供以下信息：
1. 完成了哪些优先级的任务
2. 遇到的任何问题和解决方案
3. 新增的npm依赖列表
4. 测试结果截图（登录、密码修改、数据持久化）
