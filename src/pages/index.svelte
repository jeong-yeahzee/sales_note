<style>
    .notice_title {
        background-color: lightyellow;
        height: 100vh;
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        flex-direction: column;
    }
</style>

<div class="notice_title">
    <h1 style="font-size: 100px;">정상적인 접근이 아닙니다.</h1>
</div>

<!--
<a href="/kiosk_admin/kiosk_admin_page">키오스크 관리자로 이동</a><br>
<a href="/glasses_lens_order/login">안경렌즈 주문 사이트로 이동</a><br>
<a href="/chain/bills">그랑프리 월별 주문내역서</a>
<h3>Retina Webs</h3>
-->

<script>
    import { goto } from '@roxi/routify';

    // console.log("index.....",window.location.hostname);
    if( window.location.hostname.indexOf("mbti") != -1 ) {
        $goto("./mbti/main"); // mbti 페이지
    }
</script>