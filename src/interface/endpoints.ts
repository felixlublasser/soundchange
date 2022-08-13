import ProjectInterface from '@/interface/interfaces/Project'
import FileNameInterface from '@/interface/interfaces/FileName'
import LanguageStageInterface from '@/interface/interfaces/LanguageStage'
import LanguageStageUpdateInterface from '@/interface/interfaces/LanguageStageUpdate'
import WordStageInterface from '@/interface/interfaces/WordStage'
import { Result } from '@/lib/result'

export type GetProject = ({ id }: { id: string }) => Promise<Result<ProjectInterface>>
export type OpenProject = ({ filePath }: { filePath: string }) => Promise<Result<ProjectInterface>>
export type NewProject = () => Promise<Result<ProjectInterface>>
export type SaveProject = ({ id }: { id: string }) => Promise<Result<ProjectInterface>>
export type GetRecentProjectFileNames = () => Promise<Result<FileNameInterface[]>>
export type GetLanguageStage = ({ projectId, id }: { projectId: string, id: string }) => Promise<Result<LanguageStageInterface>>
export type UpdateLanguageStage = ({ projectId, id, params }: { projectId: string, id: string, params: LanguageStageUpdateInterface }) => Promise<Result<LanguageStageInterface>>
export type GetWordsForLanguageStage = ({ projectId, id }: { projectId: string, id: string }) => Promise<Result<WordStageInterface[]>>

export default interface Endpoints {
  getProject: GetProject
  openProject: OpenProject
  newProject: NewProject
  saveProject: SaveProject
  getRecentProjectFileNames: GetRecentProjectFileNames
  getLanguageStage: GetLanguageStage
  updateLanguageStage: UpdateLanguageStage
  getWordsForLanguageStage: GetWordsForLanguageStage
}
