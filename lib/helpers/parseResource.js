/**
 *****************************************
 * Created by edonet@163.com
 * Created on 2019-07-18 09:21:17
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 解析路径
 *****************************************
 */
function parseResource(resource) {
    let idx = resource.indexOf('?'),
        resourcePath = resource,
        resourceQuery = '';

    // 分割路径
    if (idx > -1) {
        resourcePath = resource.slice(0, idx);
        resourceQuery = resource.slice(idx);
    }

    // 返回结果
    return {
        realResource: resourcePath,
        resource,
        resourcePath,
        resourceQuery
    };
}


/**
 *****************************************
 * 抛出接口
 *****************************************
 */
module.exports = parseResource;
