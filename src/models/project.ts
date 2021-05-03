import LanguageStage from '@/models/languageStage'
import Store from '@/records/store'
import { Result, resultify, throwUnless } from '@/lib/result'

export default class Project {
  version = '0_0_1'
  filePath: string | null = null
  protoLanguage: LanguageStage = new LanguageStage();
  
  static fromStore(store: Store, filePath: string): Result<Project> {
    return resultify(() => {
      const newP = new Project()
      newP.version = store.version
      newP.protoLanguage = throwUnless(LanguageStage.fromStore(store, store.protoLanguageId))
      newP.filePath = filePath
      return newP
    })
  }

  // toRecord(): ProjectRecord {
  //   return new ProjectRecord({ version: this.version, protoLanguage: this.protoLanguage.toRecord() })
  // }
}
