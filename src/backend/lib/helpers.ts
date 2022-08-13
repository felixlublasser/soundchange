import SCRecord from "../records/SCRecord"
import { ISoundChangeRecord } from "../records/tables"

export function applySoundChange ({ soundChange, roman }: { soundChange: SCRecord<ISoundChangeRecord>, roman: string }): string {
  return roman.replace(new RegExp(soundChange.record.replace, 'g'), soundChange.record.replaceWith)
}
