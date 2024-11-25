<style>
    .div_contain{
        display: flex;
        height: 100%;
        gap: 16px;
    }
    /*왼쪽 블럭(브랜드)*/
    .div_left{
        display: flex;
        flex-direction: column;
        flex-shrink: 0;
        width: 184px;
    }
    .div_left>div{
        display: flex;
        height: 32px;
        align-items: center;
        justify-content: space-between;
        background-color: #FFFFFF;
        padding: 0 16px;
        cursor: pointer;
    }
    .div_left>div:hover{
        background-color: #e1e1e1;
    }
    .div_set_brand{
        gap: 4px;
        height: 48px !important;
        border-bottom: 1px solid #000;
    }
    /*오른쪽 블럭(상품)*/
    .div_right{
        display: flex;
        flex-direction: column;
        gap: 8px;
        background-color: #FFFFFF;
        padding: 16px;
        flex-grow: 1;
    }
    .div_title{
        display: flex;
        flex-shrink: 0;
        height: 48px;
        align-items: center;
        justify-content: space-between;
        background-color: #FFFFFF;
        padding: 0 16px;
        font-weight: 600;
    }

    /*브랜드 모달*/
    .div_modal_header{
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
    .div_brand_modal{
        display: flex;
        padding: 8px;
        width: 800px;
        height: 400px;
        gap: 16px;
    }
    .div_brand{
        display: grid;
        grid-template-rows: 40px 1fr 48px;
        width: 312px;
        flex-shrink: 0;
    }
    .div_brand_add{
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 15px;
        font-weight: 700;
        border: 1px solid #cee5c5;
        background-color: #f5fff1;
        color: #000000;
    }
    .div_brand_add:hover{
        background-color: #a9dba9;
    }
    .div_brand_info{
        display: grid;
        grid-template-columns: 1fr 96px;
        grid-template-rows: 24px 62px 24px 1fr;
        padding: 24px 16px;
        column-gap: 16px;
    }
    .div_brand_info .label{
        font-size: 14px;
        font-weight: 700;
        color: #000;
        margin-bottom: 4px;
    }
    .div_brand_info input,
    .div_brand_info select{
        border: 1px solid #b1b1b1;
        border-radius: 0;
        width: 100%;
        height: 40px;
        font-size: 14px;
        font-weight: 700;
        color: #000;
    }
    .div_brand_info textarea{
        border: 1px solid #b1b1b1;
        border-radius: 0;
        width: 100%;
        height: 80px;
        font-size: 14px;
        font-weight: 700;
        color: #000;
        resize: none;
    }
    .btn_close{
        display: flex;
        width: 32px;
        height: 32px;
        justify-content: center;
        align-items: center;
        gap: 8px;
        border: none;
        background: transparent;
    }

    /*그리드 기본 스타일*/
    .div_grid{
        width: 100%;
        height: 100%;
    }
</style>
<div class="div_contain">
    <div class="div_left">
        <div on:click={on_click_brand_modal} class="div_set_brand">
            브랜드 관리<Icon_setting/>
        </div>
        <div>전체보기</div>
        {#each brand_arr as value}
            <div style="gap: 4px;padding-left: 24px;text-overflow: ellipsis;">
                <Icon_chevron_right/>{value.BRAND_NAME}
            </div>
        {/each}
    </div>

    <div class="div_right">
        <div class="div_title" style="flex-grow: 1;">
            <div>상품 관리</div>
            <button type="button" on:click={on_click_add_product}>새 상품추가</button>
        </div>
        <div>
            <button type="button" on:click={()=>{filter_type = ""}}>전체({comma(product_cnt)})</button>
            <button type="button" on:click={()=>{filter_type = "1"}}>판매중</button>
            <button type="button" on:click={()=>{filter_type = "0"}}>판매중단</button>
        </div>
        <div bind:this={this_product_grid} class="ag-theme-quartz div_grid"></div>
    </div>
</div>

<Modal bind:modal={brand_modal}>
    <div slot="header" class="div_modal_header">
        <span>브랜드 관리</span>
        <button class="btn_close" on:click={brand_modal.hide}>
            <Icon_close/>
        </button>
    </div>
    <div slot="content" class="div_brand_modal">
        <div bind:this={this_brand_grid} class="ag-theme-quartz div_grid"></div>
        <div class="div_brand">
            <div class="div_brand_add">+ 브랜드 추가</div>
            <div class="div_brand_info">
                <div class="label">브랜드명</div>
                <div class="label">상태</div>
                <input type="text" bind:value={brand_obj.BRAND_NAME}>
                <select bind:value={brand_obj.STATUS}>
                    <option value="1">사용</option>
                    <option value="0">미사용</option>
                </select>
                <div class="label" style="grid-column: 1 / span 2;">메모</div>
                <textarea bind:value={brand_obj.MEMO} style="grid-column: 1 / span 2;"></textarea>
                <div><button type="button" on:click={on_click_brand_save} class="btn_save">저장</button></div>
            </div>
        </div>
    </div>
</Modal>

<script>
    import {onMount} from "svelte";

    import * as agGrid from "ag-grid-community";
    import "ag-grid-community/styles/ag-grid.css";
    import "ag-grid-community/styles/ag-theme-quartz.css";
    import Icon_chevron_right from "../../public/assets/component/icon/Icon_chevron_right.svelte";
    import Icon_close from "../../public/assets/component/icon/Icon_close.svelte";
    import Icon_setting from "../../public/assets/component/icon/Icon_setting.svelte";
    import Modal from "../../public/assets/component/Modal.svelte";
    import {grid_button_renderer_class} from "../js/grid_class.js";
    import {comma} from "../js/common.js";
    import {DB_I_BRAND, DB_L_BRAND, DB_L_PRODUCT} from "../js/local_db.js";

    const brand_schema = ()=>({
        BRAND_NAME: "",
        ORDER_NO: "",
        STATUS: "1",
        MEMO: ""
    });

    // 브랜드 목록
    let brand_arr = [];
    // 조회 타입
    let filter_type = "";
    // 총 상품 수량
    let product_cnt = 0;
    // 브랜드 관리 모달
    let brand_modal;
    let brand_obj = brand_schema();
    // 브랜드 그리드
    let this_brand_grid, brand_grid_api;
    // 상품 그리드
    let this_product_grid, product_grid_api;

    onMount(async ()=>{
        product_grid_options_init();
        brand_grid_options_init();

        const result = await DB_L_PRODUCT();
        product_cnt = result.length;
        product_grid_api.setGridOption("rowData", result);

        brand_arr = await DB_L_BRAND();
        brand_grid_api.setGridOption("rowData", brand_arr);
    });

    // 브랜드 추가/삭제 모달 오픈
    function on_click_brand_modal(){
        brand_modal.show();
    }

    // 브랜드 추가/수정/삭제 모달
    async function on_click_brand_save(){
        // 저장시 브랜드명 확인
        if(brand_obj.BRAND_NAME === ""){
            return alert("브랜드명을 입력해주세요");
        }

        const result = await DB_I_BRAND(brand_obj);
        if(result !== 1){
            alert("브랜드 추가에 실패 했습니다.");
        }

        alert("브랜드가 추가되었습니다.");
        // 모달값 초기화
        brand_obj = brand_schema();
        // 브랜드 정보 재조회
        brand_arr = await DB_L_BRAND();
        brand_grid_api.setGridOption("rowData", brand_arr);
    }

    // 추가 버튼 클릭시 > 상품 등록 모달 오픈
    async function on_click_add_product(){

    }

    // 그리드의 정보 수정 버튼 클릭시
    function grid_row_update(data){

    }

    // 상품 목록 그리드
    function product_grid_options_init(){
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
            loading: false,
            overlayLoadingTemplate: "<div class='grid_loading'></div>",
            overlayNoRowsTemplate: `<span>등록된 상품이 없습니다.</span>`
        }

        product_grid_api = agGrid.createGrid(this_product_grid, grid_options);
    }

    // 브랜드 목록 그리드
    function brand_grid_options_init(){
        const column_defs = [
            {
                headerName: "브랜드명",
                field: "BRAND_NAME",
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
                    return param.value === 1 ? "사용" : "미사용";
                }
            }
        ];

        const grid_options = {
            columnDefs: column_defs,
            rowData: null,
            loading: false,
            overlayLoadingTemplate: "<div class='grid_loading'></div>",
            overlayNoRowsTemplate: `<span>등록된 브랜드가 없습니다.</span>`
        }

        brand_grid_api = agGrid.createGrid(this_brand_grid, grid_options);
    }
</script>