
# Excel Encoding Wizard 组件

一个基于 Svelte 的对话框组件，用于解析 Excel 文件、通过服务器端接口验证/补全数据，并显示验证结果，结合 `BaseEncodingTemplate` 实现数据处理功能。

## 概述

该组件提供了一个交互式的对话框界面，允许用户选择 Excel 文件、解析文件内容、通过服务器端接口验证和补全数据、显示数据表格，并在数据有效时提供确认操作。组件支持国际化、动态按钮操作，适用于需要验证和补全 Excel 数据的场景。

## 使用方法

将组件嵌入 Svelte 应用，并传递必要的属性。以下是一个示例：

1. 实现数据模版，定义和excel文件匹配的字段。[BaseEncodingTemplate](./BaseEncodingTemplate_cn.md)
2. 打开对话框，加载本地的excel文件，将触发解析和调用服务api验证数据，验证通过后，显示确认按钮。点击确认按钮会通过回传函数返回数据集。

```typescript
<script lang="ts">
    import EncodingDialog from '@ticatec/batch-data-uploader/EncodingDialog.svelte';
    import type { DataColumn } from '@ticatec/batch-data-uploader/DataColumn';
    import MyEncodingTemplate from './MyEncodingTemplate'; // 继承自 BaseEncodingTemplate

    const template = new MyEncodingTemplate();

    function handleClose() {
        console.log('Dialog closed');
    }

    function handleConfirm(data: any[]) {
        console.log('Confirmed data:', data);
    }
</script>

<ExcelEncodingDialog
    title="验证 Excel 数据"
    width="800px"
    height="600px"
    {template}
    closeHandler={handleClose}
    confirmCallback={handleConfirm}
/>
```

## 组件详情

### 属性

- **title**: `string`
    - 对话框标题。
- **width**: `string` (默认: `"800px"`)
    - 对话框宽度。
- **height**: `string` (默认: `"600px"`)
    - 对话框高度。
- **template**: `BaseEncodingTemplate`
    - `BaseEncodingTemplate` 实例，用于解析 Excel 文件、验证和补全数据。
- **confirmCallback**: `any`
    - 确认按钮点击时调用的回调函数，接收解析后的数据列表（`template.list`）。

### 按钮操作

- **btnChoose**: 选择文件按钮，触发文件输入框以选择 Excel 文件。
- **btnConfirm**: 确认按钮，仅在数据有效（`template.valid` 为 `true`）时显示，调用 `confirmCallback` 并关闭对话框。

### 事件处理

- **文件选择**：通过隐藏的 `<input type="file">` 元素触发 `parseExcelFile`，解析选中的 Excel 文件并调用 `template.parseExcelFile` 进行验证/补全。
- **数据验证**：解析完成后检查 `template.valid`，如果数据有效，则添加“确认”按钮。
- **错误提示**：解析失败时通过 `window.Toast` 显示错误信息，并隐藏加载指示器。

## 类型

- **DataColumn**: 自定义接口，定义列元数据（继承自 `@ticatec/uniface-element/DataTable` 的 `TableColumn`）。
- **ButtonAction** / **ButtonActions**: 来自 `@ticatec/uniface-element/ActionBar`，定义按钮操作。
- **IndicatorColumn**: 来自 `@ticatec/uniface-element/DataTable`，定义行号列。

## 依赖组件

- **Dialog**: 来自 `@ticatec/uniface-element/Dialog`，提供对话框容器。
- **DataTable**: 来自 `@ticatec/uniface-element/DataTable`，显示数据表格。
- **Box**: 来自 `@ticatec/uniface-element/Box`，提供带边框的容器样式。
- **getI18nText**: 来自 `@ticatec/i18n`，用于国际化文本。

## 注意事项

- 确保 `BaseEncodingTemplate` 已正确实现 `isDataValid`、`encodeData` 方法和 `valid` 属性，以支持数据验证和补全。
- 文件输入框仅接受 `.xls` 和 `.xlsx` 格式的文件。
- 解析过程中会显示加载指示器（`window.Indicator`），失败时通过 `window.Toast` 显示错误提示。
- 确认按钮仅在 `template.valid` 为 `true` 时显示，确保只有有效数据可以提交。
- 依赖 `window.Indicator` 和 `window.Toast` 进行 UI 提示，需确保这些全局对象已定义。
- `confirmCallback` 接收解析后的完整数据列表，适合用于后续处理或提交。
