<style>
    .div_contain{
        display: flex;
        height: 100%;
        flex-direction: column;
        gap: 16px;
    }
    .div_title{
        display: flex;
        height: 48px;
        align-items: center;
        background-color: #FFFFFF;
        padding: 0 16px;
    }
    .div_content{
        background-color: #FFFFFF;
        padding: 0 16px;
        flex-grow: 1;
    }
</style>

<div class="div_contain">
    <div class="div_title">
        <div>가맹점 관리</div>
    </div>
    <div class="div_content">
        <button type="button" on:click={on_click}>추가</button>
    </div>
</div>

<script>
    import {onMount} from "svelte";
    import {DB_I_SHOP, DB_L_SHOP} from "../js/local_db";

    onMount(()=>{
        DB_L_SHOP();
    });

    async function on_click(){
        await DB_I_SHOP();
        await DB_L_SHOP();
    }
</script>