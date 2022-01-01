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

interface PRNG {
  (): number;
  next(): number;
}

type State = {
  s0: number;
  s1: number;
  s2: number;
};

const WHITESPACE = " ";
const FRAG = 2.3283064365386963e-10; // 2^-32

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
function mash() {
  let n = 0xefc8249d;

  return (seed: string): number => {
    const l = seed.length;
    for (let i = 0; i < l; i++) {
      n += seed.charCodeAt(i);
      let h = 0.02519603282416938 * n;
      n = h >>> 0;
      h -= n;
      h *= n;
      n = h >>> 0;
      h -= n;
      n += h * 0x100000000; // 2^32
    }
    return (n >>> 0) * FRAG;
  };
}

// Johannes Baagøe <baagoe@baagoe.com>, 2010
// This has a few modifications to the original functionality,
// but provides the exact same results.
//
// Modifications
//  - Seed only as a string. Caller is responsible to provide a seed in string format.
//  - Some minor edits to inner state handling - No looping of arguments.
//  - Initial state is not defined as zero's, but instead initialized with mash function.
export function alea(seed: string = (+new Date()).toString()): PRNG {
  const seedState = stateSeeder();

  const state = { ...seedState(), c: 1 };

  const d = seedState(seed);

  for (const key in d) {
    const k = key as keyof State;
    const s = (state[k] -= d[k]);
    if (s < 0) {
      state[k] += 1;
    }
  }

  const next = function () {
    const t = 2091639 * state.s0 + state.c * FRAG;
    state.s0 = state.s1;
    state.s1 = state.s2;
    state.c = t | 0;
    state.s2 = t - state.c;
    return state.s2;
  };

  return Object.assign(next, {
    next,
  });
}
