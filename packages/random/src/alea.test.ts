import { alea } from "./alea";

describe("alea", () => {
  it("should give same result with same seed", () => {
    const g1 = alea("test");
    const g2 = alea("test");

    const v1 = g1();
    const v2 = g2();

    expect(v1).toEqual(0.5442283214069903);
    expect(v2).toEqual(0.5442283214069903);

    expect(g1.next()).toEqual(g2.next());
  });
});
