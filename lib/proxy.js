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
const storage = require('./storage');


/**
 *****************************************
 * 创建存储代理
 *****************************************
 */
module.exports = (plugin, compiler) => {

    // 更新标识
    compiler.$$memoryStorage = storage;

    // 代理文件系统
    compiler.inputFileSystem = storage.proxy(compiler.inputFileSystem);

    // 添加加载器
    compiler.hooks.afterEnvironment.tap(plugin.descriptor, () => {
        compiler.options.module.rules.push({
            test: storage.match,
            loader: path.resolve(__dirname, 'loader.js'),
            options: storage
        });
    });

    // 添加模块创建勾子
    compiler.hooks.normalModuleFactory.tap(plugin.descriptor, nmf => {
        nmf.hooks.beforeResolve.tap(plugin.descriptor, data => {
            if (data.request.startsWith('@memory/')) {

                // 更新资源连接
                data.request = path.join(storage.context, data.request);

                // 返回结果
                return data;
            }
        });
    });

    // 添加资源接口
    compiler.hooks.compilation.tap(plugin.descriptor, compilation => {
        compilation.hooks.normalModuleLoader.tap(plugin.descriptor, context => {
            context.$memory = (key, value) => (
                value === undefined && typeof key === 'string' ?
                plugin.$get(key) :
                plugin.$set(key, value)
            );
        });
    });

    // 返回结果
    return storage;
};
