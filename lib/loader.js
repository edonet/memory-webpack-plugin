/**
 *****************************************
 * Created by edonet@163.com
 * Created on 2019-07-16 20:27:23
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 加载依赖
 *****************************************
 */
const parseResource = require('./helpers/parseResource');


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
    let query = this.resourceQuery || '';

    // 重写向资源
    if (query.startsWith('?ident&')) {
        let idents = this.query.idents,
            loader = idents && idents[query];

        // 处理加载器
        if (loader) {
            let resource = this.resourcePath + '?' + query.slice(7),
                request = JSON.stringify(loader + '!' + resource);

            // 返回重定向入口
            return `module.exports = require(${ request });`;
        }

        // 返回空
        return '';
    }

    // 获取源码
    if (query.startsWith('?memory=')) {
        let memory = this.query.memory;

        // 获取数据
        if (memory) {
            let data = parseResource(query.slice(8)),
                source = memory[data.resource] || memory[data.resourcePath];

            // 获取代码
            if (source && typeof source === 'function') {
                source = source.call(this, data);
            }

            // 返回代码
            return source || '';
        }
    }

    // 返回空
    return '';
};
