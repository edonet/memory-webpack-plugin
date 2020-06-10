/**
 *****************************************
 * 缓存资源
 *****************************************
 */
declare class MemoryWebpackPlugin {

    /** 处理编译 */
    protected apply(...args: unknown[]): void;

    /** 设置资源 */
    set(name: string, loader: (this: this, api: this) => unknown): void;
    set(options: Record<string, (this: this, api: this) => unknown>): void;
}


/**
 *****************************************
 * 抛出接口
 *****************************************
 */
export = MemoryWebpackPlugin;
