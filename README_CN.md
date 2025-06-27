# Excel 数据批量上传处理组件 / 数据识别组件

[[English Document](./README.md)]

# @ticatec/batch-data-uploader

一个通用的批量上传数据的 Svelte 组件，支持 Excel 文件解析、本地预处理、字段匹配验证、多语言提示、导入校验与错误提示。

---

## ✨ 功能特色

- 📂 支持拖拽上传和选择上传 `.xlsx` 文件
- 🧠 本地解析 Excel 数据，无需服务器预处理
- 🧩 支持字段映射与自定义解析器
- 📝 预览与校验数据，错误项高亮提示
- 🌐 多语言支持（内建中英文）
- 🔌 适配 `@ticatec/uniface-element` 的 UI 元素风格

---

## 📦 安装

```bash
npm install @ticatec/batch-data-uploader xlsx
````

---

## 📁 项目结构

主要组件和类如下：

| 文件                       | 描述                                            |
| ------------------------ | --------------------------------------------- |
| `FileUploadWizard.svelte` | 主上传对话框，使用 `BaseUploadTemplate` 上传并验证数据        |
| `EncodingWizard.svelte`  | 字段映射对话框，使用 `BaseEncodingTemplate` 映射 Excel 字段 |
| `BaseTemplate.ts`        | 抽象基类，封装了 Excel 解析与列定义逻辑                       |
| `BaseUploadTemplate.ts`  | 上传模板基类，用于校验、预处理和上传数据                          |
| `BaseEncodingTemplate.ts` | 编码模板基类，用于动态字段映射与转换                            |
| `utils.ts`               | 工具函数，如 `setNestedValue` 与 `getNestedValue`    |
| `i18n_resources`         | 多语言资源定义，支持中英文切换                               |

---
## 🚀 使用方式

### 批量数据上传

[实现批量数据上传](./documents/FileUploadWizard_cn.md)

### 数据解析和校验

[实现数据解析和校验](./documents/EncodingWizard_cn.md)

## 🌐 多语言支持

通过依赖 `@ticatec/i18n` 和 `i18n_resources`，支持中英文自动切换。你可以通过扩展 `i18nKeys` 与资源文件进行国际化定制。

中文资源文件，可以通过i18的工具加载。

```json
{
    "batchUploading": {
        "status": {
            "pending": "待上传",
            "uploading": "正在上传...",
            "successful": "成功",
            "fail": "失败"
        },
        "parsing": "正在解析文件...",
        "parseFailure": "无法解析文件：{{name}}",
        "waitUploading": "上传中无法退出！",
        "button": {
            "upload": "上传",
            "save": "保存错误数据",
            "open": "打开",
            "confirm": "确定"
        },
        "errorTitle": "错误",
        "sheetName": "异常数据",
        "labelStatus": "状态",
        "labelValid": "有效性",
        "textValid": "是",
        "textInvalid": "否"
    }
}
```
---

## 🧪 示例

请查看 `src/routes/+page.svelte` 示例页，包含完整的使用流程和模板定义。

---

## 🪪 License

MIT License © Ticatec

---

## Author

Henry Feng  
huili.f@gmail.com