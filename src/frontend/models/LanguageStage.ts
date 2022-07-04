import LanguageStageInterface from '@/interface/interfaces/LanguageStage'
import LanguageStageUpdateInterface from '@/interface/interfaces/LanguageStageUpdate'
import LanguageStageSummary from './LanguageStageSummary'
import OriginalWord from './OriginalWord'

export default class LanguageStage {
  private data: LanguageStageInterface
  private _dataChanged: LanguageStageUpdateInterface = {}

  constructor(data: LanguageStageInterface) {
    this.data = data
  }

  get id(): string {
    return this.data.id
  }

  get name(): string | null {
    return this.data.name
  }

  set name(newName: string | null) {
    this._dataChanged.name = newName
  }

  get branches(): LanguageStageSummary[] {
    return this.data.branches.map(branch => new LanguageStageSummary(branch))
  }

  get originalWords(): OriginalWord[] {
    return this.data.originalWords.map(word => new OriginalWord(word))
  }

  get dataChanged(): LanguageStageUpdateInterface {
    return this._dataChanged
  }

  // get toRecord(): LanguageStageRecord {
  //   return new LanguageStageRecord({
  //     id: this.id,
  //     name: this.name,
  //     branchIds: this.branches.map(b => b.id),
  //     originalWordIds: this.originalWords.map(w => w.id),
  //     soundChangeIds: this.soundChanges.map(sc => sc.id),
  //   })
  // }

  // get allDescendants(): LanguageStage[] {
  //   return [this, ...this.branches.flatMap(branch => branch.allDescendants)]
  // }

  // get allWords(): Word[] {
  //   return [...this.originalWords, ...this.inheritedWords]
  // }

  // get inheritedWords(): InheritedWord[] {
  //   if (this.ancestor === null) {
  //     return []
  //   }
  //   return this.ancestor.allWords.map(word => {
  //     return this.soundChanges.reduce(function (w, sc): InheritedWord {
  //       return sc.mangle(w)
  //     }, word) as InheritedWord
  //   })
  // }

  // addBranch(): LanguageStage {
  //   const newBranch = new LanguageStage({ ancestor: this })
  //   this.branches.push(newBranch)
  //   return newBranch
  // }

  // addOriginalWord({ roman }: { roman: string }): void {
  //   this.originalWords.push(new OriginalWord({ roman, languageStage: this }))
  // }

  // addSoundChange(args: ISoundChange): void {
  //   this.soundChanges.push(new SoundChange(this, args))
  // }
}
