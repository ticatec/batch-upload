import type {DataColumn as TableColumn} from "@ticatec/uniface-element/DataTable";

export type ParserText = (text: string) => any;

export default interface DataColumn extends TableColumn {
    /**
     * 在excel中的列号
     */
    pos: number;

    /**
     * 对于的字段名
     */
    field: string;

    /**
     * 解析函数
     */
    parser?: ParserText

}