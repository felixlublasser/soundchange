import SoundChangeInterface from '@/interface/interfaces/SoundChange'
import { ISoundChangeRecord } from '@/backend/records/tables'
import SCRecord from '@/backend/records/SCRecord'
import SoundChange from '@/backend/models/SoundChange'
import { isError } from '@/lib/result'

export default function serializeSoundChange(record: SCRecord<ISoundChangeRecord>): SoundChangeInterface {
  const parseResult = SoundChange.parse(record)
  console.log(isError(parseResult) ? parseResult : JSON.stringify(parseResult, undefined, 2))
  return {
    id: record.id,
    name: record.record.name,
    contextBefore: record.record.contextBefore,
    contextAfter: record.record.contextAfter,
    replace: record.record.replace,
    replaceWith: record.record.replaceWith,
  }
}