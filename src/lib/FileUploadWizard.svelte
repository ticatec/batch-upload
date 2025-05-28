<script lang="ts">
    import Dialog from "@ticatec/uniface-element/Dialog";
    import type {ButtonAction, ButtonActions} from "@ticatec/uniface-element/ActionBar";
    import DataTable, {type IndicatorColumn} from "@ticatec/uniface-element/DataTable";
    import i18n, {getI18nText} from "@ticatec/i18n";
    import Box from "@ticatec/uniface-element/Box"
    import {onMount} from "svelte";
    import type BaseTemplate from "$lib/BaseTemplate";
    import type DataColumn from "@ticatec/uniface-element/DataTable";
    import i18nKeys from "$lib/i18n_resources/i18nKeys";

    export let title: string;

    export let width: string = "800px";
    export let height: string = "600px"

    export let closeHandler: any;
    export let template: BaseTemplate;

    type ProcessStatus = 'Init' | 'Pending' | 'Uploading' | 'Done';  //初始状态，待上传，上传中，处理完成

    let status: ProcessStatus = 'Init';


    const btnChoose: ButtonAction = {
        label: getI18nText(i18nKeys.button.open),
        type: 'primary',
        handler: () => {
            uploadField.click();
        }
    }

    const btnUpload: ButtonAction = {
        label: getI18nText(i18nKeys.button.upload),
        type: 'primary',
        handler: async ()=> {
            status = 'Uploading';
            try {
                await template.upload();
            } finally {
                status = 'Done';
            }
        }
    }

    const btnSave: ButtonAction = {
        label: getI18nText(i18nKeys.button.save),
        type: 'primary',
        handler: async ()=> {
            template.exportErrorRowsToExcel(`error-${filename}`);
        }
    }

    let actions: ButtonActions = [btnChoose];
    let uploadField: any;
    let list: Array<any> = [];
    let filename: string;

    const parseExcelFile = async (excelFile: File) => {
        filename = excelFile.name;
        window.Indicator.show(getI18nText(i18nKeys.parsing));
        try {
            await template.parseExcelFile(excelFile);
            list = template.list;
            status = list.length > 0 ? 'Pending' : 'Init';
        } catch (ex) {
            window.Toast.show(getI18nText(i18nKeys.parseFailure, {name: excelFile.name}));
        } finally {
            window.Indicator.hide();
        }
    }


    let columns: Array<DataColumn>;

    onMount(async () => {
        columns = template.columns;
        template.setProgressStatusListener(()=> {
            list = template.list;
        })
    });



    const indicatorColumn: IndicatorColumn = {
        width: 60,
        selectable: false,
        displayNo: true
    }


    $: {
        switch (status) {
            case 'Init':
                actions = [btnChoose];
                break;
            case 'Pending':
                actions = [btnUpload, btnChoose];
                break;
            case 'Uploading':
                btnUpload.disabled = true;
                btnChoose.disabled = true;
                actions = [...actions];
                break;
            case 'Done':
                btnUpload.disabled = false;
                btnChoose.disabled = false;
                const hasError = list.filter(item => item.error == null).length != list.length;
                actions = hasError ? [btnSave, btnChoose] : [btnChoose];
                break;
        }
    }


    const confirmCloseDialog = async ():Promise<boolean> => {
        if (status == 'Uploading') {
            window.Toast.show(getI18nText(i18nKeys.waitUploading));
            return false;
        } else {
            return true;
        }
    }

</script>

<Dialog {title} {closeHandler} {actions} closeConfirm={confirmCloseDialog}
        content$style="width: {width}; height: {height}; padding: 12px;">
    <Box style="border: 1px solid var(--uniface-editor-border-color, #F8FAFC); width: 100%; height: 100%; cursor: {status == 'Uploading' ? 'progress' : 'default'}" round>
        <DataTable style="width: 100%; height: 100%" {list} {indicatorColumn} {columns}>

        </DataTable>
    </Box>
    <input type="file" bind:this={uploadField} on:change={(e) => parseExcelFile(e.target.files?.[0])} style="display: none"
           accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">

</Dialog>
