import { BaseAdapter } from './base-adapter';

export class SessionStorageAdapter extends BaseAdapter
{
	get(key: string): string | null {
		return window.sessionStorage.getItem(this.normalizeKey(key));
	}

	set(key: string, value: string, expire?: number): void {
		window.sessionStorage.setItem(this.normalizeKey(key), value);
	}

	remove(key: string): void {
		window.sessionStorage.removeItem(this.normalizeKey(key));
	}

	clear(): void {
		const regex = new RegExp('^' + this.prefix + '\\.');

		for (let i = 0; i < window.sessionStorage.length; i++) {
			const key = window.sessionStorage.key(i);
			if (key && regex.test(key)) {
				window.sessionStorage.removeItem(key);
			}
		}
	}

	getAll(): { [key: string]: string } {
		const result: { [key: string]: string } = {};
		const regex = new RegExp('^' + this.prefix + '\\.');

		for (let i = 0; i < window.sessionStorage.length; i++) {
			const key = window.sessionStorage.key(i);
			if (key && regex.test(key)) {
				result[key] = window.sessionStorage.getItem(key) as string;
			}
		}

		return result;
	}
}
