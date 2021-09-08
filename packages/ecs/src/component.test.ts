import { defineComponent } from "./component";

describe("component", () => {
  it("should create a component definition with type and data", () => {
    const Mass = defineComponent("mass", 0);
    expect(Mass.__type).toEqual("mass");
    expect(Mass.__data).toEqual(0);
  });

  it("should construct a component from component definition", () => {
    const Mass = defineComponent("mass", 0);
    const mass = Mass();
    expect(mass.__type).toEqual("mass");
    expect(mass.data).toEqual(0);
  });

  it("should only mutate component state", () => {
    const Mass = defineComponent("mass", 0);
    const mass = Mass();
    mass.assign(100);
    expect(mass.data).toEqual(100);
    expect(Mass.__data).toEqual(0);
  });
});
