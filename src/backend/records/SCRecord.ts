import RecordTable from '@/backend/records/RecordTable'
import { Result } from '@/lib/result'
import RecordInterface from './types'

export default class SCRecord<RecordInterfaceNew> {
  record: RecordInterface<RecordInterfaceNew>
  private tableRef: RecordTable<RecordInterfaceNew>

  constructor(record: RecordInterface<RecordInterfaceNew>, tableRef: RecordTable<RecordInterfaceNew>) {
    this.record = { ...record }
    this.tableRef = tableRef
  }

  copy(): SCRecord<RecordInterfaceNew> {
    return new SCRecord<RecordInterfaceNew>(this.record, this.tableRef)
  }

  save(): Result<SCRecord<RecordInterfaceNew>> {
    return this.tableRef.save(this)
  }

  get id(): string {
    return this.record.id
  }
}
