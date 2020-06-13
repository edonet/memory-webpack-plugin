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
const { Proxy } = require('./proxy');


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

        // 处理队列
        this.$$queue = [];

        // 设置资源
        this.set = (...args) => this.$$queue.push(args);

        // 添加配置
        this.set(options);
    }

    /* 执行插件 */
    apply(compiler) {

        // 已经代理过
        if (!compiler.$$memoryProxied) {
            let proxy = new Proxy({
                    moduleDir: compiler.options.resolve.modules[0] || 'node_modules',
                });

            // 设置标识
            compiler.$$memoryProxied = proxy;

            // 代理文件系统
            compiler.inputFileSystem = proxy.apply(compiler.inputFileSystem);

            // 添加加载器
            compiler.hooks.afterEnvironment.tap(
                this.descriptor,
                () => {
                    compiler.options.module.rules.push(proxy.loader);
                }
            );
        }

        // 模块目录
        this.set = compiler.$$memoryProxied.set;

        // 执行队列
        this.$$queue.forEach(args => this.set.apply(this, args));
        this.$$queue = null;

        // 执行就绪函数
        this.ready && this.ready(compiler);
    }
}


/**
 *****************************************
 * 抛出接口
 *****************************************
 */
module.exports = MemoryWebpackPlugin;
