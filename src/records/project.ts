import SCRecord from '@/records/screcord'

export default class ProjectRecord extends SCRecord {
  version = '';
  filePath = '';

  static get schema(): string {
    return require("@/schemas/project.json")
  }
}
