import BaseTemplate, {type UpdateProgressStatus, type UploadFun} from "$lib/BaseTemplate";
import type DataColumn from "$lib/DataColumn";

let columns: Array<DataColumn> = [
    {
        field: 'company.name',
        text: '单位名称',
        width: 240,
        pos: 1
    },
    {
        field: 'company.deptName',
        text: '部门',
        width: 240,
        pos: 2
    },
    {
        field: 'company.team',
        text: '班组',
        width: 240,
        pos: 4
    },
    {
        field: 'employeeNo',
        text: '员工编号',
        width: 90,
        pos: 10,
        align: "center"
    },
    {
        field: 'employeeName',
        text: '姓名',
        width: 120,
        pos: 11
    },
    {
        field: 'gender',
        text: '性别',
        width: 80,
        pos: 12,
        align: "center"
    },
    {
        field: 'age',
        text: '年龄',
        width: 120,
        pos: 21,
        align: "center"
    }
]
export default class EmployeesTemplate extends BaseTemplate {

    constructor(uploadFun: UploadFun, batchSize: number = 50, rowOffset: number = 1) {
        super(columns, uploadFun, batchSize, rowOffset);
    }

}