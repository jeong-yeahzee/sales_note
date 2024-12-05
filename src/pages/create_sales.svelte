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
    <div>판매 입력</div>
    <div>
        <div>거래처 정보 검색</div>
        <select on:change={on_change_shop}>
            <option value="">선택</option>
            {#each shop_arr as value}
                <option value={value.SHOP_NO}>{value.SHOP_NAME}</option>
            {/each}
        </select>
    </div>
    {#if shop_obj.SHOP_NO === ""}
        <div>거래처를 선택해주세요.</div>
    {:else}
        <div>{JSON.stringify(shop_obj)}</div>
    {/if}
    <div>
        <div>상품 검색</div>
        <input type="text" bind:value={search_product} on:keyup={on_keyup_search_product}>
        <div>
            <div>{product_obj.BRAND_NAME}</div>
            <div>{product_obj.PRODUCT_NAME}</div>
            <div>{product_obj.SALES_DC_PRICE_OUT}</div>
            <input type="text" bind:value={product_obj.SALES_COUNT}>
            <div>{product_obj.TOTAL_SALES_DC_PRICE_OUT}</div>
            <button type="button" on:click={on_click_product_add}>추가</button>
        </div>
    </div>
    <div bind:this={this_grid} class="ag-theme-quartz div_grid"></div>
    <div>총 판매금액: {total_sales_amount}</div>
    <div>총 판매수량: {total_sales_count}</div>
    <div><button type="button" on:click={on_click_create_sales}>판매 추가</button></div>
</div>
<script>
    import {onMount} from "svelte";

    import * as agGrid from "ag-grid-community";
    import "ag-grid-community/styles/ag-grid.css";
    import "ag-grid-community/styles/ag-theme-quartz.css";
    import { dc_price_calc, number_formatter, set_value_obj} from "../js/common.js";
    import {
        exec_all,
        QUERY_L_SHOP,
        QUERY_S_PRODUCT_DC_PRICE, QUERY_S_SALES_MASTER_NO
    } from "../js/local_db.js";

    const shop_schema = ()=>({
        SHOP_NO: "",
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
        BRAND_NO: "",
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

    // 거래처 목록
    let shop_arr = [];
    let shop_obj = shop_schema();

    // 상품 검색 키워드
    let search_product;
    // 검색한 상품정보
    let product_obj = product_schema();
    // 총 판매금액
    let total_sales_amount = 0;
    // 총 판매 수량
    let total_sales_count = 0;

    let this_grid, grid_api;

    $:{
        // 할인판매단가
        product_obj.SALES_DC_PRICE_OUT = dc_price_calc(product_obj);
        // 판매가합계
        product_obj.TOTAL_SALES_PRICE_OUT = Number(product_obj.SALES_DC_PRICE_OUT)*Number(product_obj.SALES_COUNT);
        // 할인판매가합계
        product_obj.TOTAL_SALES_DC_PRICE_OUT = Number(product_obj.SALES_DC_PRICE_OUT)*Number(product_obj.SALES_COUNT);
    }

    onMount(async ()=>{
        grid_options_init();
        // 거래처정보 조회
        await get_shop();
    });

    // 거래처 선택시
    function on_change_shop(e){
        // 거래처 선택 해제시
        if(e.target.value === ""){
            shop_obj = shop_schema();
            return;
        }

        shop_obj = shop_arr.find((data) => data.SHOP_NO === Number(e.target.value));
    }

    // 상품정보 검색
    async function on_keyup_search_product(e){

        // 엔터키가 아니라면 실행 안함
        if(e.keyCode !== 13){
            return;
        }

        // 거래처 선택 확인
        if(shop_obj.SHOP_NO === ""){
            return alert("판매를 등록할 거래처를 선택해주세요.");
        }

        // 상품 검색
        const result = await DB_S_PRODUCT_DC_PRICE();
        if(result.length === 1){
            product_obj = set_value_obj(product_obj, result[0]);
        }else if(result.length > 1){

        }else{
            alert("존재하지 않는 상품입니다.");
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
            // 판매건에 상품 추가
            grid_api.applyTransaction({ add: [product_obj] });

            total_sales_amount = 0;
            grid_api.forEachNode((node)=> {
                total_sales_amount += node.data.TOTAL_SALES_DC_PRICE_OUT;
                total_sales_count += Number(node.data.SALES_COUNT);
            });
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

        // master_no 조회
        const master_no = await DB_S_MASTER_NO();
        console.log("master_no",master_no);
    }

    // 거래처정보 조회
    async function get_shop(){
        shop_arr = await DB_L_SHOP();
    }

    // 거래처 정보 조회
    async function DB_L_SHOP(){
        const param = {
            query: QUERY_L_SHOP(),
            value: []
        };
        return await exec_all(param);
    }

    // 상품 할인 가격정보 조회
    async function DB_S_PRODUCT_DC_PRICE(){
        const param = {
            query: QUERY_S_PRODUCT_DC_PRICE("text"),
            value: [shop_obj.SHOP_NO, `%${search_product}%`]
        };
        return await exec_all(param);
    }

    // 판매 마스터번호 조회
    async function DB_S_MASTER_NO(){
        const param = {
            query: QUERY_S_SALES_MASTER_NO(),
            value: []
        }
        return await exec_all(param);
    }

    // 판매등록
    async function DB_I_SALES(){

    }

    // 판매 그리드
    function grid_options_init(){
        const column_defs = [
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
                valueFormatter: number_formatter
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
                valueFormatter: number_formatter
            },
            {
                headerName: "할인판매단가",
                field: "SALES_DC_PRICE_OUT",
                flex:1,
                valueFormatter: number_formatter
            },
            {
                headerName: "판매가합계",
                field: "TOTAL_SALES_PRICE_OUT",
                flex:1,
                valueFormatter: number_formatter
            },
            {
                headerName: "할인판매가합계",
                field: "TOTAL_SALES_DC_PRICE_OUT",
                flex:1,
                valueFormatter: number_formatter
            }
        ];

        const grid_options = {
            columnDefs: column_defs,
            rowData: null,
            loading: false,
            overlayLoadingTemplate: "<div class='grid_loading'></div>",
            overlayNoRowsTemplate: `<span>추가한 상품이 없습니다.</span>`
        }

        grid_api = agGrid.createGrid(this_grid, grid_options);
    }
</script>