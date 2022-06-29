import Store from '@/records/Store'
import Savable from '@/frontend/types/Savable'
import LanguageStage from '@/frontend/models/LanguageStage';
import { Result, resultify, succeedOrThrow } from '@/lib/result';
import OriginalWordRecord from '@/records/OriginalWord';
import BaseWord from '@/frontend/models/BaseWord';
import IWord from '@/frontend/types/Word';

interface IOriginalWord {
  id?: string;
  roman: string;
  languageStage: LanguageStage;
}

export default class OriginalWord extends Savable implements IWord {
  roman: string;
  languageStage: LanguageStage;

  constructor(args: IOriginalWord) {
    super(args.id)
    this.roman = args.roman
    this.languageStage = args.languageStage
  }

  get base(): BaseWord {
    return new BaseWord(this)
  }

  get shortHistory(): string {
    return this.base.shortHistory
  }

  static fromStore(store: Store, id: string, languageStage: LanguageStage): Result<OriginalWord> {
    return resultify(() => {
      const record = succeedOrThrow(store.originalWords.find(id))
      const word = new OriginalWord({
        id: record.id,
        roman: record.roman,
        languageStage,
      })
      return word
    })
  }

  get toRecord(): OriginalWordRecord {
    return new OriginalWordRecord({
      id: this.id,
      roman: this.roman,
    })
  }
}
