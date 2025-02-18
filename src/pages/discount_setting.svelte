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
        display: grid;
        grid-template-columns: 264px 1fr;
        grid-template-rows: 200px 1fr;
        height: 100%;
    }
    .shop_list{
        display: flex;
        flex-direction: column;
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
    .main_content{
        height: 100%;
        display: flex;
        flex-direction: column;
    }
    .shop_info{
        display: grid;
        grid-template-columns: 72px auto 72px auto;
        grid-template-rows: 28px 28px;
        flex-shrink: 0;
    }
    .grid_th{
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        border-top: 1px solid rgba(0, 0, 0, 20%);
        border-right: 1px solid rgba(0, 0, 0, 20%);
        background-color: rgba(0, 0, 0, 3%);
    }
    .grid_td{
        display: flex;
        padding: 6px 8px;
        font-size: 13px;
        border-top: 1px solid rgba(0, 0, 0, 20%);
        border-right: 1px solid rgba(0, 0, 0, 20%);
    }
    .dc_set{
        display: grid;
        grid-template-columns: 64px 120px 1fr 80px;
        grid-template-rows: repeat(auto-fit, minmax(0,1fr));
        height: 100%;
        border-top: 1px solid rgba(0, 0, 0, 20%);
        border-right: 1px solid rgba(0, 0, 0, 20%);
        background-color: #f4f7ff;
        flex-grow: 1;
        column-gap: 16px;
    }
    .calc_info{
        justify-content: center !important;
        grid-column: 1 / span 3;
    }
    .final_save{
        grid-row: span 3;
        border-left: 1px solid rgba(0, 0, 0, 20%);
        padding: 0 8px !important;
    }
    .dc_set>div{
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding: 0 0 8px;
        font-size: 14px;
        font-weight: 600;
    }
    .value_box{
        display: flex;
        width: 100%;
        height: 100%;
        align-items: center;
        justify-content: center;
        border: 1px solid rgba(0, 0, 0, 40%);;
        background: #FFF;
        padding: 0 6px;
    }
    .value_box>span{
        font-size: 13px;
        font-weight: 500;
        letter-spacing: -0.6px;
    }
    .input_dc{
        width: 100%;
        height: 100%;
        padding: 4px;
        text-align: right;
        background-color: transparent;
        color: #000000;
        font-size: 16px;
        font-weight: 700;
    }
    .blank{
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: rgba(0, 0, 0, 3%);
    }
    .product_grid{
        display: flex;
        flex-direction: column;
        grid-column: 1 / span 2;
    }
    .grid{
        width: 100%;
        flex-grow: 1;
    }
    :global(.product_grid .ag_bg_green){
        background-color: #a9dba9;
    }
</style>
<div class="div_contain">
    <div class="div_title">할인율 관리</div>
    <div class="content">
        <div class="shop_list">
            <div class="content_header">거래처 목록</div>
            <div bind:this={this_shop_grid} class="grid"></div>
        </div>
        {#if shop_obj.SHOP_NO}
            <div class="main_content">
                <div class="shop_info">
                    <div class="grid_th">거래처명</div>
                    <div class="grid_td">{shop_obj.SHOP_NAME}</div>
                    <div class="grid_th" style="grid-row: span 2;">메모</div>
                    <div class="grid_td" style="grid-row: span 2;">{shop_obj.MEMO}</div>
                    <div class="grid_th">사업자번호</div>
                    <div class="grid_td">{shop_obj.BUSINESS_LICENSE}</div>
                </div>
                <div class="dc_set">
                    <div class="calc_info">※ 할인판매가 = (판매가 * (100 - 할인율) / 100) - 할인가</div>
                    <div class="final_save">
                        <button type="button" on:click={on_click_dc_price_save}>
                            변경사항 저장
                        </button>
                    </div>
                    <div>할인율</div>
                    <div>
                        <div class="value_box">
                            <input type="text" bind:value={dc_percent} class="input_dc"/>
                            <span>%</span>
                        </div>
                    </div>
                    <div style="grid-row: span 2;justify-content:flex-start;">
                        <button type="button"
                                on:click={on_click_dc_price_apply}>
                            선택적용
                        </button>
                    </div>
                    <div>할인가</div>
                    <div>
                        <div class="value_box">
                            <input type="text" bind:value={dc_price} class="input_dc"/>
                            <span>원</span>
                        </div>
                    </div>
                </div>
            </div>
        {:else}
            <div class="blank">거래처를 선택해주세요.</div>
        {/if}
        <div class="product_grid">
            <div class="content_header">상품 목록</div>
            <div bind:this={this_product_grid} class="grid"></div>
        </div>
    </div>
</div>

<script>
    import {onMount} from "svelte";

    import * as agGrid from "ag-grid-community";
    import {arr_to_obj, comma, dc_price_calc, g_nvl, number_formatter} from "../js/common.js";
    import {custom_theme} from "../js/grid_common.js";
    import {
        exec_all, exec_transaction,
        QR_L_BRAND, QR_L_PRODUCT_DC, QR_L_SHOP, QR_M_PRODUCT_DC
    } from "../js/local_db.js";

    // 적용할 할인율
    let dc_percent = "";
    let dc_price = "";

    // 브랜드 목록
    let brand_arr = [];
    let brand_obj = {};

    // 선택된 거래처
    let shop_obj = {};

    let this_shop_grid, shop_grid_api;
    let this_product_grid, product_grid_api;

    $:{
        dc_percent = number_formatter(dc_percent, "");
        dc_price = number_formatter(dc_price, "");
    }

    onMount(async ()=>{
        shop_grid_options_init();
        product_grid_options_init();

        // 거래처정보 가져오기
        await get_shop();

        // 브랜드정보 가져오기
        await get_brand();
    });

    // 선택 적용 클릭시
    function on_click_dc_price_apply(){
        const selected_data = product_grid_api.getSelectedRows();

        if(Number(dc_percent) === 0 && Number(dc_price) === 0){
            return alert("적용할 할인율/할인가를 입력해주세요.");
        }

        // 할인율/할인가 적용 상품 없을때
        if(selected_data.length === 0){
            return alert("상품을 선택해주세요.");
        }

        selected_data.forEach((data)=>{
            // 값이 있을때만 적용
            if(Number(dc_percent) !== 0){
                data.DISCOUNT_PERCENT = Number(g_nvl(dc_percent,0));
                data.IS_UPDATE = true;
            }
            // 값이 있을때만 적용
            if(Number(dc_price) !== 0){
                data.DISCOUNT_PRICE = Number(g_nvl(dc_price,0));
                data.IS_UPDATE = true;
            }
        });

        // 입력값 초기화
        dc_percent = "";
        dc_price = "";
        product_grid_api.redrawRows();
        product_grid_api.deselectAll();
    }

    // 할인 적용한 상품 저장
    async function on_click_dc_price_save(){
        const save_data = [];
        product_grid_api.forEachNode((node)=>{
            if(node.data.IS_UPDATE){
                save_data.push(node.data);
            }
        });

        // 변경된 상품 있는지 체크
        if(save_data.length === 0){
            return alert("변경된 금액이 없습니다.");
        }

        // 추가/수정 저장
        const result = await DB_M_PRODUCT_DC(save_data);

        // DB 저장 오류일때
        if(!result){
            return alert("저장 실패\n재시도 부탁드립니다.");
        }

        alert("저장되었습니다.");
        // 상품 할인 정보 재조회
        await get_product_dc();
    }

    // 거래처정보 가져오기
    async function get_shop(){
        const result = await DB_L_SHOP();
        shop_grid_api.setGridOption("rowData", result);
    }

    // 브랜드정보 가져오기
    async function get_brand(){
        brand_arr = await DB_L_BRAND();
        brand_obj = arr_to_obj(brand_arr, "BRAND_NO");
    }

    // 상품할인정보 가져오기
    async function get_product_dc(){

        // 선택된 거래처 없을때 상품 목록 초기화
        if(shop_obj.SHOP_NO === ""){
            product_grid_api.setGridOption("rowData", []);
            return;
        }

        product_grid_api.setGridOption("loading", true);

        const result = await DB_L_PRODUCT_DC(shop_obj);
        product_grid_api.setGridOption("rowData", result);

        product_grid_api.setGridOption("loading", false);
    }

    // 거래처 정보 조회
    async function DB_L_SHOP(){
        const param = {
            query: QR_L_SHOP()
        };
        return await exec_all(param);
    }

    // 브랜드 조회
    async function DB_L_BRAND(){
        const param = {
            query: QR_L_BRAND()
        };
        return await exec_all(param);
    }

    // 상품할인율 조회
    async function DB_L_PRODUCT_DC(data){
        const param = {
            query: QR_L_PRODUCT_DC(),
            in1: data.SHOP_NO
        };
        return await exec_all(param);
    }

    // 할인율/할인가 정보 추가
    async function DB_M_PRODUCT_DC(data_arr){
        const array_param = [];

        // 여러건 한번에 저장할때 매개변수 위치 맞추기
        for(const data of data_arr){
            const param = {
                query: QR_M_PRODUCT_DC(),
                in1: shop_obj.SHOP_NO,
                in2: data.BRAND_NO,
                in3: data.PRODUCT_NO,
                in4: data.DISCOUNT_PERCENT,
                in5: data.DISCOUNT_PRICE
            }
            array_param.push(param);
        }
        return await exec_transaction(array_param);
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
            headerHeight: 28,
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
                // 거래처 선택시
                shop_obj = event.node.data;
                // 상품 할인 정보 조회
                get_product_dc();
            },
            overlayLoadingTemplate: "<div class='grid_loading'></div>",
            overlayNoRowsTemplate: `<span>등록된 거래처가 없습니다.</span>`
        }

        shop_grid_api = agGrid.createGrid(this_shop_grid, grid_options);
    }

    // 상품 목록 그리드
    function product_grid_options_init(){
        const column_defs = [
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
                width: 220
            },
            {
                headerName: "판매가",
                field: "PRICE_OUT",
                width: 90,
                cellClass: ["text_right"],
                valueFormatter: number_formatter
            },
            {
                headerName: "할인율",
                field: "DISCOUNT_PERCENT",
                width: 70,
                cellClass: ["text_right"],
                valueFormatter: number_formatter
            },
            {
                headerName: "할인가",
                field: "DISCOUNT_PRICE",
                width: 90,
                cellClass: ["text_right"],
                valueFormatter: number_formatter
            },
            {
                headerName: "할인판매가",
                field: "DC_PRICE_OUT",
                width: 90,
                cellClass: ["text_right"],
                valueGetter: (params)=>{
                    params.data.DC_PRICE_OUT = dc_price_calc(params.data);
                    return params.data.DC_PRICE_OUT;
                },
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
            suppressCellFocus: true,
            rowSelection: {
                mode: "multiRow",
                enableClickSelection: true,
                enableSelectionWithoutKeys: true
            },
            selectionColumnDef: {
                width: 30,
            },
            rowClassRules: {
                "ag_bg_green": (params)=>{
                    return params.data.IS_UPDATE;
                }
            },
            onFirstDataRendered(event) {
                product_grid_api.sizeColumnsToFit();
            },
            onGridSizeChanged(event){
                product_grid_api.sizeColumnsToFit();
            },
            overlayLoadingTemplate: "<div class='grid_loading'></div>",
            overlayNoRowsTemplate: `<span>조회된 상품이 없습니다.</span>`
        }

        product_grid_api = agGrid.createGrid(this_product_grid, grid_options);
    }
</script>