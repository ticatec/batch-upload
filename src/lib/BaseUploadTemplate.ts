import BaseTemplate from "$lib/BaseTemplate";
import type {DataColumn as TableColumn} from "@ticatec/uniface-element/DataTable";
import {getI18nText} from "@ticatec/i18n";
import i18nKeys from "$lib/i18n_resources/i18nKeys";
import type DataColumn from "$lib/DataColumn";
import utils from "$lib/utils";
import * as XLSX from 'xlsx';


export type UploadFun = (arr: Array<any>) => Promise<void>;
export type UpdateProgressStatus = () => void;

const statusColumn: TableColumn =  {
    text: "status",
    width: 150,
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

export default abstract class BaseUploadTemplate extends BaseTemplate {

    protected uploadFun: UploadFun;
    protected batchSize: number;
    protected updateProgressStatus: UpdateProgressStatus | null = null;

    protected constructor(columns: Array<DataColumn>, uploadFun: UploadFun, batchSize: number = 50, rowOffset: number = 1) {
        super(columns, rowOffset);;
        this.uploadFun = uploadFun;
        this.batchSize = batchSize;
    }

    /**
     * 状态更新的监听器
     * @param value
     */
    setProgressStatusListener(value: UpdateProgressStatus) {
        this.updateProgressStatus = value;
    }

    /**
     * 上传数据
     */
    async upload() {
        for (let i = 0; i < this.list.length; i += this.batchSize) {
            const chunk = this.list.slice(i, i + this.batchSize);
            chunk.forEach(item=>item.status='U');
            this.updateProgressStatus?.();
            await this.uploadFun(chunk);
            chunk.forEach(item=>item.status='D');
            this.updateProgressStatus?.();
        }
    }

    /**
     * 将数据包裹着一个对象里面
     * @param data
     * @protected
     */
    protected wrapData(data: any): any {
        return {data, status: 'P'}
    }

    /**
     * 获取表格的列定义
     */
    get columns(): Array<TableColumn> {
        return [...this._columns.map(col=> ({...col, field: `data.${col.field}`})), statusColumn];
    }

    /**
     * 导出处理异常的数据
     * @param filename
     */
    exportErrorRowsToExcel(filename: string) {
        // 筛选出有错误的行
        const errorRows = this._list.filter(row => row.error != null);

        // 生成 Excel 数据（第一行为标题）
        const header = [...this._columns.map(col => col.text), getI18nText(i18nKeys.errorTitle)];
        const data = errorRows.map(row => {
            const values = this._columns.map(col => {
                return utils.getNestedValue(row.data, col.field);
            });
            return [...values, row.error];
        });

        const worksheetData = [header, ...data];
        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, getI18nText(i18nKeys.sheetName));

        const wbout = XLSX.write(workbook, {
            bookType: 'xlsx',
            type: 'array'
        });

        // 创建 Blob 并触发下载
        const blob = new Blob([wbout], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

}