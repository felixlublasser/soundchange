export type Result<T> = T | Error;

export function isError<T>(result: Result<T>): result is Error {
  return result instanceof Error;
}

export function isSuccess<T>(result: Result<T>): result is T {
  return !isError(result);
}

export function succeedOrThrow<T>(result: Result<T>): T {
  if (isError(result)) {
    throw result
  } else {
    return result
  }
}

export function resultify<T>(func:() => T): Result<T> {
  try {
    return func()
  } catch (e) {
    return e as Error
  }
}

export function collectify<T>(results: Result<T>[]): Result<T[]> {
  const potentialError = results.find(isError)
  return potentialError ? potentialError : results as Result<T[]>
}

export function errorOrExec<T, U>(result: Result<T>, func: (t: T) => U): Error | U {
  return isError(result) ? result : func(result)
}