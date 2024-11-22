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
        justify-content: space-between;
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
    .div_grid{
        width: 100%;
        height: 100%;
    }
</style>
<div class="div_contain">
    <div style="display: flex;gap: 8px;">
        <div class="div_title" style="flex-grow: 1;">
            <div>상품 관리</div>
            <button type="button" on:click={on_click_add_product}>새 상품추가</button>
        </div>
        <div class="div_title" on:click={on_click_brand_modal} style="gap: 4px;">
            <Icon_setting/>브랜드 관리
        </div>
    </div>

    <div class="div_content">
        <div>
            <button type="button" on:click={()=>{filter_type = ""}}>전체({comma(product_cnt)})</button>
            <button type="button" on:click={()=>{filter_type = "1"}}>판매중</button>
            <button type="button" on:click={()=>{filter_type = "0"}}>판매중단</button>
        </div>
        <div bind:this={this_grid} class="ag-theme-quartz div_grid"></div>
    </div>
</div>

<script>
    import {onMount} from "svelte";

    import * as agGrid from "ag-grid-community";
    import "ag-grid-community/styles/ag-grid.css";
    import "ag-grid-community/styles/ag-theme-quartz.css";
    import Icon_setting from "../../public/assets/component/icon/Icon_setting.svelte";
    import {grid_button_renderer_class} from "../js/grid_class.js";
    import {comma} from "../js/common.js";
    import {DB_L_PRODUCT} from "../js/local_db.js";

    // 조회 타입
    let filter_type = "";
    // 총 상품 수량
    let product_cnt = 0;
    // 상품 그리드
    let this_grid, grid_api;

    onMount(async ()=>{
        grid_options_init();
        const result = await DB_L_PRODUCT();
        product_cnt = result.length;
        grid_api.setGridOption("rowData", result);
    });

    // 브랜드 추가/삭제 모달 오픈
    function on_click_brand_modal(){

    }

    // 추가 버튼 클릭시 > 상품 등록 모달 오픈
    async function on_click_add_product(){

    }

    // 그리드의 정보 수정 버튼 클릭시
    function grid_row_update(data){

    }

    // 가맹점 목록 그리드
    function grid_options_init(){
        const update_btn_renderer_params = {
            inner_html: `<button class="btn_update btn_grid btn_blue">정보수정</button>`,
            add_class: `.btn_update`,
            function_name : grid_row_update,
        };
        const column_defs = [
            {
                flex:1,
                cellRenderer: grid_button_renderer_class,
                cellRendererParams: update_btn_renderer_params
            },
            {
                headerName: "상품명",
                field: "PRODUCT_NAME",
                flex:1
            }
        ];

        const grid_options = {
            columnDefs: column_defs,
            rowData: null,
            overlayLoadingTemplate: "<div class='grid_loading'></div>",
            overlayNoRowsTemplate: `<span>등록된 상품이 없습니다.</span>`
        }

        grid_api = agGrid.createGrid(this_grid, grid_options);
    }
</script>