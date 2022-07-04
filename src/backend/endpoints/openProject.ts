import ProjectInterface from '@/interface/interfaces/Project'
import Project from '@/backend/records/Project'
import { isError, Result } from '@/lib/result'
import serializeProject from '@/backend/endpoints/serializers/project'
import Store from '@/backend/records/Store'
import JsonFile from '@/backend/lib/file/jsonFile'
import StoreSchema from '../schemas/store'
import State from '@/backend/state'

export default async function getProject(
  { filePath }: { filePath: string }
): Promise<Result<ProjectInterface>> {
  const file = await new JsonFile<typeof Store, typeof StoreSchema>(filePath, Store).load()
  if (isError(file)) { return file }
  const store = file.parsedObject
  const project = new Project({ store, filePath })
  State.addOpenProject(project)
  return serializeProject(project)
}
