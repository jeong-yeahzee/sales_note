<style>
    .div_contain{
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        gap: 16px;
        background-color: #FFFFFF;
    }

    /*그리드 기본 스타일*/
    .div_grid{
        width: 100%;
        height: 100%;
    }
</style>
<div class="div_contain">
    <div bind:this={this_shop_grid} class="ag-theme-quartz div_grid"></div>
    <div bind:this={this_detail_grid} class="ag-theme-quartz div_grid"></div>
</div>
<script>
    import {onMount} from "svelte";

    import * as agGrid from "ag-grid-community";
    import "ag-grid-community/styles/ag-grid.css";
    import "ag-grid-community/styles/ag-theme-quartz.css";

    import {number_formatter} from "../js/common.js";
    import {exec_all, QR_L_SHOP} from "../js/local_db.js";

    let this_shop_grid, shop_grid_api;
    let this_detail_grid, detail_grid_api;

    onMount(async ()=>{
        shop_grid_options_init();

        await get_shop();
    });

    // 거래처정보 조회
    async function get_shop(){
        const result = await DB_L_SHOP();
        shop_grid_api.setGridOption("rowData", result);
    }

    // 거래처 정보 조회
    async function DB_L_SHOP(){
        const param = {
            query: QR_L_SHOP(),
            value: []
        };
        return await exec_all(param);
    }

    // 거래처 목록 그리드
    function shop_grid_options_init(){
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
                headerName: "대표자명",
                field: "CEO_NAME",
                flex:1
            },
            {
                headerName: "미수금",
                field: "TOTAL_SALES_OUTSTANDING",
                flex:1,
                valueFormatter: number_formatter
            },
        ];

        const grid_options = {
            columnDefs: column_defs,
            rowData: null,
            overlayLoadingTemplate: "<div class='grid_loading'></div>",
            overlayNoRowsTemplate: `<span>등록된 거래처가 없습니다.</span>`
        }

        shop_grid_api = agGrid.createGrid(this_shop_grid, grid_options);
    }
</script>