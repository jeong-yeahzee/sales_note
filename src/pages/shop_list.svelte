<style>
    .div_contain{
        display: flex;
        height: 100%;
        flex-direction: column;
        gap: 16px;
    }
    .div_title{
        display: flex;
        flex-shrink: 0;
        height: 48px;
        align-items: center;
        background-color: #FFFFFF;
        padding: 0 16px;
    }
    .div_content{
        display: flex;
        flex-direction: column;
        gap: 8px;
        background-color: #FFFFFF;
        padding: 16px;
        flex-grow: 1;
    }
    .div_shop_cnt{
        font-weight: bold;
        letter-spacing: 1px;
    }
    .div_grid{
        width: 100%;
        min-height: calc(100vh - 112px);
        height: 100%;
    }
</style>

<div class="div_contain">
    <div class="div_title">
        <div>가맹점 관리</div>
        <button type="button" on:click={on_click}>추가</button>
    </div>
    <div class="div_content">
        <div class="div_shop_cnt">총 {comma(shop_cnt)}건</div>
        <div bind:this={this_grid} class="ag-theme-quartz div_grid"></div>
    </div>
</div>

<script>
    import {onMount} from "svelte";

    import * as agGrid from "ag-grid-community";
    import "ag-grid-community/styles/ag-grid.css";
    import "ag-grid-community/styles/ag-theme-quartz.css";

    import {DB_I_SHOP, DB_L_SHOP} from "../js/local_db.js";
    import {g_nvl, comma} from "../js/common.js";

    let shop_cnt = 0;
    let this_grid, grid_api;

    onMount(async ()=>{
        grid_options_init();
        const result = await DB_L_SHOP();
        shop_cnt = result.length;
        grid_api.setGridOption("rowData", result);
    });

    async function on_click(){
        // await DB_I_SHOP();
        // await DB_L_SHOP();
    }

    // 가맹점 목록 그리드
    function grid_options_init(){
        const column_defs = [
            {
                headerName: "거래처코드",
                field: "SHOP_NO",
                flex:1
            },
            {
                headerName: "거래처명",
                field: "SHOP_NAME",
                flex:1
            },
            {
                headerName: "사업자번호",
                field: "BUSINESS_LICENSE",
                flex:1
            },
            {
                headerName: "휴대폰번호",
                field: "MOBILE",
                flex:1
            },
            {
                headerName: "전화번호",
                field: "TEL",
                flex:1
            },
            {
                headerName: "주소",
                field: "ADDRESS1",
                flex:1,
                valueFormatter: (param)=>{
                    return `${g_nvl(param.data.ADDRESS1)} ${g_nvl(param.data.ADDRESS2)}`;
                }
            },
            {
                headerName: "대표자명",
                field: "CEO_NAME",
                flex:1
            },
            {
                headerName: "메모",
                field: "MEMO",
                flex:1
            },
            {
                headerName: "거래처등록일",
                field: "SALES_TYPE",
                flex:1
            }
        ];

        const grid_options = {
            columnDefs: column_defs,
            rowData: null
        }

        grid_api = agGrid.createGrid(this_grid, grid_options);
    }
</script>