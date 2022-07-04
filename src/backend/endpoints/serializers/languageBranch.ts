import SCRecord from "@/backend/records/SCRecord";
import Store from "@/backend/records/Store";
import { ILanguageStageRecord } from "@/backend/records/tables";
import LanguageBranchInterface from "@/interface/interfaces/LanguageBranch";
import { collectify, isError, Result } from "@/lib/result";

export default function serializeLanguageBranch (
  languageStage: SCRecord<ILanguageStageRecord>,
  store: Store
): Result<LanguageBranchInterface> {
  const branches = store.languageStages.where((record) =>
    record.record.parentLanguageStageId === languageStage.id
  )

  const serializedBranches = collectify(
    branches.map(branch => serializeLanguageBranch(branch, store))
  )
  if (isError(serializedBranches)) { return serializedBranches }

  return {
    id: languageStage.id,
    name: languageStage.record.name,
    branches: serializedBranches
  }
}
