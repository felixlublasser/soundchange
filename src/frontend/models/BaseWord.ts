import IWord from '@/frontend/types/Word'

export default class BaseWord {
  word: IWord

  constructor(word: IWord) {
    this.word = word
  }

  get shortHistory(): string {
    return this.word.roman
  }
}
