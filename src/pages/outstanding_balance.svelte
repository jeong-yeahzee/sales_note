<style>
    .div_contain{
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        gap: 16px;
        background-color: #FFFFFF;
    }

    /*그리드 기본 스타일*/
    .div_grid{
        width: 100%;
        height: 100%;
    }
</style>
<div class="div_contain">
    <div bind:this={this_shop_grid} class="ag-theme-quartz div_grid"></div>
    <div bind:this={this_detail_grid} class="ag-theme-quartz div_grid"></div>
</div>
<script>
    import {onMount} from "svelte";

    let this_shop_grid, shop_grid_api;
    let this_detail_grid, detail_grid_api;

    onMount(()=>{

    });
</script>