import Endpoints from '@/interface/endpoints'
import { ipcRenderer } from 'electron';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function endpoint<T extends (...args: any) => any>(
  key: keyof Endpoints
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  return async (args: Parameters<T>): Promise<ReturnType<T>> => {
    const response = await Object.freeze(
      ipcRenderer.invoke(key, args)
    ) as ReturnType<T>
    console.log('Response received:', key, args, JSON.stringify(response))
    return response
  }
}

const endpoints: Endpoints = {
  getProject: endpoint('getProject'),
  openProject: endpoint('openProject'),
  newProject: endpoint('newProject'),
  saveProject: endpoint('saveProject'),
  getRecentProjectFileNames: endpoint('getRecentProjectFileNames'),
  getLanguageStage: endpoint('getLanguageStage'),
  updateLanguageStage: endpoint('updateLanguageStage'),
  getWordsForLanguageStage: endpoint('getWordsForLanguageStage'),
  createWordForLanguageStage: endpoint('createWordForLanguageStage'),
  getSoundChangesForLanguageStage: endpoint('getSoundChangesForLanguageStage'),
  createSoundChangeForLanguageStage: endpoint('createSoundChangeForLanguageStage'),
}
  export default endpoints

