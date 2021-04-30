import LanguageStageRecord from '@/records/languageStage'
import { Result, isError } from '@/lib/result'

export default class LanguageStage {
  name: string | null = null;

  static fromJSON(json: unknown): Result<LanguageStage> {
    const loadResult = LanguageStageRecord.fromJSON(json)
    if (isError(loadResult)) {
      return loadResult
    }
    return this.fromRecord(loadResult as LanguageStageRecord)
  }

  static fromRecord(record: LanguageStageRecord): LanguageStage {
    const newP = new LanguageStage()
    newP.name = record.name
    return newP
  }

  toRecord(): LanguageStageRecord {
    return new LanguageStageRecord({ name: this.name })
  }
}
