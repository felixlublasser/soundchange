/* global $string */

import SoundChangeContextParser from "./parser";

describe('SoundChangeContextParser', () => {
  subject(() => SoundChangeContextParser.parse($string))

  def('string', () => 'abc   [a,b] +7*[p]{\n90}\t')

  it('parses the right tree', () => {
    expect($subject.getParseTree()).toEqual({
      elements: {
        root: {
          elements: {
            left: {
    
            },
            right: {
    
            }
          }
        }
      }
    })
  })
})
