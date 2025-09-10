import { BaseAdapter } from './base-adapter';

export class LocalStorageAdapter extends BaseAdapter
{
  	get(key: string): string | null {
    	return window.localStorage.getItem(this.normalizeKey(key));
  	}

  	set(key: string, value: string, expire?: number): void {
    	window.localStorage.setItem(this.normalizeKey(key), value);
  	}

  	remove(key: string): void {
    	window.localStorage.removeItem(this.normalizeKey(key));
  	}

  	clear(): void {
		const regex = new RegExp('^' + this.prefix + '\\.');

		for (let i = 0; i < window.localStorage.length; i++) {
			const key = window.localStorage.key(i);
			if (key && regex.test(key)) {
				window.localStorage.removeItem(key);
			}
		}
	}

  	getAll(): { [key: string]: string } {
		const result: { [key: string]: string } = {};
		const regex = new RegExp('^' + this.prefix + '\\.');

		for (let i = 0; i < window.localStorage.length; i++) {
			const key = window.localStorage.key(i);
			if (key && regex.test(key)) {
				result[key] = window.localStorage.getItem(key) as string;
			}
		}

		return result;
	}
}
