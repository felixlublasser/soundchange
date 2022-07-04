import Project from '@/backend/records/Project'
import serializeProject from '@/backend/endpoints/serializers/project'
import { NewProject } from '@/interface/endpoints'
import State from '@/backend/state'

const newProject: NewProject = async () => {
  const project = new Project({})
  State.addOpenProject(project)
  return serializeProject(project)
}
export default newProject
