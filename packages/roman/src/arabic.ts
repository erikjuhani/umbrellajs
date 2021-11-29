import { RomanNumerals } from "./romanNumerals";

export function arabic(romanNumeral: string): number {
  if (
    !romanNumeral.match(
      /^(?=[MDCLXVI])M{0,3}(C[MD]|D?C{0,3})(X[CL]|L?X{0,3})(I[XV]|V?I{0,3})$/
    )
  )
    throw Error("provided string is not roman numeral");
  return [...romanNumeral].reduce((acc, romanNumeral, i, chars) => {
    const nextNumeralValue =
      RomanNumerals[chars[i + 1] as keyof typeof RomanNumerals];
    const currentNumeralValue =
      RomanNumerals[romanNumeral as keyof typeof RomanNumerals];

    return nextNumeralValue > currentNumeralValue
      ? acc - currentNumeralValue
      : acc + currentNumeralValue;
  }, 0);
}
