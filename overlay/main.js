const { app, BrowserWindow, screen } = require('electron');
const path = require('path');

function createWindow() {
  // Get primary display and center on it
  const display = screen.getPrimaryDisplay();
  const width = 400;
  const height = 32;
  const x = display.bounds.x + (display.bounds.width - width) / 2;

  const win = new BrowserWindow({
    width,
    height,
    x,
    y: 0,
    frame: false,
    transparent: true,
    resizable: false,
    movable: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    focusable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  win.setIgnoreMouseEvents(true, { forward: true });

  win.loadFile(path.join(__dirname, 'index.html'));
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  // keep running? for now quit
  if (process.platform !== 'darwin') app.quit();
});
