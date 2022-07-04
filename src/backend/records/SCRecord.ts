import RecordTable from '@/backend/records/RecordTable'
import { Result } from '@/lib/result'
import RecordInterface from './types'

export default class SCRecord<RecordInterfaceNew> {
  _record: RecordInterface<RecordInterfaceNew>
  private tableRef: RecordTable<RecordInterfaceNew>

  constructor(record: RecordInterface<RecordInterfaceNew>, tableRef: RecordTable<RecordInterfaceNew>) {
    this._record = { ...record }
    this.tableRef = tableRef
  }

  copy(): SCRecord<RecordInterfaceNew> {
    return new SCRecord<RecordInterfaceNew>(this.record, this.tableRef)
  }

  save(): Result<SCRecord<RecordInterfaceNew>> {
    return this.tableRef.save(this)
  }

  update(params: Partial<RecordInterfaceNew>): Result<SCRecord<RecordInterfaceNew>> {
    this._record = { ...this._record, ...params }
    return this.save()
  }

  get record(): RecordInterface<RecordInterfaceNew> {
    return this._record
  }

  get id(): string {
    return this.record.id
  }
}
