import { isError } from '@/lib/result'
import serializeOriginalWord from '@/backend/endpoints/serializers/originalWord'
import State from '@/backend/state'
import { UpdateOriginalWord } from '@/interface/endpoints'

const updateOriginalWord: UpdateOriginalWord = async ({ projectId, id, params }) => {
  const openProject = State.getOpenProject(projectId)
  if (isError(openProject)) { return openProject }

  const store = openProject.store

  const record = store.originalWords.find(id)
  if (isError(record)) { return record }
  
  const updateResult = record.update(params)
  if (isError(updateResult)) { return updateResult }
  
  return serializeOriginalWord(updateResult, store)
}

export default updateOriginalWord
