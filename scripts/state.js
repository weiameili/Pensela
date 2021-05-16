const { ipcRenderer } = require("electron");

let boardState = {
  col: "#b4deff",
  strokeCol: "#b4deff",
  mode: "mouse",
  bg: "#00000000"
};

ipcRenderer.on("setMode", (e, arg) => {
  boardState.mode = arg;
});

ipcRenderer.on("colSelectFill", (e, arg) => {
  boardState.col = "#" + arg;
});

ipcRenderer.on("colSelectStroke", (e, arg) => {
  boardState.strokeCol = "#" + arg;
});
