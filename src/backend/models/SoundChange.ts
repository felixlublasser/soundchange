import SCRecord from "@/backend/records/SCRecord"
import { ISoundChangeRecord } from "@/backend/records/tables"
import { isError, Result } from "@/lib/result"

const BRACKET_MATCHER = /^\[([^*{?+,\]]+,)*[^*{?+,\]]+]/

export default class SoundChange {
  contextBefore: MatcherString
  contextAfter: MatcherString
  replace: MatcherString
  replaceWith: TransformationString

  constructor({ contextBefore, contextAfter, replace, replaceWith }:
    {
      contextBefore: MatcherString,
      contextAfter: MatcherString,
      replace: MatcherString,
      replaceWith: TransformationString
    }
  ) {
    this.contextBefore = contextBefore
    this.contextAfter = contextAfter
    this.replace = replace
    this.replaceWith = replaceWith
  }

  static parse(soundChange: SCRecord<ISoundChangeRecord>): Result<SoundChange> {
    const contextBefore = MatcherString.parse(soundChange.record.contextBefore)
    if (isError(contextBefore)) { return contextBefore }

    const contextAfter = MatcherString.parse(soundChange.record.contextAfter)
    if (isError(contextAfter)) { return contextAfter }

    const replace = MatcherString.parse(soundChange.record.replace)
    if (isError(replace)) { return replace }

    const replaceWith = TransformationString.parse({
      replaceMatcherString: replace,
      replaceWith: soundChange.record.replaceWith
    })
    if (isError(replaceWith)) { return replaceWith } 

    return new SoundChange({ contextBefore, contextAfter, replace, replaceWith })
  }
}

class MatcherString {
  elements: Matcher[]

  constructor(els: Matcher[]) {
    this.elements = els
  }

  static parse(context: string): Result<MatcherString> {
    let parsingContext: ParsingContext<Matcher> = {
      remaining: context,
      els: []
    }

    while (parsingContext.remaining.length > 0) {
      const char = parsingContext.remaining[0]
      let parseResult: Result<ParsingContext<Matcher>>
      if (char === '[') {
        parseResult = parseGraphemeClassWithQ(parsingContext)
      } else {
        parseResult = parseGraphemesWithQ(parsingContext)
      }
      if (isError(parseResult)) { return parseResult }
      parsingContext = parseResult
    }
    return new MatcherString(parsingContext.els)
  }
}

class Matcher {
  core: Grapheme | Grapheme[]
  quantifier: Quantifier = new Quantifier()

  constructor(core: Grapheme | Grapheme[]) {
    this.core = core
  }
}

class Quantifier {
  min
  max

  constructor(min = 1, max = 1) {
    this.min = min
    this.max = max
  }
}

type ParsingContext<T> = { remaining: string, els: T[] }

type Grapheme = string

class TransformationString {
  elements: Transformation[]

  constructor(els: Transformation[]) {
    this.elements = els
  }

  static parse(
    { replaceMatcherString, replaceWith }: {
      replaceMatcherString: MatcherString,
      replaceWith: string
    }
  ): Result<TransformationString> {
    const parsingContext: ParsingContext<Transformation> = {
      remaining: replaceWith,
      els: []
    }

    while (parsingContext.remaining.length > 0) {
      const char = parsingContext.remaining[0]
      let parseResult: Result<ParsingContext<Transformation>>
      if (char === '[') {
        // const bracketMatcher = parsingContext.remaining.match(BRACKET_MATCHER)
        // if (!bracketMatcher || !bracketMatcher[0]) {
        //   return new Error('Cannot parse grapheme class transformation')
        // }
        // parseResult = {
        //   remaining: parsingContext.remaining.slice(bracketMatcher[0].length),
        //   els: parsingContext.els
        // }
        // parseResult = parseGraphemeClass(parsingContext)
        // if (isError(parseResult)) { return parseResult }
        const graphemesRes = parseGraphemeClass(parsingContext.remaining)
        if (isError(graphemesRes)) { return graphemesRes }

        const correspondingMatcher: Matcher | undefined = replaceMatcherString.elements[parsingContext.els.length]
        if (!correspondingMatcher) {  
          return new Error(
            'cannot find corresponding matcher for grapheme class transformation'
          )
        }

        const newTrafo = new ReplacementMapTrafo(
          graphemesRes.graphemes,
          replaceMatcherString.elements[parsingContext.els.length]
        )
        if (isError(newTrafo)) { return newTrafo }

        parsingContext.els.push(newTrafo)
        parsingContext.remaining = graphemesRes.remaining
      } else {
        const graphemeResult = parseGraphemes(parsingContext.remaining)
        if (isError(graphemeResult)) { return graphemeResult }
        parsingContext.els.push(new ReplacementTrafo(graphemeResult))
        parsingContext.remaining = parsingContext.remaining.slice(graphemeResult.length)
      }
    }
    return new TransformationString(parsingContext.els)
  }
}

interface Transformation {
  transform(g: Grapheme | Grapheme[]): string
}

class ReplacementTrafo implements Transformation {
  replacement: string

  constructor(replacement: string) {
    this.replacement = replacement
  }

  transform(): string {
    return this.replacement
  }
}

class ReplacementMapTrafo implements Transformation {
  replacement: string

  constructor(replacement: string[], replaceMatcherString: Matcher) {
    this.replacement = replacement
  }

  transform(): string {
    return this.replacement
  }
}

// class GraphemeClass {
//   graphemes: Grapheme[]

//   constructor(graphemes: Grapheme[]) {
//     this.graphemes = graphemes
//   }
// }

function parseGraphemeClassWithQ(
  parsingContext: ParsingContext<Matcher>
): Result<ParsingContext<Matcher>> {
  const graphemesRes = parseGraphemeClass(parsingContext.remaining)
  if (isError(graphemesRes)) { return graphemesRes }

  parsingContext.els.push(new Matcher(graphemesRes.graphemes))
  parsingContext.remaining = graphemesRes.remaining

  return parseQuantifier(parsingContext)
}

function parseGraphemeClass(remaining: string): Result<{ graphemes: string[], remaining: string }> {
  const wellFormedBracketMatch = remaining.match(BRACKET_MATCHER)
  if (!wellFormedBracketMatch || !wellFormedBracketMatch[0]) {
    return new Error('Could not parse grapheme class')
  }
  const bracketExp = wellFormedBracketMatch[0]
  return {
    graphemes: bracketExp.slice(1, bracketExp.length - 1).split(','),
    remaining: remaining.slice(bracketExp.length)
  }
}

function parseGraphemes(remaining: string): Result<string> {
  const matches = remaining.match(/^[^[*{?+]+/)
  console.log('parsing graphemes', matches && matches[0])
  if (matches === null) {
    return new Error('Cannot parse graphemes')
  }
  return matches[0]
}

function parseGraphemesWithQ(parsingContext: ParsingContext<Matcher>): Result<ParsingContext<Matcher>> {
  const grapheme = parseGraphemes(parsingContext.remaining)
  if (isError(grapheme)) { return grapheme }
  parsingContext = {
    remaining: parsingContext.remaining.slice(grapheme.length),
    els: parsingContext.els.concat(new Matcher(grapheme))
  }

  return parseQuantifier(parsingContext)
}

function parseQuantifier(parsingContext: ParsingContext<Matcher>): Result<ParsingContext<Matcher>> {
  let parsedQuantifier = new Quantifier()
  const simpleQuantifier = parsingContext.remaining.match(/^[*?+]/)
  const bracesQuantifier = parsingContext.remaining.match(/^{([0-9]+)}/)
  console.log('parsing quantifier', simpleQuantifier, bracesQuantifier)
  if (simpleQuantifier && simpleQuantifier[0]) {
    parsedQuantifier = new Quantifier(...{
      '*': [0, Infinity],
      '?': [0, 1],
      '+': [1, Infinity]
    }[simpleQuantifier[0] as '*' | '?' | '+'])
    parsingContext.remaining = parsingContext.remaining.slice(1)
    console.log(parsedQuantifier)

  } else if (bracesQuantifier && bracesQuantifier[0]) {
    const count = parseInt(bracesQuantifier[1])
    if (isNaN(count)) {
      return new Error('error parsing quantifier')
    }
    parsedQuantifier = new Quantifier(count, count)
    parsingContext.remaining = parsingContext.remaining.slice(bracesQuantifier[0].length)
  }
  parsingContext.els[parsingContext.els.length - 1].quantifier = parsedQuantifier
  return parsingContext
}

// type TransformationElement = Grapheme | Grapheme[]
