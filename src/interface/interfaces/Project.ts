import LanguageBranch from './LanguageBranch'

export default interface ProjectInterface {
  id: string
  version: string
  filePath: string | null
  languageTree: LanguageBranch
}
