# @umbrellajs/random

Random module is a pseudo random generator that holds one particular
pseudo random algorithm called Alea, which was made by Johannes Baagøe <baagoe@baagoe.com> in 2010, MIT licensed.

The same algorithm is in use in the _well known_ [rot.js](https://github.com/ondras/rot.js/blob/master/src/rng.ts) roguelike toolkit.

More info about [Alea algorithm](https://web.archive.org/web/20111105142920/http://baagoe.com/en/RandomMusings/javascript/).

## Modifications

The algorithm is the same and uses same constant values and initial state.

The inner works are a bit different:

- Instead of a for loop this uses functional reduce and an object as a state
- Uses infinite generator which yields random numbers from the Alea algorithm
- Seed arguments are not given as an array, but instead as a string

## Usage

### Alea

The `alea` function returns a pseudo random generator using alea algorithm.
If you call `alea()`, without arguments, a stringified `+new Date()` is silently assumed.
This provides somewhat unpredictable numbers, similarly to Math.random.

```ts
import { alea } from "@umbrellajs/random";

const random = alea();

random(); // A random float between 0 and 1
random.next(); // Or alternatively next() function can be used.
```

#### Seed argument

The `alea` function takes a string argument as a seed. If seed is provided one can expect
the same results for the same seed used.

```ts
import { alea } from "@umbrellajs/random";

const random0 = alea("umbrellajs");
const random1 = alea("umbrellajs");

random0(); // 0.4548914898186922
random1(); // 0.4548914898186922
```
