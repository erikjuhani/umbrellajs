import { d6, d20, dice, roll, diceGroup } from "./dice";

describe("roll", () => {
  it.each`
    input                           | expected
    ${dice(6)}                      | ${[1, 6]}
    ${diceGroup(dice(6), dice(20))} | ${[2, 26]}
    ${diceGroup(d6(), d20())}       | ${[2, 26]}
    ${"d12"}                        | ${[1, 12]}
  `(
    "should roll with input $input.notation and return result between $expected",
    ({ input, expected }) => {
      const result = roll(input);
      expect(result).toBeGreaterThanOrEqual(expected[0]);
      expect(result).toBeLessThanOrEqual(expected[1]);
    }
  );

  it("should give correct result from complex dice notation", () => {
    const result = roll("((d20 +5) - (d20 +2)) -2");
    expect(result).toBeGreaterThanOrEqual(-18);
    expect(result).toBeLessThanOrEqual(20);
  });
});
