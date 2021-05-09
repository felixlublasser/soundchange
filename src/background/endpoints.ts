import { app, dialog, ipcMain } from 'electron'
import File from './file'
import Json from '../lib/json'

export const defineEndpoints = ():void => {
  ipcMain.handle('getRecentProjects', async () => {
    return (await new File(`${app.getPath('userData')}/recentProjects`).load({ ignoreNotFound: true })).parsed
  })

  ipcMain.handle('addToRecentProjects', async (_event, filePath: string) => {
    const userSettings = await new File(`${app.getPath('userData')}/recentProjects`).load({ ignoreNotFound: true })
    if (!userSettings.parsed) {
      userSettings.parsed = { recentProjects: [filePath] }
    } else if (!Array.isArray(userSettings.parsed.recentProjects)) {
      userSettings.parsed.recentProjects = [filePath]
    } else {
      userSettings.parsed.recentProjects = [...new Set([filePath, ...userSettings.parsed.recentProjects])]
    }
    return userSettings.save()
  })

  ipcMain.handle('loadProject', async (_event, filePath: string) => {
    const file = await new File(filePath).load()
    return file.parsed
  })

  ipcMain.on('dialogOpenProject', async (event) => {
    const dialogResult = await dialog.showOpenDialog({})
    if (!dialogResult.canceled) {
      const file = await new File(dialogResult.filePaths[0]).load()
      event.sender.send('openedProject', file.parsed, file.filePath)
    }
  })

  ipcMain.on('saveProject', async (_event, object: Json, filePath: string) => {
    const file = new File(filePath)
    file.parsed = object
    file.save()
  })
}
