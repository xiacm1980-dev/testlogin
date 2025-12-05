import React, { createContext, useState, useContext, ReactNode } from 'react';

type Language = 'en' | 'zh';

const translations = {
  en: {
    'app.title': 'SecGuard Manager',
    'app.subtitle': 'Secure Device Management System',
    'app.footer': '© 2024 SecGuard Systems Inc. Protected by quantum encryption.',
    
    // Login
    'login.title': 'Login as',
    'login.password': 'Password',
    'login.placeholder': 'Enter password (default: 123456)',
    'login.back': 'Back',
    'login.button': 'Login',
    'login.error': 'Invalid password. Default is 123456',
    
    // Roles
    'role.sysadmin': 'System Administrator',
    'role.secadmin': 'Security Administrator',
    'role.logadmin': 'Log Audit Administrator',
    'role.desc.sysadmin': 'System status, Backup/Restore, API Config.',
    'role.desc.secadmin': 'DDoS Protection, Video Cleaning, File Cleaning.',
    'role.desc.logadmin': 'Log Audit, Reports & Statistical Analysis.',
    
    // Sidebar
    'menu.dashboard': 'Dashboard',
    'menu.system_config': 'System Config',
    'menu.api_settings': 'API Settings',
    'menu.user_management': 'User Management',
    'menu.security_policies': 'Security Policies',
    'menu.threat_protection': 'Threat & DDoS',
    'menu.video_cleaning': 'Video Cleaning',
    'menu.file_cleaning': 'File Cleaning',
    'menu.logs_audit': 'Audit Logs',
    'menu.reports': 'Reports & Analysis',
    'menu.signout': 'Sign Out',

    // Dashboard
    'dash.system_dashboard': 'System Dashboard',
    'dash.cpu': 'CPU Usage',
    'dash.memory': 'Memory Usage',
    'dash.disk': 'Disk Status',
    'dash.uptime': 'System Uptime',
    'dash.healthy': 'All Systems Normal',
    'dash.service_status': 'Service Status',
    'dash.service_name': 'Service Name',
    'dash.status': 'Status',
    'dash.load': 'Load',
    'dash.last_check': 'Last Check',
    'dash.running': 'Running',
    'dash.degraded': 'Degraded',
    'dash.task_video': 'Active Video Tasks',
    'dash.task_file': 'File Cleaning Tasks',
    'dash.threat_stats': 'Threat Prevention Stats (24h)',
    'dash.ddos_attacks': 'DDoS Attacks',
    'dash.intrusions': 'Intrusions',

    // System Config
    'config.title': 'System Configuration',
    'config.subtitle': 'Manage device settings, maintenance, and data policies.',
    'config.save': 'Save All Changes',
    'config.saving': 'Saving...',
    'config.tab.network': 'Network',
    'config.tab.logs': 'Log Policy',
    'config.tab.backup': 'Backup & Restore',
    'config.network.interfaces': 'Network Interfaces',
    'config.hostname': 'Hostname',
    'config.mgmt_ip': 'Management IP',
    'config.dns': 'DNS Server',
    'config.gateway': 'Gateway',
    'config.time': 'Time & NTP',
    'config.logs.title': 'Log Cleaning & Retention Policy',
    'config.logs.retention': 'Retention Period (Days)',
    'config.logs.desc': 'Logs older than {days} days will be automatically deleted or archived.',
    'config.logs.archive': 'Auto-Archive before delete',
    'config.logs.archive_desc': 'Compress and move old logs to cold storage before deletion.',
    'config.logs.manual': 'Manually Clean Logs Now',
    'config.backup.title': 'System Backup & Restore',
    'config.backup.create': 'Create Backup',
    'config.backup.create_desc': 'Download a full snapshot of the system configuration.',
    'config.backup.download': 'Download System Snapshot',
    'config.backup.restore': 'Restore System',
    'config.backup.restore_desc': 'Upload a previously saved snapshot to restore system state.',
    'config.backup.upload': 'Click to upload backup file',
    'config.backup.recent': 'Recent Backups',

    // Security Policies
    'policy.title': 'Security Policies',
    'policy.subtitle': 'Manage firewall rules and traffic control lists.',
    'policy.add': 'Add New Rule',
    'policy.search': 'Search policies...',
    'policy.filter': 'Filter',
    'policy.col.status': 'Status',
    'policy.col.id': 'ID',
    'policy.col.name': 'Name',
    'policy.col.source': 'Source',
    'policy.col.dest': 'Destination',
    'policy.col.service': 'Service',
    'policy.col.action': 'Action',
    'policy.allow': 'ALLOW',
    'policy.deny': 'DENY',
    'policy.delete_confirm': 'Are you sure you want to delete this policy rule?',
    'policy.empty': 'No policies found matching your search.',

    // Log Audit
    'log.title': 'System Logs & Audit',
    'log.subtitle': 'Monitor system events, security alerts, and user activity.',
    'log.export': 'Export CSV',
    'log.search': 'Search by message, module, IP...',
    'log.col.time': 'Time',
    'log.col.severity': 'Severity',
    'log.col.module': 'Module',
    'log.col.message': 'Message',
    'log.col.source': 'Source',
    'log.empty': 'No logs found.',

    // Threat Protection
    'threat.title': 'Threat Protection',
    'threat.subtitle': 'Configure DDoS mitigation and intrusion prevention systems.',
    'threat.active': 'ACTIVE',
    'threat.disabled': 'DISABLED',
    'threat.monitor': 'Live Attack Monitor',
    'threat.pps': 'Current PPS',
    'threat.dropped': 'Dropped Packets',
    'threat.sources': 'Active Sources',
    'threat.mitigating': 'Mitigating',
    'threat.syn_title': 'SYN Flood Protection',
    'threat.syn_desc': 'Limit the rate of SYN packets to prevent connection exhaustion.',
    'threat.threshold': 'Threshold (pps)',
    'threat.action': 'Action',
    'threat.udp_title': 'UDP Flood Protection',
    'threat.udp_desc': 'Mitigate volumetric UDP attacks targeting random ports.',
    'threat.whitelist': 'Trusted IP Whitelist',
    'threat.add_ip': '+ Add IP Range',

    // Video Stream
    'video.title': 'Video Stream Cleaning',
    'video.subtitle': 'Secure low-latency video transfer and sanitization.',
    'video.restart': 'Restart Engine',
    'video.tab.access': 'Access Config',
    'video.tab.forward': 'Forward Config',
    'video.tab.strategy': 'Cleaning Strategy',
    'video.ingress': 'Ingress Configuration',
    'video.ingress_desc': 'Configure accepted incoming video streams and protocols.',
    'video.protocol': 'Input Protocol',
    'video.port': 'Listening Port',
    'video.allowed_ips': 'Allowed Source IPs (CIDR)',
    'video.save_ingress': 'Save Ingress Rules',
    'video.forward': 'Forwarding Configuration',
    'video.forward_desc': 'Define where cleaned streams should be sent.',
    'video.strategy': 'Cleaning Strategy',
    'video.strategy_desc': 'Deep packet inspection and payload sanitization rules.',
    'video.check.protocol': 'Protocol Compliance Check',
    'video.check.steganography': 'Steganography Detection',
    'video.check.framerate': 'Frame Rate Limiting',

    // File Cleaning
    'file.title': 'File Cleaning & Sanitation',
    'file.subtitle': 'Upload files for deep content disarmament and reconstruction (CDR).',
    'file.drop': 'Drag & Drop files here',
    'file.browse': 'or click to browse from your computer',
    'file.formats': 'Supported formats: PDF, DOCX, ZIP, EXE (Max 500MB)',
    'file.recent': 'Recent Cleaning Tasks',
    'file.search': 'Search tasks...',
    'file.col.task': 'Task ID',
    'file.col.filename': 'Filename',
    'file.col.size': 'Size',
    'file.col.status': 'Status',
    'file.col.submitted': 'Submitted',
    'file.status.clean': 'Clean',
    'file.status.malicious': 'Malicious',
    'file.status.scanning': 'Scanning...',
    'file.download': 'Download',
    'file.view_report': 'View Report',

    // API Settings
    'api.title': 'API Interface Settings',
    'api.subtitle': 'Manage external access points and API keys.',
    'api.rest_title': 'REST API Configuration',
    'api.master_key': 'Master API Key',
    'api.master_key_desc': 'Used for sysadmin level integration. Keep secret.',
    'api.rate_limit': 'Rate Limit (Req/min)',
    'api.timeout': 'Session Timeout (sec)',
    
    // Reports
    'report.title': 'Reports & Analysis',
    'report.subtitle': 'Generate compliance reports and traffic analysis.',
    'report.export': 'Export Summary',
    'report.audit': 'Monthly Security Audit',
    'report.audit_desc': 'Comprehensive overview of blocked threats, policy changes, and system events.',
    'report.traffic': 'Traffic Analysis',
    'report.traffic_desc': 'Bandwidth usage, top talkers, and protocol distribution charts.',
    'report.compliance': 'Compliance Report',
    'report.compliance_desc': 'ISO 27001 / GDPR compliance check status and violation history.',
    'report.generate': 'Generate Report →',
    'report.history': 'Generated History',
    'report.col.name': 'Report Name',
    'report.col.date': 'Date Range',
    'report.col.by': 'Generated By',
    'report.col.on': 'Generated On',
    
    // Common
    'common.change_password': 'Change Password',
    'common.update_password': 'Update Password',
    'common.cancel': 'Cancel',
    'common.current_password': 'Current Password',
    'common.new_password': 'New Password',
    'common.confirm_password': 'Confirm New Password',
    'common.success': 'Success',
    'common.password_changed': 'Password changed successfully!',
    'common.access_denied': 'Access Denied',
    'common.no_permission': 'Your role does not have permission to view this resource.',
    'common.coming_soon': 'This module is under development.',
  },
  zh: {
    'app.title': 'SecGuard 管理系统',
    'app.subtitle': '安全设备管理系统',
    'app.footer': '© 2024 SecGuard Systems Inc. 受量子加密保护。',
    
    // Login
    'login.title': '登录身份',
    'login.password': '密码',
    'login.placeholder': '输入密码 (默认: 123456)',
    'login.back': '返回',
    'login.button': '登录',
    'login.error': '密码错误。默认密码为 123456',
    
    // Roles
    'role.sysadmin': '系统管理员',
    'role.secadmin': '安全管理员',
    'role.logadmin': '审计管理员',
    'role.desc.sysadmin': '系统状态, 备份/恢复, API配置',
    'role.desc.secadmin': 'DDoS防护, 视频流清洗, 文件清洗',
    'role.desc.logadmin': '日志审计, 报表与统计分析',
    
    // Sidebar
    'menu.dashboard': '概览',
    'menu.system_config': '系统设置',
    'menu.api_settings': 'API 设置',
    'menu.user_management': '用户管理',
    'menu.security_policies': '安全策略',
    'menu.threat_protection': '威胁与DDoS',
    'menu.video_cleaning': '视频清洗',
    'menu.file_cleaning': '文件清洗',
    'menu.logs_audit': '日志审计',
    'menu.reports': '报表分析',
    'menu.signout': '退出登录',

    // Dashboard
    'dash.system_dashboard': '系统概览',
    'dash.cpu': 'CPU 使用率',
    'dash.memory': '内存使用率',
    'dash.disk': '磁盘状态',
    'dash.uptime': '运行时间',
    'dash.healthy': '系统正常',
    'dash.service_status': '服务状态',
    'dash.service_name': '服务名称',
    'dash.status': '状态',
    'dash.load': '负载',
    'dash.last_check': '最后检查',
    'dash.running': '运行中',
    'dash.degraded': '降级',
    'dash.task_video': '活跃视频任务',
    'dash.task_file': '文件清洗任务',
    'dash.threat_stats': '威胁防御统计 (24h)',
    'dash.ddos_attacks': 'DDoS 攻击',
    'dash.intrusions': '入侵拦截',

    // System Config
    'config.title': '系统配置',
    'config.subtitle': '管理设备设置、维护和数据策略。',
    'config.save': '保存更改',
    'config.saving': '保存中...',
    'config.tab.network': '网络',
    'config.tab.logs': '日志策略',
    'config.tab.backup': '备份与恢复',
    'config.network.interfaces': '网络接口',
    'config.hostname': '主机名',
    'config.mgmt_ip': '管理 IP',
    'config.dns': 'DNS 服务器',
    'config.gateway': '网关',
    'config.time': '时间与 NTP',
    'config.logs.title': '日志清理与保留策略',
    'config.logs.retention': '保留期限 (天)',
    'config.logs.desc': '超过 {days} 天的日志将被自动删除或归档。',
    'config.logs.archive': '删除前自动归档',
    'config.logs.archive_desc': '删除前压缩并移动旧日志到冷存储。',
    'config.logs.manual': '立即清理日志',
    'config.backup.title': '系统备份与恢复',
    'config.backup.create': '创建备份',
    'config.backup.create_desc': '下载系统配置的完整快照。',
    'config.backup.download': '下载系统快照',
    'config.backup.restore': '恢复系统',
    'config.backup.restore_desc': '上传之前保存的快照以恢复系统状态。',
    'config.backup.upload': '点击上传备份文件',
    'config.backup.recent': '最近备份',

    // Security Policies
    'policy.title': '安全策略',
    'policy.subtitle': '管理防火墙规则和流量控制列表。',
    'policy.add': '添加新规则',
    'policy.search': '搜索策略...',
    'policy.filter': '筛选',
    'policy.col.status': '状态',
    'policy.col.id': 'ID',
    'policy.col.name': '名称',
    'policy.col.source': '源',
    'policy.col.dest': '目的',
    'policy.col.service': '服务',
    'policy.col.action': '动作',
    'policy.allow': '允许',
    'policy.deny': '拒绝',
    'policy.delete_confirm': '确定要删除此策略规则吗？',
    'policy.empty': '未找到匹配的策略。',

    // Log Audit
    'log.title': '系统日志与审计',
    'log.subtitle': '监控系统事件、安全警报和用户活动。',
    'log.export': '导出 CSV',
    'log.search': '搜索消息、模块、IP...',
    'log.col.time': '时间',
    'log.col.severity': '级别',
    'log.col.module': '模块',
    'log.col.message': '消息',
    'log.col.source': '源',
    'log.empty': '未找到日志。',

    // Threat Protection
    'threat.title': '威胁防护',
    'threat.subtitle': '配置 DDoS 缓解和入侵防御系统。',
    'threat.active': '已激活',
    'threat.disabled': '已禁用',
    'threat.monitor': '实时攻击监控',
    'threat.pps': '当前 PPS',
    'threat.dropped': '丢弃数据包',
    'threat.sources': '攻击源',
    'threat.mitigating': '清洗中',
    'threat.syn_title': 'SYN Flood 防护',
    'threat.syn_desc': '限制 SYN 数据包速率以防止连接耗尽。',
    'threat.threshold': '阈值 (pps)',
    'threat.action': '动作',
    'threat.udp_title': 'UDP Flood 防护',
    'threat.udp_desc': '缓解针对随机端口的体积型 UDP 攻击。',
    'threat.whitelist': '受信任 IP 白名单',
    'threat.add_ip': '+ 添加 IP 范围',

    // Video Stream
    'video.title': '视频流清洗',
    'video.subtitle': '安全低延迟视频传输和净化。',
    'video.restart': '重启引擎',
    'video.tab.access': '接入配置',
    'video.tab.forward': '转发配置',
    'video.tab.strategy': '清洗策略',
    'video.ingress': '接入配置',
    'video.ingress_desc': '配置允许的传入视频流和协议。',
    'video.protocol': '输入协议',
    'video.port': '监听端口',
    'video.allowed_ips': '允许源 IP (CIDR)',
    'video.save_ingress': '保存接入规则',
    'video.forward': '转发配置',
    'video.forward_desc': '定义清洗后流的发送位置。',
    'video.strategy': '清洗策略',
    'video.strategy_desc': '深度包检测和载荷净化规则。',
    'video.check.protocol': '协议合规性检查',
    'video.check.steganography': '隐写术检测',
    'video.check.framerate': '帧率限制',

    // File Cleaning
    'file.title': '文件清洗与净化',
    'file.subtitle': '上传文件进行深度内容解除武装和重建 (CDR)。',
    'file.drop': '拖放文件到此处',
    'file.browse': '或点击从电脑浏览',
    'file.formats': '支持格式: PDF, DOCX, ZIP, EXE (最大 500MB)',
    'file.recent': '最近清洗任务',
    'file.search': '搜索任务...',
    'file.col.task': '任务 ID',
    'file.col.filename': '文件名',
    'file.col.size': '大小',
    'file.col.status': '状态',
    'file.col.submitted': '提交时间',
    'file.status.clean': '安全',
    'file.status.malicious': '恶意',
    'file.status.scanning': '扫描中...',
    'file.download': '下载',
    'file.view_report': '查看报告',

    // API Settings
    'api.title': 'API 接口设置',
    'api.subtitle': '管理外部访问点和 API 密钥。',
    'api.rest_title': 'REST API 配置',
    'api.master_key': '主 API 密钥',
    'api.master_key_desc': '用于系统管理员级别的集成。请保密。',
    'api.rate_limit': '速率限制 (Req/min)',
    'api.timeout': '会话超时 (sec)',
    
    // Reports
    'report.title': '报表与分析',
    'report.subtitle': '生成合规性报告和流量分析。',
    'report.export': '导出摘要',
    'report.audit': '月度安全审计',
    'report.audit_desc': '拦截威胁、策略变更和系统事件的综合概览。',
    'report.traffic': '流量分析',
    'report.traffic_desc': '带宽使用、主要通话者和协议分布图表。',
    'report.compliance': '合规性报告',
    'report.compliance_desc': 'ISO 27001 / GDPR 合规性检查状态和违规记录。',
    'report.generate': '生成报表 →',
    'report.history': '生成历史',
    'report.col.name': '报表名称',
    'report.col.date': '日期范围',
    'report.col.by': '生成者',
    'report.col.on': '生成时间',
    
    // Common
    'common.change_password': '修改密码',
    'common.update_password': '更新密码',
    'common.cancel': '取消',
    'common.current_password': '当前密码',
    'common.new_password': '新密码',
    'common.confirm_password': '确认新密码',
    'common.success': '成功',
    'common.password_changed': '密码修改成功！',
    'common.access_denied': '访问被拒绝',
    'common.no_permission': '您的角色没有权限查看此资源。',
    'common.coming_soon': '此模块正在开发中。',
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('zh'); // Default to Chinese as requested by context

  const t = (key: string, params?: Record<string, string | number>) => {
    let text = translations[language][key as keyof typeof translations['en']] || key;
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, String(v));
      });
    }
    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
