import { isError, Result } from '@/lib/result'
import serializeProject from '@/backend/endpoints/serializers/project'
import Store from '@/backend/records/Store'
import JsonFile from '@/backend/lib/file/jsonFile'
import StoreSchema from '../schemas/store'
import State from '@/backend/state'
import ProjectInterface from '@/interface/interfaces/Project'

export default async function saveProject(
  { id }: { id: string }
): Promise<Result<ProjectInterface>> {
  const project = State.getOpenProject(id)

  if (isError(project)) {
    return new Error(`Cannot find open project with id ${id}`)
  }
  if (project.filePath === null) {
    return new Error("Cannot save project without filepath")
  }

  const file = await new JsonFile<typeof Store, typeof StoreSchema>(
    project.filePath, Store
  ).load()
  if (isError(file)) { return file }

  const saveResult = await file.saveJSON(project.store)
  if (isError(saveResult)) {
    return saveResult
  }

  return serializeProject(project)
}
