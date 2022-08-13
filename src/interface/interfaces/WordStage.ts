export default interface WordStageInterface {
  originalWordId: string
  inherited: boolean
  roman: string
  shortHistory: {
    roman: string
    languageStageName: string | null
  }[]
}
