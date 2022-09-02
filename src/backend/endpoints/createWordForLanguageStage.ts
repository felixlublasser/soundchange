import { isError } from '@/lib/result'
import serializeOriginalWord from '@/backend/endpoints/serializers/originalWord'
import State from '@/backend/state'
import { CreateWordForLanguageStage } from '@/interface/endpoints'

const createWordForLanguageStage: CreateWordForLanguageStage = async ({ projectId, id, word }) => {
  const openProject = State.getOpenProject(projectId)
  if (isError(openProject)) { return openProject }

  const store = openProject.store

  const record = store.originalWords.create({ languageStageId: id, roman: word.roman })
  if (isError(record)) { return record }

  return serializeOriginalWord(record, store)
}

export default createWordForLanguageStage
