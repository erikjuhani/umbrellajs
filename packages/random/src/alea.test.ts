import { alea } from "./alea";

describe("alea", () => {
  it("should give same result with same seed", () => {
    const g1 = alea("test");
    const g2 = alea("test");
    expect(g1()).toEqual(g2());
    expect(g1.next()).toEqual(g2.next());
  });
});
