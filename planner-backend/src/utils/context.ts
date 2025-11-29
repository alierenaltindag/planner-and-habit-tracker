import { AsyncLocalStorage } from 'async_hooks';

export const context = new AsyncLocalStorage<Map<string, any>>();

export const setContext = (key: string, value: any) => {
    const store = context.getStore();
    if (store) {
        store.set(key, value);
    }
};

export const getContext = (key: string) => {
    const store = context.getStore();
    return store?.get(key);
};
