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
    <div>판매일자: <Datepicker_custom bind:date={sales_date}/></div>
    <div>총 판매금액: {total_sales_amount}</div>
    <div>총 판매수량: {total_sales_count}</div>
    <div><button type="button" on:click={on_click_create_sales}>판매 추가</button></div>
</div>
<script>
    import dayjs from "dayjs";
    import {onMount} from "svelte";

    import * as agGrid from "ag-grid-community";
    import "ag-grid-community/styles/ag-grid.css";
    import "ag-grid-community/styles/ag-theme-quartz.css";
    import Datepicker_custom from "../../public/assets/component/Datepicker_custom.svelte";
    import { dc_price_calc, number_formatter, set_value_obj} from "../js/common.js";
    import {
        exec_all, exec_transaction, QUERY_I_SALES,
        QUERY_L_SHOP,
        QUERY_S_PRODUCT_DC_PRICE, QUERY_S_SALES_MASTER_NO
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

    // 거래처 목록
    let shop_arr = [];
    let shop_obj = shop_schema();

    // 상품 검색 키워드
    let search_product;
    // 검색한 상품정보
    let product_obj = product_schema();
    // 판매일자
    let sales_date = dayjs().format("YYYY-MM-DD");
    // 총 판매금액
    let total_sales_amount = 0;
    // 총 판매 수량
    let total_sales_count = 0;

    // 추가할 판매건
    let this_grid, grid_api;

    $:{
        // 할인판매단가
        product_obj.SALES_DC_PRICE_OUT = dc_price_calc(product_obj);
        // 판매가합계
        product_obj.TOTAL_SALES_PRICE_OUT = Number(product_obj.SALES_PRICE_OUT)*Number(product_obj.SALES_COUNT);
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
            let is_add = true;

            grid_api.forEachNode(node =>{
                const condition1 = (node.data.BRAND_NO === product_obj.BRAND_NO);
                const condition2 = (node.data.PRODUCT_NO === product_obj.PRODUCT_NO);
                const condition3 = (node.data.SALES_DC_PRICE_OUT === product_obj.SALES_DC_PRICE_OUT);

                // 3가지 조건 모두 충족시 카운드 수량만 업데이트
                if(condition1 && condition2 && condition3){
                    node.data.SALES_COUNT = Number(node.data.SALES_COUNT) + Number(product_obj.SALES_COUNT);
                    node.data.TOTAL_SALES_PRICE_OUT = Number(node.data.SALES_PRICE_OUT)*Number(node.data.SALES_COUNT);
                    node.data.TOTAL_SALES_DC_PRICE_OUT = Number(node.data.SALES_DC_PRICE_OUT)*Number(node.data.SALES_COUNT);
                    grid_api.applyTransaction({ update: [node.data]});
                    // 업데이트 완료시 새로운 판매 추가 안함
                    is_add = false;
                }
            });

            // 기존 판매와 동일한 판매건이 아니라면 추가
            if(is_add){
                // 판매건에 상품 추가
                grid_api.applyTransaction({ add: [product_obj] });
            }

            // 총 판매금액 합계 계산
            total_sales_amount = 0;
            total_sales_count = 0;
            grid_api.forEachNode((node)=> {
                total_sales_amount += node.data.TOTAL_SALES_DC_PRICE_OUT;
                total_sales_count += Number(node.data.SALES_COUNT);
            });

            // 검색한 상품 초기화
            product_obj = product_schema();
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
        const insert_data = [];

        // 저장할 데이터 담아주기
        grid_api.forEachNode(node =>{
            insert_data.push({...node.data, ...shop_obj});
        });

        const result = await DB_I_SALES(insert_data);
        // DB 저장 오류일때
        if(!result){
            return alert("저장 실패\n재시도 부탁드립니다.");
        }

        alert("저장되었습니다.");
        // 판매 입력 정보 초기화
        grid_api.setGridOption("rowData", []);
    }

    // 거래처정보 조회
    async function get_shop(){
        shop_arr = await DB_L_SHOP();
    }

    // 판매 입력 정보 초기화
    function init_sales(){
        grid_api.setGridOption("rowData", []);
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
    async function DB_S_SALES_MASTER_NO(){
        const param = {
            query: QUERY_S_SALES_MASTER_NO(),
            value: []
        }

        const result = await exec_all(param);
        return result[0].MASTER_NO;
    }

    // 판매등록
    async function DB_I_SALES(data_arr){
        const param = {
            query: QUERY_I_SALES(),
            value: []
        };

        // 판매 묶어주는 master_no 조회
        const master_no = await DB_S_SALES_MASTER_NO();

        // 여러건 한번에 저장할때 매개변수 위치 맞추기
        for(const data of data_arr){
            const sales_type = "1"; // 1:판매, 2:반품
            param.value.push([
                master_no,
                data.SHOP_NO,
                data.SHOP_NAME,
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