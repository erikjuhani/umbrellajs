import { assignId } from "./util";

describe("util", () => {
  it("should increment id in a sequence", () => {
    const id0 = assignId();
    const id1 = assignId();
    const id2 = assignId();

    expect(Number(id0)).toBeLessThan(Number(id1));
    expect(Number(id1)).toBeLessThan(Number(id2));
  });
});
