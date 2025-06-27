
# FileUploadWizard 组件

一个基于 Svelte 的对话框组件，用于处理 Excel 文件的上传、解析和数据显示，结合 `BaseUploadTemplate` 实现文件解析和批量上传功能。

## 概述

该组件提供了一个交互式的对话框界面，允许用户选择 Excel 文件、解析文件内容、显示数据表格、执行上传操作，并支持导出包含错误的数据。组件支持国际化、动态按钮操作和上传进度管理，适用于需要批量处理 Excel 数据的场景。

## 使用方法

1. 实现数据模版，定义和excel文件匹配的字段。[BaseUploadTemplate](./BaseUploadTemplate_cn.md)
2. 打开对话框，加载本地的excel文件，将触发解析，显示上传按钮。点击上传按钮会开始上传过程。
3. 上传完毕，如果有错误将显示保存错误数据的按钮，点击按钮可以将错误数据下载到本地

```typescript
<script lang="ts">
    import ExcelUploadDialog from './ExcelUploadDialog.svelte';
    import type { DataColumn } from './DataColumn';
    import MyUploadTemplate from './MyUploadTemplate'; // 继承自 BaseUploadTemplate
    const template = new MyUploadTemplate();

    async function handleAfterUploaded() {
        console.log('Upload completed');
    }

    function handleClose() {
        console.log('Dialog closed');
    }
</script>

<ExcelUploadDialog
    title="上传 Excel 文件"
    width="800px"
    height="600px"
    {template}
    afterUploaded={handleAfterUploaded}
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
- **template**: `BaseUploadTemplate`
    - `BaseUploadTemplate` 实例，用于解析和上传 Excel 数据。
- **afterUploaded**: `() => Promise<void>`
    - 上传完成后的回调函数。

### 按钮操作

- **btnChoose**: 选择文件按钮，触发文件输入框。
- **btnUpload**: 上传按钮，调用 `template.upload()` 执行批量上传。
- **btnSave**: 保存错误按钮，调用 `template.exportErrorRowsToExcel()` 导出包含错误的数据。

### 事件处理

- **文件选择**：通过隐藏的 `<input type="file">` 元素触发 `parseExcelFile`，解析选中的 Excel 文件。
- **上传进度**：通过 `template.setProgressStatusListener` 监听上传进度，动态更新 `list`。
- **关闭确认**：通过 `confirmCloseDialog` 阻止在上传中 (`Uploading`) 关闭对话框。

### 组件逻辑

- **初始化**：在 `onMount` 中获取 `template.columns` 并设置进度状态监听器。
- **状态管理**：根据 `status` 动态更新按钮状态和可用性：
    - `Init`: 仅显示“选择文件”按钮。
    - `Pending`: 显示“上传”和“选择文件”按钮。
    - `Uploading`: 禁用所有按钮，鼠标指针变为加载状态。
    - `Done`: 如果存在错误数据，显示“保存错误”和“选择文件”按钮；否则仅显示“选择文件”按钮。
- **文件解析**：调用 `template.parseExcelFile` 解析 Excel 文件，显示加载指示器，处理成功或失败的提示。
- **数据表格**：使用 `DataTable` 组件显示解析后的数据，包含一个指示列（显示行号）。

## 类型

- **ProcessStatus**: `'Init' | 'Pending' | 'Uploading' | 'Done'`
    - 表示数据处理的状态。
- **DataColumn**: 自定义接口，定义列元数据（继承自 `@ticatec/uniface-element/DataTable` 的 `TableColumn`）。
- **ButtonAction** / **ButtonActions**: 来自 `@ticatec/uniface-element/ActionBar`，定义按钮操作。
- **IndicatorColumn**: 来自 `@ticatec/uniface-element/DataTable`，定义行号列。

## 注意事项

- 确保 `BaseUploadTemplate` 已正确实现 `uploadData` 方法，以处理实际的上传逻辑。
- 文件输入框仅接受 `.xls` 和 `.xlsx` 格式的文件。
- 上传过程中会显示加载指示器，失败时通过 `window.Toast` 显示错误提示。
- 关闭对话框时会检查是否处于 `Uploading` 状态，防止中断上传。
- 错误数据导出文件名格式为 `error-${filename}`，基于原始文件名。

