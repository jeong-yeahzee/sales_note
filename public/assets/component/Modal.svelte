
<style>
    .wrap {
        width: 100vw;
        height: calc(100% - env(safe-area-inset-bottom) - env(safe-area-inset-top));
        display: none;
        align-items: center;
        justify-content: center;
        position: fixed;
        top: 0;
        left: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 100;
        overflow: auto;
    }
    .wrap.show {
        display: flex;
    }
    .popup {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        position: relative;
        background: #ffffff;
    }
    @media (max-width: 720px) {
        .wrap {
            justify-content: flex-start;
        }
    }
</style>

<div class="common_modal {_class}" bind:this="{modal}">
    <div class="wrap" class:show="{is_show}">
        <div class="popup">
            <slot name="header" />
            <slot name="content" />
            <slot name="footer" />
        </div>
    </div>
</div>

<script>
    import { onMount, tick } from "svelte";

    let _class = "";
    export let modal = null;
    export let backdrop = false;
    export { _class as class };
    let is_show = false;

    onMount(() => {
        modal.show = async () => {
            let body = document.querySelector("body");
            body.style.overflow = "hidden";

            const show_event = new Event("show");
            modal.dispatchEvent(show_event);

            is_show = true;
            await tick();

            const shown_event = new Event("shown");
            modal.dispatchEvent(shown_event);
        };
        modal.hide = async () => {
            let body = document.querySelector("body");
            body.style.overflow = "auto";

            const hide_event = new Event("hide");
            modal.dispatchEvent(hide_event);

            is_show = false;
            await tick();

            const hidden_event = new Event("hidden");
            modal.dispatchEvent(hidden_event);
        };

        modal.is_show = ()=> is_show;

        if(backdrop){
            modal.addEventListener("click",(e)=>{
                if(e.target.classList.contains("wrap")){
                    modal.hide();
                }
            });
        }
    });
</script>