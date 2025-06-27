# BaseUploadTemplate Class

An abstract base class for parsing and batch uploading Excel file data, extending `BaseTemplate`, with support for status management and error data export.

## [BaseTemplate](./BaseTemplate.md)

## Overview

The `BaseUploadTemplate` class extends `BaseTemplate`, adding batch upload functionality, progress status updates, and error data export capabilities. It supports parsing Excel files with custom column definitions, uploading data in batches, and providing status tracking and error handling features.

## Usage

To use `BaseUploadTemplate`, you must extend the class and implement the `uploadData` method to define the data upload logic. Below is an example:

```typescript
import BaseUploadTemplate from './BaseUploadTemplate';
import type { DataColumn } from './DataColumn';

class MyUploadTemplate extends BaseUploadTemplate {
    constructor(columns: DataColumn[], batchSize: number = 50, rowOffset: number = 1) {
        super(columns, batchSize, rowOffset);
    }

    protected async uploadData(list: Array<any>): Promise<Array<any>> {
        // Implement data upload logic, e.g., calling an API
        return list.map(item => ({ ...item, error: null }));
    }
}
```

### Parsing and Uploading Excel Files

```typescript
const file: File = // ... Obtain the file (e.g., from an input element)
const columns: DataColumn[] = [
    { field: 'name', text: 'Name', parser: (value) => String(value) },
    { field: 'age', text: 'Age', parser: (value) => Number(value) }
];
const template = new MyUploadTemplate(columns);
await template.parseExcelFile(file); // Parse the file
await template.upload(); // Upload the data
console.log(template.list); // Access processed data
```

### Exporting Error Data

```typescript
template.exportErrorRowsToExcel('errors.xlsx'); // Export data with errors to an Excel file
```

## Class Details

### Constructor

```typescript
protected constructor(columns: Array<DataColumn>, batchSize: number = 50, rowOffset: number = 1)
```

- **Parameters**:
  - `columns`: An array of `DataColumn` objects defining the data structure (field names, display text, and optional parsers).
  - `batchSize`: The size of each upload batch (default: 50).
  - `rowOffset`: The number of starting rows to skip in the Excel sheet (default: 1, e.g., to skip the header row).
- **Description**: Initializes the template with column definitions, batch size, and row offset.

### Methods

#### `setProgressStatusListener`

```typescript
setProgressStatusListener(value: UpdateProgressStatus)
```

- **Parameters**:
  - `value`: A callback function for updating progress status.
- **Description**: Sets a listener to notify progress status updates, typically used for UI updates.

#### `uploadData` (Abstract Method)

```typescript
protected abstract uploadData(list: Array<any>): Promise<Array<any>>
```

- **Parameters**:
  - `list`: An array of data to upload.
- **Description**: Subclasses must implement this method to define the data upload logic (e.g., calling a backend API). Returns an array containing the upload results, which may include error information.
- **Override**: Subclasses must implement this method.

#### `upload`

```typescript
async upload()
```

- **Description**: Uploads data in batches, updating the status of each record (`P` for pending, `U` for uploading, `D` for done), and invokes the progress status listener during the upload process.
- **Logic**: Processes data in batches, calling `uploadData` for each batch and updating the error status of records based on the results.

#### `wrapData`

```typescript
protected wrapData(data: any): any
```

- **Parameters**:
  - `data`: A single row object.
- **Description**: Wraps the data into an object containing `data` and `status` properties, with the initial status set to `P` (pending).
- **Override**: Subclasses can override this method to customize the wrapping logic.

#### `columns` (Getter)

```typescript
get columns(): Array<TableColumn>
```

- **Returns**: An array of `TableColumn` objects representing column definitions, including data columns and a status column.
- **Description**: Extends `BaseTemplate`'s `columns`, adding a `data.` prefix to each field and appending a status column (displaying pending, uploading, success, or error information).

#### `exportErrorRowsToExcel`

```typescript
exportErrorRowsToExcel(filename: string)
```

- **Parameters**:
  - `filename`: The name of the exported Excel file.
- **Description**: Filters rows with errors, generates an Excel file containing column headers, data values, and error information, and triggers a file download.
- **Dependencies**: Uses the `xlsx` library to generate the Excel file.

## Types

- **DataColumn**: A custom type defining column metadata (e.g., `field`, `text`, `parser`, `visible`, `ignore`).
- **TableColumn**: A type from `@ticatec/uniface-element/DataTable`, used for column definitions in UI components.
- **UploadFun**: `(arr: Array<any>) => Promise<Array<any>>` type, representing the upload function.
- **UpdateProgressStatus**: `() => void` type, representing the progress status update callback.

## Status Column

Defines an additional `statusColumn` to display the status of each row:

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

- **Status Values**:
  - `P`: Pending
  - `U`: Uploading
  - `D`: Done (may include errors)
- **Internationalization**: Uses `getI18nText` to retrieve status display text.

## Notes

- This class is abstract and must be extended with an implementation of the `uploadData` method.
- Batch uploading is controlled by `batchSize` to avoid uploading too much data at once.
- The error data export function includes only rows with errors, facilitating user analysis and correction.