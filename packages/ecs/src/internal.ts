import { ComponentDefinition } from ".";
import { Entity } from "./entity";

type __InternalState = {
  [def: ComponentDefinition["__type"]]: Set<Entity>;
};

export const __internalState: __InternalState = {};
