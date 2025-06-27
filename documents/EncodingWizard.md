# Excel Encoding Wizard Component

A Svelte-based dialog component for parsing Excel files, validating/completing data via a server-side API, and displaying validation results, integrated with `BaseEncodingTemplate` for data processing.

## Overview

This component provides an interactive dialog interface that allows users to select an Excel file, parse its contents, validate and complete data through a server-side API, display a data table, and provide a confirm action when the data is valid. The component supports internationalization and dynamic button operations, making it suitable for scenarios requiring validation and completion of Excel data.

## Usage

Embed the component in a Svelte application and pass the required properties. Below is an example:

1. Implement a data template to define fields matching the Excel file. [BaseEncodingTemplate](./BaseEncodingTemplate.md)
2. Open the dialog to load a local Excel file, which triggers parsing and validation via the server API. If validation passes, a confirm button is displayed. Clicking the confirm button returns the dataset through a callback function.

```typescript
<script lang="ts">
    import EncodingDialog from '@ticatec/batch-data-uploader/EncodingDialog.svelte';
    import type { DataColumn } from '@ticatec/batch-data-uploader/DataColumn';
    import MyEncodingTemplate from './MyEncodingTemplate'; // Extends BaseEncodingTemplate

    const template = new MyEncodingTemplate();

    function handleClose() {
        console.log('Dialog closed');
    }

    function handleConfirm(data: any[]) {
        console.log('Confirmed data:', data);
    }
</script>

<ExcelEncodingDialog
    title="Validate Excel Data"
    width="800px"
    height="600px"
    {template}
    closeHandler={handleClose}
    confirmCallback={handleConfirm}
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
- **template**: `BaseEncodingTemplate`
  - An instance of `BaseEncodingTemplate` used for parsing Excel files, validating, and completing data.
- **confirmCallback**: `any`
  - A callback function invoked when the confirm button is clicked, receiving the parsed data list (`template.list`).

### Button Actions

- **btnChoose**: File selection button that triggers a file input dialog to choose an Excel file.
- **btnConfirm**: Confirm button, displayed only when the data is valid (`template.valid` is `true`), invokes `confirmCallback,` and closes the dialog.

### Event Handling

- **File Selection**: Triggered via a hidden `<input type="file">` element, which calls `parseExcelFile` to parse the selected Excel file and invokes `template.parseExcelFile` for validation/completion.
- **Data Validation**: After parsing, checks `template.valid`. If the data is valid, adds the "Confirm" button.
- **Error Prompt**: Displays an error message via `window.Toast` if parsing fails and hides the loading indicator.

## Types

- **DataColumn**: A custom interface defining column metadata (extends `TableColumn` from `@ticatec/uniface-element/DataTable`).
- **ButtonAction** / **ButtonActions**: From `@ticatec/uniface-element/ActionBar`, defining button operations.
- **IndicatorColumn**: From `@ticatec/uniface-element/DataTable`, defining the row number column.

## Dependent Components

- **Dialog**: From `@ticatec/uniface-element/Dialog`, provides the dialog container.
- **DataTable**: From `@ticatec/uniface-element/DataTable`, displays the data table.
- **Box**: From `@ticatec/uniface-element/Box`, provides a bordered container style.
- **getI18nText**: From `@ticatec/i18n`, used for internationalized text.

## Notes

- Ensure `BaseEncodingTemplate` correctly implements `isDataValid`, `encodeData`, and the `valid` property to support data validation and completion.
- The file input only accepts `.xls` and `.xlsx` file formats.
- A loading indicator (`window.Indicator`) is displayed during parsing, and errors are shown via `window.Toast`.
- The confirm button is displayed only when `template.valid` is `true`, ensuring only valid data can be submitted.
- The component depends on `window.Indicator` and `window.Toast` for UI prompts; ensure these global objects are defined.
- The `confirmCallback` receives the complete parsed data list, suitable for further processing or submission.