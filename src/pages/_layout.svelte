<style>
    .div_contain{
        display: flex;
        width: 100%;
        min-height: 100vh;
        height: 100%;
    }
    .div_menu_bar{
        display: flex;
        flex-direction: column;
        flex-shrink: 0;
        width: 200px;
        height: 100%;
        background-color: #FFFFFF;
        padding: 0 16px;
    }
    .div_menu_bar>div{
        display: flex;
        height: 48px;
        align-content: center;
        gap: 8px;
    }
    .div_menu_bar>div:not(div:first-of-type):hover{
        font-weight: bold;
    }
    .div_content{
        flex-grow: 1;
        background-color: #f1f1f1;
        padding: 16px 16px 0;
    }
</style>

<div class="div_contain">
    <div class="div_menu_bar">
        <div on:click={$goto("/")}>SALES_NOTE</div>
        {#each menu_arr as value}
            <div on:click={()=>{on_click_go_menu(value.menu_url)}}>
                {#if value.icon === "shop"}
                    <Icon_shop/>
                {:else if value.icon === "box"}
                    <Icon_box/>
                {/if}
                <div>{value.menu_name}</div>
            </div>
        {/each}
    </div>
    <div class="div_content">
        <slot/>
    </div>
</div>

<script>
    import { goto } from '@roxi/routify';
    import Icon_shop from "../../public/assets/component/icon/Icon_shop.svelte";
    import Icon_box from "../../public/assets/component/icon/Icon_box.svelte";

    const menu_arr = [
        {menu_name: "가맹점 관리", menu_url: "/shop_list", icon: "shop"},
        {menu_name: "상품 관리", menu_url: "/product_list", icon: "box"},
        {menu_name: "전표 등록", menu_url: "", icon: ""},
        {menu_name: "거래 내역", menu_url: "", icon: ""},
        {menu_name: "미수금 관리", menu_url: "", icon: ""}
    ];

    function on_click_go_menu(url){
        $goto(url);
    }
</script>