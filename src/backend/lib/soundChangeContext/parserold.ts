import { errorOrExec, isError, Result } from "@/lib/result";
import InputReader from "./inputReader";
import Lexer, {
  Token,
  EOF,
  Literal,
  SyntaxToken,
  isEOF,
  isLiteral,
  isSyntaxToken,
} from "./lexer";

class ParseError extends Error {
  constructor(token: Token, expected: string) {
    super(`Unexpected token <${token.content}>: expected ${expected}.`)
  }
}

type GuardedType<T> = T extends (x: any) => x is infer U ? U : never;

type SyntaxTokenString = "," | "[" | "]" | "{" | "}" | "?" | "*" | "+"
type SpecificSyntaxToken<T extends SyntaxTokenString> = {
  type: "SyntaxToken"
  prefix: string, content: T
}

// derived leaf node types
type CommaToken = SpecificSyntaxToken<",">
type OpenBracketToken = SpecificSyntaxToken<"[">
type ClosedBracketToken = SpecificSyntaxToken<"]">
type OpenBraceToken = SpecificSyntaxToken<"{">
type ClosedBraceToken = SpecificSyntaxToken<"}">
type NoneOrOneToken = SpecificSyntaxToken<"?">
type NoneOrMoreToken = SpecificSyntaxToken<"*">
type OneOrMoreToken = SpecificSyntaxToken<"+">
type NumberLiteralToken = { type: "Literal", prefix: string, content: `${number}` }

// leaf node type guards
function syntaxTokenTypeGuardFactory<T extends SyntaxToken> (glyph: SyntaxTokenString) {
  return (token: Token): token is T => {
    return isSyntaxToken(token) && token.content === glyph
  }
}

function syntaxTokenDecider<G extends SyntaxTokenString>(glyph: G) {
  return (token: Token): token is SpecificSyntaxToken<G> =>
    isSyntaxToken(token) && token.content === glyph
}

const isCommaToken = syntaxTokenTypeGuardFactory<CommaToken>(",")
const isOpenBracketToken = syntaxTokenTypeGuardFactory<OpenBracketToken>("[")
// const isClosedBracketToken = syntaxTokenTypeGuardFactory<ClosedBracketToken>("]")
// const isOpenBraceToken = syntaxTokenTypeGuardFactory<OpenBraceToken>("{")
// const isClosedBraceToken = syntaxTokenTypeGuardFactory<ClosedBraceToken>("}")
// const isNoneOrOneToken = syntaxTokenTypeGuardFactory<NoneOrOneToken>("?")
// const isNoneOrMoreToken = syntaxTokenTypeGuardFactory<NoneOrMoreToken>("*")
// const isOneOrMoreToken = syntaxTokenTypeGuardFactory<OneOrMoreToken>("+")
// const isNumberLiteralToken = (token: Token): token is NumberLiteralToken => {
//   return isLiteral(token) && /[0-9]/.test(token.content)
// }

class LeafNode<T extends Token> {
  token: T

  constructor(token: T) {
    this.token = token
  }
}

type NodeConfigItem<T extends Token> = {
  stringRep: string,
  decider: (token: Token) => token is T
}

function simpleDeciderByConfig<T extends Token>(nodeConfigItem: NodeConfigItem<T>) {
  return (peek: Lexer["peek"]) => {
    return errorOrExec(peek(), nodeConfigItem.decider)
  }
}
function syntaxNodeConfig<G extends SyntaxTokenString>(glyph: G): NodeConfigItem<SpecificSyntaxToken<G>> {
  return {
    stringRep: `<${glyph}>`,
    decider: syntaxTokenDecider(glyph)
  }
}
const numberLiteralConfig: NodeConfigItem<NumberLiteralToken> = {
  stringRep: "number literal",
  decider: (token): token is NumberLiteralToken =>
    isLiteral(token) && /[0-9]/.test(token.content)
}
const matcherLiteralConfig: NodeConfigItem<Literal> = {
  stringRep: "matcher literal",
  decider: isLiteral
}
const EOFConfig: NodeConfigItem<EOF> = {
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

type TokenFromNodeConfig<NCI> = NCI extends NodeConfigItem<infer T> ? T : never

const subruleConfig = {
  literalOrCommaSeparatedMatcherSubgroupConfig: {
    if: (peek: Lexer["peek"]) => {
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

const isOpenBracketTokenOrLiteral =
  (token: Token): token is OpenBracketToken | Literal =>
    isOpenBracketToken(token) || isLiteral(token)

const treeRootConfig = {
  root: {
    try: "EOF",
    else: {
      if: simpleDecider(isOpenBracketTokenOrLiteral),
      then: "quantifiedMatcherSet",
      else: {
        error: "matcher literal, <[>, or EOF"
      }
    }
  }
}

// higher level nodes

class HighLevelNode<T extends NodeElements> {
  elements: T

  constructor(elements: T) {
    this.elements = elements
  }
}

type Node = LeafNode<any> | HighLevelNode<any>

class CommaSeparatedMatcherSubgroup extends HighLevelNode<{
    left: LeafNode<Literal>,
    separator: LeafNode<CommaToken>,
    right: LeafNode<Literal> | CommaSeparatedMatcherSubgroup,
}> {}

class MatcherGroup extends HighLevelNode<{
  open: LeafNode<OpenBracketToken>,
  matchers: LeafNode<Literal> | CommaSeparatedMatcherSubgroup,
  close: LeafNode<ClosedBracketToken>,
}> {}

class QuantifierLiteral extends HighLevelNode<{
  open: LeafNode<OpenBraceToken>,
  number: LeafNode<NumberLiteralToken>,
  close: LeafNode<ClosedBraceToken>,
}> {}

class QuantifiedMatcher extends HighLevelNode<{
  matcher: LeafNode<Literal> | MatcherGroup,
  quantifier: LeafNode<
      | NoneOrMoreToken
      | NoneOrOneToken
      | OneOrMoreToken
    >
    | QuantifierLiteral
    | null,
}> {}
class QuantifiedMatcherSet extends HighLevelNode<{
  left: QuantifiedMatcher,
  right: QuantifiedMatcherSet | LeafNode<EOF>,
}> {}

type NodeElements = Record<
  string,
  Node | null
>

type NodeKey = keyof typeof nodeConfig
type RuleKey = keyof typeof ruleConfig
type SubruleConfig =
  | ParseFunc
  | DecisionRuleConfig
  | TryElseRuleConfig
  | NodeKey
  | RuleKey
  | null
type ParseFunc = () => Result<Node | null>
type DecisionRuleConfig = {
  if: DeciderFunction | NodeKey | NodeKey[],
  then: SubruleConfig
  else: SubruleConfig
}
type DeciderFunction = ((peek: Lexer["peek"]) => Result<boolean>)
type TryElseRuleConfig = {
  try: NodeKey | readonly NodeKey[]
  else: SubruleConfig
}

type RuleConfig = Record<string, SubruleConfig>

function isDecisionRuleConfig(
  subconfig: SubruleConfig
): subconfig is DecisionRuleConfig {
  return typeof subconfig === "object"
    && Object.prototype.hasOwnProperty.call(subconfig, "decider")
}

function isDeciderFunction(
  decider: DecisionRuleConfig["if"]
): decider is DeciderFunction {
  return typeof decider === "function"
}

function isTryElseRuleConfig(
  subconfig: SubruleConfig
): subconfig is TryElseRuleConfig {
  return typeof subconfig === "object"
    && subconfig !== null
    && Object.prototype.hasOwnProperty.call(subconfig, "try")
}

function isParseFunc(
  subconfig: SubruleConfig
): subconfig is ParseFunc {
  return typeof subconfig === "function"
}

function isNodeKey(
  subconfig: SubruleConfig)
: subconfig is NodeKey {
  return typeof subconfig === "string"
    && Object.prototype.hasOwnProperty.call(nodeConfig, subconfig)
}

function isRuleKey(
  subconfig: SubruleConfig)
: subconfig is RuleKey {
  return typeof subconfig === "string"
    && Object.prototype.hasOwnProperty.call(ruleConfig, subconfig)
}

type TypeDepthLimiter = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
// type TypeDepthPasserOnner = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

type PureReturnType<T extends (...args: any) => any> = Exclude<ReturnType<T>, Error>
type ConfigRuleReturnType<
  RC extends RuleConfig,
  D extends TypeDepthLimiter[number] = 2
> = {
  [Property in keyof RC]:
    SubruleConfigReturnType<RC[Property], D>
}

type ReturnTypeFromRuleKey<
  SRC extends RuleKey,
  D extends TypeDepthLimiter[number]
> = ConfigRuleReturnType<typeof ruleConfig[SRC], D>

type SubruleConfigReturnType<
  SRC extends SubruleConfig,
  D extends TypeDepthLimiter[number] = 2
> =
[D] extends [never]
    ? null
    : (SRC extends DecisionRuleConfig
      ? SubruleConfigReturnType<SRC["then"] | SRC["else"], TypeDepthLimiter[D]>
      : SRC extends ParseFunc ? PureReturnType<SRC> : (
        SRC extends NodeKey
          ? LeafNode<TokenFromNodeConfig<typeof nodeConfig[SRC]>>
          : SRC extends RuleKey
            ? HighLevelNode<ReturnTypeFromRuleKey<SRC, TypeDepthLimiter[D]>>
            : SRC extends null
              ? null
              : never
      )
    )

// type ParseTree = HighLevelNode<{
//   root: QuantifiedMatcherSet | LeafNode<EOF>
// }>

type RootConfig = {
  root: SubruleConfig
}

function simpleDecider<T extends Token>(typeGuard: (t: Token) => t is T) {
  return (peek: Lexer["peek"]) => {
    const nextToken = peek()
    return isError(nextToken) ? nextToken : typeGuard(nextToken)
  }
}

export default class Parser<T extends RootConfig> {
  // private lexer: Lexer | null = null
  // private parseTree: Result<ParseTree | undefined> = undefined
  private rootConfig: T

  constructor(rootConfig: T) {
    // this.lexer = new Lexer(new InputReader(string))
    this.rootConfig = rootConfig
  }

  // getParseTree(string: string): Result<ParseTree> {
  //   if (this.parseTree === undefined) {
  //     this.parseTree = this.parse(string)
  //   }
  //   return this.parseTree
  // }

  parse(string: string): Result<HighLevelNode<ConfigRuleReturnType<T>>> {
    const lexer = new Lexer(new InputReader(string))
    // const isOpenBracketTokenOrLiteral =
    //   (token: Token): token is OpenBracketToken | Literal =>
    //     isOpenBracketToken(token) || isLiteral(token)
    // return this.parseRule({
    //   root: {
    //     try: "EOF",
    //     else: {
    //       if: this.simpleDecider(isOpenBracketTokenOrLiteral),
    //       then: "quantifiedMatcherSet",
    //       else: this.parseError("matcher literal, <[>, or EOF")
    //     }
    //   }
    // })
    return this.parseRule(this.rootConfig, lexer)
  }

  // High Level Node Parsers

  private parseRule<RC extends RuleConfig>(ruleConfig: RC, lexer: Lexer): Result<
    HighLevelNode<ConfigRuleReturnType<RC>>
  > {
    type NE = ConfigRuleReturnType<RC>

    const result: Partial<NE> = {}
    for (const subruleKey in ruleConfig) {
      const subrule = ruleConfig[subruleKey]
      const res = this.parseSubRule(subrule, lexer)
      if (isError(res)) { return res }
      result[subruleKey] = res as NE[typeof subruleKey]
    }
    return new HighLevelNode<NE>(result as NE)
  }

  private parseSubRule<T extends SubruleConfig>(subrule: T, lexer: Lexer): Result<SubruleConfigReturnType<T>> {
    if(isDecisionRuleConfig(subrule)) {
      return this.parseDecisionRuleConfig(subrule, lexer) as Result<SubruleConfigReturnType<T>>

    } else if (isParseFunc(subrule)) {
      return subrule() as Result<SubruleConfigReturnType<T>>

    } else if (isTryElseRuleConfig(subrule)) {
      return this.parseTryElseRuleConfig(subrule, lexer)

    } else if (isNodeKey(subrule)) {
      const nodeConfigItem = nodeConfig[subrule as NodeKey]
      return this.parseLeafNode<TokenFromNodeConfig<typeof nodeConfigItem>>(
        nodeConfigItem,
        lexer
      ) as Result<SubruleConfigReturnType<T>>

    } else if (isRuleKey(subrule)) {
      return this.parseRule(ruleConfig[subrule as RuleKey], lexer) as Result<SubruleConfigReturnType<T>>
    }

    // case null
    lexer.consume()
    return null as Result<SubruleConfigReturnType<T>>
  }

  private parseTryElseRuleConfig<T extends TryElseRuleConfig>(subrule: T, lexer: Lexer) {
    const tries = (Array.isArray(subrule.try) ? subrule.try : [subrule.try]) as NodeKey[];
    const tryNodeConfigs = tries.map(trie => nodeConfig[trie])
    for (const tryNodeConfig of tryNodeConfigs) {
      const decider = simpleDeciderByConfig<
        TokenFromNodeConfig<typeof tryNodeConfig>
      >(tryNodeConfig)
      if (decider(lexer.peek)) {
        return this.parseLeafNode<TokenFromNodeConfig<typeof tryNodeConfig>>(
          tryNodeConfig,
          lexer
        ) as Result<SubruleConfigReturnType<T>>
      }
    }
    return this.parseSubRule(subrule.else, lexer) as Result<SubruleConfigReturnType<T>>
  }

  private parseDecisionRuleConfig<T extends DecisionRuleConfig>(
    subrule: T,
    lexer: Lexer,
  ): Result<SubruleConfigReturnType<T["then"]> | SubruleConfigReturnType<T["else"]>> {
    if (isDeciderFunction(subrule.if)) {
      return this.parseDeciderFunction<T["then"], T["else"]>(
        subrule.if, subrule.then, subrule.else, lexer
      )
    } else if (Array.isArray(subrule.if)) {
      return this.parseNodeKeyArray<T["then"], T["else"]>(
        subrule.if, subrule.then, subrule.else, lexer
      )
    }
    return this.parseNodeKeyArray<T["then"], T["else"]>(
      [subrule.if], subrule.then, subrule.else, lexer
    )
  }

  private parseDeciderFunction<T extends SubruleConfig, E extends SubruleConfig>(
    iff: DeciderFunction,
    then: T,
    elce: E,
    lexer: Lexer,
  ): Result<SubruleConfigReturnType<T> | SubruleConfigReturnType<E>> {
    return errorOrExec(
      iff(lexer.peek),
      (decision) =>
        this.parseSubRule<T | E>(
          decision ? then : elce,
          lexer
        )
    )
  }

  private parseNodeKeyArray<T extends SubruleConfig, E extends SubruleConfig>(
    nodeKeys: NodeKey[],
    then: T,
    elce: E,
    lexer: Lexer,
  ): Result<SubruleConfigReturnType<T> | SubruleConfigReturnType<E>> {
    const configItems = nodeKeys.map(nodeKey => nodeConfig[nodeKey])
    for (const configItem of configItems) {
      const decision = simpleDeciderByConfig<
        TokenFromNodeConfig<typeof configItem>
      >(configItem)(lexer.peek)
      if (isError(decision)) {
        return decision
      }
      if (decision) {
        return this.parseSubRule<T>(then, lexer)
      }
    }
    return this.parseSubRule<E>(elce, lexer)
  }

  // private parseMatcherGroup() {
  //   return this.parseRule({
  //     open: "[",
  //     matchers: this.parseLiteralOrCommaSeparatedMatcherSubgroupConfig,
  //     close: "]",
  //   })
  // }

  // private get parseLiteralOrCommaSeparatedMatcherSubgroupConfig(): DecisionRuleConfig {
  //   return {
  //     if: (peek: Lexer["peek"]) => {
  //       const overNextToken = peek(1)
  //       return isError(overNextToken) ? overNextToken : isCommaToken(overNextToken)
  //     },
  //     then: this.parseCommaSeparatedMatcherSubgroup,
  //     else: "matcherLiteral",
  //   }
  // }

  // private parseCommaSeparatedMatcherSubgroup() {
  //   return this.parseRule({
  //     left: "matcherLiteral",
  //     separator: ",",
  //     right: this.parseLiteralOrCommaSeparatedMatcherSubgroupConfig,
  //   })
  // }

  // private parseError(message: string) {
  //   return () => {
  //     const nextToken = lexer.peek()
  //     return isError(nextToken) ? nextToken : new ParseError(nextToken, message)
  //   }
  // }

  // private parseQuantifierLiteral() {
  //   return this.parseRule({
  //     open: "{",
  //     number: "numberLiteral",
  //     close: "}",
  //   })
  // }

  // Leaf Node Parsers
  
  private parseLeafNode<T extends Token>(
    nodeConfigItem: NodeConfigItem<T>,
    lexer: Lexer
  ) {
    const nextToken = lexer.consume()
    if (isError(nextToken)) { return nextToken }
    if (!nodeConfigItem.decider(nextToken)) {
      return new ParseError(nextToken, nodeConfigItem.stringRep)
    }
    return new LeafNode(nextToken)
  }
}