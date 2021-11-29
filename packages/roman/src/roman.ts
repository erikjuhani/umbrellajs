import { RomanNumerals } from "./romanNumerals";

export function roman(decimal: number): string {
  if (decimal < 0 || decimal > 3999)
    throw Error("only unsigned integer between range 1..3999 are supported");
  if (decimal === 0) return "N";
  let n: number = decimal;
  return Object.entries(RomanNumerals).reduce<string>(
    (acc, [romanNumeral, arabicNumeral]) => {
      const numOfTimes = Math.floor(n / arabicNumeral);
      n -= numOfTimes * arabicNumeral;
      return `${acc}${romanNumeral.repeat(numOfTimes)}`;
    },
    ""
  );
}
