import { isError } from '@/lib/result'
import serializeSoundChange from '@/backend/endpoints/serializers/soundChange'
import State from '@/backend/state'
import { UpdateSoundChange } from '@/interface/endpoints'

const updateSoundChange: UpdateSoundChange = async ({ projectId, id, params }) => {
  const openProject = State.getOpenProject(projectId)
  if (isError(openProject)) { return openProject }

  const record = openProject.store.soundChanges.find(id)
  if (isError(record)) { return record }
  
  const updateResult = record.update(params)
  if (isError(updateResult)) { return updateResult }
  
  return serializeSoundChange(updateResult)
}

export default updateSoundChange
