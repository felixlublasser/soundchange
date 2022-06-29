import {
  // app,
  // dialog,
  ipcMain } from 'electron'
import getProject from '@/backend/endpoints/getProject'
import newProject from '@/backend/endpoints/newProject'
import getRecentProjectFileNames from '@/backend/endpoints/getRecentProjectFileNames'
import Endpoints from '@/interface/endpoints'

const endpoints: Endpoints = {
  getProject,
  newProject,
  getRecentProjectFileNames,
}

export const defineEndpoints = (): void => {
  const registerEndpoint = <K extends keyof Endpoints>(key: K) => {
    const implementation = endpoints[key]
    ipcMain.handle(
      key,
      (_, ...args) => implementation(args as any)
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
