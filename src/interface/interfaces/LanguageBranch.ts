export default interface LanguageBranch {
  id: string
  name: string | null
  branches: LanguageBranch[]
}
