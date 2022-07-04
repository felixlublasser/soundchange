import Endpoints from '@/interface/endpoints'
import { ipcRenderer } from 'electron';
import ProjectInterface from '@/interface/interfaces/Project'
import FileNameInterface from '@/interface/interfaces/FileName'
import LanguageStageInterface from '@/interface/interfaces/LanguageStage'
import { Result } from '@/lib/result';

const endpoints: Endpoints = {
  getProject: ({ id }) => {
    return Object.freeze(
      ipcRenderer.invoke('getProject', { id })
    ) as Promise<Result<ProjectInterface>>
  },
  openProject: ({ filePath }) => {
    return Object.freeze(
      ipcRenderer.invoke('openProject', { filePath })
    ) as Promise<Result<ProjectInterface>>
  },
  newProject: () => {
    return Object.freeze(
      ipcRenderer.invoke('newProject')
    ) as Promise<Result<ProjectInterface>>
  },
  getRecentProjectFileNames: () => {
    return Object.freeze(
      ipcRenderer.invoke('getRecentProjectFileNames')
    ) as  Promise<Result<FileNameInterface[]>>
  },
  getLanguageStage: ({ projectId, id }) => {
    return Object.freeze(
      ipcRenderer.invoke('getLanguageStage', { id, projectId })
    ) as Promise<Result<LanguageStageInterface>>
  },
  updateLanguageStage: ({ projectId, id, params }) => {
    return Object.freeze(
      ipcRenderer.invoke('updateLanguageStage', { projectId, id, params })
    ) as Promise<Result<LanguageStageInterface>>
  }
}
export default endpoints

