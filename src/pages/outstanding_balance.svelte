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
        width: 50%;
        height: 50%;
    }

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
</style>
<div class="div_contain">
    <div bind:this={this_shop_grid} class="ag-theme-quartz div_grid"></div>
    <div style="flex-grow: 1;">
        <div>
            {shop_obj.SHOP_NAME}
            <button type="button" on:click={payment_modal.show()}>납부하기</button>
        </div>
        <div bind:this={this_detail_grid} class="ag-theme-quartz div_grid"></div>
    </div>
</div>
<Modal bind:modal={payment_modal}>
    <div slot="header" class="div_modal_header">
        <span>미수금 납부</span>
        <button class="btn_close" on:click={payment_modal.hide}>
            <Icon_close/>
        </button>
    </div>
    <div slot="content" class="div_product_modal">
        <div>현재미수금: {shop_obj.TOTAL_SALES_OUTSTANDING}</div>
        <label>납부일자</label>
        <Datepicker_custom bind:date={payment_obj.PAY_DT}/>
        <label>현금</label>
        <input type="text" bind:value={payment_obj.CASH_AMOUNT}>
        <label>카드</label>
        <input type="text" bind:value={payment_obj.CARD_AMOUNT}>
        <label>할인</label>
        <input type="text" bind:value={payment_obj.DISCOUNT_AMOUNT}>
        <label>총 납입금액</label>
        {comma(payment_obj.PAYMENT_AMOUNT)}
        <label>납입 후 미수금</label>
        {shop_obj.TOTAL_SALES_OUTSTANDING - (Number(uc(payment_obj.PAYMENT_AMOUNT)) + Number(uc(payment_obj.DISCOUNT_AMOUNT)))}
        <label>메모</label>
        <textarea bind:value={payment_obj.MEMO}></textarea>
    </div>
    <div slot="footer">
        <button type="button" on:click={payment_modal.hide()}>닫기</button>
        <button type="button" on:click={on_click_payment_save}>납부하기</button>
    </div>
</Modal>
<script>
    import dayjs from "dayjs";
    import {onMount} from "svelte";

    import * as agGrid from "ag-grid-community";
    import "ag-grid-community/styles/ag-grid.css";
    import "ag-grid-community/styles/ag-theme-quartz.css";
    import Datepicker_custom from "../../public/assets/component/Datepicker_custom.svelte";
    import Icon_close from "../../public/assets/component/icon/Icon_close.svelte";
    import Modal from "../../public/assets/component/Modal.svelte";

    import {number_formatter, uc, comma} from "../js/common.js";
    import {exec_all, exec_transaction, QR_L_SALES_PAYMENT, QR_L_SHOP, QR_M_PAYMENT} from "../js/local_db.js";

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
        STATUS: "",
        TOTAL_SALES_OUTSTANDING: ""
    });
    const payment_schema = ()=>({
        PAY_NO: null,
        PAY_TYPE: "",
        SHOP_NO: "",
        CASH_AMOUNT: "",
        CARD_AMOUNT: "",
        DISCOUNT_AMOUNT: "",
        PAYMENT_AMOUNT: "",
        ADMIN_AMOUNT: "",
        TOTAL_CALC_AMOUNT: "",
        MEMO: "",
        PAY_DT: dayjs().format("YYYY-MM-DD"),
    });

    // 선택한 거래처 정보
    let shop_obj = shop_schema();

    // 납부 모달
    let payment_modal;
    // 납부 정보
    let payment_obj = payment_schema();

    let this_shop_grid, shop_grid_api;
    let this_detail_grid, detail_grid_api;

    $:{
        if(payment_obj.PAY_TYPE === "1"){
            payment_obj.PAYMENT_AMOUNT = Number(uc(payment_obj.CASH_AMOUNT)) + Number(uc(payment_obj.CARD_AMOUNT));
            payment_obj.TOTAL_CALC_AMOUNT = payment_obj.PAYMENT_AMOUNT + Number(uc(payment_obj.DISCOUNT_AMOUNT));
        }else{
            payment_obj.TOTAL_CALC_AMOUNT = payment_obj.ADMIN_AMOUNT;
        }
    }

    onMount(async ()=>{
        shop_grid_options_init();
        detail_grid_options_init();

        await get_shop();

        payment_modal.addEventListener("show", ()=>{
            payment_obj.SHOP_NO = shop_obj.SHOP_NO;
            payment_obj.PAY_TYPE = "1";
        });
        payment_modal.addEventListener("hide", ()=>{
            // 데이터 초기화
            payment_obj = payment_schema();
        });
    });

    // 납부 모달의 납부하기 버튼 클릭시
    async function on_click_payment_save(){
        // 납부 > 납부/할인 금액이 없다면 저장 불가
        if(payment_obj.PAY_TYPE === "1" &&
            (Number(uc(payment_obj.PAYMENT_AMOUNT)) === 0 || Number(uc(payment_modal.DISCOUNT_AMOUNT)) === 0)){
            return alert("납부/할인 금액을 입력해주세요.");
        }

        // 미수금 수정 > 미수금 수정금액이 없다면 저장 불가
        if(payment_obj.PAY_TYPE === "2" && Number(uc(payment_obj.ADMIN_AMOUNT)) === 0){
            return alert("수정 금액을 입력해주세요.");
        }

        // 납부일 체크
        if(payment_obj.PAY_DT === ""){
            return alert("납부일자를 선택해주세요.");
        }

        const result = await DB_M_PAYMENT(payment_obj);

        // DB 저장 오류일때
        if(!result){
            return alert("저장 실패\n재시도 부탁드립니다.");
        }

        alert("저장되었습니다.");
        payment_modal.hide();
        // 선택한 거래처 정보 재조회
        await get_shop();
    }

    // 거래처정보 조회
    async function get_shop(){
        const result = await DB_L_SHOP();
        shop_grid_api.setGridOption("rowData", result);
    }

    // 납부/판매 정보 조회
    async function get_sales_payment(){
        const result = await DB_L_SALES_PAYMENT(shop_obj);
        detail_grid_api.setGridOption("rowData", result);
    }

    // 거래처 정보 조회
    async function DB_L_SHOP(){
        const param = {
            query: QR_L_SHOP(),
            value: []
        };
        return await exec_all(param);
    }

    // 납부/판매 정보 조회
    async function DB_L_SALES_PAYMENT(data){
        const param = {
            query: QR_L_SALES_PAYMENT(),
            value: [data.SHOP_NO,data.SHOP_NO]
        };
        return await exec_all(param);
    }

    // 납부 추가
    async function DB_M_PAYMENT(data){
        const param = {
            query: QR_M_PAYMENT(),
            value: [[
                data.PAY_NO,
                data.PAY_TYPE,
                data.SHOP_NO,
                data.CASH_AMOUNT,
                data.CARD_AMOUNT,
                data.DISCOUNT_AMOUNT,
                data.PAYMENT_AMOUNT,
                data.ADMIN_AMOUNT,
                data.TOTAL_CALC_AMOUNT,
                data.MEMO,
                data.PAY_DT
            ]]
        };
        return await exec_transaction(param);
    }

    // 거래처 목록 그리드
    function shop_grid_options_init(){
        const column_defs = [
            {
                headerName: "거래처코드",
                field: "SHOP_NO",
                flex:1
            },
            {
                headerName: "거래처명",
                field: "SHOP_NAME",
                flex:1
            },
            {
                headerName: "사업자번호",
                field: "BUSINESS_LICENSE",
                flex:1
            },
            {
                headerName: "휴대폰번호",
                field: "MOBILE",
                flex:1
            },
            {
                headerName: "전화번호",
                field: "TEL",
                flex:1
            },
            {
                headerName: "대표자명",
                field: "CEO_NAME",
                flex:1
            },
            {
                headerName: "미수금",
                field: "TOTAL_SALES_OUTSTANDING",
                flex:1,
                valueFormatter: number_formatter
            },
        ];

        const grid_options = {
            columnDefs: column_defs,
            rowSelection: {
                mode: "singleRow",
                checkboxes: false,
                enableClickSelection: true
            },
            rowData: null,
            overlayLoadingTemplate: "<div class='grid_loading'></div>",
            overlayNoRowsTemplate: `<span>등록된 거래처가 없습니다.</span>`,
            onRowSelected(event) {
                if(event.node.data === undefined){
                    return;
                }

                shop_obj = event.node.data;
                get_sales_payment();
            }
        }

        shop_grid_api = agGrid.createGrid(this_shop_grid, grid_options);
    }

    // 판매/납부 그리드
    function detail_grid_options_init(){
        const column_defs = [
            {
                headerName: "일자",
                field: "SHOW_DT",
                flex:1
            },
            {
                headerName: "금액",
                field: "TOTAL_AMOUNT",
                flex:1,
                valueFormatter: number_formatter
            },
            {
                headerName: "",
                field: "SALES_TYPE",
                flex:1
            },
            {
                headerName: "판매/납부",
                field: "TYPE",
                flex:1
            }
        ];

        const grid_options = {
            columnDefs: column_defs,
            rowData: null,
            loading:false,
            overlayLoadingTemplate: "<div class='grid_loading'></div>",
            overlayNoRowsTemplate: `<span>판매 내역이 없습니다.</span>`,
        }

        detail_grid_api = agGrid.createGrid(this_detail_grid, grid_options);
    }
</script>