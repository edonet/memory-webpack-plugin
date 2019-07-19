/**
 *****************************************
 * Created by edonet@163.com
 * Created on 2019-07-16 17:48:09
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
 * 内存资源插件
 *****************************************
 */
class MemoryWebpackPlugin {

    /* 初始化插件 */
    constructor(data) {

        // 定义描述
        this.descriptor = { name: 'memory-webpack-plugin' };

        // 设置存储
        this.$set(data);
    }

    // 执行插件
    apply(compiler) {

        // 避免重复添加加载器
        if (MemoryWebpackPlugin.ready) {
            return;
        }

        // 更新标识
        MemoryWebpackPlugin.ready = true;

        // 代理文件系统
        compiler.inputFileSystem = storage.proxy(compiler.inputFileSystem);

        // 添加加载器
        compiler.hooks.afterEnvironment.tap(this.descriptor, () => {
            compiler.options.module.rules.push({
                test: storage.match,
                loader: path.resolve(__dirname, 'loader.js'),
                options: storage
            });
        });

        // 添加模块创建勾子
        compiler.hooks.normalModuleFactory.tap(this.descriptor, nmf => {
            nmf.hooks.beforeResolve.tap(this.descriptor, data => {
                if (data.request.startsWith('@memory/')) {

                    // 更新资源连接
                    data.request = path.join(storage.context, data.request);

                    // 返回结果
                    return data;
                }
            });
        });

        // 添加资源接口
        compiler.hooks.compilation.tap(this.descriptor, compilation => {
            compilation.hooks.normalModuleLoader.tap(this.descriptor, context => {
                context.$memory = (key, value) => (
                    value === undefined && typeof key === 'string' ?
                    this.$get(key) :
                    this.$set(key, value)
                );
            });
        });
    }

    /* 设置缓存 */
    $set(key, value) {
        if (key) {
            switch (typeof key) {
                case 'string':
                    storage.set(key, value);
                    break;
                case 'object':
                    Object.keys(key).forEach(k => this.$set(k, key[k]));
                    break;
                default:
                    break;
            }
        }
    }

    // 获取数据
    $get(key) {
        if (key && typeof key === 'string') {
            return storage.get(key);
        }
    }
}


/**
 *****************************************
 * 抛出接口
 *****************************************
 */
module.exports = MemoryWebpackPlugin;
