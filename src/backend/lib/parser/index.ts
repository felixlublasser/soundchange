import { errorOrExec, isError, Result } from "@/lib/result";

interface IToken {
  type: string,
  prefix: string,
  content: string,
}

export interface Lexer<TT extends IToken> {
  peek(k?: number): Result<TT>,
  consume(k?: number): Result<TT>,
}

interface InputReader {
  peek(k?: number): Result<string | undefined>,
  consume(k?: number): Result<string | undefined>,
}

class LeafNode<TT extends IToken, T extends TT> {
  token: T

  constructor(token: T) {
    this.token = token
  }
}

type TokenFromNodeConfig<
  NCI,
  TT extends IToken
> = NCI extends NodeConfig<TT, infer T> ? T : never

// higher level nodes

class HighLevelNode<T extends NodeElements> {
  elements: T

  constructor(elements: T) {
    this.elements = elements
  }
}

type Node = LeafNode<any, any> | HighLevelNode<any>

type NodeElements = Record<
  string,
  Node | null
>

type SubruleConfig<RC extends RulesConfig<TT>, NC extends NodesConfig, TT extends IToken> =
  | ParseFunc
  | DecisionRuleConfig<RC, NC, TT>
  | TryElseRuleConfig<RC, NC, TT>
  | keyof RC
  | keyof NC
  | null
type ParseFunc = () => Result<Node | null>
type DecisionRuleConfig<
  RC extends RulesConfig<TT>,
  NC extends NodesConfig,
  TT extends IToken
> = {
  if: DeciderFunction<TT> | keyof NC | (keyof NC)[],
  then: SubruleConfig<RC, NC, TT>
  else: SubruleConfig<RC, NC, TT>
}
type DeciderFunction<TT extends IToken> = ((peek: Lexer<TT>["peek"]) => Result<boolean>)
type TryElseRuleConfig<
  RC extends RulesConfig<TT>,
  NC extends NodesConfig,
  TT extends IToken
> = {
  try: keyof NC | readonly (keyof NC)[]
  else: SubruleConfig<RC, NC, TT>
}

type RulesConfig<TT extends IToken> = Record<string, RuleConfig<any, any, TT>>

type RuleConfig<
  RC extends RulesConfig<TT>,
  NC extends NodesConfig,
  TT extends IToken,
> = Record<string, SubruleConfig<RC, NC, TT>>

type NodesConfig = Record<string, NodeConfig<any, any>>
type NodeConfig<TT extends IToken, T extends TT> = {
  stringRep: string,
  decider: (token: TT) => token is T
}
type RootConfig<
  RC extends RulesConfig<TT>,
  NC extends NodesConfig,
  TT extends IToken
> = {
  root: SubruleConfig<RC, NC, TT>
}

function isDecisionRuleConfig<
  RC extends RulesConfig<TT>,
  NC extends NodesConfig,
  TT extends IToken
>(
  subconfig: SubruleConfig<RC, NC, TT>
): subconfig is DecisionRuleConfig<RC, NC, TT> {
  return typeof subconfig === "object"
    && Object.prototype.hasOwnProperty.call(subconfig, "decider")
}

function isDeciderFunction<
  RC extends RulesConfig<TT>,
  NC extends NodesConfig,
  TT extends IToken
>(
  decider: DecisionRuleConfig<RC, NC, TT>["if"]
): decider is DeciderFunction<TT> {
  return typeof decider === "function"
}

function isTryElseRuleConfig<
  RC extends RulesConfig<TT>,
  NC extends NodesConfig,
  TT extends IToken
>(
  subconfig: SubruleConfig<RC, NC, TT>
): subconfig is TryElseRuleConfig<RC, NC, TT> {
  return typeof subconfig === "object"
    && subconfig !== null
    && Object.prototype.hasOwnProperty.call(subconfig, "try")
}

function isParseFunc<
  RC extends RulesConfig<TT>,
  NC extends NodesConfig,
  TT extends IToken,
>(
  subconfig: SubruleConfig<RC, NC, TT>
): subconfig is ParseFunc {
  return typeof subconfig === "function"
}

type TypeDepthLimiter = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

type PureReturnType<T extends (...args: any) => any> = Exclude<ReturnType<T>, Error>
type ConfigRuleReturnType<
  GlobalRC extends RulesConfig<TT>,
  NC extends NodesConfig,
  TT extends IToken,
  RC extends RuleConfig<GlobalRC, NC, TT>,
  D extends TypeDepthLimiter[number] = 2
> = GlobalRC extends any ? {
  [Property in keyof RC]:
    SubruleConfigReturnType<GlobalRC, NC, TT, RC[Property], D>
} : never

type ReturnTypeFromRuleKey<
  RC extends RulesConfig<TT>,
  NC extends NodesConfig,
  TT extends IToken,
  RK extends keyof RC,
  D extends TypeDepthLimiter[number]
> = RC extends any ? ConfigRuleReturnType<RC, NC, TT, RC[RK], D> : never

type SubruleConfigReturnType<
  RC extends RulesConfig<TT>,
  NC extends NodesConfig,
  TT extends IToken,
  SRC extends SubruleConfig<RC, NC, TT>,
  D extends TypeDepthLimiter[number] = 2
> =
[D] extends [never]
    ? null
    : (SRC extends DecisionRuleConfig<RC, NC, TT>
      ? SubruleConfigReturnType<RC, NC, TT, SRC["then"] | SRC["else"], TypeDepthLimiter[D]>
      : SRC extends ParseFunc ? PureReturnType<SRC> : (
        SRC extends keyof NC
          ? LeafNode<TT, TokenFromNodeConfig<NC[SRC], TT>>
          : SRC extends keyof RC
            ? HighLevelNode<ReturnTypeFromRuleKey<RC, NC, TT, SRC, TypeDepthLimiter[D]>>
            : SRC extends null
              ? null
              : never
      )
    )

class ParseError extends Error {
  constructor(token: IToken, expected: string) {
    super(`Unexpected token <${token.content}>: expected ${expected}.`)
  }
}

export function simpleDecider<T extends TT, TT extends IToken>(
  typeGuard: (t: TT) => t is T
) {
  return (peek: Lexer<TT>["peek"]): Result<ReturnType<typeof typeGuard>> => {
    const nextToken = peek()
    return isError(nextToken) ? nextToken : typeGuard(nextToken)
  }
}

function simpleDeciderByConfig< T extends TT, TT extends IToken>(
  nodeConfigItem: NodeConfig<TT, T>
) {
  return (peek: Lexer<TT>["peek"]) => {
    return errorOrExec(peek(), nodeConfigItem.decider)
  }
}

export default class Parser<
  TT extends IToken,
  RootC extends RootConfig<RuleC, NodeC, TT>,
  RuleC extends RulesConfig<TT>,
  NodeC extends NodesConfig,
  L extends Lexer<TT>,
  LF extends { new (...args: any[]): L },
  IR extends InputReader,
  IRF extends { new (...args: any[]): IR },
> {
  private rootConfig: RootC
  private lexerFactory: LF
  private inputReaderFactory: IRF
  private ruleConfig: RuleC
  private nodeConfig: NodeC

  constructor(
    lexerFactory: LF,
    inputReaderFactory: IRF,
    rootConfig: RootC,
    ruleConfig: RuleC,
    nodeConfig: NodeC,
  ) {
    this.lexerFactory = lexerFactory
    this.inputReaderFactory = inputReaderFactory
    this.rootConfig = rootConfig
    this.ruleConfig = ruleConfig
    this.nodeConfig = nodeConfig
  }


  parse(string: string):
    Result<HighLevelNode<ConfigRuleReturnType<RuleC, NodeC, TT, RootC>>>
  {
    const lexer = new this.lexerFactory(new this.inputReaderFactory(string))
    return this.parseRule(this.rootConfig, lexer)
  }

  private parseRule<RC extends RuleConfig<RuleC, NodeC, TT>>(
    ruleConfig: RC,
    lexer: Lexer<TT>,
  ): Result<
    HighLevelNode<ConfigRuleReturnType<RuleC, NodeC, TT, RC>>
  > {
    type NE = ConfigRuleReturnType<RuleC, NodeC, TT, RC>

    const result: Partial<NE> = {}
    for (const subruleKey in ruleConfig) {
      const subrule = ruleConfig[subruleKey]
      const res = this.parseSubRule(subrule, lexer)
      if (isError(res)) { return res }
      result[subruleKey] = res as NE[typeof subruleKey]
    }
    return new HighLevelNode<NE>(result as NE)
  }

  private parseSubRule<T extends SubruleConfig<RuleC, NodeC, TT>>(
    subrule: T,
    lexer: Lexer<TT>
  ): Result<SubruleConfigReturnType<RuleC, NodeC, TT, T>> {
    if(isDecisionRuleConfig(subrule)) {
      return this.parseDecisionRuleConfig(
        subrule,
        lexer
      ) as Result<SubruleConfigReturnType<RuleC, NodeC, TT, T>>

    } else if (isParseFunc(subrule)) {
      return subrule() as Result<SubruleConfigReturnType<RuleC, NodeC, TT, T>>

    } else if (isTryElseRuleConfig(subrule)) {
      return this.parseTryElseRuleConfig(subrule, lexer)

    } else if (this.isNodeKey(subrule)) {
      const nodeConfigItem = this.nodeConfig[subrule as keyof NodeC]
      return this.parseLeafNode<TokenFromNodeConfig<typeof nodeConfigItem, TT>>(
        nodeConfigItem,
        lexer
      ) as Result<SubruleConfigReturnType<RuleC, NodeC, TT, T>>

    } else if (this.isRuleKey(subrule)) {
      return this.parseRule(
        this.ruleConfig[subrule as keyof RuleC],
        lexer
      ) as Result<SubruleConfigReturnType<RuleC, NodeC, TT, T>>
    }
    // TODO: case "error"

    // case null
    lexer.consume()
    return null as Result<SubruleConfigReturnType<RuleC, NodeC, TT, T>>
  }

  private parseTryElseRuleConfig<T extends TryElseRuleConfig<RuleC, NodeC, TT>>(
    subrule: T,
    lexer: Lexer<TT>
  ) {
    const tries = (Array.isArray(subrule.try) ? subrule.try : [subrule.try]) as (keyof NodeC)[];
    const tryNodeConfigs = tries.map(trie => this.nodeConfig[trie])
    for (const tryNodeConfig of tryNodeConfigs) {
      const decider = simpleDeciderByConfig<
        TokenFromNodeConfig<typeof tryNodeConfig, TT>,
        TT
      >(tryNodeConfig)
      if (decider(lexer.peek)) {
        return this.parseLeafNode<TokenFromNodeConfig<typeof tryNodeConfig, TT>>(
          tryNodeConfig,
          lexer
        ) as Result<SubruleConfigReturnType<RuleC, NodeC, TT, T>>
      }
    }
    return this.parseSubRule(subrule.else, lexer) as Result<SubruleConfigReturnType<RuleC, NodeC, TT, T>>
  }

  private parseDecisionRuleConfig<T extends DecisionRuleConfig<RuleC, NodeC, TT>>(
    subrule: T,
    lexer: Lexer<TT>,
  ): Result<
    SubruleConfigReturnType<RuleC, NodeC, TT, T["then"]>
      | SubruleConfigReturnType<RuleC, NodeC, TT, T["else"]>
  > {
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

  private parseDeciderFunction<
    T extends SubruleConfig<RuleC, NodeC, TT>,
    E extends SubruleConfig<RuleC, NodeC, TT>
  >(
    iff: DeciderFunction<TT>,
    then: T,
    elce: E,
    lexer: Lexer<TT>,
  ): Result<
    SubruleConfigReturnType<RuleC, NodeC, TT, T>
    | SubruleConfigReturnType<RuleC, NodeC, TT, E>
  > {
    return errorOrExec(
      iff(lexer.peek),
      (decision) =>
        this.parseSubRule<T | E>(
          decision ? then : elce,
          lexer
        )
    )
  }

  private parseNodeKeyArray<
    T extends SubruleConfig<RuleC, NodeC, TT>,
    E extends SubruleConfig<RuleC, NodeC, TT>
  >(
    nodeKeys: (keyof NodeC)[],
    then: T,
    elce: E,
    lexer: Lexer<TT>,
  ): Result<
    SubruleConfigReturnType<RuleC, NodeC, TT, T>
    | SubruleConfigReturnType<RuleC, NodeC, TT, E>
  > {
    const configItems = nodeKeys.map(nodeKey => this.nodeConfig[nodeKey])
    for (const configItem of configItems) {
      const decision = simpleDeciderByConfig<
        TokenFromNodeConfig<typeof configItem, TT>,
        TT
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

  private parseLeafNode<T extends TT>(
    nodeConfigItem: NodeConfig<TT, T>,
    lexer: Lexer<TT>
  ) {
    const nextToken = lexer.consume()
    if (isError(nextToken)) { return nextToken }
    if (!nodeConfigItem.decider(nextToken)) {
      return new ParseError(nextToken, nodeConfigItem.stringRep)
    }
    return new LeafNode(nextToken)
  }

  private isNodeKey(
    subconfig: SubruleConfig<RuleC, NodeC, TT>)
  : subconfig is keyof NodeC {
    return typeof subconfig === "string"
      && Object.prototype.hasOwnProperty.call(this.nodeConfig, subconfig)
  }
  
  private isRuleKey(
    subconfig: SubruleConfig<RuleC, NodeC, TT>)
  : subconfig is keyof RuleC {
    return typeof subconfig === "string"
      && Object.prototype.hasOwnProperty.call(this.ruleConfig, subconfig)
  }
}