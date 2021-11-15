# @umbrellajs/dice - Dice module

Dice module consists of premade _dice_ and a roll function that can be used to either
roll for a certain die, diceGroup or dice notation.

## Usage

### Die

The `dice` function can be used to create a separate die with the amount of chosen sides.

```ts
import { dice } from "@umbrellajs/dice";

// Create a six faced die
const die = dice(6);

// Roll the die
die.roll(); // 4
```

### Dice group

Rolling a dice group is identical to rolling a single die.

```ts
import { dice, diceGroup } from "@umbrellajs/dice";

const dice = diceGroup(dice(12), dice(20));

dice.roll(); // [4, 16]
```

### Roll function

The `roll` function returns a single number value or an array of number values as the roll result.
`roll` function takes in either a `die`, `diceGroup` or `string` (Dice Notation) as a parameter.

If given a string, the roll function will follow the [dice notation](https://en.wikipedia.org/wiki/Dice_notation) standard.

```ts
import { dice, d6, d20, roll } from "@umbrellajs/dice";

roll(dice(6)); // 4

roll(diceGroup(d6(), d20())); // [4, 16]

roll("2d20"); // [17, 18]
```

#### Callback (Experimental)

A callback can be used to manipulate the return data beforehand.
For example a certain modifier can be added to the end result.

### Rolling with dice notation

#### Single die roll

```ts
import { roll } from "@umbrellajs/dice";

roll("d20"); // 17

roll("1d6"); // 4
```

#### Multiple dice roll

```ts
import { roll } from "@umbrellajs/dice";

roll("2d20");
// [6, 18]

roll("4d6");
// [2, 6, 3, 1]
```

#### Exploding die

Exploding roll will be rolled again if it hits the target number.
If target number is not explicitly set that target number will be the maximum possible value of the die.

```ts
import { roll } from "@umbrellajs/dice";

roll("2d6!");
// [2, 6, 3]

// Explicit target number
// Greater than
roll("2d6!>2");
// [2, 6, 4, 2, 3]

// Greater than or equal to
roll("2d6!>=2");
// [2, 3, 1, 6, 4, 2, 1, 3, 5, 2, 1]

// Lesser than
roll("2d6!<3");
// [2, 3, 6, 3]

// Lesser than or equal to
roll("2d6!<=3");
// [2, 3, 1, 5, 6, 3, 5]

// Equal to
roll("2d6!=2");
// [2, 4, 6, 3]

// Not equal to
roll("2d6!!=2");
// [2, 6, 4, 2, 3, 5, 2]
```

#### Fudge die

Fudge die or fate die returns a value between -1, 0 and 1.

```ts
roll("dF"); // -1 | 0 | 1
```

#### Percentile die

Percentile die returns a value between 1 and 100.

```ts
roll("d%"); // 44
```

#### Keep modifier

```ts
import { roll } from "@umbrellajs/dice";

// Keep highest roll
roll("3d20k");
// [18, 19, 20] -> 20

roll("3d20kh");
// [18, 19, 20] -> 20

// Keep two higest rolls
roll(4d20k2);
// [17, 18, 19, 20] -> [19, 20]
roll(4d20kh2);
// [17, 18, 19, 20] -> [19, 20]

// Keep lowest roll
roll("3d20kl");
// [17, 18, 19, 20] -> 17

// Keep two lowest rolls
roll("4d20kl2");
// [17, 18, 19, 20] -> [17, 18]
```

#### Drop modifier

```ts
import { roll } from "@umbrellajs/dice";

// Drop lowest roll
roll("3d20d");
// [18, 19, 20] -> [19, 20]
roll("3d20dl");
// [18, 19, 20] -> [19, 20]

// Drop two lowest rolls
roll(4d20d2);
// [17, 18, 19, 20] -> [19, 20]
roll(4d20dl2);
// [17, 18, 19, 20] -> [19, 20]

// Drop highest roll
roll("3d20dh");
// [18, 19, 20] -> [18, 19]

// Drop two highest rolls
roll("4d20dh2");
// [17, 18, 19, 20] -> [17, 18]
```

#### Multipliers

In addition to standard dice rolls, one can also do use modifiers to change the end result.
Multiple dice rolls are summed up before applying multipliers.

For example,

```ts
import { roll } from "@umbrellajs/dice";

// Addition
roll("2d6+5"); // [4, 2] + 5 -> 6 + 5 -> 11

// Subtraction
roll("2d6-5"); // [4, 2] - 5 -> 6 - 5 -> 1

// Multiplication
roll("1d6x5"); // 4 x 5 -> 20
roll("5*d6"); // 5 * 4 -> 20

// Division
roll("1d20/2"); // 20 / 2 -> 10
```
