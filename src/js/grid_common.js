import * as agGrid from "ag-grid-community";
import {g_nvl, uc} from "./common.js";

export const custom_theme = agGrid.themeQuartz.withParams({
    spacing: 4,
    borderRadius: 0,
    checkboxBorderRadius: 2,
    wrapperBorderRadius: 0,
    headerColumnBorder: true,
    headerColumnResizeHandleHeight: "0%",
    inputFocusShadow: false,
    columnBorder: true
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

/**
 * 그리드 합계 함수
 * 그리드 마다 합계 항목이 다르므로
 * 그리드 ID로 구분하여 필요한 값을 셋팅한다.
 * 예) grid_bottom_sum(grid_api, grid_bottom);
 */
export function grid_bottom_sum(api, bottom_data, except_name = "총합계") {
    //객체 깊은 복사
    let temp_data = JSON.parse(JSON.stringify(bottom_data));
    api.forEachNodeAfterFilter((node) => {
        if(g_nvl(node.data, "") != "") {     // 그룹화 했을 때를 위해서
            for (let key in temp_data[0]) {
                if (temp_data[0][key] !== except_name) {
                    temp_data[0][key] += parseFloat(uc(node.data[key]));
                }
            }
        }
    });
    api.setGridOption("pinnedBottomRowData", temp_data);
}