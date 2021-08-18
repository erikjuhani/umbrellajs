import { Observer } from "./observer";

export interface EventStream<T> {
  pool: Map<string, Observer<T>[]>;
  notify: (subject: string, value: T) => Observer<T>[];
  subscribe: (subject: string, observer: Observer<T>) => EventStream<T>;
}

export function notifyObservers<T = unknown>(
  value: T,
  observers: Observer<T>[]
): Promise<Observer<T>[]> {
  return new Promise(() => observers.forEach((observer) => observer(value)));
}

export function eventStream<T = unknown>(
  pool: Map<string, Observer<T>[]> = new Map()
): EventStream<T> {
  const stream: EventStream<T> = {
    pool,
    notify: (notifySubject: string, value: T): Observer<T>[] => {
      for (const [subject, observers] of pool) {
        if (notifySubject === subject) {
          notifyObservers<T>(value, observers);
          return observers;
        }
      }

      return [];
    },
    subscribe: (subject, observer) => {
      const observers = pool.get(subject);
      if (observers) {
        const newObservers = [...observers, observer];
        return { ...stream, pool: pool.set(subject, newObservers) };
      }

      return { ...stream, pool: pool.set(subject, [observer]) };
    },
  };

  return stream;
}

export const eventEmitter =
  <T>(subject: string, stream: EventStream<T>) =>
  (value: T) =>
    emit(subject, value, stream);

export function emit<T>(
  subject: string,
  value: T,
  stream: EventStream<T>
): Observer<T>[] {
  return stream.notify(subject, value);
}
