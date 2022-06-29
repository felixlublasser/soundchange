import LanguageStage from './LanguageStage'

export default interface ProjectInterface {
  version: string
  filePath: string | null
  protoLanguage: LanguageStage
}
