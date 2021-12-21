// A port of an algorithm by Johannes Baagøe <baagoe@baagoe.com>, 2010
// http://baagoe.com/en/RandomMusings/javascript/
// https://github.com/nquinlan/better-random-numbers-for-javascript-mirror
// Original work is under MIT license -

// Copyright (C) 2010 by Johannes Baagøe <baagoe@baagoe.org>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

const WHITESPACE = " ";

interface PRNG {
  (): number;
  next(): number;
}

type State = {
  s0: number;
  s1: number;
  s2: number;
};

type StateWithConstant = State & { c: number };

// Johannes Baagøe <baagoe@baagoe.com>, 2010
function mash() {
  let n = 0xefc8249d;

  return (data: string): number => {
    for (let i = 0; i < data.length; i++) {
      n += data.charCodeAt(i);
      let h = 0.02519603282416938 * n;
      n = h >>> 0;
      h -= n;
      h *= n;
      n = h >>> 0;
      h -= n;
      n += h * 0x100000000; // 2^32
    }
    return (n >>> 0) * 2.3283064365386963e-10; // 2^-32
  };
}

function stateSeeder(m: (data: string) => number = mash()) {
  return (seed: string = WHITESPACE): State => {
    return {
      s0: m(seed),
      s1: m(seed),
      s2: m(seed),
    };
  };
}

// Johannes Baagøe <baagoe@baagoe.com>, 2010
// This has a few modifications to the original functionality.
// Mainly by having internal infinite generator for random numbers and
// that the provided seed should always be in string format instead of arguments array.
export function alea(seed: string = (+new Date()).toString()): PRNG {
  const seedState = stateSeeder();

  let { s0, s1, s2, c } = [...seed].reduce<StateWithConstant>(
    (rootState, seedChar) => {
      return Object.entries(seedState(seedChar)).reduce(
        (state, [key, change]) => {
          const s = rootState[key as keyof State] - change;
          return {
            ...state,
            [key]: s < 0 ? s + 1 : s,
            c: 1,
          };
        },
        rootState
      );
    },
    { ...seedState(), c: 1 }
  );

  const random = function () {
    const t = 2091639 * s0 + c * 2.3283064365386963e-10; // 2^-32
    s0 = s1;
    s1 = s2;
    return (s2 = t - (c = t | 0));
  };

  function* g(): Generator<number> {
    while (true) {
      yield random();
    }
  }

  return Object.assign(() => g().next().value, {
    next: () => g().next().value,
  });
}
