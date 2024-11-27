<style>
    .div_contain{
        display: flex;
        height: 100%;
        gap: 16px;
    }
    /*그리드 기본 스타일*/
    .div_grid{
        width: 100%;
        height: 100%;
    }
</style>
<div class="div_contain">
    <div bind:this={this_shop_grid} class="ag-theme-quartz div_grid"></div>
</div>

<script>
    // 가맹점 그리드
    import {onMount} from "svelte";

    import * as agGrid from "ag-grid-community";
    import "ag-grid-community/styles/ag-grid.css";
    import "ag-grid-community/styles/ag-theme-quartz.css";

    let this_shop_grid, shop_grid_api;

    onMount(()=>{
        shop_grid_options_init();
    });

    // 거래처 목록 그리드
    function shop_grid_options_init(){
        const column_defs = [
            {
                headerName: "브랜드명",
                field: "BRAND_NAME",
                flex:1
            },
            {
                headerName: "메모",
                field: "MEMO",
                flex:1
            },
            {
                headerName: "상태",
                field: "STATUS",
                flex:1,
                cellRenderer: (param)=>{
                    if(param.data === undefined){
                        return "";
                    }
                    return param.value === "1" ? "사용" : "미사용";
                }
            }
        ];

        const grid_options = {
            columnDefs: column_defs,
            rowSelection: {
                mode: "singleRow",
                checkboxes: false,
                enableClickSelection: true
            },
            rowData: null,
            loading: false,
            overlayLoadingTemplate: "<div class='grid_loading'></div>",
            overlayNoRowsTemplate: `<span>등록된 거래처가 없습니다.</span>`,
            onRowSelected(event) {
                if(event.node.data === undefined){
                    return;
                }
            }
        }

        shop_grid_api = agGrid.createGrid(this_shop_grid, grid_options);
    }
</script>