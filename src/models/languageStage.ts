import LanguageStageRecord from '@/records/LanguageStage'
import Savable from '@/types/Savable'
import Store from '@/records/Store'
import OriginalWord from '@/models/OriginalWord'
import Word from '@/models/Word'
import SoundChange from '@/models/SoundChange'
import { Result, resultify, throwUnless } from '@/lib/result';
import ISoundChange from '@/types/ISoundChange'

interface ILanguageStage {
  id?: string;
  name?: string | null;
  ancestor?: LanguageStage | null;
  branches?: LanguageStage[];
  originalWords?: OriginalWord[];
  soundChanges?: SoundChange[];
}

export default class LanguageStage extends Savable {
  name: string | null;
  ancestor: LanguageStage | null;
  branches: LanguageStage[];
  originalWords: OriginalWord[];
  soundChanges: SoundChange[];

  constructor(args: ILanguageStage = {}) {
    super(args.id)
    this.name = args.name === undefined ? null : args.name
    this.ancestor = args.ancestor === undefined ? null : args.ancestor
    this.branches = args.branches === undefined ? [] : args.branches
    this.originalWords = args.originalWords === undefined ? [] : args.originalWords
    this.soundChanges = args.soundChanges === undefined ? [] : args.soundChanges
  }

  static fromStore(store: Store, id: string, ancestor: LanguageStage | null): Result<LanguageStage> {
    return resultify(() => {
      const record = throwUnless(store.languageStages.find(id))
      const ls = new LanguageStage({
        id: record.id,
        name: record.name,
        ancestor: ancestor,
        branches: [],
        originalWords: [],
        soundChanges: [],
      })
      ls.branches = record.branchIds.map(branchId =>
        throwUnless(LanguageStage.fromStore(store, branchId, ls))
      )
      ls.originalWords = record.originalWordIds.map(wordId =>
        throwUnless(OriginalWord.fromStore(store, wordId, ls))
      )
      ls.soundChanges = record.soundChangeIds.map(soundChangeId =>
        throwUnless(SoundChange.fromStore(store, soundChangeId, ls))
      )
      return ls
    })
  }

  get toRecord(): LanguageStageRecord {
    return new LanguageStageRecord({
      id: this.id,
      name: this.name,
      branchIds: this.branches.map(b => b.id),
      originalWordIds: this.originalWords.map(w => w.id),
      soundChangeIds: this.soundChanges.map(sc => sc.id),
    })
  }

  get allDescendants(): LanguageStage[] {
    return [this, ...this.branches.flatMap(branch => branch.allDescendants)]
  }

  get allWords(): Word[] {
    return [...this.originalWords, ...this.inheritedWords]
  }

  get inheritedWords(): Word[] {
    if (this.ancestor === null) {
      return []
    }
    return this.ancestor.allWords.map(word => {
      return this.soundChanges.reduce((w, sc) => sc.mangle(w), word)
    })
  }

  addBranch(): LanguageStage {
    const newBranch = new LanguageStage({ ancestor: this })
    this.branches.push(newBranch)
    return newBranch
  }

  addOriginalWord({ roman }: { roman: string }): void {
    this.originalWords.push(new OriginalWord({ roman, languageStage: this }))
  }

  addSoundChange(args: ISoundChange): void {
    this.soundChanges.push(new SoundChange(this, args))
  }
}
