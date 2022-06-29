import BaseWord from "@/frontend/models/BaseWord";
import LanguageStage from "@/frontend/models/LanguageStage";

export default interface IWord {
  roman: string
  languageStage: LanguageStage
  base: BaseWord
  shortHistory: string
}
