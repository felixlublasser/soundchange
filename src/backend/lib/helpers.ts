import SCRecord from "@/backend/records/SCRecord"
import { ISoundChangeRecord } from "@/backend/records/tables"

export function applySoundChange (
  { soundChange, roman }:{ soundChange: SCRecord<ISoundChangeRecord>, roman: string }
): string {
  const { contextBefore, contextAfter, replace, replaceWith } = soundChange.record
  return roman.replace(
    new RegExp(
      `(?<=${contextBefore})${replace}(?=${contextAfter})`,
      'g'
    ),
    replaceWith
  )
}
