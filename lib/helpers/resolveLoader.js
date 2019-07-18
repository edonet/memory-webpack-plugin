/**
 *****************************************
 * Created by edonet@163.com
 * Created on 2019-07-18 09:41:35
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 解析加载器
 *****************************************
 */
function resolveLoader(rules) {
    let result = [];

    // 过滤数据
    rules.forEach(rule => {
        if (rule.type === 'use') {
            let { ident, loader } = rule.value;

            // 添加结果
            result.push(
                ident ?
                loader + '??' + ident :
                loader
            );
        }
    });

    // 返回结果
    return result.join('!');
}


/**
 *****************************************
 * 抛出接口
 *****************************************
 */
module.exports = resolveLoader;
