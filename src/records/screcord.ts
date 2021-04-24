import { Result } from '@/lib/result'
import Ajv, { JSONSchemaType } from 'ajv'

export default class SCRecord {
  static get schema(): unknown {
    return {}
  }

  static fromJSON<T extends typeof SCRecord>(json: unknown): Result<InstanceType<T>> {
    if(this.validate(json)) {
      return json as InstanceType<T>
    } else {
      return new Error("Failed loading project record: Wrong format.")
    }
  }

  static validate<T extends typeof SCRecord>(json: unknown): json is InstanceType<T> {
    const ajv = new Ajv()
    console.log(this.schema)
    return ajv.compile(this.schema as JSONSchemaType<unknown, false>)(json)
  }
}
