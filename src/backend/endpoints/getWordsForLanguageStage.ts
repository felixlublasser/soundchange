import { isError } from '@/lib/result'
import serializeWordsForLanguageStage from '@/backend/endpoints/serializers/wordsForLanguageStage'
import State from '@/backend/state'
import { GetWordsForLanguageStage } from '@/interface/endpoints'

const getWordsForLanguageStage: GetWordsForLanguageStage = async ({ projectId, id }) => {
  const openProject = State.getOpenProject(projectId)
  if (isError(openProject)) { return openProject }

  const store = openProject.store
  const languageStage = store.languageStages.find(id)
  if (isError(languageStage)) { return languageStage }

  return serializeWordsForLanguageStage(languageStage, store)
}

export default getWordsForLanguageStage
