import {
  ILanguageStageRecord,
  IOriginalWordRecord,
  ISoundChangeRecord,
  LanguageStageRecordDefaults
} from '@/backend/records/tables'
import RecordTable from '@/backend/records/RecordTable'
import RecordInterface from './types'

interface IStore {
  version: string
  languageStages: RecordInterface<ILanguageStageRecord>[]
  originalWords: RecordInterface<IOriginalWordRecord>[]
  soundChanges: RecordInterface<ISoundChangeRecord>[]
  protoLanguageId: string | null
}

export default class Store {
  private data: IStore

  constructor(data?: IStore) {
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
    this.languageStages.create(LanguageStageRecordDefaults)
  }

  get languageStages(): RecordTable<ILanguageStageRecord> {
    return new RecordTable<ILanguageStageRecord>(this.data.languageStages)
  }

  get originalWords(): RecordTable<IOriginalWordRecord> {
    return new RecordTable<IOriginalWordRecord>(this.data.originalWords)
  }

  get soundChanges(): RecordTable<ISoundChangeRecord> {
    return new RecordTable<ISoundChangeRecord>(this.data.soundChanges)
  }

  get version(): string {
    return this.data.version
  }

  get protoLanguageId(): string | null {
    return this.data.protoLanguageId
  }

  static get schema(): unknown {
    return require("@/schemas/store.json")
  }

  // static fromProject(project: Project): Store {
  //   const store = new Store({
  //     version: project.version,
  //     protoLanguageId: project.protoLanguage.id,
  //     _languageStages: project.allLanguageStages.map((ls: LanguageStage) => ls.toRecord),
  //     _originalWords: project.allOriginalWords.map(w => w.toRecord),
  //     _soundChanges: project.allSoundChanges.map(sc => sc.toRecord)
  //   })
  //   return store
  // }
}
