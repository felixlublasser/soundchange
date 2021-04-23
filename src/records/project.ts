import SCRecord from '@/records/screcord'

export default class ProjectRecord extends SCRecord {
  version = '';
  filePath = '';

  static get schemaFile(): string {
    return "@/schemas/project.json"
  }
}
