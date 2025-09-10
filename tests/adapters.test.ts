import { BaseAdapter, LocalStorageAdapter, SessionStorageAdapter, CookieStorageAdapter } from '../src/adapters';

// Mock pour localStorage et sessionStorage
const localStorageMock = (() => {
  	let store: { [key: string]: string } = {};
  	return {
		getAll: () => store,
		getItem: (key: string) => store[key] || null,
		setItem: (key: string, value: string) => { store[key] = value.toString(); },
		removeItem: (key: string) => { delete store[key]; },
		clear: () => { store = {}; },
		get length() { return Object.keys(store).length; },
		key: (index: number) => Object.keys(store)[index] || null
	};
})();

const sessionStorageMock = (() => {
  	let store: { [key: string]: string } = {};
  	return {
		getItem: (key: string) => store[key] || null,
		setItem: (key: string, value: string) => { store[key] = value.toString(); },
		removeItem: (key: string) => { delete store[key]; },
		clear: () => { store = {}; },
		get length() { return Object.keys(store).length; },
		key: (index: number) => Object.keys(store)[index] || null
	};
})();

// Mock pour document.cookie
const cookieMock = (() => {
  	let cookies: { [key: string]: string } = {};
  	return {
		get cookie() {
			return Object.entries(cookies)
				.map(([key, value]) => `${key}=${value}`)
				.join('; ');
		},
		set cookie(cookieString: string) {
			const [keyValue, ...rest] = cookieString.split(';');
			const [key, value] = keyValue.split('=');
			cookies[key.trim()] = decodeURIComponent(value);
		},
		clear: () => { cookies = {}; }
  };
})();

// Configuration des mocks avant les tests
beforeAll(() => {
  	Object.defineProperty(window, 'localStorage', { value: localStorageMock });
  	Object.defineProperty(window, 'sessionStorage', { value: sessionStorageMock });
  	Object.defineProperty(document, 'cookie', {
		get: () => cookieMock.cookie,
		set: (value) => { cookieMock.cookie = value; },
  	});
});

beforeEach(() => {
  	localStorageMock.clear();
  	sessionStorageMock.clear();
  	cookieMock.clear();
});

describe('BaseAdapter', () => {
  	class TestAdapter extends BaseAdapter {
		get(key: string): string | null { return null; }
		set(key: string, value: string, expire?: number): void {}
		remove(key: string): void {}
		clear(): void {}
		getAll(): { [key: string]: string } { return {}; }
	}

  	test('normalizeKey should add prefix', () => {
		const adapter = new TestAdapter('test');
		// @ts-ignore - accès à la méthode protected
		const normalized = adapter.normalizeKey('myKey');
		expect(normalized).toBe('test.myKey');
	});

	test('getPrefix should return prefix', () => {
		const adapter = new TestAdapter('test');
		expect(adapter.getPrefix()).toBe('test');
	});
});

describe('LocalStorageAdapter', () => {
  	test('should set and get item with prefix', () => {
		const adapter = new LocalStorageAdapter('test');
		adapter.set('key1', 'value1');
		expect(adapter.get('key1')).toBe('value1');
		expect(localStorageMock.getItem('test.key1')).toBe('value1');
	});

	test('should remove item', () => {
		const adapter = new LocalStorageAdapter('test');
		adapter.set('key1', 'value1');
		adapter.remove('key1');
		expect(adapter.get('key1')).toBeNull();
	});

	test('should clear only prefixed items', () => {
		const adapter = new LocalStorageAdapter('test');
		adapter.set('key1', 'value1');
		localStorageMock.setItem('other.key', 'otherValue');

		adapter.clear();

		expect(adapter.get('key1')).toBeNull();
		expect(localStorageMock.getItem('other.key')).toBe('otherValue');
	});

	test('should getAll only prefixed items', () => {
		const adapter = new LocalStorageAdapter('test');
		adapter.set('key1', 'value1');
		adapter.set('key2', 'value2');
		localStorageMock.setItem('other.key', 'otherValue');

		const all = adapter.getAll();

		expect(all).toEqual({
			'test.key1': 'value1',
			'test.key2': 'value2'
		});
	});
});

describe('SessionStorageAdapter', () => {
  	test('should set and get item with prefix', () => {
		const adapter = new SessionStorageAdapter('test');
		adapter.set('key1', 'value1');
		expect(adapter.get('key1')).toBe('value1');
		expect(sessionStorageMock.getItem('test.key1')).toBe('value1');
  	});

	test('should remove item', () => {
		const adapter = new SessionStorageAdapter('test');
		adapter.set('key1', 'value1');
		adapter.remove('key1');
		expect(adapter.get('key1')).toBeNull();
	});
});

describe('CookieStorageAdapter', () => {
	test('should set and get cookie with prefix', () => {
		const adapter = new CookieStorageAdapter('test');
		adapter.set('key1', 'value1');
		expect(adapter.get('key1')).toBe('value1');
	});

	test('should set cookie with expiration', () => {
		const adapter = new CookieStorageAdapter('test');
		adapter.set('key1', 'value1', 60);
		expect(adapter.get('key1')).toBe('value1');
	});

	test('should remove cookie', () => {
		const adapter = new CookieStorageAdapter('test');
		adapter.set('key1', 'value1');
		adapter.remove('key1');
		expect(adapter.get('key1')).toBeNull();
	});
});
