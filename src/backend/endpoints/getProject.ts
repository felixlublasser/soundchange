import { isSuccess } from '@/lib/result'
import serializeProject from '@/backend/endpoints/serializers/project'
import State from '@/backend/state'
import { GetProject } from '@/interface/endpoints'

const getProject: GetProject = async ({ id }) => {
  const openProject = State.getOpenProject(id)
  return isSuccess(openProject) ? serializeProject(openProject) : openProject
}

export default getProject
