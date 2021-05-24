import LanguageStageRecord from '@/records/LanguageStage'
import Savable from '@/types/Savable'
import Store from '@/records/Store'
import OriginalWord from '@/models/OriginalWord'
import Word from '@/models/Word'
import { Result, resultify, throwUnless } from '@/lib/result';

interface ILanguageStage {
  id?: string;
  name: string | null;
  ancestor: LanguageStage | null;
  branches: LanguageStage[];
  originalWords: OriginalWord[];
}

export default class LanguageStage extends Savable {
  name: string | null;
  ancestor: LanguageStage | null;
  branches: LanguageStage[];
  originalWords: OriginalWord[];

  constructor(args: ILanguageStage = { name: null, ancestor: null, branches: [], originalWords: [] }) {
    super(args.id)
    this.name = args.name
    this.ancestor = args.ancestor
    this.branches = args.branches
    this.originalWords = args.originalWords
  }

  static fromStore(store: Store, id: string, ancestor: LanguageStage | null): Result<LanguageStage> {
    return resultify(() => {
      const record = throwUnless(store.languageStages.find(id))
      const ls = new LanguageStage({
        id: record.id,
        name: record.name,
        ancestor: ancestor,
        branches: [],
        originalWords: []
      })
      ls.branches = record.branchIds.map(branchId =>
        throwUnless(LanguageStage.fromStore(store, branchId, ls))
      )
      ls.originalWords = record.originalWordIds.map(wordId =>
        throwUnless(OriginalWord.fromStore(store, wordId, ls))
      )
      return ls
    })
  }

  get toRecord(): LanguageStageRecord {
    return new LanguageStageRecord({
      id: this.id,
      name: this.name,
      branchIds: this.branches.map(b => b.id),
      originalWordIds: this.originalWords.map(w => w.id)
    })
  }

  get allDescendants(): LanguageStage[] {
    return [this, ...this.branches.flatMap(branch => branch.allDescendants)]
  }

  get allWords(): Word[] {
    return [...this.originalWords, ...this.inheritedWords]
  }

  get inheritedWords(): Word[] {
    return []
  }

  addBranch(): void {
    this.branches.push(new LanguageStage())
  }

  addOriginalWord({ roman }: { roman: string }): void {
    this.originalWords.push(new OriginalWord({ roman, languageStage: this }))
  }
}
