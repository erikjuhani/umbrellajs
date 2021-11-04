# @umbrellajs/dice - Dice module

Dice module consists of premade _dice_ and a roll function that can be used to either
roll for a certain die, diceGroup or dice notation.

## Features

Die: A die with roll functionality.

DiceGroup: A dice group with roll functionality.

roll: A function that returns a result or results for rolling dice.

## Usage

### Roll function

The `roll` function returns a number or array of numbers value as the roll result.
`roll` function takes in either a `die`, `diceGroup` or `string` as a parameter.

If given a string, it should follow the (dice notation)[https://en.wikipedia.org/wiki/Dice_notation] standard.

```ts
import { dice, roll } from "@umbrellajs/dice";

roll(dice(6)); // Roll result in numeric value
```

#### Rolling

##### Die

A simple roll with die.

```ts
import { dice } from "@umbrellajs/dice";

const die = dice(6);
die.roll(); // Roll result in numeric value
```

##### Dice

Rolling a dice group is identical to rolling a single die.

```ts
import { dice, diceGroup } from "@umbrellajs/dice";

const dice = diceGroup(dice(12), dice(20));
dice.roll(); // Roll results in an array of numbers. In this case the size is two.
```

##### Dice notation

Using dice notation is more flexible and can handle more complex situations.

```ts
import { roll } from "@umbrellajs/dice";

roll("d20"); // Roll a die with 20 faces
roll("3d6"); // Roll 3 dice with 6 faces

// Examples of more complex equations
roll("(d20+10)-(d20+2)");

const modifier = 2;
roll(`((d7+2)-((d6+1)/${modifier}))*2`);

// Keep modifiers
roll("3d20kh"); // Keep highest roll
roll("3d20kl"); // Keep lowest roll
roll("3d20k2"); // Keep two highest rolls

// Drop modifiers
roll("3d20dh"); // Drop highest roll
roll("3d20dl"); // Drop lowest roll
roll("3d20d2"); // Drop 2 lowest rolls
```
