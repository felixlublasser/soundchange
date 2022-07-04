import { readFile, writeFile } from 'fs/promises'
import { Result } from '@/lib/result'

interface FSError extends Error {
  code: string
}

export default class File {
  filePath: string
  protected raw: string | null = null

  constructor(filePath: string) {
    this.filePath = filePath
  }

  async load({ ignoreNotFound = false }: { ignoreNotFound?: boolean} = {}): Promise<Result<File>> {
    try {
      this.raw = await readFile(this.filePath, 'utf-8')
    } catch (e) {
      const error = e as FSError
      if (error.code !== 'ENOENT' || !ignoreNotFound) {
        return new Error(`Error loading file ${this.filePath}: ${error.message}`)
      } else {
        throw error
      }
    }
    return this
  }
  
  async save(raw: string): Promise<File> {
    writeFile(this.filePath, raw)
    return this
  }
}
