import File from '@/backend/lib/file'
import { succeedOrThrow } from '@/lib/result'
import Json from '@/lib/json'
import { Result } from '@/lib/result'
import Ajv, { JSONSchemaType } from 'ajv'

interface Instantiable {
  new (...args: any): any
}

interface IFileFactory<T extends Instantiable> {
  new (...args: ConstructorParameters<T>): InstanceType<T>;
  schema: unknown;
}

export default class JsonFile<T extends Instantiable> extends File {
  private _parsedObject: InstanceType<T> | null = null
  private classFactory: IFileFactory<T>

  constructor(filePath: string, classFactory: IFileFactory<T>) {
    super(filePath)
    this.classFactory = classFactory
  }

  get parsedObject(): InstanceType<T> {
    const parsed = (this.raw && JSON.parse(this.raw)) as Json
    this._parsedObject ||= succeedOrThrow(this.parseJSON(parsed))
    return this._parsedObject as InstanceType<T>
  }

  async saveProject(object: T): Promise<JsonFile<T>> {
    this.save(JSON.stringify(object))
    return this
  }

  async load({ ignoreNotFound = false }: { ignoreNotFound?: boolean} = {}): Promise<Result<JsonFile<T>>> {
    super.load({ ignoreNotFound })
    return this
  }

  private parseJSON(json: Json): Result<InstanceType<T>> {
    const ajv = new Ajv()
    const validate = ajv.compile<T>(
      this.classFactory.schema as JSONSchemaType<unknown, false>
    )
    if (validate(json)) {
      return new this.classFactory(...json as unknown as ConstructorParameters<T>)
    } else {
      return new Error(JSON.stringify(validate.errors))
    }
  }
}
