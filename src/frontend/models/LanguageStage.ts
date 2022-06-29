import LanguageStageInterface from '@/interface/interfaces/LanguageStage'

export default class LanguageStage {
  data: LanguageStageInterface

  constructor(data: LanguageStageInterface) {
    this.data = data
  }

  // static fromStore(store: Store, id: string, ancestor: LanguageStage | null): Result<LanguageStage> {
  //   return resultify(() => {
  //     const record = succeedOrThrow(store.languageStages.find(id))
  //     const ls = new LanguageStage({
  //       id: record.id,
  //       name: record.name,
  //       ancestor: ancestor,
  //       branches: [],
  //       originalWords: [],
  //       soundChanges: [],
  //     })
  //     ls.branches = record.branchIds.map(branchId =>
  //       succeedOrThrow(LanguageStage.fromStore(store, branchId, ls))
  //     )
  //     ls.originalWords = record.originalWordIds.map(wordId =>
  //       succeedOrThrow(OriginalWord.fromStore(store, wordId, ls))
  //     )
  //     ls.soundChanges = record.soundChangeIds.map(soundChangeId =>
  //       succeedOrThrow(SoundChange.fromStore(store, soundChangeId, ls))
  //     )
  //     return ls
  //   })
  // }

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
