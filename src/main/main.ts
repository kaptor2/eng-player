import 'reflect-metadata';
import { app, BrowserWindow } from 'electron';
import fs from 'fs';
import path from 'path';

import { DeskController } from './controllers';
import { DBService, ttsService } from './services';

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    show: false,
  });

  mainWindow.webContents.openDevTools();

  if (app.isPackaged) {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  } else {
    mainWindow.loadURL('http://localhost:5173');
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(async () => {
  await DBService.initialize();
  await ttsService.init();

  await ttsService.init();
  const audio = await ttsService.makeAudio('en', 'and everyone else is tortured for eternity?');
  fs.writeFileSync('test.wav', audio);
  console.log('Audio saved to test.wav');

  new DeskController();
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
