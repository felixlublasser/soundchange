import LanguageStage from '@/models/LanguageStage';
import Word from '@/models/Word';

interface IInheritedWord {
  roman: string;
  languageStage: LanguageStage;
}

export default class InheritedWord implements Word {
  roman: string;
  languageStage: LanguageStage;

  constructor(args: IInheritedWord) {
    this.roman = args.roman
    this.languageStage = args.languageStage
  }
}
