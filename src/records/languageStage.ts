import SCRecord from '@/records/screcord'

export default class LanguageStageRecord extends SCRecord {
  name!: string | null;

  constructor(args: { name: string | null }) {
    super()
    Object.assign(this, args)
  }

  static get schema(): string {
    return require("@/schemas/languageStage.json")
  }
}
