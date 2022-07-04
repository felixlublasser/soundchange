import { isError } from '@/lib/result'
import serializeLanguageStage from '@/backend/endpoints/serializers/languageStage'
import State from '@/backend/state'
import { UpdateLanguageStage } from '@/interface/endpoints'

const updateLanguageStage: UpdateLanguageStage = async ({ projectId, id, params }) => {
  const openProject = State.getOpenProject(projectId)
  if (isError(openProject)) { return openProject }

  const store = openProject.store
  let languageStage = store.languageStages.find(id)
  if (isError(languageStage)) { return languageStage }

  languageStage = languageStage.update(params)
  if (isError(languageStage)) { return languageStage }

  return serializeLanguageStage({ languageStage, store })
}

export default updateLanguageStage
