import { createReduxStore, registerStore, register } from '@wordpress/data';

export function createAndRegisterReduxStore(storeName, storeConfig) {
  if (createReduxStore) {
    const store = createReduxStore(
      storeName,
      storeConfig,
    );

    register(store);
    return store;
  }
  registerStore(storeName, storeConfig);
  return storeName;
}

export default createAndRegisterReduxStore;
