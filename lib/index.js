/**
 *****************************************
 * Created by edonet@163.com
 * Created on 2019-07-19 19:29:43
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 加载依赖
 *****************************************
 */
const path = require('path');


/**
 *****************************************
 * 缓存资源
 *****************************************
 */
const assets = new Map();


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
 * 添加资源
 *****************************************
 */
function set(id, handler) {
    if (typeof id === 'string') {
        assets.set(path.isAbsolute(id) ? id : path.resolve('node_modules', id), handler);
    }
}


/**
 *****************************************
 * 代理资源
 *****************************************
 */
function proxy(fs) {
    let proxied = Object.create(fs);

    // 获取文件状态
    proxied.stat = (id, callback) => {
        assets.has(id) ? callback(null, stat()) : fs.stat(id, callback);
    };

    // 同步获取文件状态
    proxied.statSync = id => {
        return assets.has(id) ? stat() : fs.statSync(id);
    };

    // 返回结果
    return proxied;
}


/**
 *****************************************
 * 缓存资源
 *****************************************
 */
class MemoryWebpackPlugin {

    /* 初始化对象 */
    constructor(options) {

        // 定义描述
        this.descriptor = { name: 'memory-webpack-plugin' };

        // 生成资源
        this.set(options);
    }

    /* 执行插件 */
    apply(compiler) {

        // 已经代理过
        if (!compiler.$$memoryProxied) {

            // 设置标识
            compiler.$$memoryProxied = true;

            // 代理文件系统
            compiler.inputFileSystem = proxy(compiler.inputFileSystem);

            // 添加加载器
            compiler.hooks.afterEnvironment.tap(this.descriptor, () => {
                compiler.options.module.rules.push({
                    test: id => assets.has(id),
                    enforce: 'pre',
                    loader: path.join(__dirname, 'loader.js'),
                    options: assets
                });
            });
        }

        // 执行就绪函数
        this.ready && this.ready(compiler);
    }

    /* 生成虚拟资源 */
    set(...args) {
        let options = args[0];

        // 添加资源
        if (typeof options === 'string') {
            return set(...args);
        }

        // 处理自定义处理函数
        if (typeof options === 'function') {
            options = options.call({ set }, set);
        }

        // 添加资源
        if (options && typeof options === 'object') {
            if (Array.isArray(options)) {
                options.forEach(opts => this.set(opts));
            } else {
                Object.keys(options).forEach(key => set(key, options[key]));
            }
        }
    }
}


/**
 *****************************************
 * 抛出接口
 *****************************************
 */
module.exports = MemoryWebpackPlugin;
