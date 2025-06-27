# Excel Data Batch Upload Processing Component / Data Recognition Component

## [中文文档](./README_CN.md)

# @ticatec/batch-data-uploader

A universal Svelte component for batch data uploading, supporting Excel file parsing, local preprocessing, field mapping validation, multilingual prompts, import validation, and error messaging.

---

## ✨ Features

- 📂 Supports drag-and-drop and file selection for uploading `.xlsx` files
- 🧠 Local parsing of Excel data without server preprocessing
- 🧩 Supports field mapping and custom parsers
- 📝 Data preview and validation with highlighted error prompts
- 🌐 Multilingual support (built-in Chinese and English)
- 🔌 Compatible with the UI element style of `@ticatec/uniface-element`

---

## 📦 Installation

```bash
npm install @ticatec/batch-data-uploader xlsx
```

---

## 📁 Project Structure

The main components and classes are as follows:

| File                       | Description                                            |
| -------------------------- | ----------------------------------------------------- |
| `FileUploadWizard.svelte`  | Main upload dialog, uses `BaseUploadTemplate` to upload and validate data |
| `EncodingWizard.svelte`   | Field mapping dialog, uses `BaseEncodingTemplate` to map Excel fields |
| `BaseTemplate.ts`         | Abstract base class encapsulating Excel parsing and column definition logic |
| `BaseUploadTemplate.ts`   | Upload template base class for validation, preprocessing, and data uploading |
| `BaseEncodingTemplate.ts` | Encoding template base class for dynamic field mapping and transformation |
| `utils.ts`                | Utility functions, such as `setNestedValue` and `getNestedValue` |
| `i18n_resources`          | Multilingual resource definitions, supporting Chinese and English switching |

---

## 🚀 Usage

### Batch Data Upload

[Implementing Batch Data Upload](./documents/FileUploadWizard.md)

### Data Parsing and Validation

[Implementing Data Parsing and Validation](./documents/EncodingWizard.md)

## 🌐 Multilingual Support

By leveraging `@ticatec/i18n` and `i18n_resources`, automatic switching between Chinese and English is supported. You can customize internationalization by extending `i18nKeys` and resource files.

English resource file, loadable via i18n tools:

```json
{
    "batchUploading": {
        "status": {
            "pending": "To upload",
            "uploading": "Uploading...",
            "successful": "Success",
            "fail": "Failure"
        },
        "parsing": "Parsing file...",
        "parseFailure": "Cannot parse file: {{name}}",
        "waitUploading": "Cannot exit during uploading!",
        "button": {
            "upload": "Upload",
            "save": "Save error data",
            "open": "Open",
            "confirm": "Confirm"
        },
        "errorTitle": "Error",
        "sheetName": "Abnormal data",
        "labelStatus": "Status",
        "labelValid": "Validity",
        "textValid": "Yes",
        "textInvalid": "No"
    }
}
```

---

## 🧪 Examples

Refer to the `src/routes/+page.svelte` example page for a complete usage flow and template definitions.

---

## 🪪 License

MIT License © Ticatec

---

## Author

Henry Feng  
huili.f@gmail.com