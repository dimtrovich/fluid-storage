import { init } from '../src';
import { LocalStorageAdapter, SessionStorageAdapter, CookieStorageAdapter } from '../src/adapters';

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

describe('init', () => {
  	beforeEach(() => {
    	localStorageMock.clear();
    	sessionStorageMock.clear();
    	cookieMock.clear();
  	});

	test('should initialize with localStorage by default', () => {
		const storage = init('test');
		storage.set('key1', 'value1');
		expect(localStorageMock.getItem('test.key1')).toBe('{"value":"value1","expire":0}');
	});

	test('should initialize with sessionStorage', () => {
		const storage = init('test', 'sessionstorage');
		storage.set('key1', 'value1');
		expect(sessionStorageMock.getItem('test.key1')).toBe('{"value":"value1","expire":0}');
	});

	test('should initialize with cookie storage', () => {
		const storage = init('test', 'cookie');
		storage.set('key1', 'value1');
		expect(storage.get('key1')).toBe('value1');
	});

	test('should use custom default expiration', () => {
		const storage = init('test', 'localstorage', 60); // 60 minutes
		storage.set('key1', 'value1');

		const stored = JSON.parse(localStorageMock.getItem('test.key1') || '');
		expect(stored.expire).toBeGreaterThan(0);
	});

	test('should accept custom adapter', () => {
		const customAdapter = {
			get: jest.fn(),
			set: jest.fn(),
			remove: jest.fn(),
			clear: jest.fn(),
			getAll: jest.fn(() => ({})),
			getPrefix: jest.fn(() => 'custom')
		};

		const storage = init('test', customAdapter);
		storage.set('key1', 'value1');

		expect(customAdapter.set).toHaveBeenCalledWith('key1', JSON.stringify({ value: 'value1', expire: 0 }), 0);
	});
});
