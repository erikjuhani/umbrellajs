import {
  add,
  distance,
  div,
  isVector,
  mag,
  mult,
  normalize,
  sub,
  toArray,
  vector,
} from "./vector";

describe("vector", () => {
  test.each`
    value                         | expected
    ${vector(0, 0)}               | ${true}
    ${vector(0, 0, 0)}            | ${true}
    ${[0]}                        | ${false}
    ${[0, 0]}                     | ${true}
    ${[0, 0, 0]}                  | ${true}
    ${[0, 0, 0, 0]}               | ${false}
    ${{ x: 0 }}                   | ${false}
    ${{ x: 0, y: 0 }}             | ${true}
    ${{ x: 0, y: 0, z: 0 }}       | ${true}
    ${{ x: 0, y: 0, z: 0, a: 0 }} | ${true}
    ${NaN}                        | ${false}
    ${Error}                      | ${false}
    ${""}                         | ${false}
    ${null}                       | ${false}
    ${undefined}                  | ${false}
  `(
    "should recognise $value is vector correctly as $expected",
    ({ value, expected }) => {
      expect(isVector(value)).toBe(expected);
    }
  );

  test.each`
    args         | expected
    ${[0, 0]}    | ${[0, 0]}
    ${[0, 0, 0]} | ${[0, 0, 0]}
  `(
    "should create from args $args a vector $expected",
    ({ args, expected }) => {
      const call = vector.bind(null, ...args);
      expect(toArray(call())).toStrictEqual(expected);
    }
  );

  test.each`
    vector             | expected
    ${[1, 1]}          | ${[1, 1]}
    ${[1, 1, 1]}       | ${[1, 1, 1]}
    ${vector(0, 0)}    | ${[0, 0]}
    ${vector(0, 0, 0)} | ${[0, 0, 0]}
    ${undefined}       | ${Error("given input was not a vector")}
    ${NaN}             | ${Error("given input was not a vector")}
    ${{}}              | ${Error("given input was not a vector")}
  `(
    "should transform $vector to an array $expected",
    ({ vector, expected }) => {
      try {
        expect(toArray(vector)).toStrictEqual(expected);
      } catch (e) {
        expect(e).toEqual(expected);
      }
    }
  );

  test.each`
    vector             | expected
    ${[3, 4]}          | ${5}
    ${[3, 4, 0]}       | ${5}
    ${vector(3, 4)}    | ${5}
    ${vector(3, 4, 0)} | ${5}
    ${undefined}       | ${Error("given input was not a vector")}
    ${NaN}             | ${Error("given input was not a vector")}
    ${{}}              | ${Error("given input was not a vector")}
  `(
    "should calculate $vector magnitude and equal $expected",
    ({ vector, expected }) => {
      try {
        expect(mag(vector)).toStrictEqual(expected);
      } catch (e) {
        expect(e).toEqual(expected);
      }
    }
  );

  test.each`
    vector              | expected
    ${[4, 1]}           | ${1}
    ${[3, 4, 8]}        | ${1}
    ${vector(3, 3)}     | ${1}
    ${vector(6, 4, 10)} | ${1}
    ${undefined}        | ${Error("given input was not a vector")}
    ${NaN}              | ${Error("given input was not a vector")}
    ${{}}               | ${Error("given input was not a vector")}
  `("should normalize $vector and equal $expected", ({ vector, expected }) => {
    try {
      expect(mag(normalize(vector))).toStrictEqual(expected);
    } catch (e) {
      expect(e).toEqual(expected);
    }
  });

  test.each`
    vector0            | vector1              | expected
    ${[1, 1]}          | ${[1, 1]}            | ${[2, 2]}
    ${[1, 1, 1]}       | ${[1, 1, 1]}         | ${[2, 2, 2]}
    ${vector(1, 1)}    | ${vector(1, 1)}      | ${[2, 2]}
    ${vector(1, 1, 1)} | ${vector(1, 1, 1)}   | ${[2, 2, 2]}
    ${undefined}       | ${[1, 2]}            | ${Error("given arguments didn't match or were not considered as vectors")}
    ${NaN}             | ${[1, 1, 1]}         | ${Error("given arguments didn't match or were not considered as vectors")}
    ${{}}              | ${[vector(1, 1)]}    | ${Error("given arguments didn't match or were not considered as vectors")}
    ${1}               | ${[vector(1, 1, 1)]} | ${Error("given arguments didn't match or were not considered as vectors")}
  `(
    "should add $vector1 to $vector0 and equal $expected",
    ({ vector0, vector1, expected }) => {
      try {
        expect(toArray(add(vector0, vector1))).toStrictEqual(expected);
      } catch (e) {
        expect(e).toEqual(expected);
      }
    }
  );

  test.each`
    vector0            | vector1              | expected
    ${[1, 1]}          | ${[1, 1]}            | ${[0, 0]}
    ${[1, 1, 1]}       | ${[1, 1, 1]}         | ${[0, 0, 0]}
    ${vector(1, 1)}    | ${vector(1, 1)}      | ${[0, 0]}
    ${vector(1, 1, 1)} | ${vector(1, 1, 1)}   | ${[0, 0, 0]}
    ${undefined}       | ${[1, 2]}            | ${Error("given arguments didn't match or were not considered as vectors")}
    ${NaN}             | ${[1, 1, 1]}         | ${Error("given arguments didn't match or were not considered as vectors")}
    ${{}}              | ${[vector(1, 1)]}    | ${Error("given arguments didn't match or were not considered as vectors")}
    ${1}               | ${[vector(1, 1, 1)]} | ${Error("given arguments didn't match or were not considered as vectors")}
  `(
    "should subtract $vector1 from $vector0 and equal $expected",
    ({ vector0, vector1, expected }) => {
      try {
        expect(toArray(sub(vector0, vector1))).toStrictEqual(expected);
      } catch (e) {
        expect(e).toEqual(expected);
      }
    }
  );

  test.each`
    vector0            | vector1              | expected
    ${[1, 1]}          | ${[2, 2]}            | ${[2, 2]}
    ${[1, 1, 1]}       | ${[2, 2, 2]}         | ${[2, 2, 2]}
    ${vector(1, 1)}    | ${vector(2, 2)}      | ${[2, 2]}
    ${vector(1, 1, 1)} | ${vector(2, 2, 2)}   | ${[2, 2, 2]}
    ${undefined}       | ${[1, 2]}            | ${Error("given arguments didn't match or were not considered as vectors")}
    ${NaN}             | ${[1, 1, 1]}         | ${Error("given arguments didn't match or were not considered as vectors")}
    ${{}}              | ${[vector(1, 1)]}    | ${Error("given arguments didn't match or were not considered as vectors")}
    ${1}               | ${[vector(1, 1, 1)]} | ${Error("given arguments didn't match or were not considered as vectors")}
  `(
    "should multiple $vector0 with $vector1 and equal $expected",
    ({ vector0, vector1, expected }) => {
      try {
        expect(toArray(mult(vector0, vector1))).toStrictEqual(expected);
      } catch (e) {
        expect(e).toEqual(expected);
      }
    }
  );

  test.each`
    vector0             | vector1              | expected
    ${[4, 4]}           | ${[2, 2]}            | ${[2, 2]}
    ${[4, 2, 4]}        | ${[2, 2, 2]}         | ${[2, 1, 2]}
    ${vector(6, 4)}     | ${vector(3, 2)}      | ${[2, 2]}
    ${vector(4, 10, 4)} | ${vector(2, 1, 2)}   | ${[2, 10, 2]}
    ${undefined}        | ${[1, 2]}            | ${Error("given arguments didn't match or were not considered as vectors")}
    ${NaN}              | ${[1, 1, 1]}         | ${Error("given arguments didn't match or were not considered as vectors")}
    ${{}}               | ${[vector(1, 1)]}    | ${Error("given arguments didn't match or were not considered as vectors")}
    ${1}                | ${[vector(1, 1, 1)]} | ${Error("given arguments didn't match or were not considered as vectors")}
  `(
    "should divide $vector0 with $vector1 and equal $expected",
    ({ vector0, vector1, expected }) => {
      try {
        expect(toArray(div(vector0, vector1))).toStrictEqual(expected);
      } catch (e) {
        expect(e).toEqual(expected);
      }
    }
  );

  test.each`
    vector              | value | expected
    ${[4, 4]}           | ${2}  | ${[2, 2]}
    ${[4, 8, 4]}        | ${4}  | ${[1, 2, 1]}
    ${vector(6, 12)}    | ${6}  | ${[1, 2]}
    ${vector(4, 10, 4)} | ${2}  | ${[2, 5, 2]}
    ${[2, 2]}           | ${0}  | ${Error("cannot divide by zero")}
    ${undefined}        | ${1}  | ${Error("given argument was not considered as vector")}
    ${NaN}              | ${2}  | ${Error("given argument was not considered as vector")}
    ${{}}               | ${3}  | ${Error("given argument was not considered as vector")}
    ${1}                | ${4}  | ${Error("given argument was not considered as vector")}
  `(
    "should divide $vector with $value and equal $expected",
    ({ vector, value, expected }) => {
      try {
        expect(toArray(div(vector, value))).toStrictEqual(expected);
      } catch (e) {
        expect(e).toEqual(expected);
      }
    }
  );

  test.each`
    vector0            | vector1               | expected
    ${[0, 0]}          | ${[10, 10]}           | ${14}
    ${[0, 0, 0]}       | ${[10, 10, 10]}       | ${17}
    ${vector(0, 0)}    | ${vector(10, 10)}     | ${14}
    ${vector(0, 0, 0)} | ${vector(10, 10, 10)} | ${17}
    ${undefined}       | ${[1, 2]}             | ${Error("given arguments didn't match or were not considered as vectors")}
    ${NaN}             | ${[1, 1, 1]}          | ${Error("given arguments didn't match or were not considered as vectors")}
    ${{}}              | ${[vector(1, 1)]}     | ${Error("given arguments didn't match or were not considered as vectors")}
    ${1}               | ${[vector(1, 1, 1)]}  | ${Error("given arguments didn't match or were not considered as vectors")}
  `(
    "should calculate distance between $vector0 and $vector1 correctly and equal $expected",
    ({ vector0, vector1, expected }) => {
      try {
        expect(Math.floor(distance(vector0, vector1))).toStrictEqual(expected);
      } catch (e) {
        expect(e).toEqual(expected);
      }
    }
  );
});
