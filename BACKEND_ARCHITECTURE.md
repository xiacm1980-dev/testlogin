# Aegis CDR 后端架构设计

## 系统概述

后端服务负责处理视频/音频文件的CDR（Content Disarm & Reconstruction）清洗，支持实时流处理和API接口访问。

## 技术栈推荐

### 方案A：Node.js + FFmpeg（推荐用于快速原型）
**优点**：
- 与前端同语言
- npm生态丰富
- 适合API开发

**缺点**：
- 性能不如Go
- CPU密集型任务不如编译语言

### 方案B：Go + FFmpeg（推荐用于生产环境）
**优点**：
- 高性能
- 并发处理优秀
- 部署简单（单一二进制文件）

**缺点**：
- 学习曲线较陡

### 方案C：Python + FFmpeg
**优点**：
- FFmpeg绑定成熟
- 科学计算库丰富

**缺点**：
- 性能一般
- 部署复杂

## 系统架构图

```
┌─────────────────────────────────────────────────────┐
│              前端 (React - Vercel)                    │
│  https://your-app.vercel.app                         │
└─────────────────┬───────────────────────────────────┘
                  │ HTTP/REST API
┌─────────────────▼───────────────────────────────────┐
│           API Gateway / Load Balancer                │
│  - Nginx / Traefik / Caddy                           │
│  - SSL终止                                            │
│  - 速率限制                                           │
└─────────────────┬───────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────┐
│         应用服务器集群 (Node.js/Go/Python)            │
│  ┌──────────────────────────────────────────┐       │
│  │  RESTful API服务                          │       │
│  │  - /api/v1/clean/sync   (同步清洗)        │       │
│  │  - /api/v1/clean/async  (异步清洗)        │       │
│  │  - /api/v1/task/:id     (任务状态查询)     │       │
│  └──────────────────────────────────────────┘       │
│  ┌──────────────────────────────────────────┐       │
│  │  视频流处理服务                            │       │
│  │  - ONVIF监听服务                          │       │
│  │  - GB/T28181监听服务                      │       │
│  │  - 实时H264处理管道                        │       │
│  └──────────────────────────────────────────┘       │
└─────────────────┬───────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────┐
│              任务队列 (Redis/RabbitMQ)                │
│  - 异步任务队列                                       │
│  - 任务状态缓存                                       │
│  - 分布式锁                                           │
└─────────────────┬───────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────┐
│            工作节点集群 (Workers)                      │
│  ┌──────────────────────────────────────────┐       │
│  │  FFmpeg处理节点                            │       │
│  │  - H264解码 → YUV                         │       │
│  │  - 帧率压缩                                │       │
│  │  - 白噪声注入                              │       │
│  │  - H264重新编码                            │       │
│  └──────────────────────────────────────────┘       │
└─────────────────┬───────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────┐
│          对象存储 (MinIO/S3/阿里云OSS)                 │
│  - 原始文件存储                                       │
│  - 处理后文件存储                                     │
└─────────────────────────────────────────────────────┘
```

## RESTful API设计

### 1. 同步文件清洗
```http
POST /api/v1/clean/sync
Content-Type: multipart/form-data

file: <binary>

Response 200:
{
  "success": true,
  "taskId": "T-12345",
  "status": "CLEAN",
  "downloadUrl": "https://storage/cleaned/file.mp4",
  "processTime": 2.5
}
```

### 2. 异步文件清洗
```http
POST /api/v1/clean/async
Content-Type: multipart/form-data

file: <binary>

Response 202:
{
  "success": true,
  "taskId": "T-12345",
  "statusUrl": "/api/v1/task/T-12345"
}
```

### 3. 任务状态查询
```http
GET /api/v1/task/:taskId

Response 200:
{
  "taskId": "T-12345",
  "status": "PROCESSING", // UPLOADING | SCANNING | CLEAN | MALICIOUS | ERROR
  "progress": 65,
  "currentStep": "H264 encoding",
  "downloadUrl": null // 完成后提供
}
```

### 4. 视频流配置
```http
POST /api/v1/stream/config
Content-Type: application/json

{
  "protocol": "ONVIF", // or "GB28181"
  "inputPort": 5554,
  "outputPort": 5555,
  "streamUrl": "rtsp://camera-ip/stream"
}

Response 200:
{
  "success": true,
  "streamId": "STREAM-001",
  "outputUrl": "rtsp://server:5555/cleaned"
}
```

## 文件处理管道

### 视频文件处理流程
```bash
# 1. H264解码为YUV
ffmpeg -i input.mp4 -c:v rawvideo -pix_fmt yuv420p output.yuv

# 2. 帧率压缩（降低10%）
ffmpeg -i input.mp4 -r 27 temp.mp4

# 3. 添加白噪声（使用FFmpeg滤镜）
ffmpeg -i input.mp4 -vf "noise=alls=2:allf=t" output.mp4

# 4. 重新编码为H264
ffmpeg -i temp.yuv -c:v libx264 -preset medium output.mp4
```

### 音频文件处理流程
```bash
# 1. 解码为原始格式
ffmpeg -i input.mp3 -f s16le -acodec pcm_s16le output.raw

# 2. 添加白噪声
# (需要自定义音频处理脚本)

# 3. 重新编码为MP3
ffmpeg -f s16le -ar 44100 -ac 2 -i input.raw output.mp3
```

## 视频流处理

### ONVIF协议支持
```javascript
// Node.js示例
const onvif = require('node-onvif');

// 发现ONVIF设备
onvif.startProbe().then((devices) => {
  // 连接到设备
  const camera = new onvif.OnvifDevice({
    xaddr: devices[0].xaddrs[0]
  });

  // 获取RTSP流
  camera.getStreamUri().then((url) => {
    // 启动FFmpeg处理
    processStream(url);
  });
});

function processStream(inputUrl) {
  // FFmpeg实时处理
  spawn('ffmpeg', [
    '-i', inputUrl,
    '-vf', 'noise=alls=2:allf=t',
    '-c:v', 'libx264',
    '-f', 'rtsp',
    'rtsp://localhost:5555/cleaned'
  ]);
}
```

### GB/T28181-2016支持
需要使用专门的GB28181库：
- Node.js: `node-gb28181`
- Go: `gb28181-server`
- Python: `gb28181-python`

## 部署建议

### 最小配置（单机部署）
**适合**：测试环境、小规模使用

```yaml
服务器配置:
  CPU: 4核
  内存: 8GB
  硬盘: 100GB SSD
  网络: 100Mbps

软件环境:
  - Ubuntu 20.04 LTS
  - Docker & Docker Compose
  - FFmpeg 4.4+
```

### 生产配置（集群部署）
**适合**：正式生产、高并发

```yaml
负载均衡器: 2台
  - Nginx
  - 2核4GB

API服务器: 3-5台
  - Node.js/Go应用
  - 4核8GB

工作节点: 5-10台
  - FFmpeg处理
  - 8核16GB（或GPU加速）

Redis集群: 3台
  - 2核4GB

对象存储:
  - MinIO集群或云存储
```

## Docker部署示例

### docker-compose.yml
```yaml
version: '3.8'

services:
  nginx:
    image: nginx:latest
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf

  api:
    build: ./api-server
    replicas: 3
    environment:
      - REDIS_URL=redis://redis:6379
      - S3_ENDPOINT=minio:9000
    depends_on:
      - redis
      - minio

  worker:
    build: ./worker
    replicas: 5
    environment:
      - REDIS_URL=redis://redis:6379
    volumes:
      - /tmp/ffmpeg:/tmp

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  minio:
    image: minio/minio:latest
    environment:
      - MINIO_ROOT_USER=admin
      - MINIO_ROOT_PASSWORD=password123
    ports:
      - "9000:9000"
      - "9001:9001"
    command: server /data --console-address ":9001"
```

## 性能优化建议

### 1. GPU加速
使用NVIDIA GPU进行H264编解码：
```bash
ffmpeg -hwaccel cuda -i input.mp4 -c:v h264_nvenc output.mp4
```

### 2. 并发处理
- API服务器：使用worker线程池
- 文件处理：队列化任务，多worker并行
- 流处理：独立进程，避免阻塞主服务

### 3. 缓存策略
- Redis缓存任务状态
- CDN缓存已处理文件
- 内存缓存热点数据

### 4. 监控告警
推荐工具：
- Prometheus + Grafana（指标监控）
- ELK Stack（日志分析）
- Sentry（错误追踪）

## 安全考虑

1. **API认证**：使用JWT或API Key
2. **文件验证**：严格检查上传文件类型和大小
3. **资源限制**：限制单个用户的并发任务数
4. **网络隔离**：内部服务不暴露公网
5. **加密传输**：使用HTTPS/TLS

## 成本估算

### 阿里云示例（按月计费）
```
小规模（500并发）:
- ECS服务器: 3台 x ¥500 = ¥1,500
- Redis: ¥200
- OSS存储: ¥100/TB
- 带宽: ¥1,000
合计: ~¥3,000/月

中等规模（2000并发）:
- ECS服务器: 10台 x ¥800 = ¥8,000
- Redis集群: ¥800
- OSS存储: ¥500
- 带宽: ¥5,000
- 负载均衡: ¥300
合计: ~¥15,000/月
```

## 下一步行动

1. **选择技术栈**：Node.js / Go / Python
2. **创建后端项目**：初始化代码仓库
3. **实现核心API**：文件上传和处理
4. **部署测试环境**：Docker本地测试
5. **对接前端**：配置CORS和API地址
6. **性能测试**：压力测试和优化
7. **部署生产**：云服务器部署

## 参考资源

- FFmpeg文档: https://ffmpeg.org/documentation.html
- ONVIF协议: https://www.onvif.org/
- GB/T28181标准: http://www.ga.gov.cn/
- Docker部署: https://docs.docker.com/
