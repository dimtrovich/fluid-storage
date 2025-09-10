import { StorageCore } from './storage';
import { FluidStorageUtils } from './types';

// Mixin pour les méthodes utilitaires

export class StorageUtils extends StorageCore implements FluidStorageUtils
{
	public increment(key: string, value: number = 1): number {
		const current = this.get(key) || 0;

		if (typeof current !== 'number') {
			throw new Error(`Cannot increment non-numeric value for key: ${key}`);
		}

		const newValue = current + value;
		this.set(key, newValue);

		return newValue;
	}

	public decrement(key: string, value: number = 1): number {
		return this.increment(key, -value);
	}

	public remember(key: string, callback: () => any, expire?: number): any {
		const value = this.get(key);

		if (value !== null) {
			return value;
		}

		const newValue = typeof callback === 'function' ? callback() : callback;
		this.set(key, newValue, expire);

		return newValue;
	}

	public pull(key: string): any {
		const value = this.get(key);
		this.remove(key);

		return value;
	}

	public has(key: string): boolean {
		return this.get(key) !== null;
	}

	public put(key: string, value: any, expire?: number): this {
		return this.set(key, value, expire);
	}

	public add(key: string, value: any, expire?: number): boolean {
		if (this.has(key)) {
			return false;
		}

		this.set(key, value, expire);

		return true;
	}

	public forever(key: string, value: any): this {
		return this.set(key, value, 0);
	}

	public forget(...keys: string[]): this {
		return this.remove(...keys);
	}

	public flush(): this {
		return this.clear();
	}

	public exists(key: string): boolean {
		return this.has(key);
	}

	public missing(key: string): boolean {
		return !this.has(key);
	}

	public except(...keys: string[]): { [key: string]: any } {
		const allData = this.getAll();
		for (const key of keys) {
			delete allData[key];
		}
		return allData;
	}

	public hasAny(keys: string[]): boolean {
		return keys.some(key => this.has(key));
	}

	public hasAll(keys: string[]): boolean {
		return keys.every(key => this.has(key));
	}

	public missingAny(keys: string[]): boolean {
		return keys.some(key => !this.has(key));
	}

	public missingAll(keys: string[]): boolean {
		return keys.every(key => !this.has(key));
	}

	public only(...keys: string[]): { [key: string]: any } {
		const result: { [key: string]: any } = {};
		for (const key of keys) {
			const value = this.get(key);
			if (value !== null) {
				result[key] = value;
			}
		}
		return result;
	}

	public first(keys: string[]): any {
		for (const key of keys) {
			const value = this.get(key);
			if (value !== null) {
				return value;
			}
		}
		return null;
	}

	public last(keys: string[]): any {
		for (let i = keys.length - 1; i >= 0; i--) {
			const value = this.get(keys[i]);
			if (value !== null) {
				return value;
			}
		}
		return null;
	}

	public random(count: number = 1): any | any[] {
		const allData = this.getAll();
		const keys = Object.keys(allData);

		if (keys.length === 0) {
			return count === 1 ? null : [];
		}

		if (count === 1) {
			const randomKey = keys[Math.floor(Math.random() * keys.length)];
			return allData[randomKey];
		}

		const result = [];
		const shuffledKeys = [...keys].sort(() => 0.5 - Math.random());

		for (let i = 0; i < Math.min(count, keys.length); i++) {
			result.push(allData[shuffledKeys[i]]);
		}

		return result;
	}

	public isEmpty(key: string): boolean {
		return this.empty(this.get(key));
	}

	public isNotEmpty(key: string): boolean {
		return !this.isEmpty(key);
	}

	public count(): number {
		return Object.keys(this.getAll()).length;
	}

	public keys(): string[] {
		return Object.keys(this.getAll());
	}

	public values(): any[] {
		return Object.values(this.getAll());
	}

	public keyExists(key: string): boolean {
		return this.keys().includes(key);
	}

	public tap(key: string, callback: (value: any) => any): this {
		const value = this.get(key);
		if (value !== null) {
			const newValue = callback(value);
			this.set(key, newValue);
		}
		return this;
	}

	public times(count: number, callback: (index: number) => any, expire?: number): this {
		for (let i = 0; i < count; i++) {
			this.set(`item_${i}`, callback(i), expire);
		}
		return this;
	}

	public wrap(key: string, callback: (value: any) => any, expire?: number): any {
		const value = this.get(key);
		const newValue = callback(value);
		this.set(key, newValue, expire);

		return newValue;
	}

	public expireMany(keys: string[], minutes: number): this {
		for (const key of keys) {
			this.expire(key, minutes);
		}
		return this;
	}

	public extend(key: string, minutes: number): this {
		const currentExpire = this.getExpire(key);

		if (currentExpire === null) {
			return this; // La clé n'existe pas
		}

		if (currentExpire === Infinity) {
			return this; // Déjà permanent, on ne change rien
		}

		const newExpire = currentExpire + minutes;
		return this.expire(key, newExpire);
	}

	public reduce(key: string, minutes: number): this {
		const currentExpire = this.getExpire(key);

		if (currentExpire === null) {
			return this; // La clé n'existe pas
		}

		if (currentExpire === Infinity) {
			// Si c'est permanent, on lui donne une expiration
			return this.expire(key, minutes);
		}

		const newExpire = Math.max(0, currentExpire - minutes);
		return this.expire(key, newExpire);
	}
}
