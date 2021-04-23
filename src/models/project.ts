import ProjectRecord from '@/records/project'
import { Result, isError } from '@/lib/result'

export default class Project {
  version = '0_0_1'
  filePath: string | null = null
  
  static fromJSON(json: unknown): Result<Project> {
    const loadResult = ProjectRecord.fromJSON(json)
    if (isError(loadResult)) {
      return loadResult
    }
    return this.fromRecord(loadResult as ProjectRecord)
  }

  static fromRecord(record: ProjectRecord): Project {
    const newP = new Project()
    newP.version = record.version
    newP.filePath = record.filePath
    return newP
  }
}
