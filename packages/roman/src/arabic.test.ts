import { arabic } from "./arabic";

describe("arabic", () => {
  test.each`
    roman          | expected
    ${"I"}         | ${1}
    ${"IV"}        | ${4}
    ${"IX"}        | ${9}
    ${"X"}         | ${10}
    ${"MMMCMXCIX"} | ${3999}
  `(
    "should return correct arabic numeral with roman numeral input $roman and produce expected $expected",
    ({ roman, expected }) => {
      expect(arabic(roman)).toBe(expected);
    }
  );
});
