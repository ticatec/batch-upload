<script lang="ts">
    import  DialogBoard  from "@ticatec/uniface-element/DialogBoard";
    import IndicatorBoard from "@ticatec/uniface-element/IndicatorBoard";
    import MessageBoxBoard from "@ticatec/uniface-element/MessageBoxBoard";
    import ToastBoard from "@ticatec/uniface-element/ToastBoard";
    import {onMount} from "svelte";
    import FileUploadWizard from "$lib";
    import EmployeesTemplate from "./EmployeesTemplate";

    onMount(async () => {
        let template = new EmployeesTemplate(async (rows: Array<any>) => {
            console.log(rows);
            return new Promise((resolve)=>{
                for (let i=0; i<rows.length; i++) {
                    let code = Math.round(Math.random() * 1000)
                    if ( code > 800) {
                        rows[i].error = code
                    }
                }
                setTimeout(()=> {resolve()}, 1000)
            });
        });
        window.Dialog.showModal(FileUploadWizard, {template, width: "1240px", uploadFunction: ()=> {}, title: '批量上传员工'})
    })

</script>

<div style="width: 100%; height: 100%; box-sizing: border-box">

</div>
<DialogBoard></DialogBoard>
<IndicatorBoard></IndicatorBoard>
<ToastBoard></ToastBoard>
<MessageBoxBoard></MessageBoxBoard>