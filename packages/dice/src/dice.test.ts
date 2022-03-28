import { d20, d6, diceGroup, roll } from "./dice";

describe("roll", () => {
  it.each`
    input          | expected
    ${{}}          | ${0}
    ${"d6/0"}      | ${Infinity}
    ${"d6"}        | ${6}
    ${"dF"}        | ${1}
    ${"d%"}        | ${100}
    ${"1d20"}      | ${20}
    ${"2d20"}      | ${[20, 20]}
    ${"4d6"}       | ${[6, 6, 6, 6]}
    ${"d3+2d3"}    | ${9}
    ${"d20-2d6"}   | ${8}
    ${"d6+d6-2d3"} | ${6}
    ${"2d6/d6"}    | ${2}
    ${"1d6x5"}     | ${30}
    ${"3*d6"}      | ${18}
  `(
    "should roll with input $input and return the roll result of $expected",
    ({ input, expected }) => {
      jest.spyOn(Math, "random").mockReturnValue(1);
      expect(roll(input)).toEqual(expected);
    }
  );

  it.each`
    random | expected
    ${1}   | ${1}
    ${0.5} | ${0}
    ${0}   | ${-1}
  `(
    "should roll dF with random modifier $random and return the roll result of $expected",
    ({ random, expected }) => {
      jest.spyOn(Math, "random").mockReturnValue(random);
      expect(roll("dF")).toEqual(expected);
    }
  );
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
