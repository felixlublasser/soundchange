// import Store from '@/backend/records/Store'
// import { Result, resultify, succeedOrThrow } from '@/lib/result'
import LanguageStage from '@/frontend/models/LanguageStage'
// import OriginalWord from '@/frontend/models/OriginalWord'
// import SoundChange from '@/frontend/models/SoundChange'
import ProjectInterface from '@/interface/interfaces/Project'

export default class Project {
  data: ProjectInterface

  constructor(data: ProjectInterface) {
    this.data = data
  }

  get version(): string {
    return this.data.version
  }

  get filePath(): string | null {
    return this.data.filePath
  }

  get protoLanguage(): LanguageStage {
    return new LanguageStage(this.data.protoLanguage)
  }

  // get allLanguageStages(): LanguageStage[] {
  //   return this.protoLanguage.allDescendants
  // }

  // get allOriginalWords(): OriginalWord[] {
  //   return this.allLanguageStages.flatMap(ls => ls.originalWords)
  // }

  // get allSoundChanges(): SoundChange[] {
  //   return this.allLanguageStages.flatMap(ls => ls.soundChanges)
  // }
}
