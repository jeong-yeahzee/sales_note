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
        width: 136px;
        height: 100%;
    }
    .div_menu_bar>div{
        display: flex;
        height: 48px;
        align-items: center;
        gap: 8px;
        padding-left: 12px;
    }
    .div_menu_bar>div:not(div:first-of-type):hover{
        font-weight: bold;
    }
    .div_content{
        flex-grow: 1;
        padding: 16px 16px 0;
        background-color: rgba(0, 0, 0, 3%);
        min-width: 882px;
    }

    .active{
        background-color: rgba(0, 0, 0, 3%);
    }

    :global(.modal_header){
        width: 100%;
        height: 48px;
        padding: 16px 8px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: #3C4359;
        font-size: 14px;
        font-weight: 700;
        box-sizing: border-box;
        box-shadow: 0 -1px 0 0 #D1D1D1 inset;
    }
    :global(.modal_close_icon){
        display: flex;
        width: 32px;
        height: 32px;
        justify-content: center;
        align-items: center;
        gap: 8px;
        border: none;
        background: transparent;
    }
    :global(.ag-header-cell-label){
        justify-content: center;
    }
    :global(.text_right){
        text-align: right;
    }
</style>

<div class="div_contain">
    <div class="div_menu_bar">
        <div on:click={$goto("/")}>SALES_NOTE</div>
        {#each menu_arr as value}
            <div on:click={()=>{on_click_go_menu(value.menu_url)}}
                 class:active={value.menu_url === path}>
                {#if value.icon === "shop"}
                    <Icon_shop/>
                {:else if value.icon === "box"}
                    <Icon_box/>
                {:else if value.icon === "discount"}
                    <Icon_coin/>
                {:else if value.icon === "create"}
                    <Icon_add/>
                {:else if value.icon === "list"}
                    <Icon_list/>
                {:else if value.icon === "cashbook"}
                    <Icon_cashbook/>
                {:else if value.icon === "trash"}
                    <Icon_trash/>
                {/if}
                <div>{value.menu_name}</div>
            </div>
        {/each}
    </div>
    <div class="div_content">
        <slot/>
    </div>
</div>

<!--electron > alert/confirm 실행시 input focus 안되는 이슈로 인해 직접 구현-->
<Alert/>
<Confirm/>

<script>
    import { goto,afterPageLoad } from '@roxi/routify';
    import Alert from "../../public/assets/component/Alert.svelte";
    import Confirm from "../../public/assets/component/Confirm.svelte";
    import Icon_add from "../../public/assets/component/icon/Icon_add.svelte";
    import Icon_cashbook from "../../public/assets/component/icon/Icon_cashbook.svelte";
    import Icon_coin from "../../public/assets/component/icon/Icon_coin.svelte";
    import Icon_list from "../../public/assets/component/icon/Icon_list.svelte";
    import Icon_shop from "../../public/assets/component/icon/Icon_shop.svelte";
    import Icon_box from "../../public/assets/component/icon/Icon_box.svelte";
    import Icon_trash from "../../public/assets/component/icon/Icon_trash.svelte";

    const menu_arr = [
        {menu_name: "거래처 관리", menu_url: "/shop_list", icon: "shop"},
        {menu_name: "상품 관리", menu_url: "/product_list", icon: "box"},
        {menu_name: "판매가 설정", menu_url: "/discount_setting", icon: "discount"},
        {menu_name: "판매 입력", menu_url: "/create_sales", icon: "create"},
        {menu_name: "판매 내역", menu_url: "/sales_list", icon: "list"},
        {menu_name: "미수금 관리", menu_url: "/outstanding_balance", icon: "cashbook"},
        {menu_name: "휴지통", menu_url: "/delete_list", icon: "trash"}
    ];

    let path = "";

    $afterPageLoad(page => {
        let body = document.querySelector("body");
        body.style.overflow = "auto";
        path = location.pathname;
    });

    function on_click_go_menu(url){
        $goto(url);
    }
</script>