export interface ISoundChangeRecord {
  name: string | null
  languageStageId: string
  contextBefore: string
  contextAfter: string
  replace: string
  replaceWith: string
}

export interface IOriginalWordRecord {
  languageStageId: string
  roman: string
}

export interface ILanguageStageRecord {
  name: string | null
  parentLanguageStageId: string | null
}

export const LanguageStageRecordDefaults: ILanguageStageRecord = {
  name: null,
  parentLanguageStageId: null
}