'use strict'

import { app, protocol, BrowserWindow, ipcMain, Menu } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import File from './file'

const isDevelopment = process.env.NODE_ENV !== 'production'

export const runBackgroundProcess = function (): void {
  // Scheme must be registered before the app is ready
  protocol.registerSchemesAsPrivileged([
    { scheme: 'app', privileges: { secure: true, standard: true } }
  ])

  async function createWindow() {
    // Create the browser window.
    const win = new BrowserWindow({
      width: 1250,
      height: 780,
      webPreferences: {
        
        // Required for Spectron testing
        enableRemoteModule: true,
        
        // Use pluginOptions.nodeIntegration, leave this alone
        // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
        nodeIntegration: true,
        contextIsolation: false,
      }
    })

    if (process.env.WEBPACK_DEV_SERVER_URL) {
      // Load the url of the dev server if in development mode
      await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string)
      if (!process.env.IS_TEST) win.webContents.openDevTools()
    } else {
      createProtocol('app')
      // Load the index.html when not in development
      win.loadURL('app://./index.html')
    }
  }

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', async () => {
    if (isDevelopment && !process.env.IS_TEST) {
      // Install Vue Devtools
      try {
        await installExtension(VUEJS_DEVTOOLS)
      } catch (e) {
        console.error('Vue Devtools failed to install:', e.toString())
      }
    }
    createWindow()
  })

  // Exit cleanly on request from parent process in development mode.
  if (isDevelopment) {
    if (process.platform === 'win32') {
      process.on('message', (data) => {
        if (data === 'graceful-exit') {
          app.quit()
        }
      })
    } else {
      process.on('SIGTERM', () => {
        app.quit()
      })
    }
  }

  const isMac = process.platform === 'darwin'

  Menu.setApplicationMenu(Menu.buildFromTemplate([
    ...(isMac ? [{
      label: app.name,
      submenu: [
        { role: "about" as const },
        { type: 'separator' as const },
        { role: 'services' as const },
        { type: 'separator' as const },
        { role: 'hide' as const },
        { role: 'hideOthers' as const },
        { role: 'unhide' as const },
        { type: 'separator' as const },
        { role: 'quit' as const }
      ]
    }] : []),
    {
      label: 'File',
      submenu: [
        {
          label: 'Save as...'
        },
        {
          label: 'Save'
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        // { role: 'undo' },
        // { role: 'redo' },
        // { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' }
      ]
    }
  ]))

  ipcMain.handle('getRecentProjects', async () => {
    return (await new File(`${app.getPath('userData')}/recentProjects`).load({ ignoreNotFound: true })).parsed
  })

  ipcMain.handle('addToRecentProjects', async (_event, filePath: string) => {
    console.log('got request')
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
}
