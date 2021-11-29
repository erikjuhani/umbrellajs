import { roman } from "./roman";

describe("roman", () => {
  test.each`
    decimal | expected
    ${1}    | ${"I"}
    ${4}    | ${"IV"}
    ${9}    | ${"IX"}
    ${10}   | ${"X"}
    ${3999} | ${"MMMCMXCIX"}
  `(
    "should return correct roman numeral with input $decimal and produce expected $expected",
    ({ decimal, expected }) => {
      expect(roman(decimal)).toBe(expected);
    }
  );
});
