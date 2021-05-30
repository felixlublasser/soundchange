import { Result } from '@/lib/result'
import LanguageStageRecord from '@/records/LanguageStage'
import OriginalWordRecord from '@/records/OriginalWord'
import SoundChangeRecord from '@/records/SoundChange'
import Ajv, { JSONSchemaType } from 'ajv'
import RecordSet from '@/records/RecordSet'
import LanguageStage from '@/models/LanguageStage'
import Project from '@/models/Project'

interface IStore {
  version: string
  _languageStages: LanguageStageRecord[]
  _originalWords: OriginalWordRecord[]
  _soundChanges: SoundChangeRecord[]
  protoLanguageId: string
}

export default class Store {
  version!: string
  _languageStages!: LanguageStageRecord[]
  _originalWords!: OriginalWordRecord[]
  _soundChanges!: SoundChangeRecord[]
  protoLanguageId!: string

  constructor(json: IStore) {
    Object.assign(this, json)
  }

  get languageStages(): RecordSet<LanguageStageRecord> {
    return new RecordSet(this._languageStages)
  }

  get originalWords(): RecordSet<OriginalWordRecord> {
    return new RecordSet(this._originalWords)
  }

  get soundChanges(): RecordSet<SoundChangeRecord> {
    return new RecordSet(this._soundChanges)
  }

  static get schema(): unknown {
    return require("@/schemas/store.json")
  }

  static fromJSON(json: unknown): Result<Store> {
    const ajv = new Ajv()
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
      _languageStages: project.allLanguageStages.map((ls: LanguageStage) => ls.toRecord),
      _originalWords: project.allOriginalWords.map(w => w.toRecord),
      _soundChanges: project.allSoundChanges.map(sc => sc.toRecord)
    })
    return store
  }
}
