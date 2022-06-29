import ProjectInterface from '@/interface/interfaces/Project'
import FileNameInterface from '@/interface/interfaces/FileName'
import { Result } from '@/lib/result'

type GetProject = ({ filePath }: { filePath: string }) => Promise<Result<ProjectInterface>>
type NewProject = () => Promise<Result<ProjectInterface>>
type GetRecentProjectFileNames = () => Promise<Result<FileNameInterface[]>>

export default interface Endpoints {
  getProject: GetProject
  newProject: NewProject
  getRecentProjectFileNames: GetRecentProjectFileNames
}
