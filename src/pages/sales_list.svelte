<style>
    .div_contain{
        display: flex;
        height: 100%;
        flex-direction: column;
        padding: 0 16px;
        background-color: #FFFFFF;
        gap: 8px;
    }
    .div_title{
        display: flex;
        flex-shrink: 0;
        height: 48px;
        align-items: center;
        justify-content: space-between;
        font-weight: 600;
        border-bottom: 1px solid rgba(0, 0, 0, 20%);
    }
    .content{
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        gap: 8px;
    }
    .search_area{
        display: flex;
        align-items: center;
        gap: 2px;
    }
    .search_title{
        font-size: 13px;
        font-weight: 700;
        margin: 0 4px;
    }
    .search_btn_area{
        display: flex;
        gap: 2px;
        margin: 0 4px;
    }
    /*그리드 기본 스타일*/
    .div_grid{
        width: 100%;
        height: 100%;
    }
</style>
<div class="div_contain">
    <div class="div_title">판매 목록</div>
    <div class="content">
        <div class="search_area">
            <span class="search_title">판매일자 : </span>
            <Datepicker_custom bind:date={search_obj.START_DT}/>
            <span>~</span>
            <Datepicker_custom bind:date={search_obj.END_DT}/>
            <div class="search_btn_area">
                <button type="button" on:click={()=>{get_sales("prev_month")}}>전월</button>
                <button type="button" on:click={()=>{get_sales("current_month")}}>당월</button>
                <button type="button" on:click={()=>{get_sales("current_week")}}>금주</button>
                <button type="button" on:click={()=>{get_sales()}}>검색</button>
            </div>
        </div>
        <div bind:this={this_grid} class="ag-theme-quartz div_grid"></div>
    </div>
</div>
<script>
    import dayjs from "dayjs";
    import {onMount} from "svelte";

    import * as agGrid from "ag-grid-community";
    import Datepicker_custom from "../../public/assets/component/Datepicker_custom.svelte";
    import {int_formatter, number_formatter} from "../js/common.js";
    import {custom_theme, grid_bottom_sum} from "../js/grid_common.js";
    import {exec_all, QR_L_SALES} from "../js/local_db.js";

    let search_obj = {
        SHOP_NO: null,
        START_DT: dayjs().format("YYYY-MM-DD"),
        END_DT: dayjs().format("YYYY-MM-DD")
    }

    // 조회된 판매건
    let this_grid, grid_api, grid_bottom;

    onMount(async ()=>{
        grid_options_init();

        await get_sales();
    });

    // 판매내역 조회
    async function get_sales(type = ""){

        switch (type) {
            case "prev_month":
                search_obj.START_DT = dayjs().add(-1, "month").startOf("month").format("YYYY-MM-DD");
                search_obj.END_DT = dayjs().add(-1, "month").endOf("month").format("YYYY-MM-DD");
                break;
            case "current_month":
                search_obj.START_DT = dayjs().startOf("month").format("YYYY-MM-DD");
                search_obj.END_DT = dayjs().format("YYYY-MM-DD");
                break;
            case "current_week":
                search_obj.START_DT = dayjs().startOf("week").format("YYYY-MM-DD");
                search_obj.END_DT = dayjs().format("YYYY-MM-DD");
                break;
        }

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
                pinned: "left",
                width:100,
                cellRenderer: (params)=>{
                    return params.node.data.SALES_DT;
                }
            },
            {
                headerName: "거래처명",
                field: "SHOP_NAME",
                width:110
            },
            {
                headerName: "브랜드명",
                field: "BRAND_NAME",
                width:110
            },
            {
                headerName: "상품명",
                field: "PRODUCT_NAME",
                width:110
            },
            {
                headerName: "수량",
                field: "SALES_COUNT",
                cellClass: ["text_right"],
                valueFormatter: int_formatter,
                width:90
            },
            {
                headerName: "판매단가",
                field: "SALES_PRICE_OUT",
                cellClass: ["text_right"],
                valueFormatter: int_formatter,
                width:110
            },
            {
                headerName: "할인율",
                field: "DISCOUNT_PERCENT",
                cellClass: ["text_right"],
                valueFormatter: number_formatter,
                width:90
            },
            {
                headerName: "할인가",
                field: "DISCOUNT_PRICE",
                cellClass: ["text_right"],
                valueFormatter: int_formatter,
                width:110
            },
            {
                headerName: "할인판매단가",
                field: "SALES_DC_PRICE_OUT",
                cellClass: ["text_right"],
                valueFormatter: int_formatter,
                width:110
            },
            {
                headerName: "판매가합계",
                field: "TOTAL_SALES_PRICE_OUT",
                cellClass: ["text_right"],
                valueFormatter: int_formatter,
                width:110
            },
            {
                headerName: "전표번호",
                field: "MASTER_NO",
                width: 50
            },
            {
                headerName: "판매번호",
                field: "SALES_NO",
                width: 50
            },
            {
                headerName: "할인판매가합계",
                field: "TOTAL_SALES_DC_PRICE_OUT",
                cellClass: ["text_right"],
                valueFormatter: int_formatter,
                pinned: "right",
                width:110
            }
        ];

        grid_bottom = [
            {
                SALES_DT: "총합계",
                SALES_COUNT: 0,
                SALES_PRICE_OUT: 0,
                DISCOUNT_PERCENT: 0,
                DISCOUNT_PRICE: 0,
                SALES_DC_PRICE_OUT: 0,
                TOTAL_SALES_PRICE_OUT: 0,
                TOTAL_SALES_DC_PRICE_OUT: 0
            }
        ];

        const grid_options = {
            theme: custom_theme,
            columnDefs: column_defs,
            rowData: null,
            loading: false,
            rowHeight: 32,
            floatingFiltersHeight: 32,
            defaultColDef: {
                filter: "agTextColumnFilter",
                floatingFilter: true,
                suppressFloatingFilterButton: true,
                suppressHeaderFilterButton: true
            },
            rowClassRules : {
                "grid_bottom": (params)=> {
                    return params.node.rowPinned == "bottom";
                }
            },
            overlayLoadingTemplate: "<div class='grid_loading'></div>",
            overlayNoRowsTemplate: `<span>조회된 판매건이 없습니다.</span>`,
            pinnedBottomRowData: grid_bottom,
            onRowDataUpdated(event){
                grid_bottom_sum(grid_api,grid_bottom);
            }
        }

        grid_api = agGrid.createGrid(this_grid, grid_options);
    }
</script>