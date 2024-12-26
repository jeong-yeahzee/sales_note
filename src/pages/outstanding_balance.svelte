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
        flex-grow: 1;
    }
    .shop_blank{
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 3%);
    }

    /*그리드 기본 스타일*/
    .div_grid{
        width: 50%;
        height: 50%;
    }

    .payment_modal{
        display: grid;
        width: 312px;
        grid-template-columns: 82px 1fr;
        padding: 16px 16px 8px;
        row-gap: 8px;
        column-gap: 4px;
        overflow-y: auto;
        background-color: rgba(0, 0, 0, 3%);
    }
    .payment_modal>div{
        display: flex;
        height: 28px;
        align-items: center;
        gap: 2px;
    }
    .payment_modal .grid_th{
        font-size: 13px;
        font-weight: 400;
    }
    .payment_modal .grid_td input{
        flex-grow: 1;
        width: 100%;
        height: 100%;
        border: 1px solid rgba(0,0,0,40%);
        padding: 4px 8px;
        font-size: 14px;
        font-weight: 500;
    }
    .payment_modal .grid_td input::placeholder{
        font-size: 13px;
        opacity: 60%;
        font-weight: 400;
    }
    .payment_modal .grid_td textarea{
        flex-grow: 1;
        height: 100%;
        border: 1px solid rgba(0,0,0,40%);
        resize: none;
        padding: 8px;
        font-size: 14px;
        font-weight: 500;
    }
    .payment_modal .grid_td select{
        width: auto;
        height: 100%;
        border: 1px solid rgba(0,0,0,40%);
        padding: 4px 8px;
        font-size: 13px;
        font-weight: 500;
    }
    .payment_modal .grid_td input:focus,
    .payment_modal .grid_td textarea:focus,
    .payment_modal .grid_td select:focus{
        background-color: #e3f0ff;
    }
    .payment_modal .outstanding_amount{
        display: flex;
        justify-content: center;
        align-items: center;
        height: 48px;
        gap: 16px;
        font-size: 13px;
        grid-column: 1 / span 2;
        background-color: #FFF;
    }
    .outstanding_amount>b{
        font-size: 17px;
    }
    .payment_modal_footer{
        display: flex;
        width: 100%;
        height: 48px;
        align-items: center;
        justify-content: center;
        gap: 16px;
        background-color: rgba(0, 0, 0, 3%);
    }
    .payment_modal_footer>button{
        height: 32px;
        width: 56px;
        font-size: 14px;
        font-weight: 700;
        border-radius: 2px;
    }
    .payment_modal_footer .save{
        width: 80px;
    }
    .font_blue{
        color: #5588A3;
    }
    .d_none{
        display: none;
    }
</style>
<div class="div_contain">
    <div class="div_title">미수금 관리</div>
    <div class="content">
        <div bind:this={this_shop_grid} class="ag-theme-quartz div_grid"></div>
        <div style="flex-grow: 1;" class:d_none={shop_obj.SHOP_NO === ""}>
            <div>
                {shop_obj.SHOP_NAME}
                <button type="button" on:click={payment_modal.show()}>납부하기</button>
            </div>
            <div bind:this={this_detail_grid} class="ag-theme-quartz div_grid"></div>
        </div>
        <div class="shop_blank" class:d_none={shop_obj.SHOP_NO !== ""}>거래처를 선택해주세요.</div>
    </div>
</div>
<Modal bind:modal={payment_modal}>
    <div slot="header" class="modal_header">
        <span>미수금 납부</span>
        <button type="button" on:click={payment_modal.hide()} class="modal_close_icon">
            <Icon_close/>
        </button>
    </div>
    <div slot="content" class="payment_modal">
        <div class="outstanding_amount">
            <span>현재 미수금</span>
            <b class="font_blue">{comma(shop_obj.TOTAL_SALES_OUTSTANDING)}</b>
        </div>
        <div class="grid_th">납부일자</div>
        <div class="grid_td"><Datepicker_custom bind:date={payment_obj.PAY_DT}/></div>
        <div class="grid_th">현금</div>
        <div class="grid_td"><input type="text" bind:value={payment_obj.CASH_AMOUNT}></div>
        <div class="grid_th">카드</div>
        <div class="grid_td"><input type="text" bind:value={payment_obj.CARD_AMOUNT}></div>
        <div class="grid_th">할인</div>
        <div class="grid_td"><input type="text" bind:value={payment_obj.DISCOUNT_AMOUNT}></div>
        <div class="grid_th">총 납입금액</div>
        <div class="grid_td">{comma(payment_obj.PAYMENT_AMOUNT)}</div>
        <div class="grid_th">납입 후 미수금</div>
        <div class="grid_td">{comma(shop_obj.TOTAL_SALES_OUTSTANDING - (Number(uc(payment_obj.PAYMENT_AMOUNT)) + Number(uc(payment_obj.DISCOUNT_AMOUNT))))}</div>
        <div class="grid_th" style="height: 48px;">메모</div>
        <div class="grid_td" style="height: 48px;">
            <textarea bind:value={payment_obj.MEMO}></textarea>
        </div>
    </div>
    <div slot="footer" class="payment_modal_footer">
        <button type="button" on:click={payment_modal.hide()} class="border_gray">닫기</button>
        <button type="button" on:click={on_click_payment_save} class="save blue">납부하기</button>
    </div>
</Modal>
<script>
    import dayjs from "dayjs";
    import {onMount} from "svelte";

    import * as agGrid from "ag-grid-community";
    import Datepicker_custom from "../../public/assets/component/Datepicker_custom.svelte";
    import Icon_close from "../../public/assets/component/icon/Icon_close.svelte";
    import Modal from "../../public/assets/component/Modal.svelte";

    import {number_formatter, uc, comma} from "../js/common.js";
    import {custom_theme} from "../js/grid_common.js";
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
            theme: custom_theme,
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
            theme: custom_theme,
            columnDefs: column_defs,
            rowData: null,
            loading:false,
            overlayLoadingTemplate: "<div class='grid_loading'></div>",
            overlayNoRowsTemplate: `<span>판매 내역이 없습니다.</span>`,
        }

        detail_grid_api = agGrid.createGrid(this_detail_grid, grid_options);
    }
</script>