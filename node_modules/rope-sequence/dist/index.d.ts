export default class RopeSequence<T> {
  length: number
  prepend(other: RopeSequence<T> | readonly T[]): RopeSequence<T>
  append(other: RopeSequence<T> | readonly T[]): RopeSequence<T>
  slice(from: number, to?: number): RopeSequence<T>
  get(i: number): T
  forEach(f: (elt: T, index: number) => boolean | void, from?: number, to?: number): void
  map<U>(f: (elt: T, index: number) => U, from?: number, to?: number): U[]
  static from<T>(value: readonly T[] | RopeSequence<T>): RopeSequence<T>
  static empty: RopeSequence<any>
}
