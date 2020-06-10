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
        data = data.call(this, this);
    }

    // 返回结果
    return resolve(data);
};


/**
 *****************************************
 * 解析数据
 *****************************************
 */
function resolve(data) {

    // 处理异步延时
    if (data instanceof Promise) {
        return data.then(resolve);
    }

    // 返回源数据
    if (typeof data === 'string' || typeof data === 'undefined' || data instanceof Buffer) {
        return data;
    }

    // 格式化数据
    return `export default ${ JSON.stringify(data) }`;
}
