import peg from "pegjs";
import grammar from "./grammar";

const parser = peg.generate(grammar);

export interface Dice<T extends number = number> {
  max: T;
  min: number;
  notation: string;
  lastResult: number;
  roll: (amount?: number) => Dice<T>;
  result: () => number;
  toString: () => string;
}

export function dice<T extends number = number>(sides: T): Dice<T> {
  const die = {
    lastResult: 0,
    max: sides,
    min: 1,
    notation: `d${sides}`,
    roll: (amount = 1) => {
      die.lastResult = roll(`${amount > 0 ? amount : 1}d${sides}`);
      return die;
    },
    result: (): number => die.lastResult,
    toString: () => `d${sides}`,
  };

  return die;
}

export const d4 = () => dice(4);
export const d6 = () => dice(6);
export const d8 = () => dice(8);
export const d12 = () => dice(12);
export const d20 = () => dice(20);

interface DiceGroup {
  dice: Dice[];
  add: (...dice: Dice[]) => DiceGroup;
  roll: () => DiceGroup;
  result: () => number;
  toString: () => string;
}

export function diceGroup(...die: Dice[]): DiceGroup {
  const group = {
    dice: [...die],
    add: (...die: Dice[]) => ({ ...group, dice: [...group.dice, ...die] }),
    roll: () => {
      group.dice = group.dice.map((die) => die.roll());
      return group;
    },
    result: (): number => {
      return group.dice.reduce<number>((result, die) => {
        return result + die.roll().result();
      }, 0);
    },
    toString: (): string => {
      return group.dice.reduce<string>((result, die, index) => {
        if (index === 0) {
          return `${die.notation}`;
        }
        return `${result}+${die.notation}`;
      }, "");
    },
  };

  return group;
}

function isDice(value: unknown): value is Dice {
  return (value as Dice).max !== undefined;
}

function isDiceGroup(value: unknown): value is DiceGroup {
  return (value as DiceGroup).dice !== undefined;
}

type RollCallbackFn = (result: number) => number;

export function roll(die: Dice, callback?: RollCallbackFn): number;
export function roll(group: DiceGroup, callback?: RollCallbackFn): number;
export function roll(notation: string, callback?: RollCallbackFn): number;
export function roll(
  diceOrNotation: Dice | DiceGroup | string,
  callback?: RollCallbackFn
): number {
  if (isDice(diceOrNotation)) {
    const { roll } = diceOrNotation;
    return callback ? callback(roll().result()) : roll().result();
  }

  if (isDiceGroup(diceOrNotation)) {
    const { roll } = diceOrNotation;
    return callback ? callback(roll().result()) : roll().result();
  }

  if (typeof diceOrNotation === "string") {
    return parser.parse(diceOrNotation);
  }

  return 0;
}
