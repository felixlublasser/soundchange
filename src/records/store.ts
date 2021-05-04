import { Result } from '@/lib/result'
import LanguageStageRecord from '@/records/LanguageStage'
import Ajv, { JSONSchemaType } from 'ajv'
import RecordSet from '@/records/RecordSet'
import LanguageStage from '@/models/LanguageStage'
import Project from '@/models/Project'

export default class Store {
  version!: string
  protoLanguageId!: string
  _languageStages!: LanguageStageRecord[]

  get languageStages(): RecordSet<LanguageStageRecord> {
    return new RecordSet<LanguageStageRecord>(this._languageStages)
  }

  static get schema(): unknown {
    return require("@/schemas/store.json")
  }

  static fromJSON(json: unknown): Result<Store> {
    const ajv = new Ajv()
    console.log(this.schema)
    const validate = ajv.compile<Store>(this.schema as JSONSchemaType<unknown, false>)
    if (validate(json)) {
      return json as Store
    } else {
      return new Error(JSON.stringify(validate.errors))
    }
  }

  static fromProject(project: Project): Store {
    const store = new Store()
    store.version = project.version
    store.protoLanguageId = project.protoLanguage.id
    store._languageStages = project.allLanguageStages.map((ls: LanguageStage) => ls.toRecord)
    return store
  }
}
