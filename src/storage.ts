import { FluidStorageCore, StorageAdapter, StorageData } from './types';

export class StorageCore implements FluidStorageCore
{
	protected adapter: StorageAdapter;
	protected defaultExpire?: number;

	constructor(adapter: StorageAdapter, defaultExpire?: number) {
		this.adapter = adapter;
		this.defaultExpire = defaultExpire;
	}

	public get(key: string | string[]): any | any[] | null {
		if (Array.isArray(key)) {
			return this.many(key);
		}

		const data = this.adapter.get(key);

		if (this.empty(data)) {
			return null;
		}

		try {
			const parsedData = JSON.parse(data as string);
			const expire = parsedData.expire || 0;

			if (expire > 0 && (Date.now() >= expire)) {
				this.remove(key);
				return null;
			}

			return parsedData.value || parsedData;
		} catch (e) {
			return null;
		}
	}

	public many(keys: string[]): { [key: string]: any } {
		const result: { [key: string]: any } = {};

		for (const key of keys) {
			result[key] = this.get(key);
		}

		return result;
	}

	public set(key: string | { [key: string]: any }, value?: any, expire?: number): this {
		if (typeof key === 'object' && !Array.isArray(key)) {
			return this.setMany(key, value as number); // value is used as expire in this case
		}

		const expireTime = expire !== undefined ? expire : this.defaultExpire;
		const finalExpire = (!isNaN(Number(expireTime)) && isFinite(Number(expireTime))) ? Number(expireTime) : 0;

		const clonedValue = JSON.parse(JSON.stringify(value));
		let expirationTime = 0;

		if (finalExpire > 0) {
			expirationTime = Date.now() + (finalExpire * 60 * 1000);
		}

		const data: StorageData = {
			value: clonedValue,
			expire: expirationTime
		};

		this.adapter.set(key as string, JSON.stringify(data), finalExpire);

		return this;
	}

	public setMany(values: { [key: string]: any }, expire?: number): this {
		for (const [key, value] of Object.entries(values)) {
			this.set(key, value, expire);
		}

		return this;
	}

	public remove(...keys: string[]): this {
		for (const key of keys) {
			this.adapter.remove(key);
		}

		return this;
	}

	public clear(): this {
		this.adapter.clear();

		return this;
	}

	public getAll(): { [key: string]: any } {
		const allData = this.adapter.getAll();
		const result: { [key: string]: any } = {};

		for (const [key, value] of Object.entries(allData)) {
			try {
				const parsedData = JSON.parse(value);

				// Vérifier l'expiration
				if (parsedData.expire && Date.now() >= parsedData.expire) {
					this.remove(key.replace(this.adapter.getPrefix() + '.', ''));
					continue;
				}

				result[key.replace(this.adapter.getPrefix() + '.', '')] = parsedData.value || parsedData;
			} catch (e) {
				// En cas d'erreur de parsing, ignorer cette entrée
			}
		}

		return result;
	}

	public expire(key: string, minutes: number): this {
		const data = this.adapter.get(key);

		if (this.empty(data)) {
			return this;
		}

		try {
			const parsedData = JSON.parse(data as string);
			let expirationTime = 0;

			if (minutes > 0) {
				expirationTime = Date.now() + (minutes * 60 * 1000);
			}

			// Garder la valeur existante, ne changer que l'expiration
			const newData: StorageData = {
				value: parsedData.value || parsedData,
				expire: expirationTime
			};

			this.adapter.set(key, JSON.stringify(newData), minutes);
		} catch (e) {
			// En cas d'erreur, on ne fait rien
		}

		return this;
	}

	public getExpire(key: string): number | null {
		const data = this.adapter.get(key);

		if (this.empty(data)) {
			return null;
		}

		try {
			const parsedData = JSON.parse(data as string);
			const expire = parsedData.expire || 0;

			if (expire === 0) {
				return Infinity; // N'expire jamais
			}

			const remainingTime = expire - Date.now();
			return remainingTime > 0 ? Math.ceil(remainingTime / 1000 / 60) : 0;
		} catch (e) {
			return null;
		}
	}

	protected empty(value: any): boolean {
		if (value === null || value === undefined) {
			return true;
		}
		if (typeof value === 'string' && value === '') {
			return true;
		}
		if (Array.isArray(value) && value.length === 0) {
			return true;
		}
		if (typeof value === 'object' && Object.keys(value).length === 0) {
			return true;
		}
		return false;
	}
}
