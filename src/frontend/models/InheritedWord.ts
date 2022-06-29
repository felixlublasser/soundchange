import LanguageStage from '@/frontend/models/LanguageStage';
import Word from '@/frontend/types/Word';
import IWord from '@/frontend/types/Word';
import BaseWord from './BaseWord';

interface IInheritedWord {
  roman: string;
  languageStage: LanguageStage;
  ancestor: Word;
}

export default class InheritedWord implements IWord {
  roman: string;
  languageStage: LanguageStage;
  ancestor: Word;

  constructor(args: IInheritedWord) {
    this.roman = args.roman
    this.languageStage = args.languageStage
    this.ancestor = args.ancestor
  }

  get base(): BaseWord {
    return new BaseWord(this)
  }

  get shortHistory(): string {
    return this.roman + " < " + this.ancestor.shortHistory
  }
}
