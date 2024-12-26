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
        gap: 8px;
        height: 100%;
    }
    .top_block{
        display: flex;
        flex-direction: column;
        height: 152px;
        flex-shrink: 0;
    }
    .shop_list{
        display: flex;
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
        flex-shrink: 0;
    }
    .shop_grid{
        width: 264px;
        flex-shrink: 0;
    }
    .shop_info{
        display: grid;
        grid-template-columns: 72px auto 72px auto;
        border-bottom: 1px solid rgba(0, 0, 0, 20%);
        flex-shrink: 0;
        flex-grow: 1;
    }
    .shop_info>.grid_th{
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        border-top: 1px solid rgba(0, 0, 0, 20%);
        border-right: 1px solid rgba(0, 0, 0, 20%);
        background-color: rgba(0, 0, 0, 3%);
    }
    .shop_info>.grid_td{
        display: flex;
        align-items: center;
        padding: 6px 8px;
        font-size: 13px;
        border-top: 1px solid rgba(0, 0, 0, 20%);
        border-right: 1px solid rgba(0, 0, 0, 20%);
    }
    .center_block{
        display: flex;
        flex-direction: column;
        flex-grow: 1;
    }
    .sales_grid_header{
        display: grid;
        grid-template-columns: 12% 25% 6% 10% 5% 6% 10% 10% 10% 6%;
        border-left: 1px solid rgba(0, 0, 0, 20%);
        border-right: 1px solid rgba(0, 0, 0, 20%);
        border-bottom: 1px solid rgba(0, 0, 0, 20%);
    }
    .sales_grid_search{
        display: grid;
        grid-template-columns: 12% 25% 6% 10% 5% 6% 10% 10% 10% 6%;
        border-left: 1px solid rgba(0, 0, 0, 20%);
        border-right: 1px solid rgba(0, 0, 0, 20%);
        border-bottom: 1px solid rgba(0, 0, 0, 20%);
    }
    .sales_grid_content{
        display: grid;
        grid-template-columns: 12% 25% 6% 10% 5% 6% 10% 10% 10% 6%;
        height: 100%;
        overflow-y: auto;
        border-bottom: 1px solid rgba(0, 0, 0, 20%);
        border-left: 1px solid rgba(0, 0, 0, 20%);
        border-right: 1px solid rgba(0, 0, 0, 20%);
    }
    .sales_grid_bottom{
        display: grid;
        grid-template-columns: 12% 25% 6% 10% 5% 6% 10% 10% 10% 6%;
        height: 32px;
        border-bottom: 1px solid rgba(0, 0, 0, 20%);
        border-left: 1px solid rgba(0, 0, 0, 20%);
        border-right: 1px solid rgba(0, 0, 0, 20%);
    }
    .center_block .grid_th{
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        border-top: 1px solid rgba(0, 0, 0, 20%);
        border-right: 1px solid rgba(0, 0, 0, 20%);
        background-color: rgba(0, 0, 0, 3%);
        height: 40px;
        padding: 0 4px;
    }
    .center_block .grid_td{
        display: flex;
        align-items: center;
        height: 32px;
        border-right: 1px solid rgba(0, 0, 0, 20%);
        padding: 0 4px;
        font-size: 13px;
    }
    .sales_grid_content .grid_td{
        height: 28px;
        border-bottom: 1px solid rgba(0, 0, 0, 20%);
        background-color: #e3f0ff;
    }
    .center_block .grid_th:nth-child(10n),
    .center_block .grid_td:nth-child(10n){
        border-right: none;
    }
    .shop_blank{
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 3%);
    }
    .product_blank{
        grid-column: 1 / span 10;
        align-items: center;
        display: flex;
        justify-content: center;
    }
    .text_right{
        justify-content: flex-end;
    }
    .edit_input{
        background-color: #FFEB60 !important;
    }
    .center_block input{
        width: 100%;
        height: 100%;
        background-color: transparent;
        text-align: right;
    }
    .btn_add,
    .btn_delete{
        display: flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        padding: 0;
        border-radius: 4px;
    }
    .sales_grid_search :global(.search_input){
        background-color: transparent;
    }
    .bottom_block{
        display: flex;
        align-items: center;
        justify-content: center;
        height: 48px;
        margin-bottom: 8px;
    }
    .bottom_block>button{
        width: 80px;
        height: 40px;
        font-size: 14px;
        font-weight: 700;
    }
</style>
<div class="div_contain">
    <div class="div_title">판매 입력</div>
    <div class="content">
        <div class="top_block">
            <div class="content_header">거래처 선택</div>
            <div class="shop_list">
                <div bind:this={this_shop_grid} class="shop_grid"></div>
                {#if shop_obj.SHOP_NO}
                    <div class="shop_info">
                        <div class="grid_th">거래처명</div>
                        <div class="grid_td">{shop_obj.SHOP_NAME}</div>
                        <div class="grid_th" style="grid-row: span 2;">메모</div>
                        <div class="grid_td" style="grid-row: span 2;">{shop_obj.MEMO}</div>
                        <div class="grid_th">사업자번호</div>
                        <div class="grid_td">{shop_obj.BUSINESS_LICENSE}</div>
                        <div class="grid_th">전화번호</div>
                        <div class="grid_td">{shop_obj.TEL}</div>
                        <div class="grid_th">미수금</div>
                        <div class="grid_td">{comma(shop_obj.TOTAL_SALES_OUTSTANDING)}</div>
                    </div>
                {:else}
                    <div class="shop_blank">거래처를 선택해주세요.</div>
                {/if}
            </div>
        </div>
        {#if shop_obj.SHOP_NO}
            <div class="center_block">
                <div class="content_header">판매 입력</div>
                <div class="sales_grid_header">
                    <div class="grid_th">브랜드명</div>
                    <div class="grid_th">상품명</div>
                    <div class="grid_th">수량</div>
                    <div class="grid_th">판매단가</div>
                    <div class="grid_th">할인율</div>
                    <div class="grid_th">할인가</div>
                    <div class="grid_th">할인판매단가</div>
                    <div class="grid_th">판매가합계</div>
                    <div class="grid_th">할인판매가합계</div>
                    <div class="grid_th" style="justify-content: flex-start;">
                        <button type="button" on:click={on_click_sales_init} class="btn_delete orange">
                            <Icon_trash/>
                        </button>
                    </div>
                </div>
                <div class="sales_grid_search">
                    <div class="grid_td">{product_obj.BRAND_NAME}</div>
                    <div class="grid_td edit_input">
                        <Autocomplete
                                bind:autocomplete={autocomplete}
                                bind:value={product_obj.PRODUCT_NAME}
                                bind:data={autocomplete_data}
                                on:blur={on_blur_autocomplete}
                                on:keyup={on_keyup_autocomplete}
                                on:select={on_select_autocomplete}
                                class="search_input"
                                placeholder="상품명 검색">
                            <div class="data" slot="data">
                                {#each autocomplete_data as data}
                                    <div class="option" data-type="option" data-value={data.PRODUCT_NO}>
                                        [{g_nvl(data.BRAND_NAME, "선택 없음")}]
                                        <span style="font-weight: 700;margin-right: 2px;">
                                                {data.PRODUCT_NAME}
                                        </span>
                                    </div>
                                {/each}
                            </div>
                        </Autocomplete>
                    </div>
                    <div class="grid_td text_right edit_input">
                        <input type="text" bind:this={this_sales_count}
                               bind:value={product_obj.SALES_COUNT}
                               on:keydown={on_keydown_sales_count}>
                    </div>
                    <div class="grid_td text_right">{comma(product_obj.SALES_PRICE_OUT)}</div>
                    <div class="grid_td text_right">{product_obj.DISCOUNT_PERCENT}</div>
                    <div class="grid_td text_right">{comma(product_obj.DISCOUNT_PRICE)}</div>
                    <div class="grid_td text_right">{comma(product_obj.SALES_DC_PRICE_OUT)}</div>
                    <div class="grid_td text_right">{comma(product_obj.TOTAL_SALES_PRICE_OUT)}</div>
                    <div class="grid_td text_right">{comma(product_obj.TOTAL_SALES_DC_PRICE_OUT)}</div>
                    <div class="grid_td">
                        <button type="button"
                                on:click={on_click_product_add}
                                class="btn_add green">
                            <Icon_plus/>
                        </button>
                    </div>
                </div>
                <div class="sales_grid_content">
                    {#if sales_arr.length === 0}
                        <div class="product_blank">입력된 판매상품이 없습니다.</div>
                    {:else}
                        {#each sales_arr as data, index}
                            <div class="grid_td">{data.BRAND_NAME}</div>
                            <div class="grid_td">{data.PRODUCT_NAME}</div>
                            <div class="grid_td text_right edit_input">
                                <input type="text" bind:value={data.SALES_COUNT}>
                            </div>
                            <div class="grid_td text_right">{comma(data.SALES_PRICE_OUT)}</div>
                            <div class="grid_td text_right">{data.DISCOUNT_PERCENT}</div>
                            <div class="grid_td text_right">{comma(data.DISCOUNT_PRICE)}</div>
                            <div class="grid_td text_right">{comma(data.SALES_DC_PRICE_OUT)}</div>
                            <div class="grid_td text_right">{comma(data.TOTAL_SALES_PRICE_OUT)}</div>
                            <div class="grid_td text_right">{comma(data.TOTAL_SALES_DC_PRICE_OUT)}</div>
                            <div class="grid_td">
                                <button type="button"
                                        on:click={()=>{on_click_product_delete(index)}}
                                        class="btn_delete red">
                                    <Icon_delete/>
                                </button>
                            </div>
                        {/each}
                    {/if}
                </div>
                <div class="sales_grid_bottom">
                    <div class="grid_td" style="grid-column: 1 /span 2;gap: 8px;">
                        <span>판매일자</span>
                        <Datepicker_custom bind:date={sales_date}/>
                    </div>
                    <div class="grid_td text_right" style="font-weight: 700;">
                        {comma(total_sales_count)}
                    </div>
                    <div class="grid_td" style="grid-column: 4 /span 5;"></div>
                    <div class="grid_td text_right" style="font-weight: 700;">
                        {comma(total_sales_amount)}
                    </div>
                </div>
            </div>
            <div class="bottom_block">
                <button type="button"
                        on:click={on_click_create_sales}
                        disabled={total_sales_count === 0}>
                    판매 추가
                </button>
            </div>
        {:else}
            <div class="shop_blank">거래처를 선택해주세요.</div>
        {/if}
    </div>

</div>
<script>
    import dayjs from "dayjs";
    import {onMount} from "svelte";

    import * as agGrid from "ag-grid-community";
    import Autocomplete from "../../public/assets/component/Autocomplete.svelte";
    import Datepicker_custom from "../../public/assets/component/Datepicker_custom.svelte";
    import Icon_delete from "../../public/assets/component/icon/Icon_delete.svelte";
    import Icon_plus from "../../public/assets/component/icon/Icon_plus.svelte";
    import Icon_trash from "../../public/assets/component/icon/Icon_trash.svelte";
    import { dc_price_calc, set_value_obj, comma, debounce_exec, g_nvl} from "../js/common.js";
    import {custom_theme} from "../js/grid_common.js";
    import {
        exec_all, exec_transaction, QR_I_SALES,
        QR_L_SHOP,
        QR_S_PRODUCT_DC_PRICE, QR_S_SALES_MASTER_NO
    } from "../js/local_db.js";

    const shop_schema = ()=>({
        SHOP_NO: null,
        SHOP_NAME: "",
        BUSINESS_LICENSE: "",
        CEO_NAME: "",
        TEL: "",
        MOBILE: "",
        EMAIL: "",
        ADDRESS1: "",
        ADDRESS2: "",
        ZIPCODE: "",
        MEMO: "",
        STATUS: ""
    });

    const product_schema = ()=>({
        BRAND_NO: null,
        BRAND_NAME: "",
        PRODUCT_NO: "",
        PRODUCT_NAME: "",
        DISCOUNT_PERCENT: "",
        DISCOUNT_PRICE: "",
        SALES_PRICE_OUT: "",
        SALES_DC_PRICE_OUT: "",
        TOTAL_SALES_PRICE_OUT: "",
        TOTAL_SALES_DC_PRICE_OUT: "",
        SALES_COUNT: "",
        STATUS: ""
    });

    const sales_schema = ()=>({
        BRAND_NO: "",
        BRAND_NAME: "",
        PRODUCT_NO: "",
        PRODUCT_NAME: "",
        SALES_COUNT: "",
        DISCOUNT_PERCENT: "",
        DISCOUNT_PRICE: "",
        SALES_PRICE_OUT: "",
        SALES_DC_PRICE_OUT: "",
        TOTAL_SALES_PRICE_OUT: "",
        TOTAL_SALES_DC_PRICE_OUT: ""
    });

    // 거래처 목록
    let shop_obj = shop_schema();

    let autocomplete;
    let autocomplete_data = [];

    // 검색한 상품정보
    let product_obj = product_schema();
    // 수량 input
    let this_sales_count;
    let sales_arr = [];
    // 판매일자
    let sales_date = dayjs().format("YYYY-MM-DD");
    // 총 판매금액
    let total_sales_amount = 0;
    // 총 판매 수량
    let total_sales_count = 0;

    let this_shop_grid, shop_grid_api;

    $:{
        // 할인판매단가
        product_obj.SALES_DC_PRICE_OUT = dc_price_calc(product_obj);
        // 판매가합계
        product_obj.TOTAL_SALES_PRICE_OUT = Number(product_obj.SALES_PRICE_OUT)*Number(product_obj.SALES_COUNT);
        // 할인판매가합계
        product_obj.TOTAL_SALES_DC_PRICE_OUT = Number(product_obj.SALES_DC_PRICE_OUT)*Number(product_obj.SALES_COUNT);
    }
    $:{
        for(const data of sales_arr){
            // 판매가합계
            data.TOTAL_SALES_PRICE_OUT = Number(data.SALES_PRICE_OUT)*Number(data.SALES_COUNT);
            // 할인판매가합계
            data.TOTAL_SALES_DC_PRICE_OUT = Number(data.SALES_DC_PRICE_OUT)*Number(data.SALES_COUNT);
        }

        // 총 판매금액
        total_sales_amount = sales_arr.reduce((sum, item)=>{return sum + Number(item.TOTAL_SALES_DC_PRICE_OUT)}, 0);
        // 총 판매 수량
        total_sales_count = sales_arr.reduce((sum, item)=>{return sum + Number(item.SALES_COUNT)}, 0);
    }

    onMount(async ()=>{
        shop_grid_options_init();

        // 거래처정보 조회
        await get_shop();
    });

    // 상품검색 오토컴플릿 벗어날때
    function on_blur_autocomplete(){
        // 목록 초기화
        autocomplete_data = [];
    }

    // 상품검색 오토컴플릿 입력할때
    function on_keyup_autocomplete(e){
        // 방향키 입력시 실행 안함 ( enter 제외 )
        if(e.detail.keyCode === 38 || e.detail.keyCode === 40 || e.detail.keyCode === 13){
            return;
        }

        if(product_obj.PRODUCT_NAME.length > 1){
            debounce_exec(async ()=>{
                autocomplete_data = await DB_S_PRODUCT_DC_PRICE();
            }, 200);
        }else{
            autocomplete_data = [];
        }
    }

    // 상품검색 오토컴플릿 값 선택할때
    function on_select_autocomplete(e){

        // 선택값 없을때
        if(e.detail === -1){
            return;
        }

        const product = autocomplete_data[e.detail];

        autocomplete_data = [];

        product_obj = set_value_obj(product_obj, product);
        product_obj.SALES_COUNT = 1;
        this_sales_count.focus();
    }

    // 상품 추가시 수량 입력칸
    function on_keydown_sales_count(e){
        if(e.keyCode === 13){
            on_click_product_add();
        }
    }

    // 검색한 상품 추가
    async function on_click_product_add(){

        if(product_obj.PRODUCT_NO === ""){
            return alert("선택된 상품이 없습니다.");
        }

        if(Number(product_obj.SALES_COUNT) === 0){
            return alert("수량을 입력해주세요.");
        }

        if(product_obj.STATUS !== "1"){
            return confirm("판매중단 상품입니다.\n그래도 추가하시겠습니까?", confirm_accepted);
        }

        confirm_accepted();


        function confirm_accepted(){
            let is_add = true;

            for(const data of sales_arr){
                const condition1 = (data.BRAND_NO === product_obj.BRAND_NO);
                const condition2 = (data.PRODUCT_NO === product_obj.PRODUCT_NO);
                const condition3 = (data.SALES_DC_PRICE_OUT === product_obj.SALES_DC_PRICE_OUT);

                // 3가지 조건 모두 충족시 카운드 수량만 업데이트
                if(condition1 && condition2 && condition3){
                    data.SALES_COUNT = Number(data.SALES_COUNT) + Number(product_obj.SALES_COUNT);
                    // 업데이트 완료시 새로운 판매 추가 안함
                    is_add = false;
                }
            }

            // 기존 판매와 동일한 판매건이 아니라면 추가
            if(is_add){
                // 판매건에 상품 추가
                sales_arr.push(product_obj);
            }

            // 검색한 상품 초기화
            product_obj = product_schema();

            sales_arr = sales_arr;

            // 모든 작업 끝나면 상품명 검색으로 focus
            autocomplete.focus();
        }
    }

    // 추가한 판매상품 삭제
    function on_click_product_delete(index){
        sales_arr.splice(index, 1);
        sales_arr = sales_arr;
    }

    // 추가한 판매상품 전체 삭제
    function on_click_sales_init(){
        confirm("입력한 정보가 전부 삭제됩니다.\n전부 삭제하시겠습니까?", confirm_accepted);

        function confirm_accepted(){
            sales_arr = [];
        }
    }

    // 거래 저장
    async function on_click_create_sales(){
        if(shop_obj.SHOP_NO === ""){
            return alert("선택된 거래처가 없습니다.");
        }

        if(total_sales_count === 0){
            return alert("추가된 판매 상품이 없습니다.");
        }

        const result = await DB_I_SALES(sales_arr);
        // DB 저장 오류일때
        if(!result){
            return alert("저장 실패\n재시도 부탁드립니다.");
        }

        alert("저장되었습니다.");
        // 판매 입력 정보 초기화
        grid_api.setGridOption("rowData", []);
    }

    // 거래처정보 가져오기
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

    // 상품 할인 가격정보 조회
    async function DB_S_PRODUCT_DC_PRICE(){
        const param = {
            query: QR_S_PRODUCT_DC_PRICE("text"),
            value: [shop_obj.SHOP_NO, `%${product_obj.PRODUCT_NAME}%`]
        };
        return await exec_all(param);
    }

    // 판매 마스터번호 조회
    async function DB_S_SALES_MASTER_NO(){
        const param = {
            query: QR_S_SALES_MASTER_NO(),
            value: []
        }

        const result = await exec_all(param);
        return result[0].MASTER_NO;
    }

    // 판매등록
    async function DB_I_SALES(data_arr){
        const param = {
            query: QR_I_SALES(),
            value: []
        };

        // 판매 묶어주는 master_no 조회
        const master_no = await DB_S_SALES_MASTER_NO();

        // 여러건 한번에 저장할때 매개변수 위치 맞추기
        for(const data of data_arr){
            const sales_type = "1"; // 1:판매, 2:반품
            param.value.push([
                master_no,
                shop_obj.SHOP_NO,
                shop_obj.SHOP_NAME,
                data.BRAND_NO,
                data.BRAND_NAME,
                data.PRODUCT_NO,
                data.PRODUCT_NAME,
                data.SALES_COUNT,
                data.DISCOUNT_PERCENT,
                data.DISCOUNT_PRICE,
                data.SALES_PRICE_OUT,
                data.SALES_DC_PRICE_OUT,
                data.TOTAL_SALES_PRICE_OUT,
                data.TOTAL_SALES_DC_PRICE_OUT,
                sales_type,
                sales_date
            ]);
        }

        return await exec_transaction(param);
    }

    // 거래처 목록 그리드
    function shop_grid_options_init(){
        const column_defs = [
            {
                headerName: "거래처명 ( 사업자번호 )",
                field: "SEARCH_DATA",
                valueFormatter: (param)=>{
                    if(param.data === undefined){
                        return "";
                    }

                    param.data.SEARCH_DATA = `${param.data.SHOP_NAME}( ${param.data.BUSINESS_LICENSE} )`;
                    return param.data.SEARCH_DATA;
                }

            }
        ];

        const grid_options = {
            theme: custom_theme,
            columnDefs: column_defs,
            rowData: null,
            loading: false,
            headerHeight: 0,
            floatingFiltersHeight: 28,
            suppressCellFocus: true,
            rowSelection: {
                mode: "singleRow",
                checkboxes: false,
                enableClickSelection: true
            },
            defaultColDef: {
                filter: true,
                floatingFilter: true,
                suppressFloatingFilterButton: true,
                suppressHeaderFilterButton: true,
                flex: 1
            },
            onFirstDataRendered(event) {
                shop_grid_api.sizeColumnsToFit();
            },
            onGridSizeChanged(event){
                shop_grid_api.sizeColumnsToFit();
            },
            onRowClicked (event) {
                if(event.node.data === undefined){
                    return;
                }

                // 담겨있는 값이 있을때
                if(sales_arr.length > 0){
                    confirm("거래처 변경시 하단에 입력된 판매정보가 삭제됩니다.\n거래처를 변경하시겠습니까?", confirm_accepted);
                    function confirm_accepted(){
                        sales_arr = [];
                        // 거래처 선택시
                        shop_obj = event.node.data;
                    }
                    return;
                }
                // 거래처 선택시
                shop_obj = event.node.data;
            },
            overlayLoadingTemplate: "<div class='grid_loading'></div>",
            overlayNoRowsTemplate: `<span>등록된 거래처가 없습니다.</span>`
        }

        shop_grid_api = agGrid.createGrid(this_shop_grid, grid_options);
    }
</script>