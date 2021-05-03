// import LanguageStageRecord from '@/records/languageStage'
import Savable from '@/lib/savable'
import Store from '@/records/store'
import { Result, resultify, throwUnless } from '@/lib/result';

export default class LanguageStage extends Savable {
  name: string | null = null;
  ancestor: LanguageStage | null = null;
  branches: LanguageStage[] = [];

  static fromStore(store: Store, id: string): Result<LanguageStage> {
    return resultify(() => {
      const record = throwUnless(store.languageStages.find(id))
      const newLS = new LanguageStage()
      newLS.name = record.name
  
      newLS.ancestor =
        record.ancestorId === null
          ? null
          : throwUnless(LanguageStage.fromStore(store, record.ancestorId))
  
      newLS.branches = record.branchIds.map(branchId =>
        throwUnless(LanguageStage.fromStore(store, branchId))
      )
      return newLS
    })
  }

  // toRecord(): LanguageStageRecord {
  //   return new LanguageStageRecord({ id: this.id, name: this.name })
  // }
}
