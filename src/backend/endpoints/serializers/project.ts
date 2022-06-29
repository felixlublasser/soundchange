import Project from '@/interface/interfaces/Project'
import Store from '@/backend/records/Store'
import { isError, Result } from '@/lib/result'

export default function serializeProject(store: Store, filePath: string | null): Result<Project> {
  if (!store.protoLanguageId) {
    return new Error('Store has no proto language.')
  }
  const protoLanguage = store.languageStages.find(store.protoLanguageId)
  if (isError(protoLanguage)) {
    return new Error('Store has dangling proto language reference.')
  }
  return {
    version: store.version,
    protoLanguage: {
      id: protoLanguage.id,
      name: protoLanguage.record.name,
    },
    filePath
  }
}