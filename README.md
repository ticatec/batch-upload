# Excel Batch Data Upload Component

[[中文文档](./README_CN.md)]

This component is designed to batch import data from Excel files and handle uploads. It supports upload status management, exporting error rows, multilingual adaptation, data preprocessing, and more. By defining template classes and using a unified UI dialog component, it enables quick adaptation for various types of Excel data upload needs.

## Features

* Parse `.xls` / `.xlsx` files
* Custom column mapping and formatting
* Batch upload with configurable batch size
* Extensible data preprocessing logic (e.g., merging, grouping)
* Upload status display: Pending, Uploading, Success, Failed
* Export error rows to Excel
* Multilingual support (based on `@ticatec/i18n`)

---

## Usage

### Installation

```bash
npm i @ticatec/batch-data-uploader
```

### 1. Define a Template Class

Extend `BaseTemplate`, provide field definitions and upload logic, and optionally override `consolidateData` to process data.

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

  // Optional: Override to implement merge/group logic
  protected consolidateData(rows: Array<any>) {
    return super.consolidateData(rows);
  }
}
```

### 2. Use the Upload Dialog Component

```svelte
<script lang="ts">
  import UploadDialog from './UploadDialog.svelte';
  import { MyDataTemplate } from './MyDataTemplate';

  let showDialog = false;

  function doUpload(rows: any[]): Promise<void> {
    const dataChunk = rows.map(row => row.data);
    return fetch('/api/upload', {
      method: 'POST',
      body: JSON.stringify(dataChunk),
    }).then(res => {
      if (!res.ok) throw new Error('Upload failed');
      // After upload, write result info to row.error if needed
    });
  }

  const template = new MyDataTemplate(doUpload);
  
  const showUploadDialog = () => {
    window.Dialog.showModal(UploadDialog, {
      title: 'Batch Add Employees',
      template,
    });
  }
</script>

<button on:click={() => showUploadDialog()}>Import Data</button>
```

---

## Parameter Reference

### `BaseTemplate` Constructor Parameters

| Name        | Type                            | Description                                  |
| ----------- | ------------------------------- | -------------------------------------------- |
| `columns`   | `DataColumn[]`                  | Defines column position and format           |
| `uploadFun` | `(arr: any[]) => Promise<void>` | Upload function, called in batches           |
| `batchSize` | `number` (default: 50)          | Number of rows per upload batch              |
| `rowOffset` | `number` (default: 1)           | Row offset for data start (e.g. skip header) |

### `DataColumn` Interface

```ts
interface DataColumn {
  text: string;                // Column display text
  field: string;               // Data field path (supports nesting)
  pos: number;                 // Excel column index (starting from 0)
  parser?: (val: any) => any;  // Optional parser function for cell values
}
```

---

## Upload Workflow

1. User selects an Excel file
2. Call `BaseTemplate.parseExcelFile(file)` to parse data
3. Display preview data table with `Pending` status
4. User clicks upload, system calls `uploadFun` in batches
5. Mark successful items, retain `error` info for failed items
6. Failed rows can be exported to Excel

---

## Exporting Error Data

Use `BaseTemplate.exportErrorRowsToExcel(filename: string)` to export rows with errors as an Excel file, including original columns and error messages.

---

## Customization Options

* **Custom Column Display**: Define column fields and formatting functions
* **Custom Status Field**: Built-in `status` column, can be customized per business needs
* **Data Cleaning & Validation**: Implement in `consolidateData()` method
* **Multilingual Text**: Use `getI18nText` from `@ticatec/i18n`

---

## Dependencies

* [`xlsx`](https://www.npmjs.com/package/xlsx)
* [`@ticatec/uniface-element`](https://www.npmjs.com/package/@ticatec/uniface-element)
* [`@ticatec/i18n`](https://www.npmjs.com/package/@ticatec/i18n)

---

## License

MIT License.

---

## Author

Henry Feng
[huili.f@gmail.com](mailto:huili.f@gmail.com)
