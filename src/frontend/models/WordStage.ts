import WordStageInterface from '@/interface/interfaces/WordStage'

export default class Word {
  private data: WordStageInterface

  constructor(data: WordStageInterface) {
    this.data = data
  }

  get roman(): string {
    return this.data.roman
  }
  
  get shortHistoryFormatted(): string {
    return this.data.shortHistory.map(stage => stage.roman).slice(1).join(' > ')
  }
}
