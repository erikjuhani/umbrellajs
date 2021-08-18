import { add, distance, isVector, mag, sub, toArray, vector } from "./vector";

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
  `(
    "should transform $vector to an array $expected",
    ({ vector, expected }) => {
      expect(toArray(vector)).toStrictEqual(expected);
    }
  );

  test.each`
    vector             | expected
    ${[1, 1]}          | ${2}
    ${[1, 1, 1]}       | ${3}
    ${vector(1, 1)}    | ${2}
    ${vector(1, 1, 1)} | ${3}
  `(
    "should calculate $vector magnitude and equal $expected",
    ({ vector, expected }) => {
      expect(mag(vector)).toStrictEqual(expected);
    }
  );

  test.each`
    vector0            | vector1            | expected
    ${[1, 1]}          | ${[1, 1]}          | ${[2, 2]}
    ${[1, 1, 1]}       | ${[1, 1, 1]}       | ${[2, 2, 2]}
    ${vector(1, 1)}    | ${vector(1, 1)}    | ${[2, 2]}
    ${vector(1, 1, 1)} | ${vector(1, 1, 1)} | ${[2, 2, 2]}
  `(
    "should add $vector1 to $vector0 and equal $expected",
    ({ vector0, vector1, expected }) => {
      expect(toArray(add(vector0, vector1))).toStrictEqual(expected);
    }
  );

  test.each`
    vector0            | vector1            | expected
    ${[1, 1]}          | ${[1, 1]}          | ${[0, 0]}
    ${[1, 1, 1]}       | ${[1, 1, 1]}       | ${[0, 0, 0]}
    ${vector(1, 1)}    | ${vector(1, 1)}    | ${[0, 0]}
    ${vector(1, 1, 1)} | ${vector(1, 1, 1)} | ${[0, 0, 0]}
  `(
    "should subtract $vector1 from $vector0 and equal $expected",
    ({ vector0, vector1, expected }) => {
      expect(toArray(sub(vector0, vector1))).toStrictEqual(expected);
    }
  );

  test.each`
    vector0            | vector1               | expected
    ${[0, 0]}          | ${[10, 10]}           | ${14}
    ${[0, 0, 0]}       | ${[10, 10, 10]}       | ${17}
    ${vector(0, 0)}    | ${vector(10, 10)}     | ${14}
    ${vector(0, 0, 0)} | ${vector(10, 10, 10)} | ${17}
  `(
    "should calculate distance between $vector0 and $vector1 correctly and equal $expected",
    ({ vector0, vector1, expected }) => {
      expect(Math.floor(distance(vector0, vector1))).toStrictEqual(expected);
    }
  );
});
