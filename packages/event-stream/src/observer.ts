export type Observer<T> = (value: T) => void;

export function observer<T>(cb: Observer<T>): Observer<T> {
  return cb;
}
