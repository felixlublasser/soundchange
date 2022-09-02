import SoundChangeInterface from '@/interface/interfaces/SoundChange'
import { ISoundChangeRecord } from '@/backend/records/tables'
import SCRecord from '@/backend/records/SCRecord'

export default function serializeSoundChange(record: SCRecord<ISoundChangeRecord>): SoundChangeInterface {
  return {
    id: record.id,
    name: record.record.name,
    contextBefore: record.record.contextBefore,
    contextAfter: record.record.contextAfter,
    replace: record.record.replace,
    replaceWith: record.record.replaceWith,
  }
}