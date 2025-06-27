
# BaseUploadTemplate 类

一个用于解析和批量上传 Excel 文件数据的抽象基类，继承自 `BaseTemplate`，支持状态管理和错误数据导出。

## [BaseTemplate](./BaseTemplate_cn.md)

## 概述

`BaseUploadTemplate` 类扩展了 `BaseTemplate`，增加了批量上传功能、进度状态更新以及错误数据导出功能。它支持通过自定义列定义解析 Excel 文件，并以批次方式上传数据，同时提供状态跟踪和错误处理功能。

## 使用方法

要使用 `BaseUploadTemplate`，需继承该类并实现 `uploadData` 方法以定义数据上传逻辑。以下是一个示例：

```typescript
import BaseUploadTemplate from './BaseUploadTemplate';
import type { DataColumn } from './DataColumn';

class MyUploadTemplate extends BaseUploadTemplate {
    constructor(columns: DataColumn[], batchSize: number = 50, rowOffset: number = 1) {
        super(columns, batchSize, rowOffset);
    }

    protected async uploadData(list: Array<any>): Promise<Array<any>> {
        // 实现数据上传逻辑，例如调用 API
        return list.map(item => ({ ...item, error: null }));
    }
}
```

### 解析和上传 Excel 文件

```typescript
const file: File = // ... 获取文件（例如，从输入元素获取）
const columns: DataColumn[] = [
    { field: 'name', text: '姓名', parser: (value) => String(value) },
    { field: 'age', text: '年龄', parser: (value) => Number(value) }
];
const template = new MyUploadTemplate(columns);
await template.parseExcelFile(file); // 解析文件
await template.upload(); // 上传数据
console.log(template.list); // 访问处理后的数据
```

### 导出错误数据

```typescript
template.exportErrorRowsToExcel('errors.xlsx'); // 导出包含错误的数据到 Excel 文件
```

## 类详情

### 构造函数

```typescript
protected constructor(columns: Array<DataColumn>, batchSize: number = 50, rowOffset: number = 1)
```

- **参数**：
    - `columns`：定义数据结构（字段名、显示文本和可选解析器）的 `DataColumn` 对象数组。
    - `batchSize`：每次上传的批次大小（默认：50）。
    - `rowOffset`：Excel 表中要跳过的起始行数（默认：1，例如跳过标题行）。
- **描述**：初始化模板，设置列定义、批次大小和行偏移。

### 方法

#### `setProgressStatusListener`

```typescript
setProgressStatusListener(value: UpdateProgressStatus)
```

- **参数**：
    - `value`：进度状态更新回调函数。
- **描述**：设置用于通知进度状态更新的监听器，通常用于 UI 更新。

#### `uploadData` (抽象方法)

```typescript
protected abstract uploadData(list: Array<any>): Promise<Array<any>>
```

- **参数**：
    - `list`：要上传的数据数组。
- **描述**：子类必须实现此方法以定义数据上传逻辑（例如，调用后端 API）。返回包含上传结果的数组，可能包含错误信息。
- **重写**：子类需实现此方法。

#### `upload`

```typescript
async upload()
```

- **描述**：按批次上传数据，更新每条记录的状态（`P` 表示待处理，`U` 表示上传中，`D` 表示完成），并在上传过程中调用进度状态监听器。
- **逻辑**：将数据分批处理，每批调用 `uploadData`，并根据结果更新记录的错误状态。

#### `wrapData`

```typescript
protected wrapData(data: any): any
```

- **参数**：
    - `data`：单个行对象。
- **描述**：将数据包装为包含 `data` 和 `status` 属性的对象，初始状态为 `P`（待处理）。
- **重写**：子类可重写此方法以自定义包装逻辑。

#### `columns`（获取器）

```typescript
get columns(): Array<TableColumn>
```

- **返回**：`TableColumn` 对象的数组，表示列定义，包含数据列和状态列。
- **描述**：扩展 `BaseTemplate` 的 `columns`，为每个字段添加 `data.` 前缀，并附加一个状态列（显示待处理、上传中、成功或错误信息）。

#### `exportErrorRowsToExcel`

```typescript
exportErrorRowsToExcel(filename: string)
```

- **参数**：
    - `filename`：导出的 Excel 文件名。
- **描述**：筛选包含错误的行，生成 Excel 文件，包含列标题、数据值和错误信息，并触发文件下载。
- **依赖**：使用 `xlsx` 库生成 Excel 文件。

## 类型

- **DataColumn**：自定义类型，定义列元数据（例如 `field`、`text`、`parser`、`visible`、`ignore`）。
- **TableColumn**：来自 `@ticatec/uniface-element/DataTable` 的类型，用于 UI 组件中的列定义。
- **UploadFun**：`(arr: Array<any>) => Promise<Array<any>>` 类型，表示上传函数。
- **UpdateProgressStatus**：`() => void` 类型，表示进度状态更新回调。

## 状态列

定义了一个额外的 `statusColumn` 用于显示每行数据的状态：

```typescript
const statusColumn: TableColumn = {
    text: getI18nText(i18nKeys.labelStatus),
    width: 240,
    resizable: true,
    formatter: row => {
        if (row.status == 'P') {
            return getI18nText(i18nKeys.status.pending)
        } else if (row.status == 'U') {
            return getI18nText(i18nKeys.status.uploading)
        } else {
            if (row.error) {
                return row.errorText
            } else {
                return getI18nText(i18nKeys.status.successful)
            }
        }
    }
}
```

- **状态值**：
    - `P`：待处理（Pending）
    - `U`：上传中（Uploading）
    - `D`：完成（Done，可能包含错误）
- **国际化**：使用 `getI18nText` 获取状态显示文本。


## 注意事项

- 该类为抽象类，必须继承并实现 `uploadData` 方法。
- 批量上传通过 `batchSize` 控制，避免一次性上传过多数据。
- 错误数据导出功能仅包含有错误的行，便于用户分析和修复。
