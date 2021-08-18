export interface Vector2 {
  x: number;
  y: number;
}

export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

type vector2array = [x: number, y: number];
type vector3array = [x: number, y: number, z: number];

export type Vector = (Vector2 | vector2array) | (Vector3 | vector3array);

export function isVector(value: unknown): value is Vector {
  if (!value) {
    return false;
  }

  const predicate = value as Vector;

  return (
    isVector2(predicate) ||
    isVector2Array(predicate) ||
    isVector3(predicate) ||
    isVector3Array(predicate)
  );
}

function isVector2(value: Vector): value is Vector2 {
  const predicate = value as Vector2;
  return (
    predicate.x !== undefined &&
    predicate.y !== undefined &&
    (predicate as any).z === undefined
  );
}

function isVector3(value: Vector): value is Vector3 {
  const predicate = value as Vector3;
  return (
    predicate.x !== undefined &&
    predicate.y !== undefined &&
    predicate.z !== undefined
  );
}

function isVector2Array(value: Vector): value is vector2array {
  return value instanceof Array && value.length === 2;
}

function isVector3Array(value: Vector): value is vector3array {
  return value instanceof Array && value.length === 3;
}

export function mag(vector: vector2array): number;
export function mag(vector: vector3array): number;
export function mag(vector: Vector2): number;
export function mag(vector: Vector3): number;
export function mag(vector: Vector): number {
  if (isVector2Array(vector) || isVector3Array(vector)) {
    return vector.reduce((prev, curr) => prev + curr * curr);
  }

  if (isVector2(vector)) {
    const { x, y } = vector;
    return x * x + y * y;
  }

  const { x, y, z } = vector;
  return x * x + y * y + z * z;
}

export function toArray(vector: vector2array): vector2array;
export function toArray(vector: vector3array): vector3array;
export function toArray(vector: Vector2): vector2array;
export function toArray(vector: Vector3): vector3array;
export function toArray(vector: Vector): vector2array | vector3array {
  if (isVector2(vector)) return [vector.x, vector.y];
  if (isVector3(vector)) return [vector.x, vector.y, vector.z];
  return vector;
}

export function add(v0: vector2array, v1: vector2array): vector2array;
export function add(v0: vector3array, v1: vector3array): vector3array;
export function add(v0: Vector2, v1: Vector2): Vector2;
export function add(v0: Vector3, v1: Vector3): Vector3;
export function add(v0: Vector, v1: Vector): Vector {
  if (isVector2Array(v0) && isVector2Array(v1)) {
    return v0.map((value, idx) => value + v1[idx]) as vector2array;
  }

  if (isVector2(v0) && isVector2(v1)) {
    return vector(v0.x + v1.x, v0.y + v1.y);
  }

  if (isVector3Array(v0) && isVector3Array(v1)) {
    return v0.map((value, idx) => value + v1[idx]) as vector3array;
  }

  const vec0 = v0 as Vector3;
  const vec1 = v1 as Vector3;

  return vector(vec0.x + vec1.x, vec0.y + vec1.y, vec0.z + vec1.z);
}

export function sub(v0: vector2array, v1: vector2array): vector2array;
export function sub(v0: vector3array, v1: vector3array): vector3array;
export function sub(v0: Vector2, v1: Vector2): Vector2;
export function sub(v0: Vector3, v1: Vector3): Vector3;
export function sub(v0: Vector, v1: Vector): Vector {
  if (isVector2Array(v0) && isVector2Array(v1)) {
    return v0.map((value, idx) => value - v1[idx]) as vector2array;
  }

  if (isVector2(v0) && isVector2(v1)) {
    return vector(v0.x - v1.x, v0.y - v1.y);
  }

  if (isVector3Array(v0) && isVector3Array(v1)) {
    return v0.map((value, idx) => value - v1[idx]) as vector3array;
  }

  const vec0 = v0 as Vector3;
  const vec1 = v1 as Vector3;

  return vector(vec0.x - vec1.x, vec0.y - vec1.y, vec0.z - vec1.z);
}

export function distance(v0: Vector, v1: Vector): number {
  if (isVector2Array(v0) && isVector2Array(v1)) {
    return Math.hypot(...sub(v1, v0));
  }

  if (isVector3Array(v0) && isVector3Array(v1)) {
    return Math.hypot(...sub(v1, v0));
  }

  if (isVector2(v0) && isVector2(v1)) {
    const { x, y } = sub(v1, v0);
    return Math.hypot(x, y);
  }

  const { x, y, z } = sub(v1 as Vector3, v0 as Vector3) as Vector3;
  return Math.hypot(x, y, z);
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
