const Konva = require("konva");

const stage = new Konva.Stage({
  container: "container",
  width: window.innerWidth,
  height: window.innerHeight,
});

const container = stage.container();
container.tabIndex = 1;
container.focus();
const layer = new Konva.Layer();

let masterBoard = new Konva.Rect({
  x: 0,
  y: 0,
  width: window.innerWidth,
  height: window.innerHeight,
  fill: boardState.bg,
  stroke: "#ffffff",
  strokeWidth: 0,
});
layer.add(masterBoard);
stage.add(layer);

let x = 0,
  y = 0,
  c = null,
  inDraw = false;

stage.on("click touchstart", () => {
  x = stage.getPointerPosition().x;
  y = stage.getPointerPosition().y;
});

stage.on("mousemove touchmove", () => {
  x = stage.getPointerPosition().x;
  y = stage.getPointerPosition().y;
});

const f1 = (e) => {
  boardState.after = [];
  boardState.before.push(layer.children.slice(1, layer.children.length));
  c = layer.children[layer.children.length - 1];
  layer.children[layer.children.length - 1].remove();
  if (e.key.length == 1) {
    c = new Konva.Text({
      x: c.attrs.x,
      y: c.attrs.y,
      text: c.attrs.text + e.key,
      fontSize: 30,
      fontFamily: "Calibri",
      fill: c.attrs.fill,
    });
  } else if (e.key == "Enter") {
    c = new Konva.Text({
      x: c.attrs.x,
      y: c.attrs.y,
      text: c.attrs.text + "\n",
      fontSize: 30,
      fontFamily: "Calibri",
      fill: c.attrs.fill,
    });
  } else if (e.key == "Backspace") {
    c = new Konva.Text({
      x: c.attrs.x,
      y: c.attrs.y,
      text: c.attrs.text.slice(0, -1),
      fontSize: 30,
      fontFamily: "Calibri",
      fill: c.attrs.fill,
    });
  }
  layer.add(c);
  stage.add(layer);
};

const f2 = (e, a) => {
  if (e.key == "Enter") {
    inDraw = false;
    a.stop();
  }
};

ipcRenderer.on("drawSquare", () => {
  masterBoard.attrs.fill =
    boardState.bg.length < 8 ? boardState.bg : "#00000001";
  layer.add(masterBoard);
  stage.add(layer);
  stage.container().style.cursor = "crosshair";

  let anim = new Konva.Animation((f) => {
    c.attrs.width = x - c.attrs.x;
    c.attrs.height = y - c.attrs.y;
  }, layer);
  stage.on("mousedown touchstart", () => {
    c = new Konva.Rect({
      x: x,
      y: y,
      width: 0,
      height: 0,
      fill: boardState.col,
      stroke: boardState.strokeCol,
      strokeWidth: 5,
    });
    c.on("click tap", (e) => {
      if (boardState.mode == "eraser") {
        boardState.after = [];
        boardState.before.push(layer.children.slice(1, layer.children.length));
        e.target.remove();
        stage.add(layer);
      }
    });
    boardState.after = [];
    boardState.before.push(layer.children.slice(1, layer.children.length));
    layer.add(c);
    stage.add(layer);
    anim.start();
  });
  stage.on("mouseup touchend", () => {
    anim.stop();
  });
});

ipcRenderer.on("drawCircle", () => {
  masterBoard.attrs.fill =
    boardState.bg.length < 8 ? boardState.bg : "#00000001";
  layer.add(masterBoard);
  stage.add(layer);
  stage.container().style.cursor = "crosshair";

  let anim = new Konva.Animation((f) => {
    c.attrs.radiusX = Math.abs(x - c.attrs.x);
    c.attrs.radiusY = Math.abs(y - c.attrs.y);
  }, layer);
  stage.on("mousedown touchstart", () => {
    c = new Konva.Ellipse({
      x: x,
      y: y,
      radiusX: 0,
      radiusY: 0,
      fill: boardState.col,
      stroke: boardState.strokeCol,
      strokeWidth: 5,
    });
    c.on("click tap", (e) => {
      if (boardState.mode == "eraser") {
        boardState.after = [];
        boardState.before.push(layer.children.slice(1, layer.children.length));
        e.target.remove();
        stage.add(layer);
      }
    });
    boardState.after = [];
    boardState.before.push(layer.children.slice(1, layer.children.length));
    layer.add(c);
    stage.add(layer);
    anim.start();
  });
  stage.on("mouseup touchend", () => {
    anim.stop();
  });
});

ipcRenderer.on("drawLine", () => {
  masterBoard.attrs.fill =
    boardState.bg.length < 8 ? boardState.bg : "#00000001";
  layer.add(masterBoard);
  stage.add(layer);
  stage.container().style.cursor = "crosshair";

  let anim = new Konva.Animation((f) => {
    c.attrs.points[2] = x;
    c.attrs.points[3] = y;
  }, layer);
  stage.on("mousedown touchstart", () => {
    c = new Konva.Line({
      points: [x, y, x, y],
      stroke: boardState.strokeCol,
      strokeWidth: 4,
      hitStrokeWidth: 10,
    });
    c.on("click tap", (e) => {
      if (boardState.mode == "eraser") {
        boardState.after = [];
        boardState.before.push(layer.children.slice(1, layer.children.length));
        e.target.remove();
        stage.add(layer);
      }
    });
    boardState.after = [];
    boardState.before.push(layer.children.slice(1, layer.children.length));
    layer.add(c);
    stage.add(layer);
    anim.start();
  });
  stage.on("mouseup touchend", () => {
    anim.stop();
  });
});

ipcRenderer.on("drawTriangle", () => {
  masterBoard.attrs.fill =
    boardState.bg.length < 8 ? boardState.bg : "#00000001";
  layer.add(masterBoard);
  stage.add(layer);
  stage.container().style.cursor = "crosshair";

  let anim = new Konva.Animation((f) => {
    let ox = c.attrs.ox;
    let oy = c.attrs.oy;
    c.attrs.points = [ox + (x - ox) / 2, oy, ox, y, x, y];
  }, layer);
  stage.on("mousedown touchstart", () => {
    c = new Konva.Line({
      ox: x,
      oy: y,
      points: [x, y, x, y, x, y],
      fill: boardState.col,
      closed: true,
      stroke: boardState.strokeCol,
      strokeWidth: 5,
    });
    c.on("click tap", (e) => {
      if (boardState.mode == "eraser") {
        boardState.after = [];
        boardState.before.push(layer.children.slice(1, layer.children.length));
        e.target.remove();
        stage.add(layer);
      }
    });
    boardState.after = [];
    boardState.before.push(layer.children.slice(1, layer.children.length));
    layer.add(c);
    stage.add(layer);
    anim.start();
  });
  stage.on("mouseup touchend", () => {
    anim.stop();
  });
});

ipcRenderer.on("drawPolygon", () => {
  masterBoard.attrs.fill =
    boardState.bg.length < 8 ? boardState.bg : "#00000001";
  layer.add(masterBoard);
  stage.add(layer);
  stage.container().style.cursor = "crosshair";

  let anim = new Konva.Animation((f) => {
    let len = c.attrs.points.length;
    c.attrs.points[len - 1] = y;
    c.attrs.points[len - 2] = x;
  }, layer);

  stage.on("click tap", () => {
    if (inDraw) {
      if (
        Math.abs(c.attrs.points[0] - x) < 10 &&
        Math.abs(c.attrs.points[1] - y) < 10
      ) {
        anim.stop();
        inDraw = false;
      } else {
        c.attrs.points.push(x);
        c.attrs.points.push(y);
      }
    } else {
      c = new Konva.Line({
        points: [x, y, x, y],
        fill: boardState.col,
        stroke: boardState.col,
        strokeWidth: 4,
        closed: true,
        stroke: boardState.strokeCol,
        strokeWidth: 5,
      });
      c.on("finish", () => {
        anim.stop();
        inDraw = false;
      });
      c.on("click tap", (e) => {
        if (boardState.mode == "eraser") {
          boardState.after = [];
          boardState.before.push(
            layer.children.slice(1, layer.children.length)
          );
          e.target.remove();
          stage.add(layer);
        }
      });
      boardState.after = [];
      boardState.before.push(layer.children.slice(1, layer.children.length));
      layer.add(c);
      stage.add(layer);
      anim.start();
      inDraw = true;
    }
  });
  container.addEventListener("keydown", (e) => {
    f2(e, anim);
  });
});

ipcRenderer.on("drawCross", () => {
  masterBoard.attrs.fill =
    boardState.bg.length < 8 ? boardState.bg : "#00000001";
  layer.add(masterBoard);
  stage.add(layer);
  stage.container().style.cursor = "crosshair";

  stage.on("click tap", () => {
    let l1 = 24,
      l2 = 14,
      l3 = 7;
    c = new Konva.Line({
      points: [
        x,
        y - l2,
        x + l1 - l3,
        y - l1 - l3,
        x + l1 + l3,
        y - l1 + l3,
        x + l2,
        y,
        x + l1 + l3,
        y + l1 - l3,
        x + l1 - l3,
        y + l1 + l3,
        x,
        y + l2,
        x - l1 + l3,
        y + l1 + l3,
        x - l1 - l3,
        y + l1 - l3,
        x - l2,
        y,
        x - l1 - l3,
        y - l1 + l3,
        x - l1 + l3,
        y - l1 - l3,
      ],
      fill: boardState.col,
      closed: true,
      stroke: boardState.strokeCol,
      strokeWidth: 5,
    });
    c.on("click tap", (e) => {
      if (boardState.mode == "eraser") {
        boardState.after = [];
        boardState.before.push(layer.children.slice(1, layer.children.length));
        e.target.remove();
        stage.add(layer);
      }
    });
    boardState.after = [];
    boardState.before.push(layer.children.slice(1, layer.children.length));
    layer.add(c);
    stage.add(layer);
  });
});

ipcRenderer.on("drawStar", () => {
  masterBoard.attrs.fill =
    boardState.bg.length < 8 ? boardState.bg : "#00000001";
  layer.add(masterBoard);
  stage.add(layer);
  stage.container().style.cursor = "crosshair";

  stage.on("click tap", () => {
    let r = 32,
      r2 = 16,
      sin = Math.sin,
      cos = Math.cos,
      pi = Math.PI;
    c = new Konva.Line({
      points: [
        x,
        y - r,
        x + r2 * cos((3 * pi) / 10),
        y - r2 * sin((54 * pi) / 180),
        x + r * cos((18 * pi) / 180),
        y - r * sin((18 * pi) / 180),
        x + r2 * cos((-18 * pi) / 180),
        y - r2 * sin((-18 * pi) / 180),
        x + r * cos((-54 * pi) / 180),
        y - r * sin((-54 * pi) / 180),
        x,
        y + r2,
        x + r * cos((-126 * pi) / 180),
        y - r * sin((-126 * pi) / 180),
        x + r2 * cos((-162 * pi) / 180),
        y - r2 * sin((-162 * pi) / 180),
        x + r * cos((-198 * pi) / 180),
        y - r * sin((-198 * pi) / 180),
        x + r2 * cos((-234 * pi) / 180),
        y - r2 * sin((-234 * pi) / 180),
      ],
      fill: boardState.col,
      closed: true,
      stroke: boardState.strokeCol,
      strokeWidth: 5,
    });
    c.on("click tap", (e) => {
      if (boardState.mode == "eraser") {
        boardState.after = [];
        boardState.before.push(layer.children.slice(1, layer.children.length));
        e.target.remove();
        stage.add(layer);
      }
    });
    boardState.after = [];
    boardState.before.push(layer.children.slice(1, layer.children.length));
    layer.add(c);
    stage.add(layer);
  });
});

ipcRenderer.on("drawTick", () => {
  masterBoard.attrs.fill =
    boardState.bg.length < 8 ? boardState.bg : "#00000001";
  layer.add(masterBoard);
  stage.add(layer);
  stage.container().style.cursor = "crosshair";

  stage.on("click tap", () => {
    let l = 12;
    c = new Konva.Line({
      points: [
        x - l,
        y - l * 2,
        x,
        y - l,
        x + l,
        y - l * 2,
        x + l * 2,
        y - l * 3,
        x + l * 3,
        y - l * 2,
        x,
        y + l,
        x - l * 2,
        y - l,
      ],
      fill: boardState.col,
      closed: true,
      stroke: boardState.strokeCol,
      strokeWidth: 5,
    });
    c.on("click tap", (e) => {
      if (boardState.mode == "eraser") {
        boardState.after = [];
        boardState.before.push(layer.children.slice(1, layer.children.length));
        e.target.remove();
        stage.add(layer);
      }
    });
    boardState.after = [];
    boardState.before.push(layer.children.slice(1, layer.children.length));
    layer.add(c);
    stage.add(layer);
  });
});

ipcRenderer.on("drawFreehand", () => {
  masterBoard.attrs.fill =
    boardState.bg.length < 8 ? boardState.bg : "#00000001";
  layer.add(masterBoard);
  stage.add(layer);
  stage.container().style.cursor = "crosshair";

  let anim = new Konva.Animation((f) => {
    c.attrs.points = c.attrs.points.concat([x, y]);
  }, layer);
  stage.on("mousedown touchstart", () => {
    c = new Konva.Line({
      points: [x, y],
      stroke: boardState.strokeCol,
      strokeWidth: 10,
      lineJoin: "round",
      lineCap: "round",
    });
    c.on("click tap", (e) => {
      if (boardState.mode == "eraser") {
        boardState.after = [];
        boardState.before.push(layer.children.slice(1, layer.children.length));
        e.target.remove();
        stage.add(layer);
      }
    });
    boardState.after = [];
    boardState.before.push(layer.children.slice(1, layer.children.length));
    layer.add(c);
    stage.add(layer);
    anim.start();
  });
  stage.on("mouseup touchend", () => {
    anim.stop();
  });
});

ipcRenderer.on("textMode", () => {
  masterBoard.attrs.fill =
    boardState.bg.length < 8 ? boardState.bg : "#00000001";
  layer.add(masterBoard);
  stage.add(layer);
  stage.container().style.cursor = "text";

  stage.on("click tap", () => {
    c = new Konva.Text({
      x: x,
      y: y,
      text: "",
      fontSize: 30,
      fontFamily: "Calibri",
      fill: boardState.strokeCol,
    });
    c.on("click tap", (e) => {
      if (boardState.mode == "eraser") {
        boardState.after = [];
        boardState.before.push(layer.children.slice(1, layer.children.length));
        e.target.remove();
        stage.add(layer);
      }
    });
    boardState.after = [];
    boardState.before.push(layer.children.slice(1, layer.children.length));
    layer.add(c);
    stage.add(layer);
  });

  container.addEventListener("keydown", f1);
});

ipcRenderer.on("dragMode", () => {
  masterBoard.attrs.fill =
    boardState.bg.length < 8 ? boardState.bg : "#00000001";
  layer.add(masterBoard);
  stage.add(layer);
  stage.container().style.cursor = "move";
  for (i = 1; i < layer.children.length; i++) {
    layer.children[i].draggable(true);
  }
  stage.add(layer);
});

ipcRenderer.on("eraserMode", () => {
  stage.container().style.cursor = "crosshair";
  masterBoard.attrs.fill =
    boardState.bg.length < 8 ? boardState.bg : "#00000001";
  layer.add(masterBoard);
  stage.add(layer);
});

ipcRenderer.on("resetBoard", () => {
  if (inDraw) {
    layer.children[layer.children.length - 1].fire("finish");
  }
  masterBoard.attrs.fill = boardState.bg;
  stage.container().style.cursor = "default";
  for (i = 1; i < layer.children.length; i++) {
    layer.children[i].draggable(false);
  }
  stage.off(
    "mouseup mousedown click touchstart touchend tap mousemove touchmove"
  );
  container.removeEventListener("keydown", f1);
  container.removeEventListener("keydown", f2);
  stage.on("click touchstart", () => {
    x = stage.getPointerPosition().x;
    y = stage.getPointerPosition().y;
  });
  stage.on("mousemove touchmove", () => {
    x = stage.getPointerPosition().x;
    y = stage.getPointerPosition().y;
  });
  layer.add(masterBoard);
  stage.add(layer);
});

ipcRenderer.on("bgSelect", (e, arg) => {
  boardState.bg = "#" + arg;
  masterBoard.attrs.fill = boardState.bg;
  layer.add(masterBoard);
  stage.add(layer);
});

ipcRenderer.on("clearBoard", () => {
  boardState.after = [];
  boardState.before.push(layer.children.slice(1, layer.children.length));
  for (let i = 1; i < layer.children.length; ) {
    layer.children[1].remove();
  }
  stage.add(layer);
});

ipcRenderer.on("laserCursor", () => {
  document.getElementById("container").style.cursor =
    'url("./assets/icons/laser-pointer.png") 2 2, pointer';
});

function stepBackward() {
  if (boardState.before.length > 0 && boardState.mode != "drag") {
    boardState.after.push(layer.children.slice(1, layer.children.length));
    layer.children = Konva.Collection.toCollection(
      layer.children.slice(0, 1).concat(boardState.before.pop())
    );
    stage.add(layer);
  }
}

function stepForward() {
  if (boardState.after.length > 0 && boardState.mode != "drag") {
    boardState.before.push(layer.children.slice(1, layer.children.length));
    layer.children = Konva.Collection.toCollection(
      layer.children.slice(0, 1).concat(boardState.after.pop())
    );
    stage.add(layer);
  }
}

ipcRenderer.on("undo", stepBackward);
ipcRenderer.on("redo", stepForward);
document.addEventListener("keydown", (e) => {
  if (e.ctrlKey == true) {
    if (e.key == "z") {
      stepBackward();
    }
    if (e.key == "y") {
      stepForward();
    }
  }
});

ipcRenderer.on("screenshot", () => {
  masterBoard.strokeWidth(10)
  layer.add(masterBoard);
  stage.add(layer);
  setTimeout(() => {
    masterBoard.strokeWidth(0)
    layer.add(masterBoard);
    stage.add(layer);
  }, 100);
});
