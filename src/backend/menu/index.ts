import { app, dialog, Menu } from 'electron'
// import saveProjectAs from './saveAs'

const isMac = process.platform === 'darwin'

export const defineMenu = ():void => {
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
          label: 'Save as...',
          async click() {
            const dialogResult = await dialog.showSaveDialog({})
            // if (!dialogResult.canceled && browserWindow && browserWindow.webContents) {
            //   browserWindow.webContents.send('getProjectDataToSaveAs', dialogResult.filePath)
            // }
            if (dialogResult.canceled || !dialogResult.filePath) { return }
            // saveProjectAs(dialogResult.filePath)
          }
        },
        {
          label: 'Save',
          accelerator: 'Cmd+S',
          click(_menuItem, browserWindow) {
            if (browserWindow && browserWindow.webContents) {
              browserWindow.webContents.send('save')
            }
          }
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
    },
    {
      label: 'View',
      role: 'viewMenu',
      // submenu: [
      //   { role: 'reload' },
      //   { role: 'forceReload' },
      //   { role: 'toggleDevTools' },
      //   { type: 'separator' },
      //   { role: 'resetZoom' },
      //   { role: 'zoomIn' },
      //   { role: 'zoomOut' },
      //   { type: 'separator' },
      //   { role: 'togglefullscreen' }
      // ]
    },
  ]))
}
