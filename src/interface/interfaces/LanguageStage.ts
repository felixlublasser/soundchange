import LanguageStageSummary from './LanguageStageSummary'
import OriginalWordInterface from './OriginalWord'

export default interface LanguageStageInterface {
  id: string
  name: string | null
  branches: LanguageStageSummary[]
  originalWords: OriginalWordInterface[]
  soundChangeIds: string[]
}
