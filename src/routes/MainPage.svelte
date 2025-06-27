<script lang="ts">
    import  DialogBoard  from "@ticatec/uniface-element/DialogBoard";
    import IndicatorBoard from "@ticatec/uniface-element/IndicatorBoard";
    import MessageBoxBoard from "@ticatec/uniface-element/MessageBoxBoard";
    import ToastBoard from "@ticatec/uniface-element/ToastBoard";
    import Button from "@ticatec/uniface-element/Button";
    import {onMount} from "svelte";
    import FileUploadWizard from "$lib";
    import EmployeesTemplate from "./EmployeesTemplate";
    import ProductTemplate from "./ProductTemplate";
    import EncodingWizard from "$lib/EncodingWizard.svelte";

    const uploadData = () => {
        let template = new EmployeesTemplate(async (rows: Array<any>) => {
            console.log("开始上传数据", rows);
            return new Promise((resolve)=>{
                let list:Array<any> = rows.map(item=>({}));
                for (let i=0; i<rows.length; i++) {
                    let code = Math.round(Math.random() * 1000)
                    if ( code > 800) {
                        list[i].error = code
                    }
                }
                setTimeout(()=> {resolve(list)}, 1000)
            });
        }, 5);
        window.Dialog.showModal(FileUploadWizard, {template, width: "1240px",  title: '批量上传员工'})
    }

    const loadData = () => {
        let template = new ProductTemplate();
        window.Dialog.showModal(EncodingWizard, {template, width: "1240px",  title: '批量新增产品', confirmCallback: (list: any) => {console.log('解析数据', list)}})
    }

    onMount(async () => {

    })

</script>

<div style="width: 100%; height: 100%; box-sizing: border-box">
    <div style="padding: 20px">
        <Button label="上传" type="primary" onClick={uploadData}/>
        <Button label="读取产品" type="primary" onClick={loadData}/>
    </div>
</div>
<DialogBoard></DialogBoard>
<IndicatorBoard></IndicatorBoard>
<ToastBoard></ToastBoard>
<MessageBoxBoard></MessageBoxBoard>