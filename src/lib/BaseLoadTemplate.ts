import BaseTemplate from "$lib/BaseTemplate";
import type DataColumn from "$lib/DataColumn";

export type DataFetcher = (rows: Array<any>) => Promise<Array<any>>;
export type CheckMatch = (o1: any, o2: any) => boolean;
/**
 * 用于前台数据和服务器端的数据整合
 */
export default abstract class BaseLoadTemplate extends BaseTemplate {

    protected fetcher: DataFetcher;
    protected isMatch: CheckMatch;

    protected constructor(columns: Array<DataColumn>, fetcher: DataFetcher, checkMatch: CheckMatch, rowOffset: number = 1) {
        super(columns, rowOffset);
        this.fetcher = fetcher;
        this.isMatch = checkMatch;
    }


    /**
     * 从服务器抓取数据，然后根据主键进行数据合并
     * @param rows
     * @protected
     */
    protected async consolidateData(rows: Array<any>): Promise<Array<any>> {
        let data = await this.fetcher?.(rows);
        return rows.map(row => {
            let item = data.find(el=>this.isMatch(row, el));
            return [...row, ...item]
        })

    }
}