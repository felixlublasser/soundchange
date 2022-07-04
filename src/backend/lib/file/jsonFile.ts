import File from '@/backend/lib/file'
import { succeedOrThrow } from '@/lib/result'
import Json from '@/lib/json'
import Ajv, { JTDDataType } from 'ajv/dist/jtd'
import { Result } from '@/lib/result'

interface Instantiable {
  new (...args: any): any
}

interface IFileFactory<T extends Instantiable, Schema> {
  new (args: ConstructorParameters<T>[0]): InstanceType<T>;
  schema: Schema;
}

export default class JsonFile<T extends Instantiable, Schema> extends File {
  private _parsedObject: InstanceType<T> | null = null
  private classFactory: IFileFactory<T, Schema>

  constructor(filePath: string, classFactory: IFileFactory<T, Schema>) {
    super(filePath)
    this.classFactory = classFactory
  }

  get parsedObject(): InstanceType<T> {
    const parsed = (this.raw && JSON.parse(this.raw)) as Json
    if (!this._parsedObject) {
      this._parsedObject = succeedOrThrow(this.parseJSON(parsed))
    }
    return this._parsedObject as InstanceType<T>
  }

  async saveProject(object: T): Promise<JsonFile<T, Schema>> {
    this.save(JSON.stringify(object))
    return this
  }

  async load({ ignoreNotFound = false }: { ignoreNotFound?: boolean} = {}): Promise<Result<JsonFile<T, Schema>>> {
    await super.load({ ignoreNotFound })
    return this
  }

  private parseJSON(json: Json): Result<InstanceType<T>> {
    const ajv = new Ajv()
    const validate = ajv.compile<JTDDataType<Schema>>(
      this.classFactory.schema
    )
    if (validate(json)) {
      return new this.classFactory(json as unknown as ConstructorParameters<T>[0])
    } else {
      return new Error(`Error validating JSON file schema: ${JSON.stringify(validate.errors)}`)
    }
  }
}
