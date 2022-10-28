import { defineComponent } from "./component";
import { entity } from "./entity";
import { __internalState } from "./internal";
import { queryEntities, system } from "./system";

describe("system", () => {
  const Position = defineComponent("position", { x: 0, y: 0 });
  const Velocity = defineComponent("velocity", { x: 0, y: 0 });
  const Mass = defineComponent("mass", 0);

  const entities = [
    entity(Position, Velocity),
    entity(Mass),
    entity(Velocity),
    entity(Position, Mass),
  ];

  it("should query with components and return entities having those components", () => {
    const queried = queryEntities(Mass, Position);

    expect(queried).toHaveLength(3);
    expect(!!queried[0].getComponent(Position)).toBeFalsy();
    expect(!!queried[0].getComponent(Mass)).toBeTruthy();
    expect(!!queried[1].getComponent(Position)).toBeTruthy();
    expect(!!queried[1].getComponent(Mass)).toBeTruthy();
    expect(!!queried[2].getComponent(Position)).toBeTruthy();
    expect(!!queried[2].getComponent(Mass)).toBeFalsy();
  });

  it("should create a system with mutating update functionality", () => {
    const pool = [
      entity(Position, Velocity),
      entity(Mass),
      entity(Velocity),
      entity(Position, Mass),
      ...entities,
    ];

    const positionSystem = system<typeof Position>("position", {
      update: (entities) => {
        entities.forEach((e) => {
          const pos = e.getComponent(Position);
          pos.assign({ x: pos.data.x + 1, y: pos.data.y + 1 });
        });
      },
    });

    const positionEntities = queryEntities(Position);

    expect(pool[0].getComponent(Position)?.data).toEqual({ x: 0, y: 0 });
    expect(pool[3].getComponent(Position)?.data).toEqual({ x: 0, y: 0 });
    positionSystem.update(positionEntities);
    expect(pool[0].getComponent(Position)?.data).toEqual({ x: 1, y: 1 });
    expect(pool[3].getComponent(Position).data).toEqual({ x: 1, y: 1 });
    positionSystem.update(positionEntities);
    expect(pool[0].getComponent(Position)?.data).toEqual({ x: 2, y: 2 });
    expect(pool[3].getComponent(Position)?.data).toEqual({ x: 2, y: 2 });
  });
});
