import { Result } from "@/lib/result"

type ParsedObject<T> = {
  parsed: T,
  remainder: string
}

type SubParser<T> = (arg0: string) => Result<ParsedObject<T>>

type GraphemeSet = string[]

export const graphemeClassSubParser: SubParser<GraphemeSet> = (remainder: string) => {
  if (remainder.length === 0) {
    return new Error('unexpected end of string')
  }
  if (remainder[0] !== '[') {
    return new Error(`unexpected <${remainder[0]}>, expected <[>`)
  }
  const graphemeSet: GraphemeSet = []
  let currentGrapheme = ''
  let escaping = false
  remainder = remainder.slice(1)

  const slice = () => {
    const s = remainder[0]
    remainder = remainder.slice(1)
    escaping = escapeNext
    escapeNext = false
    return s
  }
  let escapeNext = false

  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (remainder.length === 0) {
      return new Error('unexpected end of string')
    }
    const currentChar = slice()
    if (escaping) {
      if (!/\s/.test(currentChar)) {
        currentGrapheme += currentChar
      }
    } else if (currentChar === "\\") {
      escapeNext = true
    } else if (currentChar === ']') {
      if (currentGrapheme === '') {
        return new Error('unexpected <]>, expected grapheme character')
      }
      graphemeSet.push(currentGrapheme)
      break
    } else if (currentChar === ',') {
      if (currentGrapheme === '') {
        return new Error('unexpected <,>, expected grapheme character')
      }
      graphemeSet.push(currentGrapheme)
      currentGrapheme = ''
    } else if (!/\s/.test(currentChar)) {
      currentGrapheme += currentChar
    }
  }

  return {
    parsed: graphemeSet,
    remainder
  }
}
