<style>
    .date_wrap{
        width: auto;
        border: 1px solid #d1d1d1;
        display: inline-flex;
        cursor: pointer;
        box-sizing: border-box;
    }
    .date_wrap :global(.date-time-field){
        position: initial;
    }
    .date_wrap :global(.date-time-field>input){
        display: none;
    }
    .date_wrap :global(div.picker){
        left: 0;
        top: 100%;
    }
    .date_wrap :global(.date-time-picker .top>button:first-of-type){
        order: 0;
    }
    .date_wrap :global(.date-time-picker .top .year){
        order: 1;
    }
    .date_wrap :global(.date-time-picker .top .month){
        order: 2;
    }
    .date_wrap :global(.date-time-picker .top>button:last-of-type){
        order: 3;
    }

    .date_wrap .input{
        padding: 4px;
        width: 100%;
        flex:1;
    }
    .disabled_cursor{
        cursor: no-drop;
    }
    .div_icon{
        padding: 4px;
        display: flex;
        align-items: center;
        border-left: 1px solid #d1d1d1;
        background-color: #F5F5F5;
    }
</style>
<div bind:this={this_wrap} class="date_wrap">
    <DateInput bind:value={datepicker_value} on:select={on_select_datepicker} visible={datepicker_show} locale={locale} browseWithoutSelecting={true}/>
    <input type="text" bind:this={this_date} bind:value={date} on:blur={on_blur_date}
           disabled={disabled}
           readonly=true
           placeholder={placeholder} class:disabled_cursor={disabled} class="{_class} input">
    <div bind:this={datepicker_img} class:disabled_cursor={disabled} class="div_icon">
        <Icon_date/>
    </div>
</div>

<script>
    import {DateInput} from "date-picker-svelte";
    import {onDestroy, onMount, tick} from "svelte";
    import dayjs from "dayjs";
    import Icon_date from "./icon/Icon_date.svelte";

    let _class = "";
    export { _class as class };
    export let date;
    export let disabled = false;
    export let placeholder = "YYYY-MM-DD";

    let this_wrap;
    let this_date;

    let datepicker_value = null;
    let datepicker_img;
    let datepicker_show = false;

    const locale = {
        weekdays: ["일","월","화","수","목","금","토"],
        months: ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"],
        weekStartsOn: 0,
    };

    $: if(date){
        date = date_formatter(date);
    }

    onMount(()=>{
        window.addEventListener("mousedown", mousedown);
    });

    onDestroy(() => {
        window.removeEventListener("mousedown", mousedown);
    });

    function on_select_datepicker(e){
        date = dayjs(e.detail).format("YYYY-MM-DD");
        datepicker_show = false;
    }

    function on_blur_date(){

        if(date.length > 0){
            if(date.length !== 10 || dayjs(date).format("YYYY-MM-DD") === "Invalid Date"){
                alert("날짜를 정확히 입력해주세요.", alert_accepted);
            }
        }

        function alert_accepted(){
            if(datepicker_value !== null){
                date = dayjs(datepicker_value).format("YYYY-MM-DD");
            }
            this_date.focus();
        }
    }

    async function mousedown(e) {
        if (datepicker_img || this_date) {
            if (datepicker_img.contains(e.target) || this_date.contains(e.target)) {
                if(datepicker_value === null && date.length === 10){
                    datepicker_value = new Date(date);
                }

                if(!disabled && (date.length === 10 || date.length === 0)){
                    datepicker_show = true;
                    await tick();
                    let picker = this_wrap.querySelector(".picker");
                    let position = get_position(this_wrap);

                    if(position.x + picker.offsetWidth > window.innerWidth){
                        picker.style.left = `${this_wrap.offsetLeft - (picker.offsetWidth - this_wrap.offsetWidth)}px`;
                    }else{
                        picker.style.left = `${this_wrap.offsetLeft}px`;
                    }
                    if(position.y + this_wrap.offsetHeight + picker.offsetHeight > window.innerHeight) {
                        picker.style.top = `${this_wrap.offsetTop - picker.offsetHeight}px`;
                    }else{
                        picker.style.top = `${this_wrap.offsetTop + this_wrap.offsetHeight}px`;
                    }
                }
            } else if(this_wrap.contains(e.target) && !this_date.contains(e.target)){

            }else{
                datepicker_show = false;
            }
        }
    }

    function date_formatter(value){
        const only_num = String(value).replace(/[^0-9]/g, '');
        let return_value = String(value).replace(/[^0-9-]/g, '');

        if(only_num.length === 8){
            return dayjs(only_num).format("YYYY-MM-DD");
        }else{
            return return_value;
        }
    }

    function get_position(element) {
        let x = 0;
        let y = 0;

        while (element) {
            x += element.offsetLeft - element.scrollLeft + element.clientLeft;
            y += element.offsetTop - element.scrollTop + element.clientTop;
            element = element.offsetParent;
        }

        return { x: x, y: y };
    }
</script>