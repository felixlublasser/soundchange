import WordStageInterface from '@/interface/interfaces/WordStage'
import { IOriginalWordRecord } from '@/backend/records/tables'
import SCRecord from '@/backend/records/SCRecord'
import Store from '@/backend/records/Store'
import { isError, Result } from '@/lib/result'

export default function serializeOriginalWord(record: SCRecord<IOriginalWordRecord>, store: Store): Result<WordStageInterface> {
  const languageStage = store.languageStages.find(record.record.languageStageId)
  if(isError(languageStage)) { return languageStage }

  return {
    originalWordId: record.id,
    inherited: false,
    roman: record.record.roman,
    shortHistory: [{
      roman: record.record.roman,
      languageStageName: languageStage.record.name
    }]
  }
}