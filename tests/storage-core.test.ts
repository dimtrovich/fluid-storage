import { StorageCore } from '../src/storage';
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

describe('StorageCore', () => {
	let adapter: MockAdapter;
	let storage: StorageCore;

	beforeEach(() => {
		adapter = new MockAdapter();
		storage = new StorageCore(adapter);
	});

	test('should set and get simple value', () => {
		storage.set('key1', 'value1');
		expect(storage.get('key1')).toBe('value1');
	});

	test('should set and get object value', () => {
		const testObj = { name: 'John', age: 30 };
		storage.set('key1', testObj);
		expect(storage.get('key1')).toEqual(testObj);
	});

	test('should set and get array value', () => {
		const testArray = [1, 2, 3];
		storage.set('key1', testArray);
		expect(storage.get('key1')).toEqual(testArray);
	});

	test('should return null for non-existent key', () => {
		expect(storage.get('nonExistent')).toBeNull();
	});

	test('should remove key', () => {
		storage.set('key1', 'value1');
		storage.remove('key1');
		expect(storage.get('key1')).toBeNull();
	});

	test('should clear all keys', () => {
		storage.set('key1', 'value1');
		storage.set('key2', 'value2');
		storage.clear();
		expect(storage.get('key1')).toBeNull();
		expect(storage.get('key2')).toBeNull();
	});

	test('should get multiple keys', () => {
		storage.set('key1', 'value1');
		storage.set('key2', 'value2');
		const result = storage.many(['key1', 'key2', 'key3']);

		expect(result).toEqual({
			key1: 'value1',
			key2: 'value2',
			key3: null
		});
	});

	test('should set multiple keys at once', () => {
		storage.setMany({
			key1: 'value1',
			key2: 'value2'
		});
		expect(storage.get('key1')).toBe('value1');
		expect(storage.get('key2')).toBe('value2');
	});

  	test('should handle expiration', () => {
		jest.useFakeTimers();

		storage.set('key1', 'value1', 1); // 1 minute
		expect(storage.get('key1')).toBe('value1');

		// Avance le temps de 2 minutes
		jest.advanceTimersByTime(2 * 60 * 1000);

		expect(storage.get('key1')).toBeNull();

		jest.useRealTimers();
  	});

	test('should get all data', () => {
		storage.set('key1', 'value1');
		storage.set('key2', 'value2');
		const all = storage.getAll();

		expect(all).toEqual({
			key1: 'value1',
			key2: 'value2'
		});
	});

	test('should set expiration on existing key', () => {
		jest.useFakeTimers();

		storage.set('key1', 'value1');
		storage.expire('key1', 1); // 1 minute

		// Avance le temps de 2 minutes
		jest.advanceTimersByTime(2 * 60 * 1000);

		expect(storage.get('key1')).toBeNull();

		jest.useRealTimers();
	});

	test('should get expiration time', () => {
		storage.set('key1', 'value1', 10); // 10 minutes
		const expireTime = storage.getExpire('key1');
		expect(expireTime).toBeGreaterThan(0);
		expect(expireTime).toBeLessThanOrEqual(10);
	});
});
