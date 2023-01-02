import WordStageInterface from '@/interface/interfaces/WordStage'

export default class WordStage {
  private data: WordStageInterface

  constructor(data: WordStageInterface) {
    this.data = data
  }

  get isInherited(): boolean {
    return this.data.inherited
  }

  get originalWordId(): string {
    return this.data.originalWordId
  }

  get roman(): string {
    return this.data.roman
  }
  
  get shortHistoryFormatted(): string {
    return this
      .data
      .shortHistory
      .map(stage => stage.roman)
      .reverse()
      .slice(1)
      .join(' < ')
  }
}
