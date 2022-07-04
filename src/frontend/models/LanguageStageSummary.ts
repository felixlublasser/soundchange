import LanguageStageSummaryInterface from '@/interface/interfaces/LanguageStageSummary'

export default class LanguageStageSummary {
  private data: LanguageStageSummaryInterface

  constructor(data: LanguageStageSummaryInterface) {
    this.data = data
  }

  get id(): string {
    return this.data.id
  }

  get name(): string | null {
    return this.data.name
  }
}
