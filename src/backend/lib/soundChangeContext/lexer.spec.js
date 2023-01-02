/* global $string */

import InputReader from "./inputReader";
import Lexer from "./lexer";

describe('Lexer', () => {
  subject(() => new Lexer(new InputReader($string)))

  def('string', () => 'abc  [a,[ ba]c+3,\t')

  it('emits the right tokens', () => {
    expect($subject.peek()).toEqual({ type: "MatcherLiteral", prefix: "", content: "abc" })
    expect($subject.peek()).toEqual({ type: "MatcherLiteral", prefix: "", content: "abc" })
    expect($subject.peek(1)).toEqual({ type: "SyntaxToken", prefix: "  ", content: "[" })
    expect($subject.consume()).toEqual({ type: "MatcherLiteral", prefix: "", content: "abc" })
    expect($subject.consume()).toEqual({ type: "SyntaxToken", prefix: "  ", content: "[" })
    expect($subject.consume()).toEqual({ type: "MatcherLiteral", prefix: "", content: "a" })
    expect($subject.consume()).toEqual({ type: "SyntaxToken", prefix: "", content: "," })
    expect($subject.consume()).toEqual({ type: "SyntaxToken", prefix: "", content: "[" })
    expect($subject.consume()).toEqual({ type: "MatcherLiteral", prefix: " ", content: "ba" })
    expect($subject.consume()).toEqual({ type: "SyntaxToken", prefix: "", content: "]" })
    expect($subject.consume()).toEqual({ type: "MatcherLiteral", prefix: "", content: "c+3" })
    expect($subject.consume()).toEqual({ type: "SyntaxToken", prefix: "", content: "," })
    expect($subject.consume()).toEqual({ type: "EOF", prefix: "\t", content: "" })
  })
})
