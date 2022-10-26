import ProjectInterface from '@/interface/interfaces/Project'
import FileNameInterface from '@/interface/interfaces/FileName'
import LanguageStageInterface from '@/interface/interfaces/LanguageStage'
import LanguageStageUpdateInterface from '@/interface/interfaces/LanguageStageUpdate'
import WordStageInterface from '@/interface/interfaces/WordStage'
import SoundChangeInterface from '@/interface/interfaces/SoundChange'
import WordStageCreateInterface from '@/interface/interfaces/WordStageCreate'
import SoundChangeCreateInterface from '@/interface/interfaces/SoundChangeCreate'
import { Result } from '@/lib/result'

export type GetProject = ({ id }: { id: string }) => Promise<Result<ProjectInterface>>
export type OpenProject = ({ filePath }: { filePath: string }) => Promise<Result<ProjectInterface>>
export type NewProject = () => Promise<Result<ProjectInterface>>
export type SaveProject = ({ id }: { id: string }) => Promise<Result<ProjectInterface>>
export type GetRecentProjectFileNames = () => Promise<Result<FileNameInterface[]>>
export type GetLanguageStage = (
  { projectId, id }:
  { projectId: string, id: string }
) => Promise<Result<LanguageStageInterface>>
export type UpdateLanguageStage = (
  { projectId, id, params }:
  { projectId: string, id: string, params: LanguageStageUpdateInterface }
) => Promise<Result<LanguageStageInterface>>
export type GetWordsForLanguageStage = (
  { projectId, id }:
  { projectId: string, id: string }
) => Promise<Result<WordStageInterface[]>>
export type CreateWordForLanguageStage = (
  { projectId, id, word }:
  { projectId: string, id: string, word: WordStageCreateInterface }
) => Promise<Result<WordStageInterface>>
export type GetSoundChangesForLanguageStage = (
  { projectId, id }:
  { projectId: string, id: string }
) => Promise<Result<SoundChangeInterface[]>>
export type CreateSoundChangeForLanguageStage = (
  { projectId, id, soundChange }:
  { projectId: string, id: string, soundChange: SoundChangeCreateInterface }
) => Promise<Result<SoundChangeInterface>>

export default interface Endpoints {
  getProject: GetProject
  openProject: OpenProject
  newProject: NewProject
  saveProject: SaveProject
  getRecentProjectFileNames: GetRecentProjectFileNames
  getLanguageStage: GetLanguageStage
  updateLanguageStage: UpdateLanguageStage
  getWordsForLanguageStage: GetWordsForLanguageStage
  createWordForLanguageStage: CreateWordForLanguageStage
  getSoundChangesForLanguageStage: GetSoundChangesForLanguageStage
  createSoundChangeForLanguageStage: CreateSoundChangeForLanguageStage
}
