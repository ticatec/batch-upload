<script lang="ts">
    import Dialog from "@ticatec/uniface-element/Dialog";
    import type {ButtonAction, ButtonActions} from "@ticatec/uniface-element/ActionBar";
    import DataTable, {type IndicatorColumn} from "@ticatec/uniface-element/DataTable";
    import {getI18nText} from "@ticatec/i18n";
    import Box from "@ticatec/uniface-element/Box"
    import {onMount} from "svelte";
    import type DataColumn from "./DataColumn";
    import i18nKeys from "$lib/i18n_resources/i18nKeys";
    import type BaseEncodingTemplate from "$lib/BaseEncodingTemplate";

    export let title: string;
    export let width: string = "800px";
    export let height: string = "600px"
    export let closeHandler: any;
    export let template: BaseEncodingTemplate;
    export let confirmCallback: any;


    const btnChoose: ButtonAction = {
        label: getI18nText(i18nKeys.button.open),
        type: 'primary',
        handler: () => {
            uploadField.value = '';
            uploadField.click();
        }
    }

    const btnConfirm: ButtonAction = {
        label: getI18nText(i18nKeys.button.confirm),
        type: 'primary',
        handler: ()=> {
            confirmCallback?.(template.list);
            closeHandler?.();
        }
    }

    let actions: ButtonActions = [btnChoose];
    let uploadField: any;
    let list: Array<any> = [];
    let filename: string;

    const parseExcelFile = async (excelFile: File) => {
        if (excelFile) {
            filename = excelFile.name;
            window.Indicator.show(getI18nText(i18nKeys.parsing));
            try {
                await template.parseExcelFile(excelFile);
                list = template.list;
                if (template.valid) {
                    actions = [btnConfirm, ...actions]
                }
            } catch (ex) {
                window.Toast.show(getI18nText(i18nKeys.parseFailure, {name: excelFile.name}));
            } finally {
                window.Indicator.hide();
            }
        }
    }


    let columns: Array<DataColumn>;

    onMount(async () => {
        columns = template.columns;
    });


    const indicatorColumn: IndicatorColumn = {
        width: 40,
        selectable: false,
        displayNo: true
    }


</script>

<Dialog {title} {closeHandler} {actions}
        content$style="width: {width}; height: {height}; padding: 12px;">
    <Box style="border: 1px solid var(--uniface-editor-border-color, #F8FAFC); width: 100%; height: 100%; "
         round>
        <DataTable style="width: 100%; height: 100%" {list} {indicatorColumn} {columns}>

        </DataTable>
    </Box>
    <input type="file" bind:this={uploadField} on:change={(e) => parseExcelFile(e.target.files?.[0])} style="display: none"
           accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">

</Dialog>
