<style>
    .div_contain{
        display: flex;
        width: 100%;
        height: 100%;
        gap: 16px;
    }
    .div_left{
        width: 200px;
        height: 100%;
    }
    .div_right{
        flex-grow: 1;
        height: 100%;
    }
    /*그리드 기본 스타일*/
    .div_grid{
        width: 100%;
        height: 100%;
    }
</style>
<div class="div_contain">
    <div class="div_left">
        <div bind:this={this_shop_grid} class="ag-theme-quartz div_grid"></div>
    </div>
    <div class="div_right">
        <div></div>
        <div bind:this={this_product_grid} class="ag-theme-quartz div_grid"></div>
    </div>
</div>

<script>
    // 가맹점 그리드
    import {onMount} from "svelte";

    import * as agGrid from "ag-grid-community";
    import "ag-grid-community/styles/ag-grid.css";
    import "ag-grid-community/styles/ag-theme-quartz.css";
    import {arr_to_obj,number_formatter} from "../js/common.js";
    import {DB_L_BRAND, DB_L_DISCOUNT_PRICE, DB_L_SHOP} from "../js/local_db.js";

    // 등록된 거래처 수
    let shop_cnt = 0;
    // 총 상품 수량
    let product_cnt = 0;

    // 브랜드 목록
    let brand_arr = [];
    let brand_obj = {};

    let this_shop_grid, shop_grid_api;
    let this_product_grid, product_grid_api;

    onMount(async ()=>{
        shop_grid_options_init();
        product_grid_options_init();

        // 거래처정보 가져오기
        await get_shop();

        // 브랜드정보 가져오기
        await get_brand();
    });

    // 거래처정보 가져오기
    async function get_shop(){
        const result = await DB_L_SHOP();
        shop_cnt = result.length;
        shop_grid_api.setGridOption("rowData", result);
    }

    // 브랜드정보 가져오기
    async function get_brand(){
        brand_arr = await DB_L_BRAND();
        brand_obj = arr_to_obj(brand_arr, "BRAND_NO");
    }

    // 상품할인정보 가져오기
    async function get_discount_price(data){
        const result = await DB_L_DISCOUNT_PRICE(data);
        product_cnt = result.length;
        product_grid_api.setGridOption("rowData", result);
    }

    // 거래처 목록 그리드
    function shop_grid_options_init(){
        const column_defs = [
            {
                headerName: "거래처명",
                field: "SHOP_NAME",
                flex:1
            },
            {
                headerName: "메모",
                field: "MEMO",
                flex:1
            },
            {
                headerName: "상태",
                field: "STATUS",
                flex:1,
                cellRenderer: (param)=>{
                    if(param.data === undefined){
                        return "";
                    }
                    return param.value === "1" ? "사용" : "미사용";
                }
            }
        ];

        const grid_options = {
            columnDefs: column_defs,
            rowSelection: {
                mode: "singleRow",
                checkboxes: false,
                enableClickSelection: true
            },
            rowData: null,
            loading: false,
            overlayLoadingTemplate: "<div class='grid_loading'></div>",
            overlayNoRowsTemplate: `<span>등록된 거래처가 없습니다.</span>`,
            onRowSelected(params) {
                if(params.node.data === undefined){
                    return;
                }

                get_discount_price(params.node.data);
            }
        }

        shop_grid_api = agGrid.createGrid(this_shop_grid, grid_options);
    }

    // 상품 목록 그리드
    function product_grid_options_init(){
        const column_defs = [
            {
                headerName: "브랜드",
                field: "BRAND_NO",
                flex:1,
                cellRenderer: (param)=>{
                    if(param.data === undefined){
                        return "";
                    }

                    return brand_obj[param.value]?.BRAND_NAME;
                }
            },
            {
                headerName: "상품명",
                field: "PRODUCT_NAME",
                flex:1
            },
            {
                headerName: "매입가",
                field: "PRICE_IN",
                flex:1,
                valueFormatter: number_formatter
            },
            {
                headerName: "판매가",
                field: "PRICE_OUT",
                flex:1,
                valueFormatter: number_formatter
            },
            {
                headerName: "상태",
                field: "STATUS",
                flex:1,
                cellRenderer: (param)=>{
                    if(param.data === undefined){
                        return "";
                    }
                    return param.value === "1" ? "사용" : "미사용";
                }
            }
        ];

        const grid_options = {
            columnDefs: column_defs,
            rowData: null,
            loading: false,
            overlayLoadingTemplate: "<div class='grid_loading'></div>",
            overlayNoRowsTemplate: `<span>등록된 상품이 없습니다.</span>`
        }

        product_grid_api = agGrid.createGrid(this_product_grid, grid_options);
    }
</script>