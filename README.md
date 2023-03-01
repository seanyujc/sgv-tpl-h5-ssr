环境需求：node 12

## 开始
```
npm i
npm run dev
```

## 按需自动导入组件

### 符合以下规范的组件可以按需自动导入：  
新建组件名以“My”开头，统一通过文件“components/index.ts”导出。使用时以“My”名字开头（注意大小写）。例如：

统一导出

```ts
// components/index.ts
import { MyTop } from "./top";

export { MyTop };
```

使用

```html
<MyTop></MyTop>
```

## 辅助开发工具

### Install
```bash
npm i sgv-cli@2.0.0-beta -g
```
### New page
```bash
sgv build -p <page name>
```

### New Component
```bash
sgv build -c <component name>
```
