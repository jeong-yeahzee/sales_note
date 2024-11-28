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
    .btn_area{
        width: 50%;
    }
    .btn_area > button {
        height: 40px;
        width: 100%;
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
    .alert_accept:focus {
        box-shadow: 0 0 0px 3px #0064bc;
        border: 2px solid #FFF;
    }
    .alert_accept:hover {
        background: linear-gradient(0deg, rgba(0, 0, 0, 0.15) 0%, rgba(0, 0, 0, 0.15) 100%), #0064bc;
    }
</style>

{#if is_show}
    <div class="wrap" bind:this={alert}>
        <slot>
            <div class="popup">
                <div class="content">{@html text}</div>
                <div class="btn_area">
                    <button bind:this={this_accept}
                            on:click={on_click} on:blur={on_blur} class="alert_accept">확인</button>
                </div>
            </div>
        </slot>
    </div>
{/if}

<script>
    import {onMount, tick} from "svelte";

    export let is_show = false;
    export let alert = null;

    let this_accept;
    let text = "";
    let callback = null;

    onMount(async () => {
        window.alert = async function (txt, call) {
            if (is_show) {
                return false;
            }
            text = txt;
            callback = call ? call : undefined;
            is_show = true;

            await tick();

            // 강제로 확인 버튼에 focus
            this_accept.focus();

            return true;
        };
    });

    async function on_click() {
        is_show = false;

        if (callback) {
            await callback();
        }
    }

    // 확인 버튼 포커스 잃을때 > 강제로 포커싱
    function on_blur(){
        // 강제로 확인 버튼에 focus
        this_accept.focus();
    }
</script>