# BaseTemplate 类

一个用于解析 Excel 文件并处理具有可定制列定义数据的抽象基类。

## 概述

`BaseTemplate` 类为使用 `xlsx` 库处理 Excel 文件提供了一个基础。它支持将 Excel 数据解析为结构化格式，并通过子类化支持自定义列定义和数据转换。该类设计为可扩展以适应特定用例。
通常不需要直接从BaseTemplate继承，根据业务需要可以直接使用两个子类 `BaseEncodingTemplate` 或者 `BaseUploadTemplate`

## 使用方法

要使用 `BaseTemplate`，需继承该类并实现必要的自定义数据处理逻辑。以下是一个示例：

```typescript
import BaseTemplate from './BaseTemplate';
import type { DataColumn } from './DataColumn';

class MyTemplate extends BaseTemplate {
    constructor(columns: DataColumn[], rowOffset: number = 1) {
        super(columns, rowOffset);
    }

    // 可选地重写 consolidateData 以进行自定义数据处理
    protected async consolidateData(rows: Array<any>): Promise<Array<any>> {
        // 在此添加自定义逻辑
        return rows;
    }
}
```

### 解析 Excel 文件

要解析 Excel 文件，请使用 `File` 对象调用 `parseExcelFile` 方法：

```typescript
const file: File = // ... 获取文件（例如，从输入元素获取）
const columns: DataColumn[] = [
    { field: 'name', parser: (value) => String(value) },
    { field: 'age', parser: (value) => Number(value) }
];
const template = new MyTemplate(columns);
await template.parseExcelFile(file);
console.log(template.list); // 访问解析后的数据
```

## 类详情

### 构造函数

```typescript
protected constructor(columns: Array<DataColumn>, rowOffset: number = 1)
```

- **参数**：
    - `columns`：定义数据结构（字段名和可选解析器）的 `DataColumn` 对象数组。
    - `rowOffset`：Excel 表中要跳过的起始行数（默认值：1，例如跳过标题行）。
- **描述**：使用列定义和行偏移初始化模板。

### 方法

#### `parseExcelFile`

```typescript
async parseExcelFile(file: File): Promise<void>
```

- **参数**：
    - `file`：要解析的 Excel 文件。
- **描述**：读取并解析 Excel 文件，根据列定义处理每一行，并将结果在应用 `consolidateData` 后存储到内部 `_list` 中。
- **依赖**：使用 `xlsx` 读取 Excel 文件，使用 `utils` 进行嵌套值操作。

#### `consolidateData`

```typescript
protected async consolidateData(rows: Array<any>): Promise<Array<any>>
```

- **参数**：
    - `rows`：从 Excel 文件解析出的原始行对象数组。
- **描述**：子类可重写的钩子方法，用于执行额外的数据处理。默认返回未更改的行。
- **重写**：子类可重写此方法以实现自定义数据转换逻辑。

#### `extractData`

```typescript
protected extractData(arr: Array<any>): Array<any>
```

- **参数**：
    - `arr`：要处理的数据对象数组。
- **描述**：过滤并映射输入数据，仅包括可见且未忽略的列，返
  回处理后的新对象数组。
- **用途**：在内部用于准备上传或进一步处理的数据。

#### `wrapData`

```typescript
protected wrapData(data: any): any
```

- **参数**：
    - `data`：单个行对象。
- **描述**：用于包装或转换单个行数据的钩子方法。默认返回未更改的数据。
- **重写**：子类可重写此方法以将数据包装为特定结构。

#### `columns`（获取器）

```typescript
get columns(): Array<TableColumn>
```

- **返回**：`TableColumn` 对象的数组，表示列定义。
- **描述**：提供列定义的副本，供数据表或其他 UI 组件使用。

#### `list`（获取器）

```typescript
get list(): Array<any>
```

- **返回**：解析并处理后的数据列表的副本。
- **描述**：提供对处理后数据的外部访问。

## 类型 DataColumn接口

定义数据表列结构和行为的 TypeScript 接口，用于描述数据列的元数据，支持列显示、数据解析和格式化等功能。
`DataColumn` 接口定义了数据表中列的属性和行为，包括列标题、字段映射、格式化、对齐, 用于数据解析和上传控制的特定字段。适用于需要处理表格数据和 Excel 文件解析的场景。

### 使用方法

`DataColumn` 接口用于定义数据表的列结构，通常与 `BaseTemplate` 或其派生类（如 `BaseUploadTemplate`、`BaseEncodingTemplate`）结合使用。以下是一个示例：

```typescript
import type { DataColumn } from './DataColumn';

const columns: DataColumn[] = [
    {
        field: 'user.name',
        text: '姓名',
        width: 150,
        align: 'left',
        parser: (value) => String(value).trim(),
        visible: true,
        ignore: false
    },
    {
        field: 'user.age',
        text: '年龄',
        width: 100,
        align: 'center',
        parser: (value) => Number(value) || 0,
        visible: true,
        ignore: false,
        formatter: (row) => `${row['user.age']} 岁`
    }
];
```

### 属性

- **field**: `string`
  - 字段名，用于映射数据对象中的属性，支持点分隔的嵌套路径（如 `user.name`）。
- **text**: `string`
  - 列标题文字，显示在数据表头。
- **frozen?**: `boolean`
  - 是否冻结列（固定在表格左侧），仅在前面列的 `frozen` 为 `true` 时有效。
- **align?**: `'left' | 'center' | 'right'`
  - 单元格内容对齐方式，默认为未指定（由渲染器决定）。
- **width**: `number`
  - 列宽度（像素）。
- **minWidth?**: `number`
  - 列最小宽度（像素，可选）。
- **formatter?**: `FormatCell`
  - 单元格格式化函数，用于自定义单元格显示内容。
- **escapeHTML?**: `boolean`
  - 是否转义 HTML 字符，防止 XSS 攻击（默认：未指定）。
- **visible?**: `boolean`
  - 列是否可见，控制是否在表格中显示（默认：未指定）。
- **resizable?**: `boolean`
  - 列是否允许调整宽度（默认：未指定）。
- **ignore?**: `boolean`
  - 是否忽略该列，设置为 `true` 时，列仅用于前端显示，不参与数据上传（默认：`false`）。
- **parser?**: `ParserText`
  - 数据解析函数，定义为 `(text: string) => any`，用于将 Excel 单元格的原始值转换为目标格式（例如，将字符串转换为数字）。

#### 类型

- **ParserText**: `(text: string) => any`
  - 解析函数类型，接收字符串输入并返回任意类型的值，用于处理 Excel 文件中的单元格数据。
- **FormatCell**: 自定义类型（定义在 `./FormatCell`），用于格式化单元格显示内容。


#### 注意事项

- `field` 在 `DataColumn` 中为必填属性，用于确保数据映射的正确性。
- `parser` 函数是处理 Excel 数据时的关键，需根据字段类型（如字符串、数字、日期）定义合适的解析逻辑。
- `ignore` 属性适用于需要在前端显示但不参与上传的列（例如，辅助信息列）。
- 确保依赖的类型（`FormatCell`）已正确定义并导入。


#### 示例列定义

```typescript
const columns: DataColumn[] = [
    {
        field: 'user.name',
        parser: (value) => String(value).trim(),
        visible: true,
        ignore: false
    },
    {
        field: 'user.age',
        parser: (value) => Number(value) || 0,
        visible: true,
        ignore: false
    }
];
```

## 注意事项

- 该类为抽象类，必须继承后使用。
- 确保已安装并配置 `xlsx` 和 `@ticatec/uniface-element/DataTable`。
- `rowOffset` 可用于跳过 Excel 文件中的标题行。
- `DataColumn` 中的 `parser` 函数允许自定义单元格值的解析（例如，将字符串转换为数字）。
