interface FluidStorageCore {
    get(key: string | string[]): any | any[] | null;
    many(keys: string[]): {
        [key: string]: any;
    };
    set(key: string | {
        [key: string]: any;
    }, value?: any, expire?: number): this;
    setMany(values: {
        [key: string]: any;
    }, expire?: number): this;
    remove(...keys: string[]): this;
    clear(): this;
    getAll(): {
        [key: string]: any;
    };
    expire(key: string, minutes: number): this;
    getExpire(key: string): number | null;
}
interface FluidStorageUtils {
    exists(key: string): boolean;
    missing(key: string): boolean;
    except(...keys: string[]): {
        [key: string]: any;
    };
    hasAny(keys: string[]): boolean;
    hasAll(keys: string[]): boolean;
    missingAny(keys: string[]): boolean;
    missingAll(keys: string[]): boolean;
    only(...keys: string[]): {
        [key: string]: any;
    };
    first(keys: string[]): any;
    last(keys: string[]): any;
    random(count?: number): any | any[];
    isEmpty(key: string): boolean;
    isNotEmpty(key: string): boolean;
    count(): number;
    keys(): string[];
    values(): any[];
    keyExists(key: string): boolean;
    tap(key: string, callback: (value: any) => any): this;
    times(count: number, callback: (index: number) => any, expire?: number): this;
    wrap(key: string, callback: (value: any) => any, expire?: number): any;
    increment(key: string, value?: number): number;
    decrement(key: string, value?: number): number;
    remember(key: string, callback: () => any, expire?: number): any;
    pull(key: string): any;
    has(key: string): boolean;
    put(key: string, value: any, expire?: number): this;
    add(key: string, value: any, expire?: number): boolean;
    forever(key: string, value: any): this;
    forget(...keys: string[]): this;
    flush(): this;
    expireMany(keys: string[], minutes: number): this;
    extend(key: string, minutes: number): this;
    reduce(key: string, minutes: number): this;
}
interface StorageAdapter {
    get(key: string): string | null;
    set(key: string, value: string, expire?: number): void;
    remove(key: string): void;
    clear(): void;
    getAll(): {
        [key: string]: string;
    };
    getPrefix(): string;
}
type StorageType = 'localstorage' | 'sessionstorage' | 'cookie' | StorageAdapter;
type FluidStorage = FluidStorageCore & FluidStorageUtils;

declare abstract class BaseAdapter implements StorageAdapter {
    protected prefix: string;
    constructor(prefix: string);
    getPrefix(): string;
    protected normalizeKey(key: string): string;
    abstract get(key: string): string | null;
    abstract set(key: string, value: string, expire?: number): void;
    abstract remove(key: string): void;
    abstract clear(): void;
    abstract getAll(): {
        [key: string]: string;
    };
}

declare class CookieStorageAdapter extends BaseAdapter {
    get(key: string): string | null;
    set(key: string, value: string, expire?: number): void;
    remove(key: string): void;
    clear(): void;
    getAll(): {
        [key: string]: string;
    };
    private getAllCookies;
}

declare class LocalStorageAdapter extends BaseAdapter {
    get(key: string): string | null;
    set(key: string, value: string, expire?: number): void;
    remove(key: string): void;
    clear(): void;
    getAll(): {
        [key: string]: string;
    };
}

declare class SessionStorageAdapter extends BaseAdapter {
    get(key: string): string | null;
    set(key: string, value: string, expire?: number): void;
    remove(key: string): void;
    clear(): void;
    getAll(): {
        [key: string]: string;
    };
}

/**!
 * Fluid Storage v1.0.0 (https://github.com/dimtrovich/fluid-storage)
 * Copyright 2025 Dimtrov Lab's | Dimitri Sitchet Tomkeu
 * Licensed under MIT (https://opensource.org/licences/mit)
 *
 * @author Dimitri Sitchet Tomkeu <devcode.dst@gmail.com>
 * @copyright Dimtrov Lab's | Dimitri Sitchet Tomkeu
 * @description Une interface de stockage structuré de données côté client simple et rapide
 * @version 1.0.0
 * @licence MIT
 */

/**
 * Initialisation du gestionnaire de stockage
 */
declare function init(prefix?: string, type?: StorageType, defaultExpire?: number): FluidStorage;

declare const _default: {
    init: typeof init;
};

export { BaseAdapter, CookieStorageAdapter, LocalStorageAdapter, SessionStorageAdapter, _default as default, init };
