/**
 *****************************************
 * Created by edonet@163.com
 * Created on 2020-06-13 15:11:20
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
 * 代理对象
 *****************************************
 */
class Proxy {

    /* 初始化对象 */
    constructor({ moduleDir }) {

        // 缓存资源
        this.assets = new Map();

        // 绑定设置函数
        this.set = this.set.bind(this);

        // 模块目录
        this.moduleDir = moduleDir || 'node_modules';

        // 加载器
        this.loader = {
            test: id => this.assets.has(id),
            enforce: 'pre',
            loader: path.join(__dirname, 'loader.js'),
            options: this.assets
        };
    }

    /* 获取资源状态 */
    stat() {
        return { isDirectory: () => false, isFile: () => true };
    }

    // 添加资源
    add(id, handler) {

        // 获取路径
        id = path.isAbsolute(id) ? id : path.resolve(this.moduleDir, id);

        // 设置资源
        this.assets.set(id, handler || '');

        // 返回路径
        return id;
    }

    // 设置资源
    set(id, handler) {

        // 自定义处理
        if (typeof id === 'function') {
            id = id.call(this, this);
        }

        // 处理资源
        if (id) {
            switch (typeof id) {
                case 'string':
                    return this.add(id, handler);
                case 'object':
                    if (Array.isArray(id)) {
                        return id.reduce((res, opts) => res.concat(this.set(this, opts)), []);
                    } else {
                        return Object.keys(id).map(key => this.add(key, id[key]));
                    }
                default:
                    throw new Error(`invalid cache id ${JSON.stringify(id)}`);
            }
        }
    }

    // 应用代理
    apply(fs) {
        let proxied = Object.create(fs);

        // 获取文件状态
        proxied.stat = (id, callback) => {
            this.assets.has(id) ? callback(null, this.stat()) : fs.stat(id, callback);
        };

        // 同步获取文件状态
        proxied.statSync = id => {
            return this.assets.has(id) ? this.stat() : fs.statSync(id);
        };

        // 返回结果
        return proxied;
    }
}



/**
 *****************************************
 * 抛出接口
 *****************************************
 */
module.exports = { Proxy };
