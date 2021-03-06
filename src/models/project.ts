import Store from '@/records/Store'
import { Result, resultify, throwUnless } from '@/lib/result'
import LanguageStage from '@/models/LanguageStage'
import OriginalWord from '@/models/OriginalWord'
import SoundChange from '@/models/SoundChange'

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

  get allOriginalWords(): OriginalWord[] {
    return this.allLanguageStages.flatMap(ls => ls.originalWords)
  }

  get allSoundChanges(): SoundChange[] {
    return this.allLanguageStages.flatMap(ls => ls.soundChanges)
  }
}
