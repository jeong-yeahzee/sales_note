<script>
    import { createEventDispatcher, onDestroy, onMount, tick } from "svelte";
    import {g_nvl} from "../../../src/js/common.js";

    let _class = "";
    export { _class as class };
    export let value = null;
    export let autocomplete = null;
    export let autocomplete_input = null;
    export let data = [];
    export let key = null;
    export let disabled = false;
    export let placeholder = "";
    let is_open = false;
    let focused_index = -1;
    let options = [];
    let selected_index = -1;

    const dispatch = createEventDispatcher();

    $: {
        if (autocomplete) {
            options = autocomplete.querySelectorAll("[data-type='option']");
            for (let i = 0; i < options.length; i++) {
                options[i].classList.remove("selected");
            }
            if (focused_index >= 0 && focused_index < options.length) {
                options[focused_index].classList.add("selected");
            }
        }
    }

    $:{
        if(data.length === 0){
            focused_index = -1;
            selected_index = -1;
        }
    }

    onMount(() => {
        window.addEventListener("mousedown", mousedown);
        autocomplete.addEventListener("keydown", on_keydown);
        autocomplete.addEventListener("keyup", on_keyup);
        autocomplete.get_selected_index = () => selected_index;
        autocomplete.get_selected_data = () => {
            if (data.length > 0) {
                return data[selected_index];
            } else {
                return {};
            }
        };
    });

    onDestroy(() => {
        window.removeEventListener("mousedown", mousedown);
    });

    async function mousedown(e) {
        if (autocomplete) {
            if (!autocomplete.contains(e.target)) {
                is_open = false;
            } else {
                options = autocomplete.querySelectorAll("[data-type='option']");
                for (let i = 0; i < options.length; i++) {
                    let option = options[i];
                    if (option.contains(e.target)) {
                        focused_index = i;
                        selected_index = focused_index;
                        value = g_nvl(option.dataset.label, option.innerHTML);
                        is_open = false;
                        await tick();
                        dispatch("select", selected_index);
                    }
                }
            }
        }
    }

    function on_focus(e) {
        is_open = true;
        if (focused_index !== selected_index) {
            focused_index = selected_index;
        }
        dispatch("focus");
    }
    function on_blur(e) {
        is_open = false;
        dispatch("blur");
    }
    function on_click(e) {
        is_open = true;
        dispatch("click");
    }
    function on_input(e) {
        dispatch("input", e);
    }

    function on_keydown(e) {
        const key_event = [9, 13, 27, 38, 40];

        if (key_event.indexOf(e.keyCode) !== -1) {
            exec_key_event(e);
        } else {
            dispatch("keydown", e);
        }
    }
    function on_keyup(e) {
        dispatch("keyup", e);
    }
    function exec_key_event(e) {
        // 아래 화살표 눌렀을 때 - current_focus 변수에 값을 한번 더하고, add_option_style 함수에 해당 options 를 가지고 가서 실행
        // 위 화살표 눌렀을 때 - current_focus 변수에 값을 한번 빼고, add_option_style 함수에 해당 options 를 가지고 가서 실행
        // tab 눌렀을 때 - autocomplete 창 숨기는 함수 실행, tab 기본 이벤트도 실행
        // esc 눌었을 때 - autocomplete 창 숨기는 함수 실행
        // 엔터 눌렀을 때 - 해당 options 클릭하게 함
        options = autocomplete.querySelectorAll("[data-type='option']");

        if (e.keyCode == 40 && options.length > 0) {
            e.preventDefault();
            focused_index++;
            if (focused_index < 0) {
                focused_index = options.length - 1;
            }
            if (focused_index >= options.length) {
                focused_index = 0;
            }
            let option = options[focused_index];
            let parent = option.parentElement;
            parent.scrollTop = option.offsetTop - parent.clientHeight;
            dispatch("arrow_keydown", e);
        } else if (e.keyCode == 38 && options.length > 0) {
            e.preventDefault();
            focused_index--;
            if (focused_index < 0) {
                focused_index = options.length - 1;
            }
            if (focused_index >= options.length) {
                focused_index = 0;
            }
            let option = options[focused_index];
            let parent = option.parentElement;
            parent.scrollTop = option.offsetTop - parent.clientHeight;
            dispatch("arrow_keydown", focused_index);
        } else if (e.keyCode == 9) {
            is_open = false;

            if (focused_index >= 0 && focused_index < options.length) {
                let option = options[focused_index];
                value = g_nvl(option.dataset.label, option.innerHTML);
            }
            selected_index = focused_index;
            dispatch("select", selected_index);
        } else if (e.keyCode == 27) {
            e.preventDefault();
            is_open = false;
        } else if (e.keyCode == 13) {
            e.preventDefault();
            is_open = false;

            if (focused_index >= 0 && focused_index < options.length) {
                let option = options[focused_index];
                value = g_nvl(option.dataset.label, option.innerHTML);
            }
            selected_index = focused_index;
            dispatch("select", selected_index);
        }
    }
</script>

<div
        class="{_class} autocomplete"
        class:open="{is_open}"
        class:disabled="{disabled}"
        bind:this="{autocomplete}"
        disabled="true"
>
    <div class="input">
        <input
                bind:this="{autocomplete_input}"
                bind:value="{value}"
                on:click="{on_click}"
                on:focus="{on_focus}"
                on:blur="{on_blur}"
                on:input="{on_input}"
                placeholder="{placeholder}"
        />
        <slot class="input" />
    </div>
    {#if !disabled}
        <div class="data">
            <slot name="data">
                {#each data as item}
                    <div data-type="option"
                         data-value={item[key.value]}
                         data-label={item[key.label]}>
                        {item[key.label]}
                    </div>
                {/each}
            </slot>
        </div>
    {/if}
</div>

<style>
    .autocomplete {
        min-height: 32px;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        font-weight: 500;
        color: #666;
        list-style: none;
        background: white;
    }
    .autocomplete.disabled {
        background-color: #cdcdcd;
    }
    .input input {
        background-color: transparent;
        width: 100%;
    }
    .input {
        display: flex;
        align-items: center;
        width: 100%;
    }
    .disabled .input {
        pointer-events: none;
    }
    .data {
        width: 100%;
        max-height: 250px;
        overflow-y: auto;
        position: absolute;
        top: 100%;
        left: 0;
        background: white;
        box-shadow: -1px -1px 0 0 #d9d9d9, inset -1px -1px 0 0 #d9d9d9;
        z-index: 100;
        display: none;
    }

    .open .data {
        display: block;
    }
    .data [data-type="option"] {
        cursor: pointer;
    }
    .data [data-type="option"]:hover {
        background: #eee;
    }
    :global(.data [data-type="option"].selected) {
        background-color: #2c89f5;
        color: white !important;
    }
</style>