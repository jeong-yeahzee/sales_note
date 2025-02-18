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
    .brand_content{
        padding: 0 8px;
    }
    .brand_content>div{
        display: flex;
        width: 100%;
        min-height: 32px;
        align-items: center;
        word-break: break-all;
        padding: 8px 0;
        cursor: pointer;
    }
    .brand_content>div.active{
        background-color: #e3f0ff;
    }
    .brand_set_icon{
        outline: none;
        border: none;
        background-color: transparent;
        padding: 0;
        height: 16px;
        opacity: 50%;
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
        gap: 4px;
        align-items: center;
        height: 32px;
        color: #f1f1f1;
    }
    .state_block>button{
        outline: none;
        border: none;
        background-color: #FFFFFF;
        font-size: 13px;
        line-height: 110%;
        color: #474747;
    }
    .state_block>button.active{
        font-size: 13px;
        font-weight: 700;
        color: #000000;
    }

    /*브랜드 모달*/
    .brand_modal{
        display: flex;
        padding: 8px;
        width: 500px;
        height: 360px;
        gap: 16px;
        background-color: rgba(0, 0, 0, 3%);
    }
    .brand_modal_left{
        display: flex;
        flex-direction: column;
        flex-grow: 1;
    }
    .content_header{
        display: flex;
        align-items: center;
        width: 100%;
        height: 32px;
        font-size: 13px;
        background-color: rgba(0, 0, 0, 50%);
        color: #FFF;
        padding: 0 8px;
        font-weight: 600;
    }
    .brand_modal_right{
        display: grid;
        grid-template-rows: 32px 138px 32px 1fr;
        width: 256px;
        flex-shrink: 0;
        gap: 16px;
    }
    .brand_add{
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .brand_info{
        display: grid;
        grid-template-columns: 56px 1fr;
        grid-auto-rows: min-content;
        row-gap: 8px;
        column-gap: 4px;
    }
    .brand_info>div{
        display: flex;
        height: 28px;
        align-items: center;
        gap: 2px;
    }
    .brand_info .grid_th{
        font-size: 13px;
        font-weight: 400;
    }
    .brand_info .grid_td>input{
        width: 100%;
        height: 100%;
        border: 1px solid rgba(0,0,0,40%);
        padding: 4px 8px;
        font-size: 14px;
        font-weight: 500;
    }
    .brand_info .grid_td>input::placeholder{
        font-size: 13px;
        opacity: 60%;
        font-weight: 400;
    }
    .brand_info .grid_td>textarea{
        width: 100%;
        height: 100%;
        border: 1px solid rgba(0,0,0,40%);
        resize: none;
        padding: 8px;
        font-size: 14px;
        font-weight: 500;
    }
    .brand_info .grid_td>select{
        width: auto;
        height: 100%;
        border: 1px solid rgba(0,0,0,40%);
        padding: 4px 8px;
        font-size: 13px;
        font-weight: 500;
    }
    .brand_info .grid_td input:focus,
    .brand_info .grid_td textarea:focus,
    .brand_info .grid_td select:focus{
        background-color: #e3f0ff;
    }
    .create_dt{
        flex-grow: 1;
        text-align: center;
        line-height: 110%;
        font-size: 12px;
    }
    .brand_save{
        display: flex;
        justify-content: center;
    }
    .brand_delete{
        display: flex;
        justify-content: flex-end;
        align-items: flex-end;
    }
    .brand_save>button,
    .brand_delete>button{
        height: 32px;
    }

    .product_modal{
        display: grid;
        width: 320px;
        grid-template-columns: 72px 1fr;
        padding: 16px 16px 8px;
        row-gap: 8px;
        column-gap: 4px;
        overflow-y: auto;
        background-color: rgba(0, 0, 0, 3%);
    }
    .product_modal>div{
        display: flex;
        height: 28px;
        align-items: center;
        gap: 2px;
    }
    .product_modal .grid_th{
        font-size: 13px;
        font-weight: 400;
    }
    .product_modal .grid_td input{
        flex-grow: 1;
        width: 100%;
        height: 100%;
        border: 1px solid rgba(0,0,0,40%);
        padding: 4px 8px;
        font-size: 14px;
        font-weight: 500;
    }
    .product_modal .grid_td input::placeholder{
        font-size: 13px;
        opacity: 60%;
        font-weight: 400;
    }
    .product_modal .grid_td textarea{
        flex-grow: 1;
        height: 100%;
        border: 1px solid rgba(0,0,0,40%);
        resize: none;
        padding: 8px;
        font-size: 14px;
        font-weight: 500;
    }
    .product_modal .grid_td select{
        width: auto;
        height: 100%;
        border: 1px solid rgba(0,0,0,40%);
        padding: 4px 8px;
        font-size: 13px;
        font-weight: 500;
    }
    .product_modal .grid_td input:focus,
    .product_modal .grid_td textarea:focus,
    .product_modal .grid_td select:focus{
        background-color: #e3f0ff;
    }
    .product_modal_footer{
        display: flex;
        width: 100%;
        height: 48px;
        align-items: center;
        justify-content: center;
        gap: 16px;
        background-color: rgba(0, 0, 0, 3%);
    }
    .product_modal_footer>button{
        height: 32px;
        width: 64px;
        font-size: 14px;
        font-weight: 700;
    }
    .product_modal_footer>.btn_delete{
        position: absolute;
        left: 8px;
        width: 48px;
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
            <div>
                <span>브랜드 목록</span>
                <span class="sub_title">/ {comma(brand_arr.length)}개</span>
            </div>
            <button type="button" on:click={on_click_brand_modal} class="brand_set_icon">
                <Icon_setting/>
            </button>
        </div>
        <div class="brand_content">
            <div on:click={()=>{filter_obj.BRAND_NO = "";}}
                 class:active={filter_obj.BRAND_NO === ""}>
                {#if filter_obj.BRAND_NO === ""}<Icon_arrow/>{/if}
                <span>전체보기</span>
            </div>
            {#each brand_arr as value}
                <div on:click={()=>{filter_obj.BRAND_NO = value.BRAND_NO;}}
                     class:active={filter_obj.BRAND_NO === value.BRAND_NO}>
                    {#if filter_obj.BRAND_NO === value.BRAND_NO}<Icon_arrow/>{/if}
                    <span>{value.BRAND_NAME}</span>
                </div>
            {/each}
        </div>
    </div>

    <div class="div_right">
        <div class="div_title">
            <div>
                <span>상품 목록</span>
                <span class="sub_title">/ {comma(product_arr.length)}개</span>
            </div>
            <button type="button" on:click={product_modal.show()}>새 상품추가</button>
        </div>
        <div class="state_block">
            <button type="button"
                    on:click={()=>{filter_obj.STATUS = "";}}
                    class:active={filter_obj.STATUS === ""}>
                전체
            </button>
            <span>|</span>
            <button type="button"
                    on:click={()=>{filter_obj.STATUS = "1";}}
                    class:active={filter_obj.STATUS === "1"}>
                판매중
            </button>
            <span>|</span>
            <button type="button"
                    on:click={()=>{filter_obj.STATUS = "0";}}
                    class:active={filter_obj.STATUS === "0"}>
                판매중단
            </button>
        </div>
        <div bind:this={this_product_grid} class="ag-theme-quartz div_grid"></div>
    </div>
</div>

<Modal bind:modal={brand_modal}>
    <div slot="header" class="modal_header">
        <span>브랜드 관리</span>
        <button class="modal_close_icon" on:click={brand_modal.hide}>
            <Icon_close/>
        </button>
    </div>
    <div slot="content" class="brand_modal">
        <div class="brand_modal_left">
            <div class="content_header">브랜드 목록</div>
            <div bind:this={this_brand_grid} class="ag-theme-quartz div_grid"></div>
        </div>
        <div class="brand_modal_right">
            <button type="button" class="brand_add" on:click={on_click_brand_add}>+ 브랜드 추가</button>
            <div class="brand_info">
                <div class="grid_th">브랜드명</div>
                <div class="grid_td">
                    <input type="text" bind:value={brand_modal_obj.BRAND_NAME} placeholder="24자 이하 입력">
                </div>
                <div class="grid_th" style="height: 64px;">메모</div>
                <div class="grid_td" style="height: 64px;">
                    <textarea bind:value={brand_modal_obj.MEMO}></textarea>
                </div>
                <div class="grid_th">상태</div>
                <div class="grid_td">
                    <select bind:value={brand_modal_obj.STATUS}>
                        <option value="1">사용</option>
                        <option value="0">미사용</option>
                    </select>
                    {#if brand_modal_obj.BRAND_NO !== null}
                        <div class="create_dt">브랜드 생성일<br/> {brand_modal_obj.FIRST_CREATE_DT}</div>
                    {/if}
                </div>
            </div>
            <div class="brand_save">
                <button type="button" on:click={on_click_brand_save}>저장</button>
            </div>
            {#if brand_modal_obj.BRAND_NO !== null}
                <div class="brand_delete">
                    <button type="button" on:click={on_click_brand_delete}>삭제</button>
                </div>
            {/if}
        </div>
    </div>
</Modal>
<Modal bind:modal={product_modal}>
    <div slot="header" class="modal_header">
        {#if product_modal_obj.PRODUCT_NO === null}
            상품 추가
        {:else}
            상품 정보 수정
        {/if}
        <button on:click={product_modal.hide()} class="modal_close_icon">
            <Icon_close/>
        </button>
    </div>
    <div slot="content" class="product_modal">
        <div class="grid_th">브랜드</div>
        <div class="grid_td">
            <select bind:value={product_modal_obj.BRAND_NO}>
                <option value={null}>선택</option>
                {#each brand_arr as value}
                    <option value={value.BRAND_NO}>{value.BRAND_NAME}</option>
                {/each}
            </select>
        </div>
        <div class="grid_th">상품명</div>
        <div class="grid_td">
            <input type="text" bind:value={product_modal_obj.PRODUCT_NAME}>
        </div>
        <div class="grid_th">매입가</div>
        <div class="grid_td">
            <input type="text" bind:value={product_modal_obj.PRICE_IN}>
        </div>
        <div class="grid_th">판매가</div>
        <div class="grid_td">
            <input type="text" bind:value={product_modal_obj.PRICE_OUT}>
        </div>
        <div class="grid_th">정렬순서</div>
        <div class="grid_td">
            <input type="text" bind:value={product_modal_obj.ORDER_NO}>
        </div>
        <div class="grid_th" style="height: 62px;">메모</div>
        <div class="grid_td" style="height: 62px;">
            <textarea bind:value={product_modal_obj.MEMO}></textarea>
        </div>
        <div class="grid_th">상태</div>
        <div class="grid_td">
            <select bind:value={product_modal_obj.STATUS}>
                <option value="1">판매중</option>
                <option value="0">판매중단</option>
            </select>
            {#if product_modal_obj.PRODUCT_NO !== null}
                <div class="create_dt">상품 생성일<br/> {product_modal_obj.FIRST_CREATE_DT}</div>
            {/if}
        </div>
    </div>
    <div slot="footer" class="product_modal_footer">
        {#if product_modal_obj.SHOP_NO !== null}
            <button type="button" on:click={on_click_product_delete} class="btn_delete">삭제</button>
        {/if}
        <button type="button" on:click={on_click_product_save}>저장</button>
    </div>
</Modal>

<script>
    import {onMount} from "svelte";

    import * as agGrid from "ag-grid-community";
    import Icon_arrow from "../../public/assets/component/icon/Icon_arrow.svelte";
    import Icon_close from "../../public/assets/component/icon/Icon_close.svelte";
    import Icon_setting from "../../public/assets/component/icon/Icon_setting.svelte";
    import Modal from "../../public/assets/component/Modal.svelte";
    import {custom_theme, grid_button_renderer_class} from "../js/grid_common.js";
    import {byte_check, comma, validate_emojis, number_formatter, arr_to_obj, uc} from "../js/common.js";
    import {
        exec_all,
        exec_transaction,
        QR_L_BRAND,
        QR_L_PRODUCT,
        QR_D_PRODUCT,
        QR_D_BRAND,
        QR_M_BRAND, QR_M_PRODUCT
    } from "../js/local_db.js";

    const brand_schema = ()=>({
        BRAND_NO: null,
        BRAND_NAME: "",
        ORDER_NO: "",
        STATUS: "1",
        MEMO: ""
    });
    const product_schema = ()=>({
        BRAND_NO: null,
        PRODUCT_NO: null,
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
        BRAND_NO: "",
        STATUS: ""
    };
    // 상품 목록
    let product_arr = [];

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

    $:{
        if(product_arr.length > 0){
            let render_arr = product_arr;
            if(filter_obj.BRAND_NO !== ""){
                render_arr = product_arr.filter(data=> data.BRAND_NO === filter_obj.BRAND_NO);
            }
            if(filter_obj.STATUS !== ""){
                render_arr = render_arr.filter(data=> data.STATUS === filter_obj.STATUS);
            }
            product_grid_api.setGridOption("rowData", render_arr);
        }
    }
    $:{
        product_modal_obj.PRICE_IN = number_formatter(product_modal_obj.PRICE_IN);
        product_modal_obj.PRICE_OUT = number_formatter(product_modal_obj.PRICE_OUT);
    }

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
        brand_grid_api.deselectAll();
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
            return alert("메모는 2000byte(약 670자) 이내로 입력가능합니다.");
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
            return alert("메모는 2000byte(약 670자) 이내로 입력가능합니다.");
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
        product_arr = await DB_L_PRODUCT();
    }

    // 그리드의 정보 수정 버튼 클릭시
    function grid_row_update(data){
        product_modal_obj = data;
        product_modal.show();
    }

    // 브랜드 조회
    async function DB_L_BRAND(){
        const param = {
            query: QR_L_BRAND()
        };
        return await exec_all(param);
    }

    // 상품 조회
    async function DB_L_PRODUCT(){
        const param = {
            query: QR_L_PRODUCT()
        };
        return await exec_all(param);
    }

    // 브랜드 추가/수정
    async function DB_M_BRAND(data){
        const param = {
            query: QR_M_BRAND(),
            in1: data.BRAND_NO,
            in2: data.BRAND_NAME,
            in3: data.STATUS,
            in4: data.MEMO
        }
        return await exec_transaction(param);
    }

    // 상품 추가/수정
    async function DB_M_PRODUCT(data){
        const param = {
            query: QR_M_PRODUCT(),
            in1: data.BRAND_NO,
            in2: data.PRODUCT_NO,
            in3: data.PRODUCT_NAME,
            in4: uc(data.PRICE_IN),
            in5: uc(data.PRICE_OUT),
            in6: data.ORDER_NO,
            in7: data.STATUS,
            in8: data.MEMO
        }
        return await exec_transaction(param);
    }

    // 브랜드 삭제
    async function DB_D_BRAND(data){
        const param = {
            query: QR_D_BRAND(),
            in1: data.BRAND_NO
        }
        return await exec_transaction(param);
    }

    // 상품 삭제
    async function DB_D_PRODUCT(data){
        const param = {
            query: QR_D_PRODUCT(),
            in1: data.PRODUCT_NO
        }
        return await exec_transaction(param);
    }

    // 브랜드 목록 그리드
    function brand_grid_options_init(){
        const column_defs = [
            {
                headerName: "브랜드명",
                field: "BRAND_NAME",
                flex:3
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
            theme: custom_theme,
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
            onRowClicked (event) {
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
            inner_html: `<button class="btn_update">수정</button>`,
            add_class: `.btn_update`,
            function_name : grid_row_update,
        };
        const column_defs = [
            {
                cellRenderer: grid_button_renderer_class,
                cellRendererParams: update_btn_renderer_params,
                width: 60,
                filter: false
            },
            {
                headerName: "코드",
                field: "PRODUCT_NO",
                width: 45
            },
            {
                headerName: "브랜드명",
                field: "BRAND_NAME",
                width: 100,
                valueFormatter: (param)=>{
                    if(param.data === undefined){
                        return "";
                    }

                    param.data.BRAND_NAME = brand_obj[param.data.BRAND_NO]?.BRAND_NAME;
                    return param.data.BRAND_NAME;
                }
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
                valueFormatter: number_formatter
            },
            {
                headerName: "판매가",
                field: "PRICE_OUT",
                width: 90,
                cellClass: ["text_right"],
                valueFormatter: number_formatter
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
                valueFormatter: number_formatter
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
        ];

        const grid_options = {
            theme: custom_theme,
            columnDefs: column_defs,
            rowData: null,
            loading: false,
            headerHeight: 32,
            floatingFiltersHeight: 32,
            defaultColDef: {
                filter: true,
                floatingFilter: true,
                suppressFloatingFilterButton: true,
                suppressHeaderFilterButton: true
            },
            onFirstDataRendered(event) {
                product_grid_api.sizeColumnsToFit();
            },
            onGridSizeChanged(event){
                product_grid_api.sizeColumnsToFit();
            },
            overlayLoadingTemplate: "<div class='grid_loading'></div>",
            overlayNoRowsTemplate: `<span>등록된 상품이 없습니다.</span>`
        }

        product_grid_api = agGrid.createGrid(this_product_grid, grid_options);
    }
</script>