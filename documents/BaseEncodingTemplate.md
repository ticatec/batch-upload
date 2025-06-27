# BaseEncodingTemplate Class

An abstract base class for parsing Excel files, encoding data, and performing validation, extending `BaseTemplate`, with support for data validity checks and column expansion.

## [BaseTemplate](./BaseTemplate.md)

## Overview

The `BaseEncodingTemplate` class extends `BaseTemplate`, adding data validity verification and encoding functionality. It supports parsing Excel files, validating the legitimacy of each row of data, and implementing custom data encoding logic through subclasses. The class adds a column to display data validity (showing "Valid" or "Invalid" status).

## Usage

To use `BaseEncodingTemplate`, you must extend the class and implement the `isRowValid`, `encodeData` methods, and the `valid` property. Below is an example:

```typescript
import BaseEncodingTemplate from './BaseEncodingTemplate';
import type { DataColumn } from './DataColumn';

const columns: DataColumn[] = [
    {
        field: 'user.name',
        text: 'Name',
        width: 150,
        parser: (value) => String(value).trim()
    },
    {
        field: 'user.age',
        text: 'Age',
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
        // Implement data encoding logic, e.g., calling an API and replacing or merging with local data
        return rows.map(item => ({ ...item, encoded: true }));
    }

    get valid(): boolean {
        // Check if the entire dataset is valid
        return this._list.filter(item => item.id == null).length > 0;
    }
}
```

### Parsing Excel Files

```typescript
const file: File = // ... Obtain the file (e.g., from an input element)
const template = new MyEncodingTemplate();
await template.parseExcelFile(file); // Parse and encode data
console.log(template.list); // Access processed data
console.log(template.valid); // Check data validity
```

## Class Details

### Constructor

```typescript
protected constructor(columns: Array<DataColumn>, rowOffset: number = 1)
```

- **Parameters**:
  - `columns`: An array of `DataColumn` objects defining the data structure (field names, display text, and optional parsers).
  - `rowOffset`: The number of starting rows to skip in the Excel sheet (default: 1, e.g., to skip the header row).
- **Description**: Initializes the template, setting column definitions and row offset.

### Methods

#### `isRowValid` (Abstract Method)

```typescript
protected abstract isRowValid(row: any): boolean
```

- **Parameters**:
  - `row`: A single row data object.
- **Description**: Subclasses must implement this method to validate the legitimacy of a single row of data, returning `true` for valid and `false` for invalid.
- **Override**: Subclasses must implement specific validation logic.

#### `encodeData` (Abstract Method)

```typescript
protected abstract encodeData(rows: Array<any>): Promise<Array<any>>
```

- **Parameters**:
  - `rows`: An array of data to be encoded.
- **Description**: Subclasses must implement this method to define data encoding logic (e.g., calling a server API for data processing). Returns the encoded data array.
- **Override**: Subclasses must implement specific encoding logic.

#### `valid` (Abstract Getter)

```typescript
abstract get valid(): boolean
```

- **Returns**: A boolean indicating whether the entire dataset is valid.
- **Description**: Subclasses must implement this getter to check the validity of all data.
- **Override**: Subclasses must implement specific logic.

#### `consolidateData`

```typescript
protected async consolidateData(rows: Array<any>): Promise<Array<any>>
```

- **Parameters**:
  - `rows`: An array of raw row objects parsed from the Excel file.
- **Description**: Overrides the `BaseTemplate` method, calling `encodeData` to encode data and merge the encoded results with the original rows.
- **Logic**: Iterates through each row, merging encoded results with the original data.

#### `columns` (Getter)

```typescript
get columns(): Array<TableColumn>
```

- **Returns**: An array of `TableColumn` objects representing column definitions, including data columns and a match status column.
- **Description**: Extends `BaseTemplate`'s `columns`, adding a match status column (`validColumn`) to display the validity of each row ("Valid" or "Invalid").

### Match Status Column

Defines an additional `validColumn` to display the validity of each row:

```typescript
private validColumn: TableColumn = {
    text: getI18nText(i18nKeys.labelMatch),
    width: 90,
    align: 'center',
    escapeHTML: true,
    formatter: row => this.isRowValid(row) ? ValidData : InvalidData
}
```

- **Display**:
  - `ValidData`: `<span style="color: #76FF03">Valid</span>` (green text).
  - `InvalidData`: `<span style="color: #ff3e00">Invalid</span>` (red text).
- **Internationalization**: Uses `getI18nText` to retrieve column titles and status text.

## Notes

- This class is abstract and must be extended with implementations of `isRowValid`, `encodeData`, and the `valid` property.
- `rowOffset` can be used to skip header rows in Excel files.
- The match status column visually displays data validation results with green (valid) and red (invalid) text.
- Data encoding typically involves server interaction, and subclasses must ensure `encodeData` handles asynchronous operations.