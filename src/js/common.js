
/**
 * 빈값 체크
 * @param text
 * @param rText
 * @returns {string}
 */
export function g_nvl(text, rText) {
    if (text === null || text === undefined) text = "";
    if (rText !== null && rText !== undefined && text === "") text = rText;
    return text;
}

/**
 * 콤마찍기
 */
export function comma(str) {
    str = String(Number(String(g_nvl(str, "0")).replace(/[^0-9-]/g,"")));
    return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, "$1,");
}

/**
 * 콤마풀기
 * null_allowed_flag에 따라 return을 0 or ""로 함.
 * @param str
 * @param null_flag
 * @returns {string|number}
 */
export function uc(str, null_flag) {
    if(str == "" || str == null){
        if(null_flag){
            return "";
        }else{
            return 0;
        }
    }

    // String 바꿔주는 이유: replace() -> number 일때 사용불가
    let replace_str = String(str);
    let minus_flag = "";
    if( replace_str.indexOf("-")>-1){
        minus_flag = "-";
    }
    return minus_flag + replace_str.replace(/[^\d.]+/g, '');    // 소수점도 제대로 반영되게끔 정규식에 추가
}