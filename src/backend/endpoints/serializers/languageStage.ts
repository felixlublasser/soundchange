import LanguageStageInterface from '@/interface/interfaces/LanguageStage'
import { Result } from '@/lib/result'
import { ILanguageStageRecord } from '@/backend/records/tables'
import SCRecord from '@/backend/records/SCRecord'
import Store from '@/backend/records/Store'

export default function serializeLanguageStage({ languageStage, store }: {
  languageStage: SCRecord<ILanguageStageRecord>,
  store: Store
}): Result<LanguageStageInterface> {
  const branches = store.languageStages.where((record) =>
    record.record.parentLanguageStageId === languageStage.id
  )

  // const originalWords = store.originalWords.where((record) =>
  //   record.record.languageStageId === languageStage.id
  // )

  const soundChanges = store.soundChanges.where((record) =>
    record.record.languageStageId === languageStage.id
  )

  return {
    id: languageStage.id,
    name: languageStage.record.name,
    branches: branches.map(branch => ({
      id: branch.id,
      name: branch.record.name
    })),
    // originalWords: originalWords.map(ow => ({
    //   id: ow.id,
    //   roman: ow.record.roman
    // })),
    soundChangeIds: soundChanges.map(sc => sc.record.id),
  }
}