import type DataColumn from "./DataColumn";
import type {DataColumn as TableColumn} from "@ticatec/uniface-element/DataTable";
import * as XLSX from 'xlsx';
import utils from "./utils";

export default abstract class BaseTemplate {

    protected readonly _columns: Array<DataColumn>;
    protected readonly rowOffset: number;
    protected _list: Array<any> = [];

    /**
     *
     * @param columns
     * @param rowOffset
     * @protected
     */
    protected constructor(columns: Array<DataColumn>, rowOffset: number = 1) {
        this._columns = columns;
        this.rowOffset = rowOffset;
    }

    /**
     * 整理数据，在子类可以通过重载完成数据的二次处理
     * @param rows
     * @protected
     */
    protected async consolidateData(rows: Array<any>): Promise<Array<any>> {
        return rows;
    }

    /**
     * 解析一个excel文件
     * @param file
     */
    async parseExcelFile(file: File): Promise<void> {
        const buffer = await file.arrayBuffer();
        const workbook = XLSX.read(buffer, {type: 'array'});
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const range = XLSX.utils.decode_range(sheet['!ref'] || ''); // 获取范围

        const rows: any[] = [];

        for (let rowIndex = range.s.r + this.rowOffset; rowIndex <= range.e.r; rowIndex++) {
            const rowObject: any = {};

            for (let i=0; i<this._columns.length; i++) {
                const colDef = this._columns[i];
                const cellAddress = {r: rowIndex, c: i};
                const cellRef = XLSX.utils.encode_cell(cellAddress);
                const cell = sheet[cellRef];
                const rawValue = cell?.v;
                const formattedValue = colDef.parser ? colDef.parser(rawValue) : rawValue;
                utils.setNestedValue(rowObject, colDef.field, formattedValue);
            }
            rows.push(this.wrapData(rowObject));
        }
        this._list = await this.consolidateData(rows);
    }

    /**
     * 获取实际待上传的数据
     * @param arr
     */
    protected extractData(arr: Array<any>) {
        let list= arr.map(item => {
            let result : any = {};
            for (let col of this._columns) {
                if (col.visible != false && col.ignore != false) {
                    utils.setNestedValue(result, col.field, utils.getNestedValue(item.data, col.field));
                }
            }
            return result;
        });
        return list;
    }

    /**
     * 包裹数据
     * @param data
     * @protected
     */
    protected wrapData(data: any): any {
        return data;
    }

    /**
     * 获取表格的列定义
     */
    get columns(): Array<TableColumn> {
        return this._columns.map(col=> ({...col}));
    }

    /**
     * 获取数据
     */
    get list(): Array<any> {
        return [...this._list];
    }


}