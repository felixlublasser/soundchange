import SCRecord from '@/records/screcord'

export default class ProjectRecord extends SCRecord {
  version = '';

  constructor(args: { version: string }) {
    super()
    Object.assign(this, args)
  }

  static get schema(): string {
    return require("@/schemas/project.json")
  }
}
