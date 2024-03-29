import {
  // app,
  // dialog,
  ipcMain } from 'electron'
import getProject from '@/backend/endpoints/getProject'
import openProject from '@/backend/endpoints/openProject'
import newProject from '@/backend/endpoints/newProject'
import saveProject from '@/backend/endpoints/saveProject'
import getRecentProjectFileNames from '@/backend/endpoints/getRecentProjectFileNames'
import getLanguageStage from '@/backend/endpoints/getLanguageStage'
import updateLanguageStage from '@/backend/endpoints/updateLanguageStage'
import getWordsForLanguageStage from '@/backend/endpoints/getWordsForLanguageStage'
import createWordForLanguageStage from '@/backend/endpoints/createWordForLanguageStage'
import updateOriginalWord from '@/backend/endpoints/updateOriginalWord'
import deleteOriginalWord from '@/backend/endpoints/deleteOriginalWord'
import getSoundChangesForLanguageStage from '@/backend/endpoints/getSoundChangesForLanguageStage'
import createSoundChangeForLanguageStage from '@/backend/endpoints/createSoundChangeForLanguageStage'
import updateSoundChange from '@/backend/endpoints/updateSoundChange'
import deleteSoundChange from '@/backend/endpoints/deleteSoundChange'
import Endpoints from '@/interface/endpoints'

const endpoints: Endpoints = {
  getProject,
  openProject,
  newProject,
  saveProject,
  getRecentProjectFileNames,
  getLanguageStage,
  updateLanguageStage,
  getWordsForLanguageStage,
  createWordForLanguageStage,
  updateOriginalWord,
  deleteOriginalWord,
  getSoundChangesForLanguageStage,
  createSoundChangeForLanguageStage,
  updateSoundChange,
  deleteSoundChange,
}

export const defineEndpoints = (): void => {
  const registerEndpoint = <K extends keyof Endpoints>(key: K) => {
    const implementation = endpoints[key]
    ipcMain.handle(
      key,
      (_, arg) => {
        console.log("Request received:", key, JSON.stringify(arg))
        return implementation(arg as any)
      }
    )
  }

  (Object.keys(endpoints) as Array<keyof Endpoints>)
    .forEach(registerEndpoint)
}

  // ipcMain.on('addToRecentProjects', async (_event, filePath: string) => {
  //   console.log('received command')
  //   const userSettings = await new File(`${app.getPath('userData')}/recentProjects`).load({ ignoreNotFound: true })
  //   console.log('loaded file', JSON.stringify(userSettings))
  //   if (!userSettings.parsed) {
  //     userSettings.parsed = { recentProjects: [filePath] }
  //   } else if (!Array.isArray(userSettings.parsed.recentProjects)) {
  //     userSettings.parsed.recentProjects = [filePath]
  //   } else {
  //     userSettings.parsed.recentProjects = [...new Set([filePath, ...userSettings.parsed.recentProjects])]
  //   }
  //   userSettings.save()
  // })

  // ipcMain.on('dialogOpenProject', async (event) => {
  //   const dialogResult = await dialog.showOpenDialog({})
  //   if (!dialogResult.canceled) {
  //     const file = await new File(dialogResult.filePaths[0]).load()
  //     event.sender.send('openedProject', file.parsed, file.filePath)
  //   }
  // })

  // ipcMain.on('saveProject', async (_event, object: Json, filePath: string) => {
  //   const file = new File(filePath)
  //   file.parsed = object
  //   file.save()
  // })
// }
