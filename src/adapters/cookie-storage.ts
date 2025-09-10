import { BaseAdapter } from './base-adapter';

export class CookieStorageAdapter extends BaseAdapter
{
	get(key: string): string | null {
		const cookies = this.getAllCookies();
		const normalizedKey = this.normalizeKey(key);
		return cookies[normalizedKey] || null;
	}

	set(key: string, value: string, expire?: number): void {
		const normalizedKey = this.normalizeKey(key);
		let expireDate = '';

		if (expire && expire > 0) {
			const expireTime = Date.now() + (expire * 60 * 1000);
			expireDate = '; expires=' + (new Date(expireTime)).toUTCString();
		}

		document.cookie = `${normalizedKey}=${encodeURIComponent(value)}${expireDate}; path=/`;
	}

	remove(key: string): void {
		const normalizedKey = this.normalizeKey(key);
		document.cookie = `${normalizedKey}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC`;
	}

	clear(): void {
		const cookies = this.getAllCookies();
		const regex = new RegExp('^' + this.prefix + '\\.');

		for (const key in cookies) {
			if (regex.test(key)) {
				this.remove(key.replace(this.prefix + '.', ''));
			}
		}
	}

	getAll(): { [key: string]: string } {
		const cookies = this.getAllCookies();
		const result: { [key: string]: string } = {};
		const regex = new RegExp('^' + this.prefix + '\\.');

		for (const key in cookies) {
			if (regex.test(key)) {
				result[key] = cookies[key];
			}
		}

		return result;
	}

	private getAllCookies(): { [key: string]: string } {
		const cookiesArr = document.cookie.split(';');
		const cookies: { [key: string]: string } = {};

		cookiesArr.forEach(elt => {
			const parts = elt.split('=');
			if (parts.length >= 2) {
				const key = parts[0].trim();
				const value = decodeURIComponent(parts.slice(1).join('='));
				cookies[key] = value;
			}
		});

		return cookies;
	}
}
