import { isError, Result } from "@/lib/result"

export default class InputReader {
  private string: string
  private cursor = 0

  constructor(string: string) {
    this.string = string
  }

  peek(k = 0): Result<string | undefined> {
    if (k < 0) {
      return new Error('Input reader cannot peek back.')
    }
    return this.string[this.cursor + k]
  }

  consume(k = 0): Result<string | undefined> {
    const res = this.peek(k)
    if (isError(res)) {
      return res
    }
    this.cursor += k + 1
    return res
  }
}
