import LanguageStage from '@/models/LanguageStage'
import Store from '@/records/Store'
import { Result, resultify, throwUnless } from '@/lib/result'

export default class Project {
  version = '0_0_1'
  filePath: string | null = null
  protoLanguage: LanguageStage = new LanguageStage();
  
  static fromStore(store: Store, filePath: string): Result<Project> {
    return resultify(() => {
      const newP = new Project()
      newP.version = store.version
      newP.protoLanguage = throwUnless(
        LanguageStage.fromStore(store, store.protoLanguageId, null)
      )
      newP.filePath = filePath
      return newP
    })
  }

  get allLanguageStages(): LanguageStage[] {
    return this.protoLanguage.allDescendants
  }
}
