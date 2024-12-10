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
    :global(.product_grid .ag_bg_green){
        background-color: #a9dba9;
    }
</style>
<div class="div_contain">
    <div>할인율 설정</div>
    <div>
        <select bind:value={shop_no} on:change={on_change_shop_no}>
            <option value="">선택</option>
            {#each shop_arr as value}
                <option value={value.SHOP_NO}>{value.SHOP_NAME}</option>
            {/each}
        </select>
        <input type="text" bind:value={dc_percent} class="input_discount" placeholder="할인율"/>
        <button type="button" on:click={()=>{on_click_dc_price_apply("percent")}}>선택적용</button>
        <input type="text" bind:value={dc_price} class="input_discount" placeholder="할인가"/>
        <button type="button" on:click={()=>{on_click_dc_price_apply("price")}}>선택적용</button>
        <button type="button" on:click={on_click_dc_price_save}>변경사항 저장</button>
    </div><div bind:this={this_product_grid} class="ag-theme-quartz div_grid product_grid"></div>

</div>

<script>
    import {onMount} from "svelte";

    import * as agGrid from "ag-grid-community";
    import "ag-grid-community/styles/ag-grid.css";
    import "ag-grid-community/styles/ag-theme-quartz.css";
    import {arr_to_obj, dc_price_calc, g_nvl, number_formatter} from "../js/common.js";
    import {
        exec_all, exec_transaction,
        QR_L_BRAND, QR_L_PRODUCT_DC, QR_L_SHOP, QR_M_PRODUCT_DC
    } from "../js/local_db.js";

    // 등록된 거래처 수
    let shop_cnt = 0;
    // 총 상품 수량
    let product_cnt = 0;

    let shop_no;
    let dc_percent;
    let dc_price;

    // 거래처 목록
    let shop_arr = [];
    let shop_obj = {};

    // 브랜드 목록
    let brand_arr = [];
    let brand_obj = {};

    let this_product_grid, product_grid_api;

    onMount(async ()=>{
        product_grid_options_init();

        // 거래처정보 가져오기
        await get_shop();

        // 브랜드정보 가져오기
        await get_brand();
    });

    // 거래처 선택시
    async function on_change_shop_no(){
        product_grid_api.setGridOption("loading", true);
        await get_product_dc();
        product_grid_api.setGridOption("loading", false);
    }

    // 선택 적용 클릭시
    function on_click_dc_price_apply(type=""){
        const selected_data = product_grid_api.getSelectedRows();

        if(type === ""){
            return;
        }

        if(type === "percent" && Number(dc_percent) === 0){
            return alert("적용할 할인율을 입력해주세요.");
        }

        if(type === "price" && Number(dc_price) === 0){
            return alert("적용할 할인가를 입력해주세요.");
        }

        // 할인율/할인가 적용 상품 없을때
        if(selected_data.length === 0){
            return alert("상품을 선택해주세요.");
        }

        selected_data.forEach((data)=>{
            if(type === "percent"){
                data.DISCOUNT_PERCENT = Number(g_nvl(dc_percent,0));
            }

            if(type === "price"){
                data.DISCOUNT_PRICE = Number(g_nvl(dc_price,0));
            }

            data.IS_UPDATE = true;
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
                node.data.SHOP_NO = shop_no;
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
        shop_arr = await DB_L_SHOP();
        shop_obj = arr_to_obj(shop_arr, "SHOP_NO");
    }

    // 브랜드정보 가져오기
    async function get_brand(){
        brand_arr = await DB_L_BRAND();
        brand_obj = arr_to_obj(brand_arr, "BRAND_NO");
    }

    // 상품할인정보 가져오기
    async function get_product_dc(){
        // 선택된 거래처 없을때 상품 목록 초기화
        if(shop_no === ""){
            product_grid_api.setGridOption("rowData", []);
            return;
        }

        const param = {
            SHOP_NO: shop_no
        };
        const result = await DB_L_PRODUCT_DC(param);
        product_cnt = result.length;
        product_grid_api.setGridOption("rowData", result);
    }

    // 거래처 정보 조회
    async function DB_L_SHOP(){
        const param = {
            query: QR_L_SHOP(),
            value: []
        };
        return await exec_all(param);
    }

    // 브랜드 조회
    async function DB_L_BRAND(){
        const param = {
            query: QR_L_BRAND(),
            value: []
        };
        return await exec_all(param);
    }

    // 상품할인율 조회
    async function DB_L_PRODUCT_DC(data){
        const param = {
            query: QR_L_PRODUCT_DC(),
            value: [data.SHOP_NO]
        };
        return await exec_all(param);
    }

    // 할인율/할인가 정보 추가
    async function DB_M_PRODUCT_DC(data_arr){
        const param = {
            query: QR_M_PRODUCT_DC(),
            value: []
        };

        // 여러건 한번에 저장할때 매개변수 위치 맞추기
        for(const data of data_arr){
            param.value.push([
                data.SHOP_NO,
                data.BRAND_NO,
                data.PRODUCT_NO,
                data.DISCOUNT_PERCENT,
                data.DISCOUNT_PRICE
            ]);
        }
        return await exec_transaction(param);
    }

    // 상품 목록 그리드
    function product_grid_options_init(){
        const column_defs = [
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
                headerName: "할인판매가",
                field: "DC_PRICE_OUT",
                flex:1,
                valueGetter: (params)=>{
                    params.data.DC_PRICE_OUT = dc_price_calc(params.data);
                    return params.data.DC_PRICE_OUT;
                },
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
            rowSelection: {
                mode: "multiRow"
            },
            rowClassRules: {
                "ag_bg_green": (params)=>{
                    return params.data.IS_UPDATE;
                }
            },
            overlayLoadingTemplate: "<div class='grid_loading'></div>",
            overlayNoRowsTemplate: `<span>조회된 상품이 없습니다.</span>`
        }

        product_grid_api = agGrid.createGrid(this_product_grid, grid_options);
    }
</script>