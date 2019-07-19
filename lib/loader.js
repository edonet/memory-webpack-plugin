/**
 *****************************************
 * Created by edonet@163.com
 * Created on 2019-07-16 20:27:23
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 定义加载器
 *****************************************
 */
module.exports = code => code;


/**
 *****************************************
 * 定义拦截器
 *****************************************
 */
module.exports.pitch = function pitch() {
    let data = this.query.get(this.resourcePath);

    // 处理数据
    if (typeof data === 'function') {
        data = data.call(this, this.resourceQuery);
    }

    // 返回数据
    return data;
};
