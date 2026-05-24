const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 850,
    minWidth: 1000,
    minHeight: 700,
    icon: path.join(__dirname, 'public', 'vite.svg'), // fallback icon
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    autoHideMenuBar: true
  });

  const isDev = process.env.VITE_DEV === 'true' || !app.isPackaged;

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    // mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));
  }

  // Open external links in default OS browser (Wiki links, etc.)
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http:') || url.startsWith('https:')) {
      shell.openExternal(url);
    }
    return { action: 'deny' };
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// IPC Handler to read Warframe log file EE.log and extract the active account name
ipcMain.handle('get-warframe-account-name', async () => {
  try {
    const localAppData = process.env.LOCALAPPDATA || path.join(os.homedir(), 'AppData', 'Local');
    const logPath = path.join(localAppData, 'Warframe', 'EE.log');
    
    if (!fs.existsSync(logPath)) {
      console.log('EE.log not found at: ' + logPath);
      return null;
    }
    
    const logContent = fs.readFileSync(logPath, 'utf8');
    const lines = logContent.split('\n');
    
    // Scan lines backwards to find the most recent login/account mention
    for (let i = lines.length - 1; i >= 0; i--) {
      const line = lines[i];
      
      const loginMatch = line.match(/Logged\s+in\s+as\s+([a-zA-Z0-9_.-]+)/i);
      if (loginMatch && loginMatch[1]) {
        console.log('Detected Warframe username (Logged in):', loginMatch[1]);
        return loginMatch[1].trim();
      }
      
      const accountMatch = line.match(/Account\s+name:\s+([a-zA-Z0-9_.-]+)/i);
      if (accountMatch && accountMatch[1]) {
        console.log('Detected Warframe username (Account name):', accountMatch[1]);
        return accountMatch[1].trim();
      }

      const playtimeMatch = line.match(/SetPlayTimeAccount:\s+([a-zA-Z0-9_.-]+)/i);
      if (playtimeMatch && playtimeMatch[1]) {
        console.log('Detected Warframe username (PlayTimeAccount):', playtimeMatch[1]);
        return playtimeMatch[1].trim();
      }
    }
    
    return null;
  } catch (err) {
    console.error('Failed to parse Warframe EE.log:', err);
    return null;
  }
});
