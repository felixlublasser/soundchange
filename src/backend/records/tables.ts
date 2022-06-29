export interface ISoundChangeRecord {
  name: string | null
  contextBefore: string
  contextAfter: string
  replace: string
  replaceWith: string
}

export interface IOriginalWordRecord {
  roman: string
}

export interface ILanguageStageRecord {
  name: string | null
  branchIds: string[]
  originalWordIds: string[]
  soundChangeIds: string[]
}

export const LanguageStageRecordDefaults: ILanguageStageRecord = {
  name: null,
  branchIds: [],
  originalWordIds: [],
  soundChangeIds: [],
}