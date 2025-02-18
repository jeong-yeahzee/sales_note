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
    <div>
        판매일자:
        <Datepicker_custom bind:date={search_obj.START_DT}/> ~
        <Datepicker_custom bind:date={search_obj.END_DT}/>
        <button type="button" on:click={get_sales}>검색</button>
    </div>
    <div bind:this={this_grid} class="ag-theme-quartz div_grid"></div>
</div>
<script>
    import dayjs from "dayjs";
    import {onMount} from "svelte";

    import * as agGrid from "ag-grid-community";
    import Datepicker_custom from "../../public/assets/component/Datepicker_custom.svelte";
    import {int_formatter, number_formatter} from "../js/common.js";
    import {custom_theme} from "../js/grid_common.js";
    import {exec_all, QR_L_SALES} from "../js/local_db.js";

    let search_obj = {
        SHOP_NO: null,
        START_DT: dayjs().format("YYYY-MM-DD"),
        END_DT: dayjs().format("YYYY-MM-DD")
    }

    // 조회된 판매건
    let this_grid, grid_api;

    onMount(async ()=>{
        grid_options_init();

        await get_sales();
    });

    // 판매내역 조회
    async function get_sales(){
        const result = await DB_L_SALES();
        grid_api.setGridOption("rowData", result);
    }

    // 판매내역 조회
    async function DB_L_SALES(){
        const param = {
            query: QR_L_SALES(),
            in1: search_obj.SHOP_NO,
            in2: search_obj.SHOP_NO,
            in3: search_obj.START_DT,
            in4: search_obj.END_DT
        }
        return await exec_all(param);
    }

    // 판매 그리드
    function grid_options_init(){
        const column_defs = [
            {
                headerName: "판매일",
                field: "SALES_DT",
                flex:1
            },
            {
                headerName: "전표번호",
                field: "MASTER_NO",
                flex:1
            },
            {
                headerName: "판매번호",
                field: "SALES_NO",
                flex:1
            },
            {
                headerName: "거래처번호",
                field: "SHOP_NO",
                flex:1
            },
            {
                headerName: "거래처명",
                field: "SHOP_NAME",
                flex:1
            },
            {
                headerName: "브랜드명",
                field: "BRAND_NAME",
                flex:1
            },
            {
                headerName: "상품명",
                field: "PRODUCT_NAME",
                flex:1
            },
            {
                headerName: "수량",
                field: "SALES_COUNT",
                flex:1
            },
            {
                headerName: "판매단가",
                field: "SALES_PRICE_OUT",
                flex:1,
                valueFormatter: int_formatter
            },
            {
                headerName: "할인율",
                field: "DISCOUNT_PERCENT",
                flex:1,
                valueFormatter: number_formatter
            },
            {
                headerName: "할인가",
                field: "DISCOUNT_PRICE",
                flex:1,
                valueFormatter: int_formatter
            },
            {
                headerName: "할인판매단가",
                field: "SALES_DC_PRICE_OUT",
                flex:1,
                valueFormatter: int_formatter
            },
            {
                headerName: "판매가합계",
                field: "TOTAL_SALES_PRICE_OUT",
                flex:1,
                valueFormatter: int_formatter
            },
            {
                headerName: "할인판매가합계",
                field: "TOTAL_SALES_DC_PRICE_OUT",
                flex:1,
                valueFormatter: int_formatter
            }
        ];

        const grid_options = {
            theme: custom_theme,
            columnDefs: column_defs,
            rowData: null,
            loading: false,
            overlayLoadingTemplate: "<div class='grid_loading'></div>",
            overlayNoRowsTemplate: `<span>조회된 판매건이 없습니다.</span>`
        }

        grid_api = agGrid.createGrid(this_grid, grid_options);
    }
</script>