import ProjectRecord from '@/records/project'
import { Result, isError } from '@/lib/result'

export default class Project {
  version = '0_0_1'
  filePath: string | null = null
  
  static fromJSON(json: unknown, filePath: string): Result<Project> {
    const loadResult = ProjectRecord.fromJSON(json)
    if (isError(loadResult)) {
      return loadResult
    }
    return this.fromRecord(loadResult as ProjectRecord, filePath)
  }

  static fromRecord(record: ProjectRecord, filePath: string): Project {
    const newP = new Project()
    newP.version = record.version
    newP.filePath = filePath
    return newP
  }

  toRecord(): ProjectRecord {
    return new ProjectRecord({ version: this.version })
  }
}
