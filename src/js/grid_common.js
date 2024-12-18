import * as agGrid from "ag-grid-community";

export const custom_theme = agGrid.themeQuartz.withParams({
    spacing: 4,
    borderRadius: 0,
    wrapperBorderRadius: 0,
    headerColumnBorder: true,
    headerColumnResizeHandleHeight: "0%",
    columnBorder: true,
});

export class grid_button_renderer_class {
    //init = 렌더러를 사용하기 전에 한 번 호출됩니다.
    init(params) {
        this.params = params;

        // 셀 만들기
        this.eGui = document.createElement("div");
        this.eGui.style = "height: 100%;display: flex;padding: 2px;";
        this.eGui.innerHTML = params.inner_html;

        // elements 참조
        this.eButton = this.eGui.querySelector(params.add_class);

        //버튼에 add EventListener
        this.eventListener = () => params.function_name(params.data, params.value, params.node);
        this.eButton.addEventListener('click', this.eventListener);
    }

    // *필수* 구성 요소의 DOM 요소를 반환하여 그리드의 셀에 넣습니다.
    getGui() {
        return this.eGui;
    }

    // 셀이 새로 고쳐질때 마다 실행됩니다
    refresh() {
        return true;
    }
}