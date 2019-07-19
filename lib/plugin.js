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
const proxy = require('./proxy');


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
        this.data = data;
    }

    // 执行插件
    apply(compiler) {

        // 统一资源存储
        if (!compiler.$$memoryStorage) {
            compiler.$$memoryStorage = proxy(this, compiler);
        }

        // 设置存储
        this.storage = compiler.$$memoryStorage;

        // 设置数据
        this.$set(this.data);

        // 执行准备就绪回调
        this.ready && this.ready(compiler);
    }

    /* 设置缓存 */
    $set(key, value) {
        if (key) {
            switch (typeof key) {
                case 'string':
                    this.storage.set(key, value);
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
            return this.storage.get(key);
        }
    }
}


/**
 *****************************************
 * 抛出接口
 *****************************************
 */
module.exports = MemoryWebpackPlugin;
