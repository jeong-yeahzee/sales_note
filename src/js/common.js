
/**
 * 빈값 체크
 * @param text
 * @param rText
 * @returns {string}
 */
export function g_nvl(text, replace_text) {
    if (text === null || text === undefined) text = "";
    if (replace_text !== null && replace_text !== undefined && text === "") text = replace_text;
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

/** 이모티콘 체크 */
export function validate_emojis(value) {
    const regex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u2604]|[\u2607-\u2609]|[\u2610-\u2619]|[\u2620-\u2659]|[\u2671-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
    return regex.test(value);
}

/** 바이트 계산 */
export function byte_check(text) {
    let byte = 0;
    for (let i = 0; i < text.length; i++) {
        let one_char = escape(text.charAt(i));
        if (one_char.length == 1) {
            byte++;
        } else if (one_char.indexOf("%u") != -1) {
            byte += 3;
        } else if (one_char.indexOf("%") != -1) {
            byte++;
        }
    }
    return byte;
}