export default interface ISoundChange {
  id?: string
  name?: string | null
  contextBefore?: string
  contextAfter?: string
  replace?: string
  replaceWith?: string
}
