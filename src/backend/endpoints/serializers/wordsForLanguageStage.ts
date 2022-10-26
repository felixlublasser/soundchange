import SCRecord from "@/backend/records/SCRecord";
import Store from "@/backend/records/Store";
import { ILanguageStageRecord } from "@/backend/records/tables";
import WordStageInterface from "@/interface/interfaces/WordStage";
import { isError, Result } from "@/lib/result";
import { applySoundChange } from '@/backend/lib/helpers'
import RecordTable from "@/backend/records/RecordTable";

export default function serializeWordsForLanguageStage (
  languageStage: SCRecord<ILanguageStageRecord>,
  store: Store
): Result<WordStageInterface[]> {
  let languageStageChain: SCRecord<ILanguageStageRecord>[] = []
  let currentLanguageStage: SCRecord<ILanguageStageRecord> | null = languageStage

  while (currentLanguageStage) {
    languageStageChain = languageStageChain.concat(currentLanguageStage)
    const parentLanguageStageId = currentLanguageStage.record.parentLanguageStageId
    if (parentLanguageStageId) {
      const dbResult = store.languageStages.find(parentLanguageStageId)
      if (isError(dbResult)) { return dbResult }
      currentLanguageStage = dbResult
    } else {
      currentLanguageStage = null
    }
  }

  return languageStageChain.reverse().reduce((wordList: WordStageInterface[], ls) => {
    const soundChanges = store.soundChanges.where(({ record }) =>
      record.languageStageId === ls.id
    )
    // TODO: sort sound changes by index?
    wordList.forEach(word => {
      soundChanges.forEach(soundChange => {
        const newRoman = applySoundChange({ soundChange, roman: word.roman })
        word.roman = newRoman
      })
      word.shortHistory = word.shortHistory.concat(
        { roman: word.roman, languageStageName: ls.record.name }
      )
    })

    const originalWords = store.originalWords.where(({ record }) =>
      record.languageStageId === ls.id
    )
    return wordList.concat(originalWords.map(({ record }) => ({
      originalWordId: record.id,
      inherited: ls.id !== languageStage.id,
      roman: record.roman,
      shortHistory: [{
        roman: record.roman,
        languageStageName: ls.record.name
      }]
    })))
  }, [])
}
