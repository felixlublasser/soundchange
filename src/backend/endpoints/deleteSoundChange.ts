import { isError } from '@/lib/result'
import State from '@/backend/state'
import { DeleteSoundChange } from '@/interface/endpoints'

const deleteSoundChange: DeleteSoundChange = async ({ projectId, id }) => {
  const openProject = State.getOpenProject(projectId)
  if (isError(openProject)) { return openProject }

  const record = openProject.store.soundChanges.find(id)
  if (isError(record)) { return record }
  
  const deleteResult = record.delete()
  if (isError(deleteResult)) { return deleteResult }

  return deleteResult
}

export default deleteSoundChange
