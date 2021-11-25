export interface Vector2 {
  x: number;
  y: number;
}

export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

type Dimension = "2d" | "3d";

type VectorArray<TDimension extends Dimension = "2d"> = TDimension extends "2d"
  ? [x: number, y: number]
  : [x: number, y: number, z: number];

export type Vector = Vector2 | VectorArray | (Vector3 | VectorArray<"3d">);

export function isVector(value: unknown): value is Vector {
  if (!value) return false;

  const predicate = value as Vector;

  return (
    isVector2(predicate) ||
    isVector2DArray(predicate) ||
    isVector3(predicate) ||
    isVector3DArray(predicate)
  );
}

function isVector2(value: Vector): value is Vector2 {
  return (
    typeof value === "object" && "x" in value && "y" in value && !("z" in value)
  );
}

function isVector3(value: Vector): value is Vector3 {
  return (
    typeof value === "object" && "x" in value && "y" in value && "z" in value
  );
}

function isVector2DArray(vector: Vector): vector is VectorArray {
  return Array.isArray(vector) && vector.length === 2;
}

function isVector3DArray(vector: Vector): vector is VectorArray<"3d"> {
  return Array.isArray(vector) && vector.length === 3;
}

export function mag(vector: Vector): number {
  if (isVector2DArray(vector) || isVector3DArray(vector)) {
    return Math.sqrt(vector.reduce((acc, curr) => acc + curr * curr, 0));
  }

  if (isVector2(vector)) {
    const { x, y } = vector;
    return Math.sqrt(x * x + y * y);
  }

  if (isVector3(vector)) {
    const { x, y, z } = vector;
    return Math.sqrt(x * x + y * y + z * z);
  }

  throw Error("given input was not a vector");
}

export function toArray(vector: VectorArray): VectorArray;
export function toArray(vector: VectorArray<"3d">): VectorArray<"3d">;
export function toArray(vector: Vector2): VectorArray;
export function toArray(vector: Vector3): VectorArray<"3d">;
export function toArray(vector: Vector): VectorArray | VectorArray<"3d"> {
  if (!isVector(vector)) throw Error("given input was not a vector");
  if (isVector2(vector)) return [vector.x, vector.y];
  if (isVector3(vector)) return [vector.x, vector.y, vector.z];
  return vector;
}

export function mult(v0: VectorArray, v1: VectorArray): VectorArray;
export function mult(
  v0: VectorArray<"3d">,
  v1: VectorArray<"3d">
): VectorArray<"3d">;
export function mult(v0: Vector2, v1: Vector2): Vector2;
export function mult(v0: Vector3, v1: Vector3): Vector3;
export function mult(v0: Vector, v1: Vector): Vector {
  if (isVector2DArray(v0) && isVector2DArray(v1)) {
    return v0.map((value, idx) => value * v1[idx]) as VectorArray;
  }

  if (isVector2(v0) && isVector2(v1)) {
    return vector(v0.x * v1.x, v0.y * v1.y);
  }

  if (isVector3DArray(v0) && isVector3DArray(v1)) {
    return v0.map((value, idx) => value * v1[idx]) as VectorArray<"3d">;
  }

  if (isVector3(v0) && isVector3(v1)) {
    return vector(v0.x * v1.x, v0.y * v1.y, v0.z * v1.z);
  }

  throw Error("given arguments didn't match or were not considered as vectors");
}

function divByNumber(vec: VectorArray, val: number): VectorArray;
function divByNumber(vec: VectorArray<"3d">, val: number): VectorArray<"3d">;
function divByNumber(vec: Vector2, val: number): Vector2;
function divByNumber(vec: Vector3, val: number): Vector3;
function divByNumber(vec: Vector, val: number): Vector;
function divByNumber(vec: Vector, val: number): Vector {
  if (val === 0) throw Error("cannot divide by zero");

  if (isVector2(vec)) {
    return vector(vec.x / val, vec.y / val);
  }

  if (isVector2DArray(vec)) {
    return vec.map((value) => value / val) as VectorArray;
  }

  if (isVector3(vec)) {
    return vector(vec.x / val, vec.y / val, vec.z / val);
  }

  if (isVector3DArray(vec)) {
    return vec.map((value) => value / val) as VectorArray<"3d">;
  }

  throw Error("given argument was not considered as vector");
}

export function div(vec: VectorArray, val: number): VectorArray;
export function div(vec: VectorArray<"3d">, val: number): VectorArray<"3d">;
export function div(vec: Vector2, val: number): Vector2;
export function div(vec: Vector3, val: number): Vector3;
export function div(vec: Vector, val: number): Vector;
export function div(v0: VectorArray, v1: VectorArray): VectorArray;
export function div(
  v0: VectorArray<"3d">,
  v1: VectorArray<"3d">
): VectorArray<"3d">;
export function div(v0: Vector2, v1: Vector2): Vector2;
export function div(v0: Vector3, v1: Vector3): Vector3;
export function div(v0: Vector, v1: Vector | number): Vector {
  if (typeof v1 === "number") {
    return divByNumber(v0, v1);
  }

  if (isVector2DArray(v0) && isVector2DArray(v1)) {
    return v0.map((value, idx) => value / v1[idx]) as VectorArray;
  }

  if (isVector2(v0) && isVector2(v1)) {
    return vector(v0.x / v1.x, v0.y / v1.y);
  }

  if (isVector3DArray(v0) && isVector3DArray(v1)) {
    return v0.map((value, idx) => value / v1[idx]) as VectorArray<"3d">;
  }

  if (isVector3(v0) && isVector3(v1)) {
    return vector(v0.x / v1.x, v0.y / v1.y, v0.z / v1.z);
  }

  throw Error("given arguments didn't match or were not considered as vectors");
}

export function add(v0: VectorArray, v1: VectorArray): VectorArray;
export function add(
  v0: VectorArray<"3d">,
  v1: VectorArray<"3d">
): VectorArray<"3d">;
export function add(v0: Vector2, v1: Vector2): Vector2;
export function add(v0: Vector3, v1: Vector3): Vector3;
export function add(v0: Vector, v1: Vector): Vector {
  if (isVector2DArray(v0) && isVector2DArray(v1)) {
    return v0.map((value, idx) => value + v1[idx]) as VectorArray;
  }

  if (isVector2(v0) && isVector2(v1)) {
    return vector(v0.x + v1.x, v0.y + v1.y);
  }

  if (isVector3DArray(v0) && isVector3DArray(v1)) {
    return v0.map((value, idx) => value + v1[idx]) as VectorArray<"3d">;
  }

  if (isVector3(v0) && isVector3(v1)) {
    return vector(v0.x + v1.x, v0.y + v1.y, v0.z + v1.z);
  }

  throw Error("given arguments didn't match or were not considered as vectors");
}

export function sub(v0: VectorArray, v1: VectorArray): VectorArray;
export function sub(
  v0: VectorArray<"3d">,
  v1: VectorArray<"3d">
): VectorArray<"3d">;
export function sub(v0: Vector2, v1: Vector2): Vector2;
export function sub(v0: Vector3, v1: Vector3): Vector3;
export function sub(v0: Vector, v1: Vector): Vector {
  if (isVector2DArray(v0) && isVector2DArray(v1)) {
    return v0.map((value, idx) => value - v1[idx]) as VectorArray;
  }

  if (isVector2(v0) && isVector2(v1)) {
    return vector(v0.x - v1.x, v0.y - v1.y);
  }

  if (isVector3DArray(v0) && isVector3DArray(v1)) {
    return v0.map((value, idx) => value - v1[idx]) as VectorArray<"3d">;
  }

  if (isVector3(v0) && isVector3(v1)) {
    return vector(v0.x - v1.x, v0.y - v1.y, v0.z - v1.z);
  }

  throw Error("given arguments didn't match or were not considered as vectors");
}

export function distance(v0: VectorArray, v1: VectorArray): number;
export function distance(v0: VectorArray<"3d">, v1: VectorArray<"3d">): number;
export function distance(v0: Vector2, v1: Vector2): number;
export function distance(v0: Vector3, v1: Vector3): number;
export function distance(v0: Vector, v1: Vector): number {
  if (isVector2DArray(v0) && isVector2DArray(v1)) {
    return mag(sub(v1, v0));
  }

  if (isVector3DArray(v0) && isVector3DArray(v1)) {
    return mag(sub(v1, v0));
  }

  if (isVector2(v0) && isVector2(v1)) {
    return mag(sub(v1, v0));
  }

  if (isVector3(v0) && isVector3(v1)) {
    return mag(sub(v1, v0));
  }

  throw Error("given arguments didn't match or were not considered as vectors");
}

export function normalize(v: VectorArray): VectorArray;
export function normalize(v: VectorArray<"3d">): VectorArray<"3d">;
export function normalize(v: Vector2): Vector2;
export function normalize(v: Vector3): Vector3;
export function normalize(v: Vector): Vector {
  const m = mag(v);
  if (m === 0) return v;

  return div(v, m);
}

export function vector(x: number, y: number): Vector2;
export function vector(x: number, y: number, z: number): Vector3;
export function vector(x: number, y: number, z?: number): Vector {
  if (z !== undefined) {
    const v3 = {
      x,
      y,
      z,
    };
    return v3;
  }

  const v2 = {
    x,
    y,
  };

  return v2;
}

/*
 * TODO: Make a better randomizer function.
 * @returns a random 2d vector
 */
export function random(x = 1, y = 1): Vector {
  return vector(x * Math.random(), y * Math.random());
}
