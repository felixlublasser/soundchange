import { Result } from '@/lib/result'
import JsonFile from '@/backend/lib/file/jsonFile'
import { app } from 'electron'
import FileName from '@/interface/interfaces/FileName'
import { isError, collectify } from '@/lib/result'
import serializeFileName from '@/backend/endpoints/serializers/fileName'

class ProjectFileNames {
  fileNames: string[]

  constructor(fileNames: string[]) {
    this.fileNames = fileNames
  }

  static get schema(): unknown {
    return require("@/schemas/store.json")
  }
}

export default async function newProject(): Promise<Result<FileName[]>> {
  const filePath = `${app.getPath('userData')}/recentProjects`
  const file = (await new JsonFile<typeof ProjectFileNames>(filePath, ProjectFileNames)
    .load({ ignoreNotFound: true }))
  if (isError(file)) { return file }
  return collectify(file.parsedObject.fileNames.map(serializeFileName))
}
