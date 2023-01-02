import { errorOrExec, isError } from "@/lib/result";
import SoundChangeContextLexer, {
  Token,
  Literal,
  isEOF,
  isLiteral,
  isSyntaxToken,
} from "./lexer";
import Parser, { simpleDecider } from '@/backend/lib/parser'
import InputReader from './inputReader'

type SyntaxTokenString = "," | "[" | "]" | "{" | "}" | "?" | "*" | "+"
type SpecificSyntaxToken<T extends SyntaxTokenString> = {
  type: "SyntaxToken"
  prefix: string, content: T
}

type OpenBracketToken = SpecificSyntaxToken<"[">
type NumberLiteralToken = { type: "Literal", prefix: string, content: `${number}` }

const isCommaToken = syntaxTokenDecider<",">(",")
const isOpenBracketToken = syntaxTokenDecider<"[">("[")

const isOpenBracketTokenOrLiteral =
  (token: Token): token is OpenBracketToken | Literal =>
    isOpenBracketToken(token) || isLiteral(token)

function syntaxTokenDecider<G extends SyntaxTokenString>(glyph: G) {
  return (token: Token): token is SpecificSyntaxToken<G> =>
    isSyntaxToken(token) && token.content === glyph
}

function syntaxNodeConfig<G extends SyntaxTokenString>(
  glyph: G
) {
  return {
    stringRep: `<${glyph}>`,
    decider: syntaxTokenDecider(glyph)
  }
}

const numberLiteralConfig = {
  stringRep: "number literal",
  decider: (token: Token): token is NumberLiteralToken =>
    isLiteral(token) && /[0-9]/.test(token.content)
}

const matcherLiteralConfig = {
  stringRep: "matcher literal",
  decider: isLiteral
}

const EOFConfig = {
  stringRep: "end of file",
  decider: isEOF
}

const nodeConfig = {
  ",": syntaxNodeConfig(","),
  "[": syntaxNodeConfig("["),
  "]": syntaxNodeConfig("]"),
  "{": syntaxNodeConfig("{"),
  "}": syntaxNodeConfig("}"),
  "+": syntaxNodeConfig("+"),
  "?": syntaxNodeConfig("?"),
  "*": syntaxNodeConfig("*"),
  numberLiteral: numberLiteralConfig,
  matcherLiteral: matcherLiteralConfig,
  EOF: EOFConfig,
}

const subruleConfig = {
  literalOrCommaSeparatedMatcherSubgroupConfig: {
    if: (peek: SoundChangeContextLexer["peek"]) => {
      return errorOrExec(peek(1), isCommaToken)
    },
    then: "commaSeparatedMatcherSubgroup",
    else: "matcherLiteral",
  }
} as const

const ruleConfig = {
  quantifiedMatcherSet: {
    left: "quantifiedMatcher",
    right: {
      try: "EOF",
      else: "quantifiedMatcherSet",
    }
  },
  quantifiedMatcher: {
    matcher: {
      if: "[",
      then: "matcherGroup",
      else: "matcherLiteral",
    },
    quantifier: {
      if: "{",
      then: "quantifierLiteral",
      else: {
        try: ["*", "?", "+"],
        else: null,
      }
    },
  },
  matcherGroup: {
    open: "[",
    matchers: subruleConfig.literalOrCommaSeparatedMatcherSubgroupConfig,
    close: "]",
  },
  commaSeparatedMatcherSubgroup: {
    left: "matcherLiteral",
    separator: ",",
    right: subruleConfig.literalOrCommaSeparatedMatcherSubgroupConfig,
  },
  quantifierLiteral: {
    open: "{",
    number: "numberLiteral",
    close: "}",
  }
} as const

const rootConfig = {
  root: {
    if: simpleDecider(isOpenBracketTokenOrLiteral),
    then: "quantifiedMatcherSet",
    else: "EOF",
  }
} as const

const SoundChangeContextParser = new Parser<
  Token,
  typeof rootConfig,
  typeof ruleConfig,
  typeof nodeConfig,
  SoundChangeContextLexer,
  typeof SoundChangeContextLexer,
  InputReader,
  typeof InputReader
>(
  SoundChangeContextLexer,
  InputReader,
  rootConfig,
  ruleConfig,
  nodeConfig
)

export default SoundChangeContextParser
