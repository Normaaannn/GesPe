const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        icon: path.join(__dirname, 'icon.ico'),
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: false,
        }
    });

    win.loadFile(path.join(__dirname, 'www', 'index.html'));
    win.setMenu(null); // Quita la barra de menú superior

    // Menú contextual personalizado en español
    const menuTemplate = [
        {
            label: 'Deshacer',
            accelerator: 'CmdOrCtrl+Z',
            click: () => { win.webContents.undo(); }
        },
        {
            label: 'Rehacer',
            accelerator: 'Shift+CmdOrCtrl+Z',
            click: () => { win.webContents.redo(); }
        },
        { type: 'separator' },
        {
            label: 'Cortar',
            accelerator: 'CmdOrCtrl+X',
            click: () => { win.webContents.cut(); }
        },
        {
            label: 'Copiar',
            accelerator: 'CmdOrCtrl+C',
            click: () => { win.webContents.copy(); }
        },
        {
            label: 'Pegar',
            accelerator: 'CmdOrCtrl+V',
            click: () => { win.webContents.paste(); }
        },
        { type: 'separator' },
        {
            label: 'Seleccionar todo',
            accelerator: 'CmdOrCtrl+A',
            click: () => { win.webContents.selectAll(); }
        }
    ];

    const menu = Menu.buildFromTemplate(menuTemplate);

    // Mostrar menú contextual al hacer click derecho
    win.webContents.on('context-menu', () => {
        menu.popup();
    });

    //win.webContents.openDevTools(); // Para depurar si quieres
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});


