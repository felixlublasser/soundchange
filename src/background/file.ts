import { readFile, writeFile } from 'fs/promises'
import Json from '../lib/json'

export default class File {
  filePath: string
  raw: string | null = null
  parsed: Json | null = null

  constructor(filePath: string) {
    this.filePath = filePath
  }

  async load({ ignoreNotFound = false }: { ignoreNotFound?: boolean} = {}): Promise<File> {
    try {
      this.raw = await readFile(this.filePath, 'utf-8')
      this.parsed = this.raw && JSON.parse(this.raw)
    } catch (e) {
      if (e.code !== 'ENOENT' || !ignoreNotFound) {
        console.log('Error loading file', this.filePath, ':', e)
      }
    }
    return this
  }
  
  async save(): Promise<File> {
    writeFile(this.filePath, JSON.stringify(this.parsed))
    return this
  }
}
