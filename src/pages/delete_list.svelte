<style>
    .div_contain{
        display: flex;
        height: 100%;
        gap: 16px;
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
    .sub_title{
        font-size: 13px;
        font-weight: 400;
    }

    /*왼쪽 블럭(브랜드)*/
    .div_left{
        display: flex;
        flex-direction: column;
        flex-shrink: 0;
        width: 168px;
        padding: 8px;
        background-color: #FFFFFF;
        gap: 8px;
    }
    .table_content{
        padding: 0 8px;
    }
    .table_content>div{
        display: flex;
        width: 100%;
        min-height: 32px;
        align-items: center;
        word-break: break-all;
        padding: 8px 0;
        cursor: pointer;
    }
    .table_content>div.active{
        background-color: #e3f0ff;
    }
    /*오른쪽 블럭(상품)*/
    .div_right{
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        flex-shrink: 0;
        padding: 8px 16px 0;
        background-color: #FFFFFF;
        gap: 8px;
    }
    .state_block{
        display: flex;
        gap: 8px;
        align-items: center;
        height: 32px;
    }
    .state_block>button{
        outline: none;
        border-radius: 4px;
        border: 1px solid rgba(0,0,0,20%);
        background-color: #FFFFFF;
        font-size: 13px;
        color: #474747;
        height: 100%;
        width: 64px;
    }
    .state_block>.delete{
        background-color: #ff000020;
    }
    .state_block>button:not(:disabled):hover{
        font-size: 13px;
        font-weight: 700;
        color: #000000;
        border: 1px solid rgba(0,0,0,40%);
        background: rgba(0,0,0,5%);
    }
    .state_block>button.delete:not(:disabled):hover{
        background-color: #ff000040;
    }

    /*그리드 기본 스타일*/
    .div_grid{
        width: 100%;
        height: 100%;
    }
</style>
<div class="div_contain">
    <div class="div_left">
        <div class="div_title">
            <div>휴지통 목록</div>
        </div>
        <div class="table_content">
            {#each table_arr as value}
                <div on:click={()=>{current_table = value.key;get_data();}}
                     class:active={current_table === value.key}>
                    {#if current_table === value.key}<Icon_arrow/>{/if}
                    <span>{value.name}</span>
                </div>
            {/each}
        </div>
    </div>

    <div class="div_right">
        <div class="div_title">
            <div>
                <span>삭제된 정보</span>
                <span class="sub_title">/ {comma(data_cnt)}건</span>
            </div>
        </div>
        <div class="state_block">
            <span class="sub_title" style="width: 120px;">
                선택건수 / {comma(selected_cnt)}건
            </span>
            <button type="button"
                    on:click={on_click_permanently_delete}
                    class="delete"
                    disabled={selected_cnt == 0}>
                영구삭제
            </button>
            <button type="button"
                    on:click={on_click_recover}
                    disabled={selected_cnt == 0}>
                복구
            </button>
        </div>
        <div bind:this={this_grid} class="ag-theme-quartz div_grid"></div>
    </div>
</div>

<script>
    import {onMount} from "svelte";

    import * as agGrid from "ag-grid-community";
    import Icon_arrow from "../../public/assets/component/icon/Icon_arrow.svelte";
    import {custom_theme} from "../js/grid_common.js";
    import {comma, g_nvl, int_formatter} from "../js/common.js";
    import {
        exec_all,
        QR_BACKUP_L_SHOP,
        QR_BACKUP_L_BRAND,
        QR_BACKUP_L_PRODUCT,
        QR_BACKUP_L_SALES
    } from "../js/local_db.js";

    const table_arr = [
        {name: "거래처", key: "SHOP"},
        {name: "브랜드", key: "BRAND"},
        {name: "상품", key: "PRODUCT"},
        {name: "판매", key: "SALES"}
    ];
    const column_defs_arr = {
        SHOP: [
            {
                headerName: "코드",
                field: "SHOP_NO",
                width: 45
            },
            {
                headerName: "거래처명",
                field: "SHOP_NAME",
                width: 150
            },
            {
                headerName: "사업자번호",
                field: "BUSINESS_LICENSE",
                width: 120
            },
            {
                headerName: "휴대폰번호",
                field: "MOBILE",
                width: 120
            },
            {
                headerName: "전화번호",
                field: "TEL",
                width: 120
            },
            {
                headerName: "대표자명",
                field: "CEO_NAME",
                width: 70
            },
            {
                headerName: "주소",
                field: "ADDRESS1",
                width: 100,
                valueFormatter: (param)=>{
                    if(param.data === undefined){
                        return "";
                    }

                    return `${g_nvl(param.data.ADDRESS1)} ${g_nvl(param.data.ADDRESS2)}`;
                }
            },
            {
                headerName: "메모",
                field: "MEMO",
                width: 100
            }
        ],
        BRAND: [
            {
                headerName: "브랜드명",
                field: "BRAND_NAME",
                flex:3
            },
            {
                headerName: "메모",
                field: "MEMO",
                width: 100
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
        ],
        PRODUCT: [
            {
                headerName: "코드",
                field: "PRODUCT_NO",
                width: 45
            },
            {
                headerName: "상품명",
                field: "PRODUCT_NAME",
                width: 170
            },
            {
                headerName: "매입가",
                field: "PRICE_IN",
                width: 90,
                cellClass: ["text_right"],
                valueFormatter: int_formatter
            },
            {
                headerName: "판매가",
                field: "PRICE_OUT",
                width: 90,
                cellClass: ["text_right"],
                valueFormatter: int_formatter
            },
            {
                headerName: "메모",
                field: "MEMO",
                width: 80
            },
            {
                headerName: "순서",
                field: "ORDER_NO",
                width: 45,
                valueFormatter: int_formatter
            },
            {
                headerName: "상태",
                field: "STATUS_NAME",
                width: 70,
                valueFormatter: (param)=>{
                    if(param.data === undefined){
                        return "";
                    }

                    param.data.STATUS_NAME = param.data.STATUS === "1" ? "판매중" : "판매중단";
                    return param.data.STATUS_NAME;
                }
            }
        ],
        SALES: [
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
                valueFormatter: int_formatter
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
        ],
        default: [
            {
                headerName: "생성일자",
                field: "FIRST_CREATE_DT",
                width: 100,
                filter: false,
                cellRenderer: (param)=>{
                    if(param.data === undefined){
                        return "";
                    }

                    return param.data.FIRST_CREATE_DT.split(" ")[0];
                }
            },
            {
                headerName: "삭제일자",
                field: "DELETE_DT",
                width: 100,
                filter: false,
                cellRenderer: (param)=>{
                    if(param.data === undefined){
                        return "";
                    }

                    return param.data.DELETE_DT.split(" ")[0];
                }
            }
        ]
    };
    let current_table = "SHOP";
    let data_cnt = 0;
    let selected_cnt = 0;

    // 그리드
    let this_grid, grid_api;

    onMount(()=>{
        grid_options_init();

        get_data();
    });

    // 복구 버튼 클릭시
    function on_click_recover(){
        confirm("선택한 데이터를 복구 하시겠습니까?", confirm_accepted);
        function confirm_accepted(){

        }
    }

    // 영구 삭제 버튼 클릭시
    function on_click_permanently_delete(){
        confirm("선택된 데이터가 영구적으로 삭제됩니다.\n삭제하시겠습니까?", confirm_accepted);
        function confirm_accepted(){

        }
    }

    // 삭제 정보 가져오기
    async function get_data(){
        const result = await DB_BACKUP_L();
        grid_api.setGridOption("columnDefs", [...column_defs_arr[current_table],...column_defs_arr.default]);
        grid_api.setGridOption("rowData", result);
        data_cnt = result.length;
    }

    // 삭제 정보 조회
    async function DB_BACKUP_L(){
        const param = {
            query: ""
        };

        switch (current_table) {
            case "SHOP":
                param.query = QR_BACKUP_L_SHOP();
                break;
            case "BRAND":
                param.query = QR_BACKUP_L_BRAND();
                break;
            case "PRODUCT":
                param.query = QR_BACKUP_L_PRODUCT();
                break;
            case "SALES":
                param.query = QR_BACKUP_L_SALES();
                break;
            default:
                return [];
        }

        return await exec_all(param);
    }

    // 상품 목록 그리드
    function grid_options_init(){
        const column_defs = [];

        const grid_options = {
            theme: custom_theme,
            columnDefs: column_defs,
            rowData: null,
            loading: false,
            headerHeight: 32,
            floatingFiltersHeight: 32,
            rowSelection: {
                mode: "multiRow",
                enableSelectionWithoutKeys: true,
                enableClickSelection: true,
            },
            selectionColumnDef: {
                suppressHeaderMenuButton: false,
                pinned: 'left',
            },
            defaultColDef: {
                filter: true,
                floatingFilter: true,
                suppressFloatingFilterButton: true,
                suppressHeaderFilterButton: true
            },
            overlayLoadingTemplate: "<div class='grid_loading'></div>",
            overlayNoRowsTemplate: `<span>삭제 내역이 없습니다.</span>`,
            onRowSelected () {
                selected_cnt = grid_api.getSelectedRows().length;
            }
        }

        grid_api = agGrid.createGrid(this_grid, grid_options);
    }
</script>