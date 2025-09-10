import { StorageUtils } from '../src/utils';
import { StorageAdapter } from '../src/types';

class MockAdapter implements StorageAdapter {
  	private store: { [key: string]: string } = {};

  	get(key: string): string | null {
    	return this.store[key] || null;
  	}

  	set(key: string, value: string, expire?: number): void {
    	this.store[key] = value;
  	}

  	remove(key: string): void {
    	delete this.store[key];
  	}

  	clear(): void {
    	this.store = {};
  	}

  	getAll(): { [key: string]: string } {
    	return { ...this.store };
  	}

  	getPrefix(): string {
    	return 'mock';
  	}
}

describe('StorageUtils', () => {
  	let adapter: MockAdapter;
  	let storage: StorageUtils;

  	beforeEach(() => {
    	adapter = new MockAdapter();
    	storage = new StorageUtils(adapter);
  	});

	test('should increment numeric value', () => {
		storage.set('counter', 5);
		const result = storage.increment('counter', 3);
		expect(result).toBe(8);
		expect(storage.get('counter')).toBe(8);
	});

	test('should decrement numeric value', () => {
		storage.set('counter', 10);
		const result = storage.decrement('counter', 3);
		expect(result).toBe(7);
		expect(storage.get('counter')).toBe(7);
	});

	test('should throw error when incrementing non-numeric value', () => {
		storage.set('counter', 'not a number');
		expect(() => storage.increment('counter')).toThrow();
	});

	test('should remember value with callback', () => {
		const callback = jest.fn(() => 'computed value');
		const result1 = storage.remember('key1', callback);
		const result2 = storage.remember('key1', callback);

		expect(result1).toBe('computed value');
		expect(result2).toBe('computed value');
		expect(callback).toHaveBeenCalledTimes(1); // Should be cached
	});

	test('should pull value (get and remove)', () => {
		storage.set('key1', 'value1');
		const value = storage.pull('key1');
		expect(value).toBe('value1');
		expect(storage.get('key1')).toBeNull();
	});

	test('should check if key exists', () => {
		storage.set('key1', 'value1');
		expect(storage.has('key1')).toBe(true);
		expect(storage.has('key2')).toBe(false);
	});

	test('should add value only if not exists', () => {
		const result1 = storage.add('key1', 'value1');
		const result2 = storage.add('key1', 'value2');

		expect(result1).toBe(true);
		expect(result2).toBe(false);
		expect(storage.get('key1')).toBe('value1');
	});

	test('should check if any key exists', () => {
		storage.set('key1', 'value1');
		expect(storage.hasAny(['key1', 'key2'])).toBe(true);
		expect(storage.hasAny(['key3', 'key4'])).toBe(false);
	});

	test('should check if all keys exist', () => {
		storage.set('key1', 'value1');
		storage.set('key2', 'value2');
		expect(storage.hasAll(['key1', 'key2'])).toBe(true);
		expect(storage.hasAll(['key1', 'key3'])).toBe(false);
	});

	test('should get only specified keys', () => {
		storage.set('key1', 'value1');
		storage.set('key2', 'value2');
		storage.set('key3', 'value3');

		const result = storage.only('key1', 'key3');

		expect(result).toEqual({
			key1: 'value1',
			key3: 'value3'
		});
	});

	test('should get all except specified keys', () => {
		storage.set('key1', 'value1');
		storage.set('key2', 'value2');
		storage.set('key3', 'value3');

		const result = storage.except('key2');

		expect(result).toEqual({
			key1: 'value1',
			key3: 'value3'
		});
	});

	test('should get first existing value from array', () => {
		storage.set('key2', 'value2');
		const result = storage.first(['key1', 'key2', 'key3']);
		expect(result).toBe('value2');
	});

	test('should get last existing value from array', () => {
		storage.set('key1', 'value1');
		storage.set('key3', 'value3');
		const result = storage.last(['key1', 'key2', 'key3']);
		expect(result).toBe('value3');
	});

	test('should get random values', () => {
		storage.set('key1', 'value1');
		storage.set('key2', 'value2');
		storage.set('key3', 'value3');

		const result = storage.random(2);
		expect(Array.isArray(result)).toBe(true);
		expect(result.length).toBe(2);
	});

	test('should check if value is empty', () => {
		storage.set('emptyString', '');
		storage.set('emptyArray', []);
		storage.set('emptyObject', {});
		storage.set('nonEmpty', 'value');

		expect(storage.isEmpty('emptyString')).toBe(true);
		expect(storage.isEmpty('emptyArray')).toBe(true);
		expect(storage.isEmpty('emptyObject')).toBe(true);
		expect(storage.isEmpty('nonEmpty')).toBe(false);
		expect(storage.isEmpty('nonExistent')).toBe(true);
	});

	test('should count stored items', () => {
		storage.set('key1', 'value1');
		storage.set('key2', 'value2');
		expect(storage.count()).toBe(2);
	});

	test('should get all keys and values', () => {
		storage.set('key1', 'value1');
		storage.set('key2', 'value2');

		expect(storage.keys()).toEqual(['key1', 'key2']);
		expect(storage.values()).toEqual(['value1', 'value2']);
	});

	test('should tap into value and modify it', () => {
		storage.set('user', { name: 'John', age: 30 });
		storage.tap('user', (user) => ({ ...user, age: 31 }));

		expect(storage.get('user')).toEqual({ name: 'John', age: 31 });
	});

	test('should extend expiration time', () => {
		jest.useFakeTimers();

		storage.set('key1', 'value1', 10); // 10 minutes
		const initialExpire = storage.getExpire('key1');

		storage.extend('key1', 5); // Add 5 minutes

		const newExpire = storage.getExpire('key1');
		expect(newExpire).toBe(initialExpire! + 5);

		jest.useRealTimers();
	});
});
