export const numberFormat = (value, decimals = 2) => {
    if (isNaN(value)) {
        return value;
    }
    // 如果返回的数是 int类型的最小值，返回 -
    if (value + '' === '-2147483648') {
        return '-';
    }
    // 将value转成字符串，然后才能使用字符串方法
    value = '' + value;
    let sign = '';
    if (['-', '+'].includes(value[0])) {
        sign = value[0];
        value = value.slice(1);
    }

    let intPart = Number(value) - (Number(value) % 1); // 获取整数部分
    let intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,'); // 将整数部分逢三一断

    let value2Array = value.toString().split('.');
    // 表示数据有小数位
    if (value2Array.length === 2 && decimals > 0) {
        let floatPart = value2Array[1].toString();
        floatPart = Number('0.' + floatPart).toFixed(decimals).slice(2);
        return `${sign}${intPartFormat}.${floatPart}`;
    } else {
        return `${sign}${intPartFormat}`;
    }
};

/**
 * 删除当前url中指定参数
 * @param names 数组或字符串
 * @returns {string}
 */
export function urlDelP(url, name){
    var urlArr = url.split('?');
    if(urlArr.length>1 && urlArr[1].indexOf(name)>-1){
        var query = urlArr[1];
        var obj = {}
        var arr = query.split('&');
        for (var i = 0; i < arr.length; i++) {
            arr[i] = arr[i].split('=');
            obj[arr[i][0]] = arr[i][1];
        };
        delete obj[name];
        var urlte = urlArr[0] + '?' + JSON.stringify(obj).replace(/["{}]/g, '').replace(/:/g, '=').replace(/,/g, '&');
        return arr.length > 1 ? urlte : urlte.replace('?', '');
    }else{
        return url;
    };
}