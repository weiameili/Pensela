const { app, BrowserWindow, ipcMain, screen } = require("electron");
const os = require("os");
const path = require("path");
const fs = require("fs");
const screenshot = require("screenshot-desktop");

function createWindow() {
  const board = new BrowserWindow({
    width: screen.getPrimaryDisplay().workAreaSize.width,
    height: screen.getPrimaryDisplay().workAreaSize.height,
    webPreferences: {
      nodeIntegration: true,
      devTools: true,
    },
    transparent: true,
    frame: false,
    icon: path.join(__dirname, "/assets/Icon-512x512.png"),
  });
  board.setAlwaysOnTop(true, "screen");
  board.loadFile("board.html");
  board.setResizable(false);

  const controller = new BrowserWindow({
    width: Math.floor(screen.getPrimaryDisplay().size.width * (1350 / 1920)),
    height: Math.floor(screen.getPrimaryDisplay().size.width * 1350 / 1920 * 1/11),
    webPreferences: {
      nodeIntegration: true,
      devTools: true,
    },
    transparent: true,
    frame: false,
    skipTaskbar: true,
    parent: board,
    icon: "./assets/logo.png",
  });
  controller.setPosition(205, 40);
  controller.setAlwaysOnTop(true, "screen");
  controller.loadFile("controller.html");
  controller.setResizable(false);

  function openPicker() {
    const picker = new BrowserWindow({
      width: Math.floor(screen.getPrimaryDisplay().size.width / 6),
      height: Math.floor(screen.getPrimaryDisplay().size.width / 6 * 19 / 16),
      webPreferences: {
        nodeIntegration: true,
        devTools: true,
      },
      transparent: true,
      frame: false,
      skipTaskbar: true,
      parent: board,
      icon: "./assets/logo.png",
    });
    picker.setPosition(500, 300);
    picker.setAlwaysOnTop(true, "screen");
    picker.loadFile("picker.html");
    picker.setResizable(false);
  }

  function openBackgroundDialog() {
    const dialog = new BrowserWindow({
      width: Math.floor(screen.getPrimaryDisplay().size.width / 6),
      height: Math.floor(screen.getPrimaryDisplay().size.width / 6 * 11 / 8),
      webPreferences: {
        nodeIntegration: true,
        devTools: true,
      },
      transparent: true,
      frame: false,
      skipTaskbar: true,
      parent: board,
      icon: "./assets/logo.png",
    });
    dialog.setPosition(500, 300);
    dialog.setAlwaysOnTop(true, "screen");
    dialog.loadFile("background.html");
    dialog.setResizable(false);
  }

  controller.on("closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });

  board.on("closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });

  ipcMain.on("resetBoard", () => {
    board.webContents.send("resetBoard");
  });
  ipcMain.on("eraserMode", () => {
    board.webContents.send("eraserMode");
  });
  ipcMain.on("setMode", (e, arg) => {
    board.webContents.send("setMode", arg);
  });

  ipcMain.on("textMode", () => {
    board.webContents.send("textMode");
  });

  ipcMain.on("colSelect", (e, arg) => {
    board.webContents.send("colSelectFill", arg);
    board.webContents.send("colSelectStroke", arg);
  });
  ipcMain.on("colSelectFill", (e, arg) => {
    board.webContents.send("colSelectFill", arg);
  });
  ipcMain.on("customColor", openPicker);
  ipcMain.on("colSubmit", (e, arg) => {
    controller.webContents.send("colSubmit", arg);
  });

  ipcMain.on("drawPolygon", () => {
    board.webContents.send("drawPolygon");
  });
  ipcMain.on("drawLine", () => {
    board.webContents.send("drawLine");
  });
  ipcMain.on("drawSquare", () => {
    board.webContents.send("drawSquare");
  });
  ipcMain.on("drawCircle", () => {
    board.webContents.send("drawCircle");
  });
  ipcMain.on("drawTriangle", () => {
    board.webContents.send("drawTriangle");
  });

  ipcMain.on("drawTick", () => {
    board.webContents.send("drawTick");
  });
  ipcMain.on("drawCross", () => {
    board.webContents.send("drawCross");
  });
  ipcMain.on("drawStar", () => {
    board.webContents.send("drawStar");
  });
  ipcMain.on("drawFreehand", () => {
    board.webContents.send("drawFreehand");
  });

  ipcMain.on("dragMode", () => {
    board.webContents.send("setMode", "drag");
    board.webContents.send("dragMode");
  });

  ipcMain.on("hideBoard", () => {
    board.hide();
    controller.setAlwaysOnTop(true, "screen");
  });
  ipcMain.on("showBoard", () => {
    board.show();
    controller.hide();
    controller.show();
  });

  ipcMain.on("minimizeWin", () => {
    board.show();
    controller.hide();
    controller.show();
    board.minimize();
  });
  ipcMain.on("closeWin", () => {
    board.close();
  });

  ipcMain.on("bgSelect", () => {
    openBackgroundDialog();
  });
  ipcMain.on("bgUpdate", (e, arg) =>
    controller.webContents.send("bgUpdate", arg)
  );
  ipcMain.on("bgSubmit", (e, arg) => {
    board.webContents.send("bgSelect", arg);
    board.focus();
  });

  ipcMain.on("clearBoard", () => board.webContents.send("clearBoard"));

  ipcMain.on("laserCursor", () => {
    board.webContents.send("setMode", "laser");
    board.webContents.send("laserCursor");
  });

  ipcMain.on("undo", () => board.webContents.send("undo"));
  ipcMain.on("redo", () => board.webContents.send("redo"));

  ipcMain.on("screenshot", () => {
    let d = new Date();
    if (!fs.existsSync(os.homedir() + "/Pictures/Pensela")) {
      fs.mkdirSync(os.homedir() + "/Pictures/Pensela");
    }
    screenshot({
      filename:
        os.homedir() +
        "/Pictures/Pensela/Screenshot " +
        ("0" + d.getDate()).slice(-2) +
        "-" +
        ("0" + (d.getMonth() + 1)).slice(-2) +
        "-" +
        d.getFullYear() +
        " " +
        d.getHours() +
        ":" +
        d.getMinutes() +
        ":" +
        d.getSeconds() +
        ".png",
    });
    board.webContents.send("screenshot");
  });

  ipcMain.on("strokeIncrease", () => board.webContents.send("strokeIncrease"));
  ipcMain.on("strokeDecrease", () => board.webContents.send("strokeDecrease"));

  ipcMain.on("arrowSingle", () => board.webContents.send("arrowSingle"))
  ipcMain.on("arrowDouble", () => board.webContents.send("arrowDouble"))

  ipcMain.on("highlighter", () => board.webContents.send("highlighter"))

  if (os.platform() == "win32") {
    setTimeout(() => {
      board.minimize();
      board.restore();
      board.hide();
      board.show();
      controller.hide();
      controller.show();
    }, 1000);
  }
}

app.commandLine.appendSwitch("enable-transparent-visuals");
app.disableHardwareAcceleration();

app.whenReady().then(() => {
  os.platform() == "linux" ? setTimeout(createWindow, 1000) : createWindow();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
