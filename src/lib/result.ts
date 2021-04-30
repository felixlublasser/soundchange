export type Result<T> = T | Error;

export function isError<T>(result: Result<T>): result is Error {
  return result instanceof Error;
}

export function isSuccess<T>(result: Result<T>): result is T {
  return !isError(result);
}

export function throwUnless<T>(result: Result<T>): T {
  if (isError(result)) {
    throw result
  } else {
    return result
  }
}