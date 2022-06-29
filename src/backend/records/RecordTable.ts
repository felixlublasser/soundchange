import { isError, Result } from '@/lib/result'
import SCRecord from '@/backend/records/SCRecord'
import { v4 } from 'uuid'
import RecordInterface from './types'

export default class RecordTable<RecordInterfaceNew> {
  private records: SCRecord<RecordInterfaceNew>[]
  private primaryIndex: { [id: string]: SCRecord<RecordInterfaceNew> } = {}
  
  constructor(records: RecordInterface<RecordInterfaceNew>[]) {
    this.records = records.map(record => new SCRecord<RecordInterfaceNew>(record, this))
    this.buildPrimaryIndex()
  }

  private buildPrimaryIndex() {
    this.records.forEach(record => {
      this.primaryIndex[record.id] = record
    })
  }

  find(id: string): Result<SCRecord<RecordInterfaceNew>> {
    const record = this.primaryIndex[id]
    if (isError(record)) { return new Error('Record not found') }
    return record.copy()
  }

  save(record: SCRecord<RecordInterfaceNew>): Result<SCRecord<RecordInterfaceNew>> {
    if (!Object.keys(this.primaryIndex).includes(record.id)) {
      return new Error('Record not found')
    }
    this.primaryIndex[record.id] = record.copy()
    return record
  }

  create(unpersistedRecord: RecordInterfaceNew): Result<SCRecord<RecordInterfaceNew>> {
    const newId = v4()
    const newRecord = new SCRecord({
      id: newId,
      ...unpersistedRecord
    }, this)
    this.primaryIndex[newId] = newRecord
    return newRecord.copy()
  }
}
