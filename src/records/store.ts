import { Result } from '@/lib/result'
import LanguageStageRecord from '@/records/LanguageStage'
import Ajv, { JSONSchemaType } from 'ajv'
import RecordSet from '@/records/RecordSet'
import LanguageStage from '@/models/LanguageStage'
import Project from '@/models/Project'

interface IStore {
  version: string
  _languageStages: LanguageStageRecord[]
  protoLanguageId: string
}

export default class Store {
  version!: string
  _languageStages!: LanguageStageRecord[]
  protoLanguageId!: string

  constructor(json: IStore) {
    Object.assign(this, json)
  }

  get llanguageStages(): RecordSet<LanguageStageRecord> {
    console.log('here even?')
    return new RecordSet(this._languageStages)
  }

  static get schema(): unknown {
    return require("@/schemas/store.json")
  }

  static fromJSON(json: unknown): Result<Store> {
    const ajv = new Ajv()
    console.log(this.schema)
    const validate = ajv.compile<Store>(this.schema as JSONSchemaType<unknown, false>)
    if (validate(json)) {
      return new Store(json as IStore)
    } else {
      return new Error(JSON.stringify(validate.errors))
    }
  }

  static fromProject(project: Project): Store {
    const store = new Store({
      version: project.version,
      protoLanguageId: project.protoLanguage.id,
      _languageStages: project.allLanguageStages.map((ls: LanguageStage) => ls.toRecord)
    })
    return store
  }
}
