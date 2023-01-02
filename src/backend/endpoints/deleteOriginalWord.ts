import { isError } from '@/lib/result'
import State from '@/backend/state'
import { DeleteOriginalWord } from '@/interface/endpoints'

const deleteOriginalWord: DeleteOriginalWord = async ({ projectId, id }) => {
  const openProject = State.getOpenProject(projectId)
  if (isError(openProject)) { return openProject }

  const record = openProject.store.originalWords.find(id)
  if (isError(record)) { return record }
  
  const deleteResult = record.delete()
  if (isError(deleteResult)) { return deleteResult }

  return deleteResult
}

export default deleteOriginalWord
