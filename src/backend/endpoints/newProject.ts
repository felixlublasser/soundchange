import Project from '@/interface/interfaces/Project'
import { Result } from '@/lib/result'
import Store from '@/backend/records/Store'
import serializeProject from '@/backend/endpoints/serializers/project'

export default async function newProject(): Promise<Result<Project>> {
  const store = new Store()
  return serializeProject(store, null)
}
