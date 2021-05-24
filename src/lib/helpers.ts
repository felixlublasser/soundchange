export function compare<T, U>(f: (x: T) => U ): ((a: T, b: T) => number) {
  return (a: T, b: T): number => {
    const fa = f(a)
    const fb = f(b)
    if (fa > fb) {
      return 1
    } else {
      return fa < fb ? -1 : 0
    }
  }
}
