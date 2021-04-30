import Json from '@/lib/json';
import SCRecord from '@/records/screcord'
import LanguageStageRecord from '@/records/languageStage'

export default class ProjectRecord extends SCRecord {
  version!: string;
  protoLanguage!: Json;

  constructor(args: { version: string, protoLanguage: LanguageStageRecord }) {
    super()
    Object.assign(this, args)
  }

  static get schema(): string {
    return require("@/schemas/project.json")
  }
}
