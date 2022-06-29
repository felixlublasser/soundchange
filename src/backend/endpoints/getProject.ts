import Project from '@/interface/interfaces/Project'
import { isError, Result } from '@/lib/result'
import serializeProject from '@/backend/endpoints/serializers/project'
import Store from '../records/Store'
import JsonFile from '../lib/file/jsonFile'

export default async function getProject(
  { filePath }: { filePath: string }
): Promise<Result<Project>> {
  const file = await new JsonFile<typeof Store>(filePath, Store).load()
  if (isError(file)) { return file }
  const store = file.parsedObject
  return serializeProject(store, filePath)
}
