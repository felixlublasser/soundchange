import JsonFile from '@/backend/lib/file/jsonFile'
import { app } from 'electron'
import { isError, collectify } from '@/lib/result'
import serializeFileName from '@/backend/endpoints/serializers/fileName'
import RecentProjectsSchema from '@/backend/schemas/recentProjects'
import { JTDDataType } from 'ajv/dist/jtd'
import { GetRecentProjectFileNames } from '@/interface/endpoints'

class ProjectFileNames {
  fileNames: string[]

  constructor(data: JTDDataType<typeof RecentProjectsSchema>) {
    this.fileNames = data.recentProjects
  }

  static get schema() {
    return RecentProjectsSchema
  }
}

const getRecentProjectFileNames: GetRecentProjectFileNames = async () => {
  const filePath = `${app.getPath('userData')}/recentProjects`
  const jsonFile = new JsonFile<typeof ProjectFileNames, typeof RecentProjectsSchema>(
    filePath,
    ProjectFileNames
  )
  const file = await jsonFile.load({ ignoreNotFound: true })
  if (isError(file)) { return file }
  return collectify(file.parsedObject.fileNames.map(serializeFileName))
}

export default getRecentProjectFileNames