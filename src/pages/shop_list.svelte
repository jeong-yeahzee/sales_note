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
    .sub_title{
        font-size: 13px;
        font-weight: 400;
    }
    .div_grid{
        width: 100%;
        height: 100%;
    }

    .shop_modal{
        display: grid;
        width: 368px;
        grid-template-columns: 72px 1fr;
        padding: 16px 16px 8px;
        row-gap: 8px;
        column-gap: 4px;
        overflow-y: auto;
        background-color: rgba(0, 0, 0, 3%);
    }
    .shop_modal>div{
        display: flex;
        height: 28px;
        align-items: center;
        gap: 2px;
    }
    .shop_modal .grid_th{
        font-size: 13px;
        font-weight: 400;
    }
    .shop_modal .grid_td input{
        flex-grow: 1;
        width: 100%;
        height: 100%;
        border: 1px solid rgba(0,0,0,40%);
        padding: 4px 8px;
        font-size: 14px;
        font-weight: 500;
    }
    .shop_modal .grid_td input::placeholder{
        font-size: 13px;
        opacity: 60%;
        font-weight: 400;
    }
    .shop_modal .grid_td textarea{
        flex-grow: 1;
        height: 100%;
        border: 1px solid rgba(0,0,0,40%);
        resize: none;
        padding: 8px;
        font-size: 14px;
        font-weight: 500;
    }
    .shop_modal .grid_td select{
        width: auto;
        height: 100%;
        border: 1px solid rgba(0,0,0,40%);
        padding: 4px 8px;
        font-size: 13px;
        font-weight: 500;
    }
    .shop_modal .grid_td input:focus,
    .shop_modal .grid_td textarea:focus,
    .shop_modal .grid_td select:focus{
        background-color: #e3f0ff;
    }
    .shop_modal .input_business_license.success{
        border: 1px solid #1fa835;
    }
    .btn_duplicate{
        flex-shrink: 0;
        height: 100%;
    }
    .shop_modal .div_address{
        flex-direction: column;
        gap: 4px;
        box-sizing: border-box;
        align-items: baseline;
    }
    .shop_modal .div_zipcode{
        display: flex;
        height: 100%;
        gap: 4px;
    }
    .shop_modal .div_zipcode>input{
        width: 100px;
    }
    .div_zipcode_modal{
        width: 500px;
    }
    .create_dt{
        flex-grow: 1;
        text-align: center;
        line-height: 110%;
        font-size: 12px;
    }
    .shop_modal_footer{
        display: flex;
        width: 100%;
        height: 48px;
        align-items: center;
        justify-content: center;
        gap: 16px;
        background-color: rgba(0, 0, 0, 3%);
    }
    .shop_modal_footer>button{
        height: 32px;
        width: 64px;
        font-size: 14px;
        font-weight: 700;
    }
    .shop_modal_footer>.btn_delete{
        position: absolute;
        left: 8px;
        width: 48px;
    }

    .font_red{
        color: red;
    }
</style>

<div class="div_contain">
    <div class="div_title">
        <div>
            <span>거래처 목록</span>
            <span class="sub_title">/ {comma(shop_cnt)}건</span>
        </div>
        <button type="button" on:click={shop_modal.show()}>추가</button>
    </div>
    <div bind:this={this_grid} class="div_grid"></div>
</div>

<Modal bind:modal={shop_modal}>
    <div slot="header" class="modal_header">
        {#if shop_obj.SHOP_NO === null}
            거래처 추가
        {:else}
            거래처 정보 수정
        {/if}
        <button type="button" on:click={shop_modal.hide()} class="modal_close_icon" >
            <Icon_close/>
        </button>
    </div>
    <div slot="content" class="shop_modal">
        <div class="grid_th">거래처명<span class="font_red"> *</span></div>
        <div class="grid_td">
            <input type="text" bind:value={shop_obj.SHOP_NAME} placeholder="24자까지 입력가능합니다." maxlength="24">
        </div>
        <div class="grid_th">사업자번호<span class="font_red"> *</span></div>
        <div class="grid_td">
            <input type="text" bind:value={shop_obj.BUSINESS_LICENSE}
                   on:input={()=>{shop_obj.BUSINESS_LICENSE_CHECK = false;}}
                   class:success={shop_obj.BUSINESS_LICENSE_CHECK}
                   class="input_business_license"
                   placeholder="숫자만 입력해주세요." maxlength="12">
            <button type="button" on:click={on_click_duplicate_check}
                    class="btn_duplicate"
                    disabled={shop_obj.BUSINESS_LICENSE_CHECK}>
                중복확인
            </button>
        </div>
        <div class="grid_th">대표자명</div>
        <div class="grid_td"><input type="text" bind:value={shop_obj.CEO_NAME}></div>
        <div class="grid_th">전화번호</div>
        <div class="grid_td">
            <input type="text" bind:value={shop_obj.TEL} placeholder="예시) 02-0000-0000" maxlength="14">
        </div>
        <div class="grid_th">휴대폰번호</div>
        <div class="grid_td">
            <input type="text" bind:value={shop_obj.MOBILE} placeholder="예시) 010-0000-0000" maxlength="14">
        </div>
        <div class="grid_th">이메일</div>
        <div class="grid_td">
            <input type="text" bind:value={shop_obj.EMAIL} placeholder="예시) example@gmail.com" maxlength="35">
        </div>
        <div class="grid_th" style="height: 90px">주소</div>
        <div class="grid_td div_address" style="height: 90px;">
            <div class="div_zipcode">
                <input type="text" bind:value={shop_obj.ZIPCODE} disabled>
                <button type="button" on:click={zipcode_modal.show}>주소찾기</button>
            </div>
            <input type="text" bind:value={shop_obj.ADDRESS1}>
            <input type="text" bind:value={shop_obj.ADDRESS2} placeholder="상세주소를 입력해주세요.">
        </div>
        <div class="grid_th" style="height: 64px;">메모</div>
        <div class="grid_td" style="height: 64px;"><textarea type="text" bind:value={shop_obj.MEMO}/></div>
        <div class="grid_th">상태</div>
        <div class="grid_td">
            <select bind:value={shop_obj.STATUS}>
                <option value="1">사용</option>
                <option value="0">미사용</option>
            </select>
            {#if shop_obj.SHOP_NO !== null}
                <div class="create_dt">거래처 생성일<br/> {shop_obj.FIRST_CREATE_DT}</div>
            {/if}
        </div>
    </div>
    <div slot="footer" class="shop_modal_footer">
        {#if shop_obj.SHOP_NO !== null}
            <button type="button" on:click={on_click_delete} class="btn_delete">삭제</button>
        {/if}
        <button type="button" on:click={on_click_save}>저장</button>
    </div>
</Modal>

<Modal bind:modal={zipcode_modal} backdrop={true}>
    <div slot="header" class="modal_header">
        <span>주소찾기</span>
        <button class="modal_close_icon" on:click={zipcode_modal.hide}>
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
    import {grid_button_renderer_class,custom_theme} from "../js/grid_common.js";
    import Icon_close from "../../public/assets/component/icon/Icon_close.svelte";
    import Modal from "../../public/assets/component/Modal.svelte";
    import {
        exec_all, exec_transaction, exec_check,
        QR_L_SHOP, QR_C_BUSINESS_LICENSE, QR_M_SHOP, QR_D_SHOP
    } from "../js/local_db.js";
    import {
        g_nvl,
        comma,
        validate_emojis,
        byte_check,
        business_license_formatter,
        tel_formatter
    } from "../js/common.js";

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
        STATUS: "1",
        FIRST_CREATE_DT: "",
        BUSINESS_LICENSE_CHECK: false
    });

    let shop_cnt = 0;
    // 거래처 정보 추가/수정 모달
    let shop_modal;
    // 추가/수정 하려는 거래처 정보
    let shop_obj = shop_schema();
    // 주소찾기 모달
    let zipcode_modal;
    let this_zipcode_content;
    // 거래처 그리드
    let this_grid, grid_api;

    $:{
        shop_obj.BUSINESS_LICENSE = business_license_formatter(shop_obj.BUSINESS_LICENSE);
        shop_obj.TEL = tel_formatter(shop_obj.TEL);
        shop_obj.MOBILE = tel_formatter(shop_obj.MOBILE);
    }

    onMount(async ()=>{
        grid_options_init();
        // 거래처정보 조회
        await get_shop();

        shop_modal.addEventListener("hide", ()=>{
            // 데이터 초기화
            shop_obj = shop_schema();
        });
        zipcode_modal.addEventListener("shown", ()=>{
            exec_daum_post_code();
        });
    });

    // 사업자번호 중복 확인 버튼 클릭시
    async function on_click_duplicate_check(){

        // 사업자 번호 체크 초기화
        shop_obj.BUSINESS_LICENSE_CHECK = false;

        // 사업자번호 확인
        if(shop_obj.BUSINESS_LICENSE === ""){
            return alert("사업자번호를 입력해주세요.");
        }

        // 사업자번호 자리수 체크
        if(shop_obj.BUSINESS_LICENSE.replaceAll("-", "").length !== 10){
            return alert("사업자번호를 형식에 맞춰 입력해주세요.");
        }

        const result = await DB_C_BUSINESS_LICENSE(shop_obj);
        if(!result){
            alert("사업자번호 중복체크 실패\n재시도 부탁드립니다.");
        }else if(result.IS_CHECK === 1){
            alert("이미 존재하는 사업자번호 입니다.");
        }else{
            shop_obj.BUSINESS_LICENSE_CHECK = true;
        }
    }

    // 거래처 정보 모달에서 저장버튼 클릭시
    async function on_click_save(){
        // 거래처명 확인
        if(shop_obj.SHOP_NAME === ""){
            return alert("거래처명을 입력해주세요.");
        }

        // 거래처명 최대 24자 이하만 입력가능
        if(shop_obj.SHOP_NAME.length > 24){
            return alert("상품명은 24자 이하만 입력가능합니다.");
        }

        // 거래처명 이모지 입력불가
        if(validate_emojis(shop_obj.SHOP_NAME)){
            return alert("이모티콘은 입력 불가능합니다.");
        }

        // 사업자번호 확인
        if(shop_obj.BUSINESS_LICENSE === ""){
            return alert("사업자번호를 입력해주세요.");
        }

        // 사업자번호 자리수 체크
        if(shop_obj.BUSINESS_LICENSE.replaceAll("-", "").length !== 10){
            return alert("사업자번호를 형식에 맞춰 입력해주세요.");
        }

        // 사업자번호 중복 체크
        if(!shop_obj.BUSINESS_LICENSE_CHECK){
            return alert("사업자번호 중복 확인을 해주세요.");
        }

        // 메모는 2000byte 이하만 입력가능
        if(byte_check(shop_obj.MEMO) > 2000){
            return alert("메모는 2000byte(약 670자) 이내로 입력가능합니다.");
        }

        // 추가/수정 저장
        const result = await DB_M_SHOP(shop_obj);

        // DB 저장 오류일때
        if(!result){
            return alert("저장 실패\n재시도 부탁드립니다.");
        }

        alert("저장되었습니다.");
        shop_modal.hide();
        // 거래처 정보 재조회
        await get_shop();
    }

    // 거래처 정보 모달에서 삭제버튼 클릭시
    function on_click_delete(){
        confirm("거래처를 삭제하시겠습니까?", confirm_accepted);
        async function confirm_accepted(){
            const result = await DB_D_SHOP(shop_obj);

            // DB 저장 실행일때
            if(!result){
                return alert("삭제 실패\n재시도 부탁드립니다.");
            }

            alert("삭제되었습니다.\n(삭제한 데이터는 휴지통 메뉴에서 복구 가능합니다.)");
            // 모달 데이터 초기화
            shop_obj = shop_schema();
            // 모달 닫기
            shop_modal.hide();
            // 거래처 정보 재조회
            await get_shop();
        }
    }

    // 거래처정보 조회
    async function get_shop(){
        const result = await DB_L_SHOP();
        shop_cnt = result.length;
        grid_api.setGridOption("rowData", result);
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
        shop_modal.show();
    }

    // 거래처 정보 조회
    async function DB_L_SHOP(){
        const param = {
            query: QR_L_SHOP()
        };
        return await exec_all(param);
    }

    // 거래처 정보 조회
    async function DB_C_BUSINESS_LICENSE(data){
        const param = {
            query: QR_C_BUSINESS_LICENSE(),
            in1: data.BUSINESS_LICENSE
        };
        return await exec_check(param);
    }

    // 거래처 정보 추가/수정
    async function DB_M_SHOP(data){
        const param = {
            query: QR_M_SHOP(),
            in1: data.SHOP_NO,
            in2: data.SHOP_NAME,
            in3: data.STATUS,
            in4: data.BUSINESS_LICENSE,
            in5: data.TEL,
            in6: data.MOBILE,
            in7: data.EMAIL,
            in8: data.ADDRESS1,
            in9: data.ADDRESS2,
            in10: data.ZIPCODE,
            in11: data.CEO_NAME,
            in12: data.MEMO
        };
        return await exec_transaction(param);
    }

    // 거래처 정보 삭제
    async function DB_D_SHOP(data){
        const param = {
            query: QR_D_SHOP(),
            in1: data.SHOP_NO
        };
        return await exec_transaction(param);
    }

    // 거래처 목록 그리드
    function grid_options_init(){
        const update_btn_renderer_params = {
            inner_html: `<button class="btn_update">수정</button>`,
            add_class: `.btn_update`,
            function_name : grid_row_update,
        };
        const column_defs = [
            {
                cellRenderer: grid_button_renderer_class,
                cellRendererParams: update_btn_renderer_params,
                width: 60,
                filter: false
            },
            {
                headerName: "코드",
                field: "SHOP_NO",
                width: 45
            },
            {
                headerName: "거래처명",
                field: "SHOP_NAME",
                width: 150
            },
            {
                headerName: "사업자번호",
                field: "BUSINESS_LICENSE",
                width: 120
            },
            {
                headerName: "휴대폰번호",
                field: "MOBILE",
                width: 120
            },
            {
                headerName: "전화번호",
                field: "TEL",
                width: 120
            },
            {
                headerName: "대표자명",
                field: "CEO_NAME",
                width: 70
            },
            {
                headerName: "주소",
                field: "ADDRESS1",
                width: 100,
                valueFormatter: (param)=>{
                    if(param.data === undefined){
                        return "";
                    }

                    return `${g_nvl(param.data.ADDRESS1)} ${g_nvl(param.data.ADDRESS2)}`;
                }
            },
            {
                headerName: "메모",
                field: "MEMO",
                width: 100
            },
            {
                headerName: "생성일자",
                field: "FIRST_CREATE_DT",
                width: 100,
                filter: false,
                cellRenderer: (param)=>{
                    if(param.data === undefined){
                        return "";
                    }

                    return param.data.FIRST_CREATE_DT.split(" ")[0];
                }
            }
        ];

        const grid_options = {
            theme: custom_theme,
            columnDefs: column_defs,
            rowData: null,
            loading: false,
            headerHeight: 32,
            floatingFiltersHeight: 32,
            defaultColDef: {
                filter: true,
                floatingFilter: true,
                suppressFloatingFilterButton: true,
                suppressHeaderFilterButton: true
            },
            onFirstDataRendered(event) {
                grid_api.sizeColumnsToFit();
            },
            onGridSizeChanged(event){
                grid_api.sizeColumnsToFit();
            },
            overlayLoadingTemplate: "<div class='grid_loading'></div>",
            overlayNoRowsTemplate: `<span>등록된 거래처가 없습니다.</span>`
        }

        grid_api = agGrid.createGrid(this_grid, grid_options);
    }
</script>