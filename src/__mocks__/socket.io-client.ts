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
    on: (event: string, func: (message?: string) => void) => void;
  };
}

export const socket: Socket = {
  io: {
    on: (event, func) => {
      if (events[event]) {
        events[event].push(func);
        return;
      }
      events[event] = [func];
    },
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
