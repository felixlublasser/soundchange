import { v4 } from "uuid"
import Store from "./Store"

export default class Project {
  id: string
  store: Store
  filePath: string | null

  constructor({ id = v4(), store = new Store(), filePath = null }: { id?: string, store?: Store, filePath?: string | null }) {
    this.id = id
    this.store = store
    this.filePath = filePath
  }
}
