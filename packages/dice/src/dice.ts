import peggy from "peggy";
import grammar from "./grammar";

const parser = peggy.generate(grammar);

export interface Dice {
  notation: string;
  roll<T extends number | undefined = undefined>(
    amount?: T
  ): T extends undefined ? number : T extends 1 ? number : number[];
  toString: () => string;
}

export function dice(sides: number): Dice {
  const die = {
    notation: `d${sides}`,
    roll: (amount = 1) => {
      return roll(`${amount > 0 ? amount : 1}${die.notation}`);
    },
    toString: () => die.notation,
  };

  return die as Dice;
}

export const d4 = () => dice(4);
export const d6 = () => dice(6);
export const d8 = () => dice(8);
export const d12 = () => dice(12);
export const d20 = () => dice(20);

interface DiceGroup {
  dice: Dice[];
  roll: () => number[];
  toString: () => string;
}

export function diceGroup(...die: Dice[]): DiceGroup {
  const group = {
    dice: [...die],
    roll: () => group.dice.map((die) => die.roll()),
    toString: (): string => {
      return `{${group.dice.reduce<string>((result, die, index) => {
        if (index === 0) {
          return `${die.notation}`;
        }
        return `${result}+${die.notation}`;
      }, "")}}`;
    },
  };

  return group;
}

function isDice(value: unknown): value is Dice {
  return /\d{0,}d\d{1,}/.test((value as Dice).notation);
}

function isDiceGroup(value: unknown): value is DiceGroup {
  return (value as DiceGroup).dice !== undefined;
}

type RollCallbackFn = (result: number | number[]) => number;

type Operator = "+" | "-" | "/" | "*" | "x";
type Modifier = "d" | "k";

type Notation<T extends string = string> = T extends
  | `${infer Head}d${infer Tail}`
  ? Tail extends `${number}${Operator | Modifier}${infer A}d${infer B}`
    ? number[]
    : Head extends ""
    ? number
    : Head extends "0"
    ? number
    : Head extends "1"
    ? number
    : number[]
  : number | number[];

export function roll(die: Dice, callback?: RollCallbackFn): number;
export function roll(group: DiceGroup, callback?: RollCallbackFn): number[];
export function roll<T extends string = string>(
  notation: T,
  callback?: RollCallbackFn
): Notation<T>;
export function roll(
  diceOrNotation: Dice | DiceGroup | string,
  callback?: RollCallbackFn
): number | number[] {
  if (isDice(diceOrNotation)) {
    const { roll } = diceOrNotation;
    return callback ? callback(roll()) : roll();
  }

  if (isDiceGroup(diceOrNotation)) {
    const { roll } = diceOrNotation;
    return callback ? callback(roll()) : roll();
  }

  if (typeof diceOrNotation === "string") {
    return parser.parse(diceOrNotation);
  }

  return 0;
}
