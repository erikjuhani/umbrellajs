import { defineComponent } from "./component";
import { entity } from "./entity";
import { assignId } from "./util";

describe("entity", () => {
  const Position = defineComponent("position", { x: 0, y: 0 });
  const Velocity = defineComponent("velocity", { x: 0, y: 0 });

  it("should increment entity in increasing sequence", () => {
    const e0 = entity();
    const e1 = entity();
    const e2 = entity();

    expect(Number(e0.id)).toBeLessThan(Number(e1.id));
    expect(Number(e1.id)).toBeLessThan(Number(e2.id));
  });

  it("should return a same id from assignId given existing entity", () => {
    const e = entity();
    expect(e.id).toEqual(assignId(e));
  });

  it("should create an entity without components", () => {
    const e = entity();
    expect(Object.keys(e.components)).toHaveLength(0);
  });

  it("should create an entity with unique components", () => {
    const e = entity(Position, Position, Velocity);
    expect(Object.keys(e.components)).toHaveLength(2);
  });

  it("should get the correct component if it exists", () => {
    const e = entity(Position);
    expect(e.getComponent(Position).__type).toEqual("position");
  });

  it("should only mutate component data", () => {
    const e = entity(Position);
    const pos = e.getComponent(Position);
    if (pos) {
      pos.assign({ x: 1, y: 1 });
    }
    expect(e.getComponent(Position)?.data).toEqual({ x: 1, y: 1 });
    expect(Position.__data).toEqual({ x: 0, y: 0 });
  });
});
