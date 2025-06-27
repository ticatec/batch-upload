# BaseTemplate Class

An abstract base class for parsing Excel files and handling data with customizable column definitions.

## Overview

The `BaseTemplate` class provides a foundation for processing Excel files using the `xlsx` library. It supports parsing Excel data into a structured format and enables custom column definitions and data transformations through subclassing. The class is designed to be extensible for specific use cases.  
Typically, there is no need to directly inherit from `BaseTemplate`; instead, you can use its subclasses `BaseEncodingTemplate` or `BaseUploadTemplate` based on business requirements.

## Usage

To use `BaseTemplate`, you must extend the class and implement the necessary custom data processing logic. Below is an example:

```typescript
import BaseTemplate from './BaseTemplate';
import type { DataColumn } from './DataColumn';

class MyTemplate extends BaseTemplate {
    constructor(columns: DataColumn[], rowOffset: number = 1) {
        super(columns, rowOffset);
    }

    // Optionally override consolidateData for custom data processing
    protected async consolidateData(rows: Array<any>): Promise<Array<any>> {
        // Add custom logic here
        return rows;
    }
}
```

### Parsing Excel Files

To parse an Excel file, call the `parseExcelFile` method with a `File` object:

```typescript
const file: File = // ... Obtain the file (e.g., from an input element)
const columns: DataColumn[] = [
    { field: 'name', parser: (value) => String(value) },
    { field: 'age', parser: (value) => Number(value) }
];
const template = new MyTemplate(columns);
await template.parseExcelFile(file);
console.log(template.list); // Access parsed data
```

## Class Details

### Constructor

```typescript
protected constructor(columns: Array<DataColumn>, rowOffset: number = 1)
```

- **Parameters**:
  - `columns`: An array of `DataColumn` objects defining the data structure (field names and optional parsers).
  - `rowOffset`: The number of starting rows to skip in the Excel sheet (default: 1, e.g., to skip the header row).
- **Description**: Initializes the template with column definitions and row offset.

### Methods

#### `parseExcelFile`

```typescript
async parseExcelFile(file: File): Promise<void>
```

- **Parameters**:
  - `file`: The Excel file to parse.
- **Description**: Reads and parses the Excel file, processes each row based on column definitions, and stores the result in the internal `_list` after applying `consolidateData`.
- **Dependencies**: Uses `xlsx` for reading Excel files and `utils` for nested value operations.

#### `consolidateData`

```typescript
protected async consolidateData(rows: Array<any>): Promise<Array<any>>
```

- **Parameters**:
  - `rows`: An array of raw row objects parsed from the Excel file.
- **Description**: A hook method that subclasses can override for additional data processing. By default, it returns the unchanged rows.
- **Override**: Subclasses can override this method to implement custom data transformation logic.

#### `extractData`

```typescript
protected extractData(arr: Array<any>): Array<any>
```

- **Parameters**:
  - `arr`: An array of data objects to process.
- **Description**: Filters and maps input data to include only visible and non-ignored columns, returning a new array of processed objects.
- **Purpose**: Used internally to prepare data for upload or further processing.

#### `wrapData`

```typescript
protected wrapData(data: any): any
```

- **Parameters**:
  - `data`: A single row object.
- **Description**: A hook method for wrapping or transforming a single row of data. By default, it returns the unchanged data.
- **Override**: Subclasses can override this method to wrap data into a specific structure.

#### `columns` (Getter)

```typescript
get columns(): Array<TableColumn>
```

- **Returns**: An array of `TableColumn` objects representing column definitions.
- **Description**: Provides a copy of the column definitions for use in data tables or other UI components.

#### `list` (Getter)

```typescript
get list(): Array<any>
```

- **Returns**: A copy of the parsed and processed data list.
- **Description**: Provides external access to the processed data.

## DataColumn Interface

A TypeScript interface that defines the structure and behavior of data table columns, used to describe column metadata and support features like column display, data parsing, and formatting.  
The `DataColumn` interface defines the properties and behavior of columns in a data table, including column titles, field mappings, formatting, alignment, and specific fields for data parsing and upload control. It is suitable for scenarios involving table data processing and Excel file parsing.

### Usage

The `DataColumn` interface is used to define the column structure of a data table, typically in conjunction with `BaseTemplate` or its derived classes (e.g., `BaseUploadTemplate`, `BaseEncodingTemplate`). Below is an example:

```typescript
import type { DataColumn } from './DataColumn';

const columns: DataColumn[] = [
    {
        field: 'user.name',
        text: 'Name',
        width: 150,
        align: 'left',
        parser: (value) => String(value).trim(),
        visible: true,
        ignore: false
    },
    {
        field: 'user.age',
        text: 'Age',
        width: 100,
        align: 'center',
        parser: (value) => Number(value) || 0,
        visible: true,
        ignore: false,
        formatter: (row) => `${row['user.age']} years`
    }
];
```

### Properties

- **field**: `string`
  - The field name used to map properties in the data object, supporting nested paths with dot notation (e.g., `user.name`).
- **text**: `string`
  - The column header text displayed in the data table.
- **frozen?**: `boolean`
  - Whether the column is frozen (fixed to the left side of the table), effective only if preceding columns are also `frozen`.
- **align?**: `'left' | 'center' | 'right'`
  - The alignment of cell content, defaults to unspecified (determined by the renderer).
- **width**: `number`
  - The column width in pixels.
- **minWidth?**: `number`
  - The minimum column width in pixels (optional).
- **formatter?**: `FormatCell`
  - A function for customizing cell display content.
- **escapeHTML?**: `boolean`
  - Whether to escape HTML characters to prevent XSS attacks (default: unspecified).
- **visible?**: `boolean`
  - Whether the column is visible, controlling its display in the table (default: unspecified).
- **resizable?**: `boolean`
  - Whether the column width can be resized (default: unspecified).
- **ignore?**: `boolean`
  - Whether to ignore the column; if `true`, the column is used only for frontend display and not included in data uploads (default: `false`).
- **parser?**: `ParserText`
  - A data parsing function defined as `(text: string) => any`, used to convert raw Excel cell values to the target format (e.g., converting strings to numbers).

#### Types

- **ParserText**: `(text: string) => any`
  - A parsing function type that takes a string input and returns a value of any type, used to process cell data from Excel files.
- **FormatCell**: A custom type (defined in `./FormatCell`) used for formatting cell display content.

#### Notes

- The `field` property is required in `DataColumn` to ensure correct data mapping.
- The `parser` function is critical for processing Excel data and should be defined based on the field type (e.g., string, number, date).
- The `ignore` property is useful for columns that should be displayed on the frontend but not included in uploads (e.g., auxiliary information columns).
- Ensure that dependent types (e.g., `FormatCell`) are properly defined and imported.

#### Example Column Definition

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

## Notes

- This class is abstract and must be extended for use.
- Ensure that `xlsx` and `@ticatec/uniface-element/DataTable` are installed and configured.
- The `rowOffset` can be used to skip header rows in Excel files.
- The `parser` function in `DataColumn` allows custom parsing of cell values (e.g., converting strings to numbers).