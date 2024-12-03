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
            <button type="button" on:click={product_modal.show}>새 상품추가</button>
        </div>
        <div>
            <button type="button">전체({comma(product_cnt)})</button>
            <button type="button">판매중</button>
            <button type="button">판매중단</button>
        </div>
        <div bind:this={this_product_grid} class="ag-theme-quartz div_grid"></div>
    </div>
</div>

<Modal bind:modal={brand_modal}>
    <div slot="header" class="div_modal_header">
        <span>브랜드</span>
        <button class="btn_close" on:click={brand_modal.hide}>
            <Icon_close/>
        </button>
    </div>
    <div slot="content" class="div_brand_modal">
        <div bind:this={this_brand_grid} class="ag-theme-quartz div_grid"></div>
        <div class="div_brand">
            <div class="div_brand_add" on:click={on_click_brand_add}>+ 브랜드 추가</div>
            <div class="div_brand_info">
                <label>브랜드명</label>
                <label>상태</label>
                <input type="text" bind:value={brand_modal_obj.BRAND_NAME} placeholder="24자 이하 입력">
                <select bind:value={brand_modal_obj.STATUS}>
                    <option value="1">사용</option>
                    <option value="0">미사용</option>
                </select>
                <label style="grid-column: 1 / span 2;">메모</label>
                <textarea bind:value={brand_modal_obj.MEMO} style="grid-column: 1 / span 2;"></textarea>
                <div>
                    <button type="button" on:click={on_click_brand_save} class="btn_save">저장</button>
                    {#if brand_modal_obj.BRAND_NO !== ""}
                        <button type="button" on:click={on_click_brand_delete} class="btn_delete">삭제</button>
                    {/if}
                </div>
            </div>
        </div>
    </div>
</Modal>
<Modal bind:modal={product_modal}>
    <div slot="header" class="div_modal_header">
        <span>상품</span>
        <button class="btn_close" on:click={product_modal.hide}>
            <Icon_close/>
        </button>
    </div>
    <div slot="content" class="div_product_modal">
        <label>브랜드</label>
        <select bind:value={product_modal_obj.BRAND_NO}>
            <option value="">선택</option>
            {#each brand_arr as value}
                <option value={value.BRAND_NO}>{value.BRAND_NAME}</option>
            {/each}
        </select>
        <label>상품명</label>
        <input type="text" bind:value={product_modal_obj.PRODUCT_NAME}>
        <label>매입가</label>
        <input type="text" bind:value={product_modal_obj.PRICE_IN}>
        <label>판매가</label>
        <input type="text" bind:value={product_modal_obj.PRICE_OUT}>
        <label>정렬순서</label>
        <input type="text" bind:value={product_modal_obj.ORDER_NO}>
        <label>상태</label>
        <select bind:value={product_modal_obj.STATUS}>
            <option value="1">판매중</option>
            <option value="0">판매중단</option>
        </select>
        <label>메모</label>
        <textarea bind:value={product_modal_obj.MEMO}></textarea>
        {#if product_modal_obj.PRODUCT_NO === ""}
            <button type="button" on:click={on_click_product_save}>추가</button>
        {:else}
            <button type="button" on:click={on_click_product_save}>수정</button>
            <button type="button" on:click={on_click_product_delete}>삭제</button>
        {/if}
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
    import {byte_check, comma, validate_emojis, number_formatter, arr_to_obj} from "../js/common.js";
    import {
        exec_all,
        exec_transaction,
        QUERY_L_BRAND,
        QUERY_L_PRODUCT,
        QUERY_D_PRODUCT,
        QUERY_D_BRAND,
        QUERY_M_BRAND, QUERY_M_PRODUCT
    } from "../js/local_db.js";

    const brand_schema = ()=>({
        BRAND_NO: "",
        BRAND_NAME: "",
        ORDER_NO: "",
        STATUS: "1",
        MEMO: ""
    });
    const product_schema = ()=>({
        BRAND_NO: "",
        PRODUCT_NO: "",
        PRODUCT_NAME: "",
        PRICE_IN: 0,
        PRICE_OUT: 0,
        ORDER_NO: "",
        STATUS: "1",
        MEMO: ""
    });

    // 브랜드 목록
    let brand_arr = [];
    let brand_obj = {};
    // 조회 타입
    let filter_obj = {
        brand: "",
        type: ""
    };
    // 총 상품 수량
    let product_cnt = 0;
    // 브랜드 관리 모달
    let brand_modal;
    let brand_modal_obj = brand_schema();
    // 상품 관리 모달
    let product_modal;
    let product_modal_obj = product_schema();
    // 브랜드 그리드
    let this_brand_grid, brand_grid_api;
    // 상품 그리드
    let this_product_grid, product_grid_api;

    onMount(async ()=>{
        product_grid_options_init();
        brand_grid_options_init();

        await get_brand();
        await get_product();

        brand_modal.addEventListener("hide", ()=>{
            // 데이터 초기화
            brand_modal_obj = brand_schema();
        });
        product_modal.addEventListener("hide", ()=>{
            // 데이터 초기화
            product_modal_obj = product_schema();
        });
    });

    // 브랜드 추가/수정/삭제 모달 오픈
    function on_click_brand_modal(){
        brand_modal.show();
    }

    // 브랜드 추가 버튼 클릭시
    function on_click_brand_add(){
        // 브랜드 정보 블럭 초기화
        brand_modal_obj = brand_schema();
        brand_grid_api.setGridOption("deselectAll");
    }

    // 브랜드 저장 버튼 클릭시 > 수정/추가
    async function on_click_brand_save(){
        // 저장시 브랜드명 확인
        if(brand_modal_obj.BRAND_NAME === ""){
            return alert("브랜드명을 입력해주세요.");
        }

        // 브랜드명은 최대 24자까지만 입력가능
        if(brand_modal_obj.BRAND_NAME.length > 24){
            return alert("브랜드명은 24자 이하만 입력가능합니다.");
        }

        // 브랜드명에 이모지 입력 불가
        if(validate_emojis(brand_modal_obj.BRAND_NAME)){
            return alert("이모티콘은 입력 불가능합니다.");
        }

        // 메모는 2000byte 이하만 입력가능
        if(byte_check(brand_modal_obj.MEMO) > 2000){
            return alert("메모는 약 670자 이내로 입력가능합니다.");
        }

        // 추가/수정 저장
        const result = await DB_M_BRAND(brand_modal_obj);

        // DB 저장 오류일때
        if(!result){
            return alert("저장 실패\n재시도 부탁드립니다.");
        }


        alert("저장되었습니다.");
        // 모달값 초기화
        brand_modal_obj = brand_schema();
        // 브랜드 정보 재조회
        await get_brand();
    }

    // 상품 모달에서 저장 버튼 클릭시
    async function on_click_product_save(){
        // 상품명 확인
        if(product_modal_obj.PRODUCT_NAME === ""){
            return alert("상품명을 입력해주세요.");
        }

        // 상품명 최대 34자 이하만 입력가능
        if(product_modal_obj.PRODUCT_NAME.length > 34){
            return alert("상품명은 34자 이하만 입력가능합니다.");
        }

        // 상품명에 이모지 입력불가
        if(validate_emojis(product_modal_obj.PRODUCT_NAME)){
            return alert("이모티콘은 입력 불가능합니다.");
        }

        // 메모는 2000byte 이하만 입력가능
        if(byte_check(product_modal_obj.MEMO) > 2000){
            return alert("메모는 약 670자 이내로 입력가능합니다.");
        }

        // 추가/수정 저장
        const result = await DB_M_PRODUCT(product_modal_obj);

        // DB 저장 오류일때
        if(!result){
            return alert("저장 실패\n재시도 부탁드립니다.");
        }

        alert("저장되었습니다.");
        product_modal.hide();
        // 상품정보 재조회
        await get_product();
    }

    // 브랜드 삭제 버튼 클릭시
    function on_click_brand_delete(){
        confirm("브랜드를 삭제하시겠습니까?", confirm_accepted);
        async function confirm_accepted(){
            const result = await DB_D_BRAND(brand_modal_obj);

            // DB 저장 실행일때
            if(!result){
                return alert("삭제 실패\n재시도 부탁드립니다.");
            }

            alert("삭제되었습니다.\n(삭제한 데이터는 휴지통 메뉴에서 복구 가능합니다.)");
            // 모달값 초기화
            brand_modal_obj = brand_schema();
            // 브랜드 정보 재조회
            await get_brand();
        }
    }

    // 상품 모달에서 삭제 버튼 클릭시
    function on_click_product_delete(){
        confirm("상품을 삭제하시겠습니까?", confirm_accepted);
        async function confirm_accepted(){
            const result = await DB_D_PRODUCT(product_modal_obj);

            // DB 저장 실행일때
            if(!result){
                return alert("삭제 실패\n재시도 부탁드립니다.");
            }

            alert("삭제되었습니다.\n(삭제한 데이터는 휴지통 메뉴에서 복구 가능합니다.)");
            // 모달 닫기
            product_modal.hide();
            // 상품 정보 재조회
            await get_product();
        }
    }

    // 브랜드정보 가져오기
    async function get_brand(){
        brand_arr = await DB_L_BRAND();
        brand_obj = arr_to_obj(brand_arr, "BRAND_NO");
        brand_grid_api.setGridOption("rowData", brand_arr);
    }

    // 상품정보 가져오기
    async function get_product(){
        const result = await DB_L_PRODUCT();
        product_cnt = result.length;
        product_grid_api.setGridOption("rowData", result);
    }

    // 그리드의 정보 수정 버튼 클릭시
    function grid_row_update(data){
        product_modal_obj = data;
        product_modal.show();
    }

    // 브랜드 조회
    async function DB_L_BRAND(){
        const param = QUERY_L_BRAND();
        return await exec_all(param);
    }

    // 상품 조회
    async function DB_L_PRODUCT(){
        const param = QUERY_L_PRODUCT();
        return await exec_all(param);
    }

    // 브랜드 추가/수정
    async function DB_M_BRAND(data){
        const param = {
            query: QUERY_M_BRAND(),
            value: [[data.BRAND_NO,data.BRAND_NAME, data.STATUS, data.MEMO]]
        }
        return await exec_transaction(param);
    }

    // 상품 추가/수정
    async function DB_M_PRODUCT(data){
        const param = {
            query: QUERY_M_PRODUCT(),
            value: [[
                    data.BRAND_NO,
                    data.PRODUCT_NO,
                    data.PRODUCT_NAME,
                    data.PRICE_IN,
                    data.PRICE_OUT,
                    data.ORDER_NO,
                    data.STATUS,
                    data.MEMO
                ]]
        }
        return await exec_transaction(param);
    }

    // 브랜드 삭제
    async function DB_D_BRAND(data){
        const param = {
            query: QUERY_D_BRAND(),
            value: [[data.BRAND_NO]]
        }
        return await exec_transaction(param);
    }

    // 상품 삭제
    async function DB_D_PRODUCT(data){
        const param = {
            query: QUERY_D_PRODUCT(),
            value: [[data.PRODUCT_NO]]
        }
        return await exec_transaction(param);
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
            overlayNoRowsTemplate: `<span>등록된 브랜드가 없습니다.</span>`,
            onRowSelected(event) {
                if(event.node.data === undefined){
                    return;
                }
                // 브랜드 선택시 정보 블럭에 보여주기
                brand_modal_obj = event.node.data;
            }
        }

        brand_grid_api = agGrid.createGrid(this_brand_grid, grid_options);
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
                headerName: "메모",
                field: "MEMO",
                flex:1
            },
            {
                headerName: "정렬순서",
                field: "ORDER_NO",
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