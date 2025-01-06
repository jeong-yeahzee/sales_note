<style>
    .div_contain{
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
    }
    .block{
        display: flex;
        flex-direction: column;
        padding: 16px;
        background-color: #FFFFFF;
        gap: 16px;
    }
    .block>div{
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .outstanding{
        flex-direction: column;
        gap: 14px;
    }
    .outstanding .title{
        font-size: 13px;
    }
    .outstanding .amount{
        font-size: 24px;
        font-weight: 700;
    }
    .header{
        height: 42px;
        border-bottom: 1px solid rgba(0, 0, 0, 20%);
    }
    .header .amount{
        font-weight: 700;
    }
    .content .title{
        font-size: 14px;
    }
    .content .amount{
        font-size: 14px;
        font-weight: 500;
    }
    .amount::after {
        content: "원";
        margin-left: 2px;
        font-size: 0.8em;
        font-weight: 400;
    }
</style>

<div class="div_contain">
    <div class="block" style="grid-column: 1 / span 2;">
        <div class="outstanding">
            <span class="title">현재 미수</span>
            <span class="amount">{comma(total_data.SUM_OUTSTANDING)}</span>
        </div>
    </div>
    <div class="block">
        <div class="header">
            <span class="title">{dayjs().format("M")}월 매출</span>
            <span class="amount">{comma(total_data.SUM_DC_PRICE_OUT)}</span>
        </div>
        <div class="content">
            <span class="title">표준판매가합계</span>
            <span class="amount">{comma(total_data.SUM_PRICE_OUT)}</span>
        </div>
        <div class="content">
            <span class="title">할인합계</span>
            <span class="amount">{comma(Number(total_data.SUM_PRICE_OUT)-Number(total_data.SUM_DC_PRICE_OUT))}</span>
        </div>
        <div class="content">
            <span class="title">할인판매가합계</span>
            <span class="amount">{comma(total_data.SUM_DC_PRICE_OUT)}</span>
        </div>
    </div>
    <div class="block">
        <div class="header">
            <span class="title">{dayjs().format("M")}월 수금</span>
            <span class="amount">{comma(Number(total_data.SUM_CARD_AMOUNT)+Number(total_data.SUM_CASH_AMOUNT))}</span>
        </div>
        <div class="content">
            <span class="title">카드합계</span>
            <span class="amount">{comma(total_data.SUM_CARD_AMOUNT)}</span>
        </div>
        <div class="content">
            <span class="title">현금합계</span>
            <span class="amount">{comma(total_data.SUM_CASH_AMOUNT)}</span>
        </div>
        <div class="content">
            <span class="title">할인합계</span>
            <span class="amount">{comma(total_data.SUM_DISCOUNT_AMOUNT)}</span>
        </div>
    </div>
</div>

<script>
    import dayjs from "dayjs";
    import {onMount} from "svelte";
    import {comma} from "../js/common.js";
    import {exec_all, QR_S_TOTAL_STATISTIC} from "../js/local_db.js";

    let total_data = {
        SUM_OUTSTANDING: 0,
        SUM_PRICE_OUT: 0,
        SUM_DC_PRICE_OUT: 0,
        SUM_CARD_AMOUNT: 0,
        SUM_CASH_AMOUNT: 0,
        SUM_DISCOUNT_AMOUNT: 0
    };

    onMount(async ()=>{
        total_data = (await DB_S_TOTAL_STATISTIC())[0];
    });

    // 통계 조회
    async function DB_S_TOTAL_STATISTIC(){
        const param = {
            query: QR_S_TOTAL_STATISTIC(),
            value: []
        };
        return await exec_all(param);
    }
</script>