import Store from '@/records/Store'
import Savable from '@/types/Savable'
import LanguageStage from '@/models/LanguageStage';
import { Result, resultify, throwUnless } from '@/lib/result';
import OriginalWordRecord from '@/records/OriginalWord';
import Word from '@/models/Word';

interface IOriginalWord {
  id?: string;
  roman: string;
  languageStage: LanguageStage;
}

export default class OriginalWord extends Savable implements Word {
  roman: string;
  languageStage: LanguageStage;

  constructor(args: IOriginalWord) {
    super(args.id)
    this.roman = args.roman
    this.languageStage = args.languageStage
  }

  static fromStore(store: Store, id: string, languageStage: LanguageStage): Result<OriginalWord> {
    return resultify(() => {
      const record = throwUnless(store.originalWords.find(id))
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
