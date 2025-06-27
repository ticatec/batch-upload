import BaseTemplate from "$lib/BaseTemplate";
import type DataColumn from "$lib/DataColumn";
import type {DataColumn as TableColumn} from "@ticatec/uniface-element/DataTable";
import {getI18nText} from "@ticatec/i18n";
import i18nKeys from "$lib/i18n_resources/i18nKeys";

const ValidData = `<span style="color: #76FF03">${getI18nText(i18nKeys.textValid)}</span>`;
const InvalidData = `<span style="color: #ff3e00">${getI18nText(i18nKeys.textInvalid)}</span>`;

export default abstract class BaseEncodingTemplate extends BaseTemplate {


    private validColumn: TableColumn = {
        text: getI18nText(i18nKeys.labelValid),
        width: 90,
        align: 'center',
        escapeHTML: true,
        formatter: row => this.isDataValid(row) ? ValidData : InvalidData
    }

    protected constructor(columns: Array<DataColumn>, rowOffset: number = 1) {
        super(columns, rowOffset);
    }

    /**
     * 检查一行的数据是否合法
     * @param row
     * @protected
     */
    protected abstract isDataValid(row: any): boolean;

    /**
     *
     * @param rows
     * @protected
     */
    protected abstract encodeData(rows: Array<any>): Promise<Array<any>>;

    /**
     * 数据集是否有效
     */
    abstract get valid(): boolean;

    /**
     * 从服务器抓取数据，然后根据主键进行数据合并
     * @param rows
     * @protected
     */
    protected async consolidateData(rows: Array<any>): Promise<Array<any>> {
        let list = await this.encodeData(this.extractData(rows));
        rows.forEach((item: any, idx: number) => {
            if (list[idx]) {
                rows[idx] = {...item, ...list[idx]};
            }
        });
        return rows;
    }

    get columns(): Array<TableColumn> {
        return [...this._columns, this.validColumn];
    }
}