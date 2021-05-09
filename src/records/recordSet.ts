import { Result } from '@/lib/result'
import SCRecord from '@/records/SCRecord'

export default class RecordSet<T extends SCRecord> {
  records: T[]

  constructor(records: T[]) {
    this.records = records
  }

  find(id: string): Result<T> {
    const record = this.records.find(r => r.id === id)
    return record === undefined ? new Error('Record not found') : record
  }
}
