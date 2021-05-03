import { Result } from '@/lib/result'
import LanguageStageRecord from './languageStage'
import Ajv, { JSONSchemaType } from 'ajv'
import RecordSet from '@/records/recordSet'

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
}
