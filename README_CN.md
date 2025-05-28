# Excel 数据批量上传处理组件

[[English Document](./README.md)]

本组件用于从 Excel 文件批量导入数据并上传处理。支持上传状态管理、错误行导出、多语言适配、数据预处理等功能。通过定义模板类和统一的 UI 弹窗组件，快速适配不同类型的 Excel 数据上传需求。

## 功能特性

* 解析 `.xls` / `.xlsx` 文件
* 自定义列映射与格式化
* 批量上传，支持设置上传批次大小
* 可扩展数据预处理逻辑（如合并、分组）
* 支持上传状态展示：待处理、上传中、成功、失败
* 错误行导出为 Excel 文件
* 多语言支持（基于 `@ticatec/i18n`）

---

## 使用方式

### 安装

```shell
npm i @ticatec/batch-data-uploader
```

### 1. 定义模板类

继承自 `BaseTemplate`，传入字段定义、上传逻辑，并可选地重载 `consolidateData` 处理数据。

```ts
import BaseTemplate from '$lib/BaseTemplate';
import type DataColumn from './DataColumn';

class MyDataTemplate extends BaseTemplate {
  constructor(uploadFun: UploadFun) {
    const columns: DataColumn[] = [
      { text: 'Name', field: 'name', pos: 0 },
      { text: 'Email', field: 'email', pos: 1 },
      { text: 'Age', field: 'age', pos: 2, parser: val => parseInt(val) },
    ];
    super(columns, uploadFun, 50);
  }

  // 可选：重写以实现合并/归组等逻辑
  protected consolidateData(rows: Array<any>) {
    return super.consolidateData(rows);
  }
}
```

### 2. 引入并使用上传对话框组件

```svelte
<script lang="ts">
  import UploadDialog from './UploadDialog.svelte';
  import {MyDataTemplate} from './MyDataTemplate';

  let showDialog = false;

  function doUpload(rows: any[]): Promise<void> {
    let list = rows.map(row=>row.data);
    return fetch('/api/upload', {
      method: 'POST',
      body: JSON.stringify(dataChunk),
    }).then(res => {
      if (!res.ok) throw new Error('Upload failed');
      //上传完毕需要结果写入到row.error里面
    });
  }

  const template = new MyDataTemplate(doUpload);
  
  const showUploadDialog = () => {
    window.Dialog.showModal(UploadDialog, {title: '批量新增雇员', template, });
  }
  
</script>

<button on:click={() => {showUploadDialog}>导入数据</button>

```

---

## 参数说明

### `BaseTemplate` 构造参数

| 参数名         | 类型                              | 说明                 |
| ----------- | ------------------------------- | ------------------ |
| `columns`   | `DataColumn[]`                  | 定义 Excel 中字段的位置与格式 |
| `uploadFun` | `(arr: any[]) => Promise<void>` | 上传函数，分批调用          |
| `batchSize` | `number`（默认 50）                 | 每批上传的数据量           |
| `rowOffset` | `number`（默认 1）                  | 数据起始行偏移量（跳过标题等）    |

### `DataColumn` 字段定义

```ts
interface DataColumn {
  text: string;             // 表头展示文本
  field: string;            // 数据字段路径（支持嵌套）
  pos: number;              // 所在 Excel 列索引，从 0 开始
  parser?: (val: any) => any; // 可解析函数，用于解析单元格的数据
}
```

---

## 上传流程说明

1. 用户选择 Excel 文件
2. 调用 `BaseTemplate.parseExcelFile(file)` 解析数据
3. 展示预览数据表格，状态为 `Pending`
4. 用户点击上传，系统按批次调用 `uploadFun`
5. 成功项标记为成功，失败项保留 `error` 信息
6. 可导出失败行为 Excel

---

## 错误数据导出

使用 `BaseTemplate.exportErrorRowsToExcel(filename: string)` 将失败的数据导出为 Excel 文件，包含原始列与错误信息列。

---

## 自定义扩展

* **自定义列显示内容**：可自定义每列字段及格式化函数
* **自定义状态字段**：状态由内置 `status` 列展示，可根据实际业务调整
* **数据清洗与校验**：在 `consolidateData()` 方法中实现
* **多语言文本**：使用 `@ticatec/i18n` 提供的 `getI18nText` 获取

---

## 依赖项

* [`xlsx`](https://www.npmjs.com/package/xlsx)
* [`@ticatec/uniface-element`](https://www.npmjs.com/package/@ticatec/uniface-element)
* [`@ticatec/i18n`](https://www.npmjs.com/package/@ticatec/i18n)

---

## License

MIT License.

---

## Author

Henry Feng  
huili.f@gmail.com