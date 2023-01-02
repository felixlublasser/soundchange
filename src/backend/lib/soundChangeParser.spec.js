/* global $string */

import { graphemeClassSubParser } from "./soundChangeParser";

describe('graphemeClassSubParser', () => {
  subject(() => graphemeClassSubParser($string))

  ;([
    ["", "unexpected end of string"],
    ["x", "unexpected <x>, expected <[>"],
    [",", "unexpected <,>, expected <[>"],
    ["]", "unexpected <]>, expected <[>"],
    ["[", "unexpected end of string"],
    ["\\", "unexpected <\\>, expected <[>"],
    ["[a,", "unexpected end of string"],
    ["[a,\\]", "unexpected end of string"],
    ["[a,\\] ", "unexpected end of string"],
    ["[a,\\,", "unexpected end of string"],
    ["[a,\\,,", "unexpected end of string"],
    ["[]", "unexpected <]>, expected grapheme character"],
    ["[a,\\ ]", "unexpected <]>, expected grapheme character"],
    ["[a,\\,,]", "unexpected <]>, expected grapheme character"],
    ["[a,]", "unexpected <]>, expected grapheme character"],
    ["[,", "unexpected <,>, expected grapheme character"],
    ["[a,,", "unexpected <,>, expected grapheme character"],
  ]).forEach(([string, errorMessage]) => {
    context(`when parsing ${string}`, () => {
      def('string', () => string)

      it('returns an error with the correct message', () => {
        expect($subject instanceof Error).toBe(true)
        expect($subject.message).toBe(errorMessage)
      })
    })
  })

  ;([
    ["[a]", [['a'], '']],
    ["[ab]", [['ab'], '']],
    ["[ab,a]", [['ab', 'a'], '']],
    ["[ab,ab]", [['ab', 'ab'], '']],
    ["[[,a]", [['[', 'a'], '']],
    ["[\\],a]", [[']', 'a'], '']],
    ["[\\,,\\,]", [[',', ','], '']],
    ["[a]xy", [['a'], 'xy']],
    ["[ab]xy", [['ab'], 'xy']],
    ["[ab,a]xy", [['ab', 'a'], 'xy']],
    ["[ab,ab]xy", [['ab', 'ab'], 'xy']],
    ["[[,a]xy", [['[', 'a'], 'xy']],
    ["[\\],a]xy", [[']', 'a'], 'xy']],
    ["[\\,,\\,]xy", [[',', ','], 'xy']],
  ]).forEach(([string, [parsed, remainder]]) => {
    context(`when parsing ${string}`, () => {
      def('string', () => string)

      it('returns parsed grapheme set and remainder', () => {
        expect($subject instanceof Error).toBe(false)
        expect($subject).toEqual({ parsed, remainder })
      })
    })
  })
})
