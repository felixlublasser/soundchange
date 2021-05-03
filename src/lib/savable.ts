import { v4 } from 'uuid'
// import { Result, isError } from '@/lib/result'
// import SCRecord from '@/records/screcord'

export default class Savable {
  id: string;

  constructor(id: string = v4()) {
    this.id = id
  }

  // static recordClass<S extends typeof SCRecord>(): any {
  //   return SCRecord
  // }

  // static fromRecord<S extends typeof Savable, R extends typeof SCRecord>(record: R): InstanceType<S> {
  //   return new Savable(record) as InstanceType<S>
  // }

  // static fromJSON<S extends typeof Savable, R extends typeof SCRecord>(json: unknown): Result<Savable> {
  //   const loadResult = this.recordClass().fromJSON(json)
  //   if (isError(loadResult)) {
  //     return loadResult
  //   }
  //   return this.fromRecord(loadResult as R)
  // }
}
