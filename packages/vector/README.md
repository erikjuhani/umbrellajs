# @umbrella/vector - Unit vector module

Minimalistic vector library, with basic Euclidean vector functions.

The vector datatype stores values in an object with x, y, z properties or an array
with minimum of two items and maximum of three [x, y, z].

## Todo

[] - Direction functions (angles)

## Usage

### Creating vectors

Vector can be created with a `vector` function, defining an object
with x, y, z values or simply defining an array with two or three items.

```ts
import { vector } from "@umbrellajs/vector";

const v2 = vector(1, 1); // Same as { x: 1, y: 1}
const v3 = vector(1, 1, 1); // Same as { x: 1, y: 1, z: 1 }

const v2 = [1, 1]; // [x, y]
const v3 = [1, 1, 1]; // [x, y, z]
```

### Addition

Vectors can be added with `add` function.

```ts
import { add, vector } from "@umbrellajs/vector";

add({ x: 1, y: 1 }, { x: 2, y: 2 }); // { x: 3, y: 3 }
add([1, 1], [2, 2]); // [3, 3]

const v3a = vector(1, 1, 1);
const v3b = vector(2, 2, 2);

add(v3a, v3b); // { x: 3, y: 3, z: 3 }
```

### Subtraction

Vectors can be subtracted with `sub` function.

```ts
import { sub, vector } from "@umbrellajs/vector";

sub({ x: 2, y: 2 }, { x: 1, y: 1 }); // { x: 1, y: 1 }
sub([2, 2], [1, 1]); // [1, 1]

const v3a = vector(2, 2, 2);
const v3b = vector(1, 1, 1);

sub(v3a, v3b); // { x: 1, y: 1, z: 1 }
```

### Multiplication

Vectors can be multiplied with `mult` function.

```ts
import { mult, vector } from "@umbrellajs/vector";

mult({ x: 2, y: 2 }, { x: 2, y: 2 }); // { x: 4, y: 4 }
mult([2, 2], [2, 2]); // [4, 4]

const v3a = vector(2, 2, 2);
const v3b = vector(2, 2, 2);

mult(v3a, v3b); // { x: 4, y: 4, z: 4 }
```

### Division

Vectors can be divided with `div` function.

```ts
import { div, vector } from "@umbrellajs/vector";

div({ x: 4, y: 8 }, { x: 2, y: 2 }); // { x: 2, y: 4 }
div([4, 8], [4, 2]); // [1, 4]

const v3a = vector(4, 4, 4);
const v3b = vector(2, 2, 2);

div(v3a, v3b); // { x: 2, y: 2, z: 2 }

// Vectors can also be divided with number value.
div({ x: 4, y: 4 }, 4); // { x: 1, y: 1 }
```

### Magnitude

Calculates the length of the vector with `mag` function.

```ts
import { mag, vector } from "@umbrellajs/vector";

mag({ x: 3, y: 4 }); // 5
mag(vector(2, 2, 0)); // 5
mag([3, 4]); // 5
```

### Normalize

Normalize the length of the vector to 1 with `normalize` function, making it an unit vector.

```ts
import { normalize, vector } from "@umbrellajs/vector";

normalize({ x: 3, y: 4 }); // length: 1
normalize(vector(2, 4, 8)); // length: 1
normalize([3, 4]); // length: 1
```
