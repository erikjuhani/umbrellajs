import { ComponentDefinition } from "./component";
import { Entity } from "./entity";

export function queryEntities<TComponent extends ComponentDefinition[]>(
  entities: Entity<ComponentDefinition>[],
  ...components: TComponent
): Entity<TComponent[number]>[] {
  return Array.from(
    new Set(
      components.reduce<Entity<TComponent[number]>[]>((queried, component) => {
        return queried.concat(
          entities.filter((e) => e.components.has(component.__type))
        );
      }, [])
    )
  );
}

export type Schema<TComponent extends ComponentDefinition> = {
  update: (entities: Entity<TComponent>[], delta?: number) => void;
};

export type System<TComponent extends ComponentDefinition> = {
  name: Readonly<string>;
  update: (entities: Entity<TComponent>[], delta?: number) => void;
};

export function system<
  TComponent extends ComponentDefinition = ComponentDefinition
>(name: string, schema: Schema<TComponent>): System<TComponent> {
  return { name, ...schema };
}
