import { isError } from '@/lib/result'
import serializeLanguageStage from '@/backend/endpoints/serializers/languageStage'
import State from '@/backend/state'
import { GetLanguageStage } from '@/interface/endpoints'

const getLanguageStage: GetLanguageStage = async ({ projectId, id }) => {
  const openProject = State.getOpenProject(projectId)
  if (isError(openProject)) { return openProject }

  const store = openProject.store
  const languageStage = store.languageStages.find(id)
  if (isError(languageStage)) { return languageStage }

  return serializeLanguageStage({ languageStage, store })
}

export default getLanguageStage
