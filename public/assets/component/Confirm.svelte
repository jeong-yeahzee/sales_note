<style>
    .wrap {
        width: 100vw;
        height: calc(100% - env(safe-area-inset-bottom) - env(safe-area-inset-top));
        display: flex;
        align-items: center;
        justify-content: center;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 200;
        overflow: auto;
    }
    .popup {
        min-width: 328px;
        padding: 16px;
        display: flex;
        flex-direction: column;
        align-items: center;
        background: #ffffff;
        border-radius: 8px;
        gap: 8px;
        box-shadow: 0px 0px 12px #bbbbbbc4;
    }
    .content {
        width: 100%;
        min-height: 86px;
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        font-size: 16px;
        white-space: pre;
        line-height: 1.5;
    }
    .btn_area {
        width: 100%;
        display: flex;
        align-items: center;
        gap: 8px;
    }
    .btn_area > button {
        height: 40px;
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        font-size: 15px;
        font-weight: 500;
        color: #FFFFFF;
        letter-spacing: 2px;
        cursor: pointer;
        background-color: #0064bc;
        border: 1px solid rgba(0, 0, 0, 40);
        border-radius: 4px;
    }
    .confirm_reject {
        color: #949494 !important;
        background-color: #FFFFFF !important;
        border: 1px solid rgb(0 0 0 / 24%) !important;
    }
    .confirm_reject:focus,
    .confirm_resolve:focus {
        box-shadow: 0 0 0px 3px #0064bc;
        border: 2px solid #FFF;
    }
    .confirm_reject:hover,
    .confirm_resolve:hover {
        background: linear-gradient(0deg, rgba(0, 0, 0, 0.15) 0%, rgba(0, 0, 0, 0.15) 100%), #0064bc;
    }
</style>

{#if is_show}
    <div class="wrap" bind:this={confirm}>
        <slot>
            <div class="popup">
                <div class="content">{@html text}</div>
                <div class="btn_area" on:blur|capture={on_blur}>
                    <button bind:this={this_reject}
                            on:click={on_reject}
                            on:keyup={on_keyup} class="confirm_reject">취소</button>
                    <button bind:this={this_resolve}
                            on:click={on_resolve}
                            on:keyup={on_keyup} class="confirm_resolve">확인</button>
                </div>
            </div>
        </slot>
    </div>
{/if}

<script>
    import { onMount, tick } from "svelte";

    export let is_show = false;
    export let confirm = null;

    let this_reject;
    let this_resolve;
    let text = "";
    let success = null;
    let fail = null;

    onMount(async () => {
        window.confirm = async function (txt, resolve, reject) {
            if (is_show) {
                return false;
            }
            text = txt;
            success = resolve ? resolve : undefined;
            fail = reject ? reject : undefined;
            is_show = true;

            await tick();

            // 강제로 확인 버튼에 focus
            this_resolve.focus();

            return true;
        };
    });

    async function on_resolve() {
        is_show = false;

        if (success) {
            await success();
        }
    }
    async function on_reject() {
        is_show = false;

        if (fail) {
            await fail();
        }
    }

    function on_keyup(e){
        if(e.keyCode === 39 || e.keyCode === 37){
            e.target === this_resolve ? this_reject.focus() : this_resolve.focus();
        }
    }

    function on_blur(e){
        if(e.relatedTarget !== this_resolve && e.relatedTarget !== this_reject){
            e.target.focus();
        }
    }
</script>