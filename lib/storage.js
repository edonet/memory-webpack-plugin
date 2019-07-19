/**
 *****************************************
 * Created by edonet@163.com
 * Created on 2019-07-19 11:25:48
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 加载依赖
 *****************************************
 */
const path = require('path');
const split = require('./helpers/split');


/**
 *****************************************
 * 存储数据
 *****************************************
 */
const context = __dirname;
const storage = Object.create(null);


/**
 *****************************************
 * 设置数据
 *****************************************
 */
function set(key, value) {

    // 格式化路径
    if (!path.isAbsolute(key)) {
        key = path.resolve(context, '@memory', key);
    }

    // 缓存数据
    storage[split(key)[0]] = value;
}


/**
 *****************************************
 * 获取数据
 *****************************************
 */
function get(key) {

    // 格式化路径
    if (!path.isAbsolute(key)) {
        key = path.resolve(context, '@memory', key);
    }

    // 返回缓存
    return storage[key] || storage[split(key)[0]];
}


/**
 *****************************************
 * 匹配缓存
 *****************************************
 */
function match(key) {
    return key in storage || split(key)[0] in storage;
}


/**
 *****************************************
 * 获取状态
 *****************************************
 */
function stat() {
    return { isDirectory: () => false, isFile: () => true };
}


/**
 *****************************************
 * 代理输入模块
 *****************************************
 */
function proxy(inputSystem) {
    let fs = Object.create(inputSystem);

    // 拦截异步获取状态
    fs.stat = (key, callback) => {
        key in storage ? callback(null, stat(key)) : inputSystem.stat(key, callback);
    };

    // 拦截同步获取状态
    fs.statSync = (key) => {
        return key in storage ? stat(key) : inputSystem.statSync(key);
    };

    // 返回结果
    return fs;
}


/**
 *****************************************
 * 抛出接口
 *****************************************
 */
module.exports = { context, set, get, match, proxy };
