import { Entity } from "./entity";

let _uidCounter = 0;

export function assignId(entity?: Entity): string {
  return entity?.id ?? String(_uidCounter++);
}
