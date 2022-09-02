import LanguageStageSummary from './LanguageStageSummary'

export default interface LanguageStageInterface {
  id: string
  name: string | null
  branches: LanguageStageSummary[]
  soundChangeIds: string[]
}
