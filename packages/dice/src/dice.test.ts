import { d20, d6, dice, diceGroup, roll } from "./dice";

describe("roll", () => {
  it.each`
    input                     | expected
    ${dice(6)}                | ${1}
    ${diceGroup(d20(), d6())} | ${2}
    ${"6d6"}                  | ${6}
    ${"3d20d"}                | ${2}
  `(
    "should roll with input $input.notation and return the amount of $expected rolls",
    ({ input, expected }) => {
      const result = roll(input);
      expect(typeof result === "number" ? [result] : result).toHaveLength(
        expected
      );
    }
  );

  it("should give correct result from complex dice notation", () => {
    const result = roll("((d20 +5) - (d20 +2)) -2");
    expect(result).toBeGreaterThanOrEqual(-18);
    expect(result).toBeLessThanOrEqual(20);
  });

  it("should return 0 if no valid input has been given", () => {
    expect(roll({} as any)).toEqual(0);
  });
});

describe("dice", () => {
  it("should return dice in dice notation when turned to string", () => {
    expect(`${d20()}`).toEqual("d20");
  });
});

describe("diceGroup", () => {
  it("should return diceGroup in dice notation when turned to string", () => {
    expect(`${diceGroup(d20(), d6())}`).toEqual("{d20+d6}");
  });
});
