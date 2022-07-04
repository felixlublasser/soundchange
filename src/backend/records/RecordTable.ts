import { Result } from '@/lib/result'
import SCRecord from '@/backend/records/SCRecord'
import { v4 } from 'uuid'
import RecordInterface from './types'

export default class RecordTable<RecordInterfaceNew> {
  private primaryIndex: { [id: string]: SCRecord<RecordInterfaceNew> } = {}

  constructor(recordTemplates: RecordInterface<RecordInterfaceNew>[]) {
    // this.records = records.map(record => new SCRecord<RecordInterfaceNew>(record, this))
    recordTemplates.forEach(template => {
      const newRecord = new SCRecord<RecordInterfaceNew>(template, this)
      this.primaryIndex[newRecord.id] = newRecord
    })
  }

  find(id: string): Result<SCRecord<RecordInterfaceNew>> {
    const record = this.primaryIndex[id]
    if (!record) { return new Error('Record not found') }
    return record.copy()
  }

  where(
    whereFunction: (record: SCRecord<RecordInterfaceNew>) => boolean
  ): SCRecord<RecordInterfaceNew>[] {
    let key: string
    const result: SCRecord<RecordInterfaceNew>[] = []
    for (key in this.primaryIndex) {
      const recordCopy = this.primaryIndex[key].copy()
      if (whereFunction(recordCopy)) {
        result.push(recordCopy)
      }
    }
    return result
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
