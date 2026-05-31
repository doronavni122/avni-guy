import { AsyncLocalStorage } from 'node:async_hooks';

export type RequestStore = {
	request: Request;
};

export const mcpRequestStore = new AsyncLocalStorage<RequestStore>();

export function getMcpRequest(): Request {
	const store = mcpRequestStore.getStore();
	if (store?.request) return store.request;
	return new Request('http://localhost/');
}
