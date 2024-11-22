<style>
    .div_contain{
        display: flex;
        height: 100%;
        flex-direction: column;
        gap: 16px;
    }
    .div_title{
        display: flex;
        flex-shrink: 0;
        height: 48px;
        align-items: center;
        justify-content: space-between;
        background-color: #FFFFFF;
        padding: 0 16px;
    }
    .div_content{
        display: flex;
        flex-direction: column;
        gap: 8px;
        background-color: #FFFFFF;
        padding: 16px;
        flex-grow: 1;
    }
    .div_shop_cnt{
        font-weight: bold;
        letter-spacing: 1px;
    }
    .div_grid{
        width: 100%;
        height: 100%;
    }

    .div_add_title{
        background-color: #5AB65A;
        color: #FFFFFF !important;
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
    .div_modal_footer{
        display: flex;
        width: 100%;
        height: 48px;
        align-items: center;
        justify-content: center;
        gap: 16px;
    }
    .btn_close{
        display: flex;
        width: 32px;
        height: 32px;
        justify-content: center;
        align-items: center;
        gap: 8px;
        border: none;
        background: transparent;
    }

    .div_shop_modal{
        display: grid;
        width: 400px;
        grid-template-columns: 72px 1fr;
        padding: 16px;
        row-gap: 8px;
        column-gap: 4px;
        height: 72vh;
        overflow-y: auto;
    }
    .div_shop_modal>div{
        display: flex;
        height: 32px;
        align-items: center;
    }
    .div_shop_modal .grid_th{
        font-size: 14px;
        font-weight: 400;
        gap: 2px;
    }
    .div_shop_modal .grid_td input{
        width: 100%;
        height: 100%;
        border: 1px solid #949494;
        padding: 4px 8px;
        font-size: 15px;
        font-weight: 700;
    }
    .div_shop_modal .grid_td input::placeholder{
        opacity: 60%;
        font-weight: 600;
    }
    .div_shop_modal .grid_td textarea{
        flex-grow: 1;
        height: 100%;
        border: 1px solid #949494;
        resize: none;
        padding: 8px;
        font-size: 16px;
        font-weight: 700;
    }
    .div_shop_modal .grid_td select{
        width: auto;
        height: 100%;
        border: 1px solid #949494;
        padding: 4px 8px;
        font-size: 15px;
        font-weight: 700;
    }
    .div_shop_modal .div_address{
        flex-direction: column;
        gap: 4px;
        box-sizing: border-box;
        align-items: baseline;
    }
    .div_shop_modal .div_zipcode{
        display: flex;
        height: 100%;
        gap: 4px;
    }
    .div_shop_modal .div_zipcode>input{
        width: 100px;
    }
    .div_zipcode_modal{
        width: 500px;
    }

    .font_red{
        color: red;
    }
</style>

<div class="div_contain">
    <div class="div_title">
        <div>가맹점 관리</div>
        <button type="button" on:click={on_click_add_shop}>추가</button>
    </div>
    <div class="div_content">
        <div class="div_shop_cnt">총 {comma(shop_cnt)}건</div>
        <div bind:this={this_grid} class="ag-theme-quartz div_grid"></div>
    </div>
</div>

<Modal bind:modal={shop_modal}>
    <div slot="header"
         on:click={shop_modal.hide}
         class:div_add_title={modal_type === "insert"} class="div_modal_header">
        {#if modal_type === "insert"}
            거래처 추가
        {:else}
            거래처 정보 수정
        {/if}
        <button type="button" class="btn_close" >
            <Icon_close/>
        </button>
    </div>
    <div slot="content" class="div_shop_modal">
        <div class="grid_th">거래처명<span class="font_red"> *</span></div>
        <div class="grid_td">
            <input type="text" bind:value={shop_obj.SHOP_NAME} placeholder="24자까지 입력가능합니다." maxlength="24">
        </div>
        <div class="grid_th">사업자번호<span class="font_red"> *</span></div>
        <div class="grid_td">
            <input type="text" bind:value={shop_obj.BUSINESS_LICENSE} placeholder="숫자만 입력해주세요.">
        </div>
        <div class="grid_th">대표자명</div>
        <div class="grid_td"><input type="text" bind:value={shop_obj.CEO_NAME}></div>
        <div class="grid_th">전화번호</div>
        <div class="grid_td">
            <input type="text" bind:value={shop_obj.TEL} placeholder="예시) 02-0000-0000">
        </div>
        <div class="grid_th">휴대폰번호</div>
        <div class="grid_td">
            <input type="text" bind:value={shop_obj.MOBILE} placeholder="예시) 010-0000-0000">
        </div>
        <div class="grid_th">이메일</div>
        <div class="grid_td">
            <input type="text" bind:value={shop_obj.EMAIL} placeholder="예시) example@gmail.com">
        </div>
        <div class="grid_th" style="height: 104px">주소</div>
        <div class="grid_td div_address" style="height: 104px;">
            <div class="div_zipcode">
                <input type="text" bind:value={shop_obj.ZIPCODE} disabled>
                <button type="button" on:click={zipcode_modal.show}>주소찾기</button>
            </div>
            <input type="text" bind:value={shop_obj.ADDRESS1}>
            <input type="text" bind:value={shop_obj.ADDRESS2} placeholder="상세주소를 입력해주세요.">
        </div>
        <div class="grid_th" style="height: 72px;">메모</div>
        <div class="grid_td" style="height: 72px;"><textarea type="text" bind:value={shop_obj.MEMO}/></div>
        <div class="grid_th">상태</div>
        <div class="grid_td">
            <select bind:value={shop_obj.STATUS}>
                <option value="1">사용</option>
                <option value="0">미사용</option>
            </select>
        </div>
    </div>
    <div slot="footer" class="div_modal_footer">
        <button type="button" on:click={shop_modal.hide}>닫기</button>
        <button type="button">저장</button>
    </div>
</Modal>

<Modal bind:modal={zipcode_modal} backdrop={true}>
    <div slot="header" class="div_modal_header">
        <span>주소찾기</span>
        <button class="btn_close" on:click={zipcode_modal.hide}>
            <Icon_close/>
        </button>
    </div>
    <div slot="content" bind:this={this_zipcode_content} class="div_zipcode_modal"></div>
</Modal>

<svelte:head>
    <script src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"></script>
</svelte:head>

<script>
    import {onMount} from "svelte";

    import * as agGrid from "ag-grid-community";
    import "ag-grid-community/styles/ag-grid.css";
    import "ag-grid-community/styles/ag-theme-quartz.css";
    import {grid_button_renderer_class} from "../js/grid_class.js";
    import Icon_close from "../../public/assets/component/icon/Icon_close.svelte";
    import Modal from "../../public/assets/component/Modal.svelte";
    import {DB_I_SHOP, DB_L_SHOP} from "../js/local_db.js";
    import {g_nvl, comma} from "../js/common.js";

    const shop_schema = ()=>({
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
        STATUS: "1"
    });

    let shop_cnt = 0;
    // 거래처 정보 추가/수정 모달
    let shop_modal;
    // 추가/수정인지 체크
    let modal_type = "";
    // 추가/수정 하려는 거래처 정보
    let shop_obj = shop_schema();
    // 주소찾기 모달
    let zipcode_modal;
    let this_zipcode_content;
    // 거래처 그리드
    let this_grid, grid_api;

    onMount(async ()=>{
        grid_options_init();
        const result = await DB_L_SHOP();
        shop_cnt = result.length;
        grid_api.setGridOption("rowData", result);

        shop_modal.addEventListener("hide", ()=>{
            // 데이터 초기화
            shop_obj = shop_schema();
        });
        zipcode_modal.addEventListener("shown", ()=>{
            exec_daum_post_code();
        });
    });

    // 추가 버튼 클릭시 > 거래처 등록 모달 오픈
    async function on_click_add_shop(){
        modal_type = "insert";
        shop_modal.show();
    }

    // 우편번호 검색
    function exec_daum_post_code() {
        new daum.Postcode({
            oncomplete: function (data) {
                let addr;
                if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
                    addr = data.roadAddress;
                } else { // 사용자가 지번 주소를 선택했을 경우(J)
                    addr = data.jibunAddress;
                }
                shop_obj.ZIPCODE = data.zonecode;
                shop_obj.ADDRESS1 = addr;
                zipcode_modal.hide();
            }
        }).embed(this_zipcode_content);
    }

    // 그리드의 정보 수정 버튼 클릭시
    function grid_row_update(data){
        shop_obj = data;
        modal_type = "update";
        shop_modal.show();
    }

    // 가맹점 목록 그리드
    function grid_options_init(){
        const update_btn_renderer_params = {
            inner_html: `<button class="btn_update btn_grid btn_blue">정보수정</button>`,
            add_class: `.btn_update`,
            function_name : grid_row_update,
        };
        const column_defs = [
            {
                flex:1,
                cellRenderer: grid_button_renderer_class,
                cellRendererParams: update_btn_renderer_params
            },
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
                headerName: "주소",
                field: "ADDRESS1",
                flex:1,
                valueFormatter: (param)=>{
                    return `${g_nvl(param.data.ADDRESS1)} ${g_nvl(param.data.ADDRESS2)}`;
                }
            },
            {
                headerName: "대표자명",
                field: "CEO_NAME",
                flex:1
            },
            {
                headerName: "메모",
                field: "MEMO",
                flex:1
            },
            {
                headerName: "거래처등록일",
                field: "SALES_TYPE",
                flex:1
            }
        ];

        const grid_options = {
            columnDefs: column_defs,
            rowData: null,
            overlayLoadingTemplate: "<div class='grid_loading'></div>",
            overlayNoRowsTemplate: `<span>등록된 거래처가 없습니다.</span>`
        }

        grid_api = agGrid.createGrid(this_grid, grid_options);
    }
</script>