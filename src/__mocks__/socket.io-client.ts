/* eslint-disable @typescript-eslint/no-explicit-any */
type EventCallback<T extends any[]> = (...args: T) => void;

interface Events {
  [key: string]: EventCallback<any[]>[];
}

let events: Events = {};

const emit = (event: string, ...args: any[]): void => {
  if (!events[event]) {
    return;
  }
  events[event].forEach((func) => func(...args));
};

interface Socket {
  on(event: string, func: EventCallback<any[]>): void;
  emit: typeof emit;
  io: {
    on: () => void;
  };
}

export const socket: Socket = {
  io: {
    on: jest.fn(),
  },
  on(event, func) {
    if (events[event]) {
      events[event].push(func);
      return;
    }
    events[event] = [func];
  },
  emit,
};

export const io = jest.fn(() => socket);

export const serverSocket = { emit };

export function cleanup() {
  events = {};
}

export default io;
