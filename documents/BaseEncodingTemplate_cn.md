# BaseEncodingTemplate 类

一个用于解析 Excel 文件并进行数据编码和验证的抽象基类，继承自 `BaseTemplate`，支持数据有效性检查和列扩展。

## [BaseTemplate](./BaseTemplate_cn.md)

## 概述

`BaseEncodingTemplate` 类扩展了 `BaseTemplate`，增加了数据有效性验证和编码功能。它支持解析 Excel 文件、验证每行数据的合法性，并通过子类实现自定义的数据编码逻辑。类中添加了一个用于显示数据有效性的列（显示“有效”或“无效”状态）。

## 使用方法

要使用 `BaseEncodingTemplate`，需继承该类并实现 `isRowValid`、`encodeData` 方法以及 `valid` 属性。以下是一个示例：

```typescript
import BaseEncodingTemplate from './BaseEncodingTemplate';
import type { DataColumn } from './DataColumn';

const columns: DataColumn[] = [
    {
        field: 'user.name',
        text: '姓名',
        width: 150,
        parser: (value) => String(value).trim()
    },
    {
        field: 'user.age',
        text: '年龄',
        width: 100,
        parser: (value) => Number(value) || 0
    }
];

class MyEncodingTemplate extends BaseEncodingTemplate {
    constructor() {
        super(columns, rowOffset);
    }

    protected isRowValid(row: any): boolean {
        return row.id != null;
    }

    protected async encodeData(rows: Array<any>): Promise<Array<any>> {
        // 实现数据编码逻辑，例如调用 API，然后将返回的数据取代本地数据或者和本地数据融合
        return rows.map(item => ({ ...item, encoded: true }));
    }

    get valid(): boolean {
        // 检查整个数据集是否有效
        return this._list.filter(iem=>item.id==null).length > 0;
    }
}
```

### 解析 Excel 文件

```typescript
const file: File = // ... 获取文件（例如，从输入元素获取）
const template = new MyEncodingTemplate();
await template.parseExcelFile(file); // 解析并编码数据
console.log(template.list); // 访问处理后的数据
console.log(template.valid); // 检查数据有效性
```

## 类详情

### 构造函数

```typescript
protected constructor(columns: Array<DataColumn>, rowOffset: number = 1)
```

- **参数**：
    - `columns`：定义数据结构（字段名、显示文本和可选解析器）的 `DataColumn` 对象数组。
    - `rowOffset`：Excel 表中要跳过的起始行数（默认：1，例如跳过标题行）。
- **描述**：初始化模板，设置列定义和行偏移。

### 方法

#### `isRowValid` (抽象方法)

```typescript
protected abstract isRowValid(row: any): boolean
```

- **参数**：
    - `row`：单行数据对象。
- **描述**：子类必须实现此方法以验证单行数据的合法性，返回 `true` 表示有效，`false` 表示无效。
- **重写**：子类需实现具体验证逻辑。

#### `encodeData` (抽象方法)

```typescript
protected abstract encodeData(rows: Array<any>): Promise<Array<any>>
```

- **参数**：
    - `rows`：要编码的数据数组。
- **描述**：子类必须实现此方法以定义数据编码逻辑（例如，调用服务器 API 进行数据处理）。返回编码后的数据数组。
- **重写**：子类需实现具体编码逻辑。

#### `valid` (抽象获取器)

```typescript
abstract get valid(): boolean
```

- **返回**：布尔值，表示整个数据集是否有效。
- **描述**：子类必须实现此获取器以检查所有数据的有效性。
- **重写**：子类需实现具体逻辑。

#### `consolidateData`

```typescript
protected async consolidateData(rows: Array<any>): Promise<Array<any>>
```

- **参数**：
    - `rows`：从 Excel 文件解析出的原始行对象数组。
- **描述**：重写 `BaseTemplate` 的方法，调用 `encodeData` 对数据进行编码，并将编码结果合并到原始行中。
- **逻辑**：遍历每行数据，将编码结果与原始数据合并。

#### `columns`（获取器）

```typescript
get columns(): Array<TableColumn>
```

- **返回**：`TableColumn` 对象的数组，表示列定义，包含数据列和匹配状态列。
- **描述**：扩展 `BaseTemplate` 的 `columns`，添加一个匹配状态列（`validColumn`），用于显示每行数据的有效性（“有效”或“无效”）。

### 匹配状态列

定义了一个额外的 `validColumn` 用于显示每行数据的有效性：

```typescript
private validColumn: TableColumn = {
    text: getI18nText(i18nKeys.labelMatch),
    width: 90,
    align: 'center',
    escapeHTML: true,
    formatter: row => this.isRowValid(row) ? ValidData : InvalidData
}
```

- **显示**：
    - `ValidData`：`<span style="color: #76FF03">有效</span>`（绿色文本）。
    - `InvalidData`：`<span style="color: #ff3e00">无效</span>`（红色文本）。
- **国际化**：使用 `getI18nText` 获取列标题和状态文本。

## 注意事项

- 该类为抽象类，必须继承并实现 `isDataValid`、`encodeData` 方法和 `valid` 属性。
- `rowOffset` 可用于跳过 Excel 文件中的标题行。
- 匹配状态列通过绿色（有效）和红色（无效）文本直观显示数据验证结果。
- 数据编码通常涉及与服务器交互，子类需确保 `encodeData` 方法处理异步操作。
