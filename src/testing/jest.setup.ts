import '@testing-library/jest-dom';

let store: Record<string, string> = {};

const localStorageMock = {
  getItem: (key: string) => {
    return store[key] ?? null;
  },
  setItem: (key: string, value: string) => {
    store[key] = value;
  },
  clear: () => {
    store = {};
  },
  removeItem: (key: string) => {
    delete store[key];
  },
  length: 1,
  key: () => '1',
};

global.localStorage = localStorageMock;
global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};
