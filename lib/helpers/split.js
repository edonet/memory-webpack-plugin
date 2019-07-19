/**
 *****************************************
 * Created by edonet@163.com
 * Created on 2019-07-19 15:14:03
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 分割字符
 *****************************************
 */
module.exports = (str, sep = '?') => {
    let idx = str.indexOf(sep);

    // 存在分割
    if (idx > -1) {
        return [str.slice(0, idx), str.slice(idx), str];
    }

    // 返回
    return [str, '', str];
};
