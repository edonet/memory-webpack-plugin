/**
 *****************************************
 * 模块样式
 *****************************************
 */
interface Module {
    context: string;
    rootContext: string;
    resource: string;
    resourcePath: string;
    resourceQuery: string;
    loaders: Record<string, unknown>[];
    loaderIndex: number;
    data: Record<string, unknown>;
    query: Record<string, unknown>;
    getOptions(schema?: string): Module['query'];
    cacheable(flag: boolean): void;
    async(): Module['callback'];
    callback(err: Error | null, content: string | Buffer, sourceMap?: unknown, meta?: unknown): void;
    resolve(context: string, request: string, callback: (err: Error | null, result: string) => void): void;
    loadModule(request: string, callback: (err: Error | null, source: string, sourceMap: unknown, module: unknown) => void): void;
    addDependency(file: string): void;
    addContextDependency(directory: string): void;
    clearDependencies(): void;
    emitFile(name: string, content: Buffer|string, sourceMap: unknown): void;
}


/**
 *****************************************
 * 缓存资源
 *****************************************
 */
declare class MemoryWebpackPlugin {

    /** 处理编译 */
    protected apply(...args: unknown[]): void;

    /** 设置资源 */
    set(name: string, loader: (this: Module, module: Module) => unknown): void;
    set(options: Record<string, (this: Module, module: Module) => unknown>): void;
}


/**
 *****************************************
 * 抛出接口
 *****************************************
 */
export = MemoryWebpackPlugin;
