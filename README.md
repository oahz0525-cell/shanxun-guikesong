# 山熏 · 腊肉生产溯源与车间管理

> **贵客送黑客松（Guikesong）** · Topic: `Guikesong`

## 评审速览（30 秒）

- **问题**：腊肉来源难追溯，消费者缺乏信任；厂内批次、温湿度数据分散  
- **方案**：厂内管理端 + 消费者溯源 H5，同一批次数据内外双视角  
- **Demo**：下方链接直接访问，厂内 `1234` / 消费者 `demo`  
- **代码**：`js/domain/` 业务模块 + `data/demo/` 统一数据源，详见 [docs/HACKATHON.md](docs/HACKATHON.md)

## 在线演示

| 入口 | 链接 | 说明 |
|------|------|------|
| 厂内管理端 | [admin.html](https://YOUR_VERCEL_URL.vercel.app/admin.html) | 密码 `1234`（厂内） |
| 消费者溯源 | [溯源 H5](https://YOUR_VERCEL_URL.vercel.app/trace.html?t=SXQZ260703) | 密码 `demo` |

> 部署后请将 `YOUR_VERCEL_URL` 替换为 Vercel 分配的域名。

## 项目简介

「山熏」是一套面向中小型腊肉加工厂的**生产管理与消费者溯源**演示系统，覆盖：

- 批次全生命周期（采购 → 腌制 → 晾挂 → 熏制 → 检验 → 封箱 → 出库）
- 车间 3D 可视化与温湿度设备监测
- 消费者扫码溯源 H5（工艺故事、师傅签名、环节动画）
- 二维码生成与批次台账

本仓库为**开源演示版**，供应商名称、发票号等已脱敏，仅供评审与二次学习。

## 技术栈

| 层级 | 选型 | 说明 |
|------|------|------|
| 前端 | 原生 HTML / CSS / JavaScript | 无框架，轻量 H5，适配微信扫码 |
| 3D 车间 | Three.js | 等轴厂房与设备状态可视化 |
| 图表 | Canvas 自绘 | 温湿度趋势、批次统计 |
| 后端 | Node.js `http`（公开版仅静态托管） | 完整版含 REST API；公开版已剥离 |
| 部署 | Vercel (`@vercel/node`) | Serverless 静态演示 |
| 数据 | JSON 文件 + localStorage | 演示数据；生产可接数据库 |
| 溯源 | TraceAPI（浏览器端） | 公开版仅本地模拟，无远程写入 |
| 图像处理 | Python + rembg（离线脚本，未纳入公开仓库） | 师傅肖像抠图（开发环境） |

## 目录结构（开源部分）

```
├── admin.html          # 厂内端入口
├── 山熏_demo.html      # 厂内管理主界面
├── trace.html          # 消费者溯源 H5
├── js/
│   ├── core/           # 配置 + SX_API 数据层
│   ├── domain/         # 批次、溯源、常量（业务模块）
│   └── app/boot.js     # 启动入口
├── api/trace.js        # 溯源客户端
├── data/demo/
│   ├── batches.json
│   ├── trace-records.json
│   └── readings.json
└── docs/HACKATHON.md   # 评审指南
```

## 本地运行

```bash
npm install
npm start
# → http://localhost:8788/山熏_demo.html
```

## 部署（Vercel）

1. Fork / 使用本公开仓库
2. [vercel.com](https://vercel.com) → Import Project → 选择本仓库
3. Framework Preset: **Other**，Build Command 留空，Output 留空
4. Deploy → 获得 `*.vercel.app` 域名

## 开源说明

- 本仓库为商业项目的**演示子集**，不含内部脚本、原始肖像原图、CAD 图纸与真实供应商数据。

**公开版额外移除：**

- 服务端 REST API 实现（`api/routes.js`）
- 溯源写入 / 远程 API 连接（`useRemote`、`apiBase`、`/api/trace/generate`）
- 生产环境切换说明与内部架构文档

在线 Demo 以 **纯前端 + 静态 JSON + localStorage** 运行，功能与评审演示一致。

完整开发版在私有仓库维护；公开版通过 `npm run build:public` 自动脱敏生成。

## License

MIT — 演示与学习用途。商业使用请联系项目团队。

---

**#Guikesong** · 山熏团队 · 2026
