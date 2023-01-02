import { isError, Result } from "@/lib/result"
import { Lexer } from "../parser"
import InputReader from "./inputReader"

export type Token =
  | EOF
  | Literal
  | SyntaxToken

export type EOF = { type: "EOF", prefix: string, content: "" }
export type Literal = { type: "Literal", prefix: string, content: string }
export type SyntaxToken = { type: "SyntaxToken", prefix: string, content: string }

export const isEOF = (token: Token): token is EOF => {
  return token.type === "EOF"
}
export const isLiteral = (token: Token): token is Literal => {
  return token.type === "Literal"
}
export const isSyntaxToken = (token: Token): token is SyntaxToken => {
  return token.type === "SyntaxToken"
}


export default class SoundChangeContextLexer implements Lexer<Token> {
  private inputReader: InputReader
  private cursor = 0
  private tokenStream: Result<Token>[] = []

  constructor(inputReader: InputReader) {
    this.inputReader = inputReader
  }

  peek(k = 0): Result<Token> {
    if (k < 0) {
      return new Error('Lexer cannot peek back.')
    }
    if (this.tokenStream.length <= this.cursor + k) {
      for(let i = this.tokenStream.length - 1; i <= this.cursor + k; i++) {
        this.lexNextToken()
      }
    }
    return this.tokenStream[this.cursor + k]
  }

  consume(k = 0): Result<Token> {
    const res = this.peek(k)
    console.log('consumed token', res)
    if (isError(res)) {
      return res
    }
    this.cursor += k + 1
    return res
  }

  private lexNextToken(): void {
    let prefix = ""
    // eslint-disable-next-line no-constant-condition
    while(true) {
      const currentChar = this.inputReader.peek()

      if (isError(currentChar)) {
        this.tokenStream.push(currentChar)
        return
      }

      if (currentChar === undefined) {
        this.tokenStream.push({ type: "EOF", prefix, content: "" })
        return 
      }

      if (/\s/.test(currentChar)) {
        prefix += this.inputReader.consume()
        continue
      }

      if (/[\][,+*?}{]/.test(currentChar)) {
        this.tokenStream.push({
          type: "SyntaxToken",
          prefix,
          content: currentChar
        })
        this.inputReader.consume()
        return
      }

      this.tokenStream.push({
        type: "Literal",
        prefix,
        content: this.lexMatcherLiteral(currentChar)
      })
      return
    }
  }

  private lexMatcherLiteral(currentChar: string): string {
    let tokenContent = currentChar
    this.inputReader.consume()
    let nextChar: Result<string | undefined>
    // eslint-disable-next-line no-constant-condition
    while(true) {
      nextChar = this.inputReader.peek()

      if (
        isError(nextChar)
        || nextChar === undefined
        || /\s/.test(nextChar)
        || /[\][,+*?}{]/.test(nextChar)
      ) {
        break
      }

      tokenContent += nextChar
      this.inputReader.consume()
      continue
    }
    return tokenContent
  }
}
