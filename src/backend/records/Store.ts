import {
  ILanguageStageRecord,
  IOriginalWordRecord,
  ISoundChangeRecord,
  LanguageStageRecordDefaults
} from '@/backend/records/tables'
import RecordTable from '@/backend/records/RecordTable'
import RecordInterface from './types'
import StoreSchema from '@/backend/schemas/store'
import Ajv, { JTDDataType } from 'ajv/dist/jtd'
import { isSuccess } from '@/lib/result'
import { Result } from '@/lib/Result'

interface IStore {
  version: string
  languageStages: RecordInterface<ILanguageStageRecord>[]
  originalWords: RecordInterface<IOriginalWordRecord>[]
  soundChanges: RecordInterface<ISoundChangeRecord>[]
  protoLanguageId: string | null
}

export default class Store {
  private data: IStore
  private _languageStages: RecordTable<ILanguageStageRecord> | null = null
  private _originalWords: RecordTable<IOriginalWordRecord> | null = null
  private _soundChanges: RecordTable<ISoundChangeRecord> | null = null

  constructor(data?: JTDDataType<typeof StoreSchema>) {
    if (data) {
      this.data = data
      return
    }
    this.data = {
      version: '0.0.1',
      protoLanguageId: null,
      languageStages: [],
      originalWords: [],
      soundChanges: [],
    }
    const protoLang = this.languageStages.create(LanguageStageRecordDefaults)
    if (isSuccess(protoLang)) {
      this.data.protoLanguageId = protoLang.id
    }
  }

  get languageStages(): RecordTable<ILanguageStageRecord> {
    if (!this._languageStages) {
      this._languageStages = new RecordTable<ILanguageStageRecord>(this.data.languageStages)
    }
    return this._languageStages
  }

  get originalWords(): RecordTable<IOriginalWordRecord> {
    if (!this._originalWords) {
      this._originalWords = new RecordTable<IOriginalWordRecord>(this.data.originalWords)
    }
    return this._originalWords
  }

  get soundChanges(): RecordTable<ISoundChangeRecord> {
    if (!this._soundChanges) {
      this._soundChanges = new RecordTable<ISoundChangeRecord>(this.data.soundChanges)
    }
    return this._soundChanges
  }

  get version(): string {
    return this.data.version
  }

  get protoLanguageId(): string | null {
    return this.data.protoLanguageId
  }

  static get schema(): typeof StoreSchema {
    return StoreSchema
  }

  get toJSON(): Result<JTDDataType<typeof StoreSchema>> {
    const ajv = new Ajv
    const validate = ajv.compile<JTDDataType<typeof StoreSchema>>(
      Store.schema
    )
    const json = {
      version: this.version,
      protoLanguageId: this.protoLanguageId,
      languageStages: this.languageStages.all.map(r => r.record),
      originalWords: this.originalWords.all.map(r => r.record),
      soundChanges: this.soundChanges.all.map(r => r.record),
    }
    return validate(json)
      ? json
      : new Error(`Could not serialize. Store failed validation: ${JSON.stringify(validate.errors)}`)
  }
}
