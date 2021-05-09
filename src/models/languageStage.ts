import LanguageStageRecord from '@/records/LanguageStage'
import Savable from '@/types/Savable'
import Store from '@/records/Store'
import { Result, resultify, throwUnless } from '@/lib/result';

interface ILanguageStage {
  id?: string;
  name: string | null;
  ancestor: LanguageStage | null;
  branches: LanguageStage[];
}

export default class LanguageStage extends Savable {
  name: string | null;
  ancestor: LanguageStage | null;
  branches: LanguageStage[];

  constructor(args: ILanguageStage = { name: null, ancestor: null, branches: [] }) {
    super(args.id)
    this.name = args.name
    this.ancestor = args.ancestor
    this.branches = args.branches
  }

  static fromStore(store: Store, id: string, ancestor: LanguageStage | null): Result<LanguageStage> {
    return resultify(() => {
      const record = throwUnless(store.llanguageStages.find(id))
      const ls = new LanguageStage({
        id: record.id,
        name: record.name,
        ancestor: ancestor,
        branches: []
      })
      ls.branches = record.branchIds.map(branchId =>
        throwUnless(LanguageStage.fromStore(store, branchId, ls))
      )
      return ls
    })
  }

  get toRecord(): LanguageStageRecord {
    return new LanguageStageRecord({
      id: this.id,
      name: this.name,
      branchIds: this.branches.map(b => b.id)
    })
  }

  get allDescendants(): LanguageStage[] {
    return [this, ...this.branches.flatMap(branch => branch.allDescendants)]
  }

  addBranch(): void {
    this.branches.push(new LanguageStage())
  }
}
