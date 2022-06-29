import Endpoints from '@/interface/endpoints'
import { ipcRenderer } from 'electron';
import Project from '@/interface/interfaces/Project'
import FileNameInterface from '@/interface/interfaces/FileName'
import { Result } from '@/lib/result';

const endpoints: Endpoints = {
  getProject: ({ filePath }: { filePath: string }) => {
    return ipcRenderer.invoke('getProject', { filePath }) as Promise<Result<Project>>
  },
  newProject: () => {
    return ipcRenderer.invoke('newProject') as Promise<Result<Project>>
  },
  getRecentProjectFileNames: () => {
    return ipcRenderer.invoke('getRecentProjectFileNames') as  Promise<Result<FileNameInterface[]>>
  }
}
export default endpoints

