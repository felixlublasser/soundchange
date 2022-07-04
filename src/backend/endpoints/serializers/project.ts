import ProjectInterface from '@/interface/interfaces/Project'
import { isError } from '@/lib/result'
import ProjectRecord from '@/backend/records/Project'
import { Result } from '@/lib/result'
import serializeLanguageBranch from './languageBranch'

export default function serializeProject(projectRecord: ProjectRecord): Result<ProjectInterface> {
  const store = projectRecord.store
  if (!store.protoLanguageId) {
    return new Error('Store has no proto language.')
  }
  const protoLanguage = store.languageStages.find(store.protoLanguageId)
  if (isError(protoLanguage)) {
    return new Error('Store has dangling proto language reference.')
  }

  const languageTree = serializeLanguageBranch(protoLanguage, store)
  if (isError(languageTree)) { return languageTree }

  return {
    id: projectRecord.id,
    version: store.version,
    languageTree,
    filePath: projectRecord.filePath
  }
}