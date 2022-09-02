import { collectify, isError } from '@/lib/result'
import serializeSoundChange from '@/backend/endpoints/serializers/soundChange'
import State from '@/backend/state'
import { GetSoundChangesForLanguageStage } from '@/interface/endpoints'

const getSoundChangesForLanguageStage: GetSoundChangesForLanguageStage = async ({ projectId, id }) => {
  const openProject = State.getOpenProject(projectId)
  if (isError(openProject)) { return openProject }

  const store = openProject.store
  const languageStage = store.languageStages.find(id)
  if (isError(languageStage)) { return languageStage }

  const soundChanges = store.soundChanges.where(record => record.record.languageStageId === id)

  return collectify(
    soundChanges.map(soundChange => serializeSoundChange(soundChange))
  )
}

export default getSoundChangesForLanguageStage
