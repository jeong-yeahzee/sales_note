<style>
    .div_contain{
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        gap: 16px;
        background-color: #FFFFFF;
    }
</style>
<div class="div_contain">
    <div>전표 입력</div>
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
    </div>
</div>
<script>

    import {onMount} from "svelte";
    import {
        exec_all,
        QUERY_L_SHOP,
        QUERY_S_PRODUCT_DC_PRICE
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
        PRODUCT_NO: "",
        PRODUCT_NAME: "",
        PRICE_IN: "",
        PRICE_OUT: "",
        ORDER_NO: "",
        STATUS: "",
        MEMO: ""
    });

    // 거래처 목록
    let shop_arr = [];
    let shop_obj = shop_schema();

    // 상품 검색 키워드
    let search_product;
    // 검색한 상품정보
    let product_obj = product_schema();

    onMount(async ()=>{
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

    // 거래처정보 조회
    async function get_shop(){
        shop_arr = await DB_L_SHOP();
    }

    // 상품정보 검색
    async function on_keyup_search_product(e){

        // 엔터키가 아니라면 실행 안함
        if(e.keyCode !== 13){
            return;
        }

        // 상품 검색
        const result = await DB_S_PRODUCT_DC_PRICE();
        debugger
        if(result.length === 1){
            product_obj = result[0];
        }else if(result.length > 1){

        }else{
            alert("존재하지 않는 상품입니다.");
        }
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
</script>