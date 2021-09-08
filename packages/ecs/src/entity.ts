import { Component, ComponentDefinition } from "./component";
import { assignId } from "./util";

export type Entity<
  TComponent extends ComponentDefinition = ComponentDefinition
> = {
  id: string;
  components: Map<Component["__type"], Component>;
  getComponent: <T extends TComponent>(
    component: T
  ) => Component<T["__type"], T["__data"]> | null;
};

export function entity<
  TComponent extends ComponentDefinition[] = ComponentDefinition[]
>(...components: TComponent): Entity<TComponent[number]> {
  const entity = {
    id: assignId(),
    components: new Map(components.map((c) => [c.__type, c()])),
    getComponent: <T extends TComponent[number]>(component: T) => {
      const hasComponent = (c: T): c is T => {
        return entity.components.has(c.__type);
      };

      if (hasComponent(component)) {
        return entity.components.get(component.__type) as Component<
          T["__type"],
          T["__data"]
        >;
      }

      return null;
    },
  };

  return entity as Entity<TComponent[number]>;
}
