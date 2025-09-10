/**!
 * Fluid Storage v1.0.0 (https://github.com/dimtrovich/fluid-storage)
 * Copyright 2025 Dimtrov Lab's | Dimitri Sitchet Tomkeu
 * Licensed under MIT (https://opensource.org/licences/mit)
 *
 * @author Dimitri Sitchet Tomkeu <devcode.dst@gmail.com>
 * @copyright Dimtrov Lab's | Dimitri Sitchet Tomkeu
 * @description Une interface de stockage structuré de données côté client simple et rapide
 * @version 1.0.0
 * @licence MIT
 */

import {
	BaseAdapter,
	CookieStorageAdapter,
	LocalStorageAdapter,
	SessionStorageAdapter,
} from './adapters';

import { FluidStorage, StorageAdapter, StorageType } from './types';
import { StorageUtils } from './utils';

/**
 * Initialisation du gestionnaire de stockage
 */
export function init(prefix?: string, type?: StorageType, defaultExpire?: number): FluidStorage {
	let adapter: StorageAdapter;
  	const finalPrefix = prefix || 'fs';
  	const finalType = type || 'localstorage';

  	if (typeof finalType === 'string') {
    	switch (finalType.toLowerCase()) {
			case 'localstorage':
				adapter = new LocalStorageAdapter(finalPrefix);
				break;
			case 'sessionstorage':
				adapter = new SessionStorageAdapter(finalPrefix);
				break;
			case 'cookie':
				adapter = new CookieStorageAdapter(finalPrefix);
				break;
      		default:
        		adapter = new LocalStorageAdapter(finalPrefix);
		}
	} else {
		adapter = finalType;
	}

  	return new StorageUtils(adapter, defaultExpire);
}

// Export pour usage global dans les navigateurs
if (typeof window !== 'undefined') {
  (window as any).fluidStorage = { init };
}

// Export des adapters pour permettre l'extension
export {
	BaseAdapter,
	CookieStorageAdapter,
	LocalStorageAdapter,
	SessionStorageAdapter,
};

export default { init };
