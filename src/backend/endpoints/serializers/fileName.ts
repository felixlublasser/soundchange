import FileNameInterface from '@/interface/interfaces/FileName'
import { Result } from '@/lib/result'

export default function serializeFileName(fileName: string): Result<FileNameInterface> {
  return { fileName }
}