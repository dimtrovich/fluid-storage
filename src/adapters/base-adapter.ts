import { StorageAdapter } from '../types';

export abstract class BaseAdapter implements StorageAdapter
{
  	protected prefix: string;

  	constructor(prefix: string) {
    	this.prefix = prefix;
  	}

	public getPrefix(): string {
		return this.prefix;
	}


	protected normalizeKey(key: string): string {
		return this.prefix + '.' + key.replace(new RegExp('^' + this.prefix + '\\.'), '');
	}

	abstract get(key: string): string | null;
	abstract set(key: string, value: string, expire?: number): void;
	abstract remove(key: string): void;
	abstract clear(): void;
	abstract getAll(): { [key: string]: string };
}
