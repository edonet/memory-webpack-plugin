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
const parseResource = require('./helpers/parseResource');
const resolveLoader = require('./helpers/resolveLoader');


/**
 *****************************************
 * 定义缓存
 *****************************************
 */
const cached = {
    idents: Object.create(null),
    memory: Object.create(null)
};


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
        let rules = compiler.options.module.rules,
            loader = path.resolve(__dirname, 'loader.js');

        // 避免重复添加加载器
        if (rules.find(rule => rule.loader === loader)) {
            return;
        }

        // 添加加载器
        rules.unshift({ test: loader, loader, options: cached });

        // 添加模块创建勾子
        compiler.hooks.normalModuleFactory.tap(this.descriptor, nmf => {
            nmf.hooks.beforeResolve.tap(this.descriptor, data => {
                if (data.request.startsWith('@memory/')) {
                    let resource = data.request.slice(8),
                        query = '?ident&memory=' + resource;

                    // 缓存加载器
                    if (!cached.idents[query]) {
                        cached.idents[query] = resolveLoader(
                            nmf.ruleSet.exec({ issuer: data.context, ...parseResource(resource) })
                        );
                    }

                    // 更新资源连接
                    data.request = loader + query;

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
                    cached.memory[key[0] === '/' ? key.slice(1) : key] = value;
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

            // 兼容路径
            if (key[0] === '/') {
                key = key.slice(1);
            }

            // 去除参数
            if (!(key in cached.memory)) {
                let idx = key.indexOf('?');

                if (idx > -1) {
                    key = key.slice(0, idx);
                }
            }

            // 返回结果
            return cached.memory[key];
        }
    }
}


/**
 *****************************************
 * 抛出接口
 *****************************************
 */
module.exports = MemoryWebpackPlugin;
