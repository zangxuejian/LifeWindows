# 人生窗口期 · Life Windows

React + TypeScript + Vite 前端应用。默认首页是 V3：拖动真实年龄，观察人生事件在「正盛 / 将谢 / 余温」三个区域中的变化。V2 时间地图与 V1 仍保留独立入口。

## 本地运行

```bash
npm install
npm run dev -- --host 127.0.0.1 --port 4175 --strictPort
```

打开 `http://127.0.0.1:4175/`。`--strictPort` 让端口被占用时明确报错，而不是自动切换。

只运行 `npm run dev` 时，使用 `vite.config.ts` 中的默认端口 4173。端口不决定版本；版本由 `src/App.tsx` 中的路由决定，根路径 `/` 指向 V3。

## 页面与功能

- `/`：V3 当前年龄与事件分组；可展开更多卡片、快捷切换或输入年龄。
- `/v3/explore`：73 个事件的完整内容库，支持关键词、8 个主题、当前/未来/已结束阶段筛选与分页。
- `/v3/window/:slug`：事件介绍、三项可勾选行动、阶段之后的选择、来源范围与相关事件。
- `/v3/about`：数据说明、来源目录、常见问题与本地记录管理。
- `/v2`：V2 时间地图；`/v2/explore`、`/v2/window/:slug` 为 V2 子页面。
- `/legacy`：V1 首页。旧链接 `/explore`、`/window/:slug` 继续指向 V2。

V3 用月份存储年龄，网址中的 `?age=33` 使用岁。探索页的 `q`、`category`、`stage` 和 `page` 也保存在网址里，方便刷新与分享。年龄更新仅替换当前历史记录，避免每次拖动都生成返回记录。

## 内容与状态模型

- `src/v3/data/windows.ts`：事件元数据、分类和起止年龄。
- `src/v3/data/windowContent.ts`：73 项独立内容、219 项行动建议、来源及适用范围。
- `src/v3/lib/windowLifecycle.ts`：阶段、分组、颜色与短暂余温期。
- `src/v3/lib/exploration.ts`：搜索、筛选与排序。
- `src/v3/context/AgeProvider.tsx`：真实年龄、网址同步与本地保存。

起止年龄及生命周期比例是编辑性导航模型，不是经过验证的个人机会预测。职业、关系与学习没有统一截止日期；健康、制度类内容不能替代专业评估或当前官方资格规则。每条外部资料注明支持范围，未接入直接依据的事件会如实标注。

行动清单只保存在当前浏览器；没有账户或云端同步。分享网址包含年龄，不包含行动清单。网址可能进入浏览历史和托管服务访问日志。

## 质量检查与生产构建

```bash
npm test
npm run lint
npm run build
```

构建结果输出到 `dist/`，页面按路由懒加载。可用以下命令本地检查生产构建：

```bash
npm exec vite preview -- --host 127.0.0.1 --port 4176 --strictPort
```

Vercel 项目使用 Vite，构建命令 `npm run build`，输出目录 `dist`。现有 `vercel.json` 包含 SPA 回退规则，支持直接打开或刷新详情页；当前应用无须配置 API 密钥或后端环境变量。
