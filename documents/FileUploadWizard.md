# FileUploadWizard Component

A Svelte-based dialog component for handling Excel file uploads, parsing, and data display, integrated with `BaseUploadTemplate` to enable file parsing and batch upload functionality.

## Overview

This component provides an interactive dialog interface that allows users to select an Excel file, parse its contents, display a data table, perform upload operations, and export data containing errors. The component supports internationalization, dynamic button operations, and upload progress management, making it suitable for scenarios requiring batch processing of Excel data.

## Usage

1. Implement a data template to define fields that match the Excel file. [BaseUploadTemplate](./BaseUploadTemplate.md)
2. Open the dialog to load a local Excel file, which triggers parsing and displays the upload button. Clicking the upload button starts the upload process.
3. Upon upload completion, if there are errors, a button to save error data will be displayed. Clicking this button allows downloading the error data locally.
```typescript
<script lang="ts">
    import ExcelUploadDialog from './ExcelUploadDialog.svelte';
    import type { DataColumn } from './DataColumn';
    import MyUploadTemplate from './MyUploadTemplate'; // Extends BaseUploadTemplate
    const template = new MyUploadTemplate();

    async function handleAfterUploaded() {
        console.log('Upload completed');
    }

    function handleClose() {
        console.log('Dialog closed');
    }
</script>

<ExcelUploadDialog
    title="Upload Excel File"
    width="800px"
    height="600px"
    {template}
    afterUploaded={handleAfterUploaded}
/>
```

## Component Details

### Properties

- **title**: `string`
  - The dialog title.
- **width**: `string` (default: `"800px"`)
  - The dialog width.
- **height**: `string` (default: `"600px"`)
  - The dialog height.
- **template**: `BaseUploadTemplate`
  - An instance of `BaseUploadTemplate` used for parsing and uploading Excel data.
- **afterUploaded**: `() => Promise<void>`
  - A callback function invoked after the upload is completed.

### Button Actions

- **btnChoose**: File selection button that triggers the file input dialog.
- **btnUpload**: Upload button that calls `template.upload()` to perform batch uploads.
- **btnSave**: Save errors button that calls `template.exportErrorRowsToExcel()` to export data with errors.

### Event Handling

- **File Selection**: Triggered via a hidden `<input type="file">` element, which calls `parseExcelFile` to parse the selected Excel file.
- **Upload Progress**: Listens to upload progress via `template.setProgressStatusListener` to dynamically update `list`.
- **Close Confirmation**: Uses `confirmCloseDialog` to prevent closing the dialog during the `Uploading` state.

### Component Logic

- **Initialization**: In `onMount`, retrieves `template.columns` and sets the progress status listener.
- **Status Management**: Dynamically updates button states and availability based on `status`:
  - `Init`: Displays only the "Choose File" button.
  - `Pending`: Displays "Upload" and "Choose File" buttons.
  - `Uploading`: Disables all buttons and changes the mouse cursor to a loading state.
  - `Done`: If error data exists, displays "Save Errors" and "Choose File" buttons; otherwise, displays only the "Choose File" button.
- **File Parsing**: Calls `template.parseExcelFile` to parse the Excel file, displays a loading indicator, and handles success or failure prompts.
- **Data Table**: Uses the `DataTable` component to display parsed data, including an indicator column (showing row numbers).

## Types

- **ProcessStatus**: `'Init' | 'Pending' | 'Uploading' | 'Done'`
  - Represents the data processing status.
- **DataColumn**: A custom interface defining column metadata (extends `TableColumn` from `@ticatec/uniface-element/DataTable`).
- **ButtonAction** / **ButtonActions**: From `@ticatec/uniface-element/ActionBar`, defining button operations.
- **IndicatorColumn**: From `@ticatec/uniface-element/DataTable`, defining the row number column.

## Notes

- Ensure `BaseUploadTemplate` correctly implements the `uploadData` method to handle the actual upload logic.
- The file input only accepts `.xls` and `.xlsx` file formats.
- A loading indicator is displayed during the upload process, and errors are shown via `window.Toast`.
- The dialog checks for the `Uploading` state when closing to prevent interrupting the upload.
- The exported error data filename is formatted as `error-${filename}`, based on the original filename.