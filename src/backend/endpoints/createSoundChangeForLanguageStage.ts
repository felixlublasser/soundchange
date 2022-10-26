import { isError } from '@/lib/result'
import serializeSoundChange from '@/backend/endpoints/serializers/soundChange'
import State from '@/backend/state'
import { CreateSoundChangeForLanguageStage } from '@/interface/endpoints'

const createSoundChangeForLanguageStage: CreateSoundChangeForLanguageStage = async ({ projectId, id, soundChange }) => {
  const openProject = State.getOpenProject(projectId)
  if (isError(openProject)) { return openProject }

  const store = openProject.store

  const record = store.soundChanges.create({
    languageStageId: id,
    name: null,
    ...soundChange
  })
  if (isError(record)) { return record }

  return serializeSoundChange(record)
}

export default createSoundChangeForLanguageStage
