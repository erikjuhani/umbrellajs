import { Component, ComponentDefinition } from "./component";
import { __internalState } from "./internal";
import { assignId } from "./util";

export type Entity<
  TComponent extends ComponentDefinition = ComponentDefinition
> = {
  id: string;
  hasComponent: <T extends TComponent>(component: T) => boolean;
  components: { [type: Component["__type"]]: Component };
  getComponent: <T extends TComponent>(
    component: T
  ) => Component<T["__type"], T["__data"]>;
};

export function entity<
  TComponent extends ComponentDefinition[] = ComponentDefinition[]
>(...components: TComponent): Entity<TComponent[number]> {
  const entity = {
    id: assignId(),
    components: components.reduce<Entity["components"]>(
      (acc, c) => ({ ...acc, [c.__type]: c() }),
      {}
    ),
    hasComponent: <T extends TComponent[number]>(component: T) => {
      return component.__type in entity.components;
    },
    getComponent: <T extends TComponent[number]>(component: T) => {
      return entity.components[component.__type];
    },
  };

  Object.keys(entity.components).forEach((type) =>
    __internalState[type].add(entity)
  );

  return entity;
}
