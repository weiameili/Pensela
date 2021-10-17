const { app, BrowserWindow, ipcMain, screen } = require("electron");
const os = require("os");
const path = require("path");
const fs = require("fs");
const screenshot = require("screenshot-desktop");

function createWindow() {
  let boards = []
  screen.getAllDisplays().forEach(s => {
    boards.push(new BrowserWindow({
      width: s.workArea.width,
      height: s.workArea.height,
      webPreferences: {
        nodeIntegration: true,
        devTools: true,
        contextIsolation: false,
      },
      transparent: true,
      frame: false,
      icon: path.join(__dirname, "/assets/Icon-512x512.png"),
    }))
	boards[boards.length - 1].setAlwaysOnTop(true, "screen");
  	boards[boards.length - 1].loadFile("board.html");
  	boards[boards.length - 1].setResizable(false);
	boards[boards.length - 1].setPosition(s.workArea.x, s.workArea.y);
    if (boards.length > 1) { boards[boards.length - 1].setParentWindow(boards[0]) }
  });
  const controller = new BrowserWindow({
    width: Math.floor(screen.getPrimaryDisplay().size.width * (1350 / 1920)),
    height: Math.floor(
      (((screen.getPrimaryDisplay().size.width * 1350) / 1920) * 1) / 11
    ),
    webPreferences: {
      nodeIntegration: true,
      devTools: true,
      contextIsolation: false
    },
    transparent: true,
    frame: false,
    skipTaskbar: true,
    parent: boards[0],
    icon: "./assets/logo.png",
  });
  controller.setPosition(205, 40);
  controller.setAlwaysOnTop(true, "screen");
  controller.loadFile("controller.html");
  controller.setResizable(false);

  function openPicker(x, y) {
    const picker = new BrowserWindow({
      width: Math.floor(screen.getPrimaryDisplay().size.width / 6),
      height: Math.floor(
        ((screen.getPrimaryDisplay().size.width / 6) * 19) / 16
      ),
      webPreferences: {
        nodeIntegration: true,
        devTools: true,
        contextIsolation: false
      },
      transparent: true,
      frame: false,
      skipTaskbar: true,
      parent: boards[0],
      icon: "./assets/logo.png",
    });
    picker.setPosition(x, y);
    picker.setAlwaysOnTop(true, "screen");
    picker.loadFile("picker.html");
    picker.setResizable(false);
  }

  function openBackgroundDialog(x, y) {
    const dialog = new BrowserWindow({
      width: Math.floor(screen.getPrimaryDisplay().size.width / 6),
      height: Math.floor(
        ((screen.getPrimaryDisplay().size.width / 6) * 11) / 8
      ),
      webPreferences: {
        nodeIntegration: true,
        devTools: true,
        contextIsolation: false
      },
      transparent: true,
      frame: false,
      skipTaskbar: true,
      parent: boards[0],
      icon: "./assets/logo.png",
    });
    dialog.setPosition(x, y);
    dialog.setAlwaysOnTop(true, "screen");
    dialog.loadFile("background.html");
    dialog.setResizable(false);
  }

  controller.on("closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });

  boards[0].on("closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });

  ipcMain.on("resetBoard", () => {
    for (j in boards) { boards[j].webContents.send("resetBoard"); }
  });
  ipcMain.on("eraserMode", () => {
    for (j in boards) { boards[j].webContents.send("eraserMode"); }
  });
  ipcMain.on("setMode", (e, arg) => {
    for (j in boards) { boards[j].webContents.send("setMode", arg); }
  });

  ipcMain.on("textMode", () => {
    for (j in boards) { boards[j].webContents.send("textMode"); }
  });

  ipcMain.on("colSelect", (e, arg) => {
    for (j in boards) {
		  boards[j].webContents.send("colSelectFill", arg);
      boards[j].webContents.send("colSelectStroke", arg);
    }
  });
  ipcMain.on("colSelectFill", (e, arg) => {
    for (j in boards) { boards[j].webContents.send("colSelectFill", arg); }
  });
  ipcMain.on("customColor", (e, arg) =>
    openPicker(
      controller.getPosition()[0] +
        arg -
        Math.floor(screen.getPrimaryDisplay().size.width / 12),
      controller.getPosition()[1] + controller.getSize()[1] + 10
    )
  );
  ipcMain.on("colSubmit", (e, arg) => {
    controller.webContents.send("colSubmit", arg);
  });

  ipcMain.on("drawPolygon", () => {
    for (j in boards) { boards[j].webContents.send("drawPolygon"); }
  });
  ipcMain.on("drawLine", () => {
    for (j in boards) { boards[j].webContents.send("drawLine"); }
  });
  ipcMain.on("drawSquare", () => {
    for (j in boards) { boards[j].webContents.send("drawSquare"); }
  });
  ipcMain.on("drawCircle", () => {
    for (j in boards) { boards[j].webContents.send("drawCircle"); }
  });
  ipcMain.on("drawTriangle", () => {
    for (j in boards) { boards[j].webContents.send("drawTriangle"); }
  });

  ipcMain.on("drawTick", () => {
    for (j in boards) { boards[j].webContents.send("drawTick"); }
  });
  ipcMain.on("drawCross", () => {
    for (j in boards) { boards[j].webContents.send("drawCross"); }
  });
  ipcMain.on("drawStar", () => {
    for (j in boards) { boards[j].webContents.send("drawStar"); }
  });
  ipcMain.on("drawFreehand", () => {
    for (j in boards) { boards[j].webContents.send("drawFreehand"); }
  });

  ipcMain.on("dragMode", () => {
    for (j in boards) {
      boards[j].webContents.send("setMode", "drag");
      boards[j].webContents.send("dragMode");
    }
  });

  ipcMain.on("hideBoard", () => {
    for (j in boards) { boards[j].hide(); }
    controller.setAlwaysOnTop(true, "screen");
  });
  ipcMain.on("showBoard", () => {
    for (j in boards) { boards[j].show(); }
    controller.hide();
    controller.show();
  });

  ipcMain.on("minimizeWin", () => {
    for (j in boards) { boards[j].show(); }
    controller.hide();
    controller.show();
    boards[0].minimize();
  });
  ipcMain.on("closeWin", () => {
    boards[0].close();
  });

  ipcMain.on("bgSelect", (e, arg) =>
    openBackgroundDialog(
      controller.getPosition()[0] +
        arg -
        Math.floor(screen.getPrimaryDisplay().size.width / 12),
      controller.getPosition()[1] + controller.getSize()[1] + 10
    )
  );
  ipcMain.on("bgUpdate", (e, arg) =>
    controller.webContents.send("bgUpdate", arg)
  );
  ipcMain.on("bgSubmit", (e, arg) => {
    for (j in boards) {
      boards[j].webContents.send("bgSelect", arg); 
      boards[j].focus();
    }
  });

  ipcMain.on("clearBoard", () => { for (j in boards) { boards[j].webContents.send("clearBoard") }});

  ipcMain.on("laserCursor", () => {
    for (j in boards) {
      boards[j].webContents.send("setMode", "laser");
      boards[j].webContents.send("laserCursor");
    }
  });

  ipcMain.on("undo", () => { for (j in boards) { boards[j].webContents.send("undo") }});
  ipcMain.on("redo", () => { for (j in boards) { boards[j].webContents.send("redo") }});

  ipcMain.on("screenshot", () => {
    let d = new Date();
    let screenshotPath = path.join(app.getPath("pictures"), "Pensela");
    if (!fs.existsSync(screenshotPath)) {
      fs.mkdirSync(screenshotPath, { recursive: true });
    }
    screenshot.listDisplays().then((displays) => {
      for (i in displays) {
        screenshot({ 
          screen: displays[i].id,
          filename: path.join(screenshotPath, "Screenshot ") +
            ("0" + d.getDate()).slice(-2) +
            "-" +
            ("0" + (d.getMonth() + 1)).slice(-2) +
            "-" +
            d.getFullYear() +
            " " +
            d.getHours() +
            "-" +
            d.getMinutes() +
            "-" +
            d.getSeconds() + 
            "-" +
            "Display" + 
            i +
            ".png"
        })
      }
    })
    for (j in boards) { boards[j].webContents.send("screenshot"); }
  });

  ipcMain.on("strokeIncrease", () => { for (j in boards) { boards[j].webContents.send("strokeIncrease") }});
  ipcMain.on("strokeDecrease", () => { for (j in boards) { boards[j].webContents.send("strokeDecrease") }});

  ipcMain.on("arrowSingle", () => { for (j in boards) { boards[j].webContents.send("arrowSingle") }});
  ipcMain.on("arrowDouble", () => { for (j in boards) { boards[j].webContents.send("arrowDouble") }});

  ipcMain.on("highlighter", () => { for (j in boards) { boards[j].webContents.send("highlighter") }});

  if (os.platform() == "win32") {
    setTimeout(() => {
      for (j in boards) {
        boards[j].minimize();
        boards[j].restore();
        boards[j].hide();
        boards[j].show();
      }
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
