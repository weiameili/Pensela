const { ipcRenderer } = require("electron");
const jQuery = require("jquery");
const $ = jQuery;
let colors = ["ffb4bd", "b3fdd7", "ff2b9", "000"];

$(".tool-item.text").on("click", (e) => {
  $(".selected").toggleClass("selected");
  $(e.target).toggleClass("selected");
  ipcRenderer.send("resetBoard");
  ipcRenderer.send("textMode");
  ipcRenderer.send("setMode", "draw");
});

$(".tool-item.secondary.color:not(.custom):not(.transparent)").on(
  "click",
  (e) => {
    $(".color.tool-item.main").removeClass("transparent");
    $(":root").css("--colSelect", "#" + e.target.getAttribute("colorData"));
    $(".tool-item.color.main").attr(
      "colorData",
      e.target.getAttribute("colorData")
    );
    ipcRenderer.send("colSelect", e.target.getAttribute("colorData"));
  }
);

$(".tool-item.secondary.transparent.color").on("click", (e) => {
  $(".color.tool-item.main").addClass("transparent");
  $(".tool-item.color.main").attr(
    "colorData",
    e.target.getAttribute("colorData")
  );
  ipcRenderer.send("colSelectFill", e.target.getAttribute("colorData"));
});

$(".tool-item.color.custom").on("click", () => {
  ipcRenderer.send("customColor");
});

ipcRenderer.on("colSubmit", (e, arg) => {
  colors = [arg].concat(colors).slice(0, 5);
  $(".color.tool-item.main").removeClass("transparent");
  $(":root").css("--colSelect", "#" + arg);
  $(".tool-item.color.main").attr("colorData", arg);
  let elems = $(".tool-item.secondary.color:not(.custom):not(.transparent)");
  for (let i = 0; i < elems.length; i++) {
    $(elems[i]).attr("colorData", colors[i]);
    $(elems[i]).css("background", "#" + colors[i]);
  }
});

$(".tool-item.shapes").on("click", (e) => {
  ipcRenderer.send("resetBoard");
  ipcRenderer.send("setMode", "draw");
  $(".tool-item.shapes.main").toggleClass("main");
  $(e.target).toggleClass("main");
  $(".selected").toggleClass("selected");
  $(e.target).toggleClass("selected");
});

$(".tool-item.polygon").on("click", () => {
  ipcRenderer.send("drawPolygon");
});
$(".tool-item.line").on("click", () => {
  ipcRenderer.send("drawLine");
});
$(".tool-item.square").on("click", () => {
  ipcRenderer.send("drawSquare");
});
$(".tool-item.circle").on("click", () => {
  ipcRenderer.send("drawCircle");
});
$(".tool-item.triangle").on("click", () => {
  ipcRenderer.send("drawTriangle");
});

$(".tool-item.sticker:not(.eraser):not(.clear)").on("click", (e) => {
  ipcRenderer.send("resetBoard");
  ipcRenderer.send("setMode", "draw");
  $(".tool-item.sticker.main").toggleClass("main");
  $(e.target).toggleClass("main");
  $(".selected").toggleClass("selected");
  $(e.target).toggleClass("selected");
});
$(".tool-item.eraser").on("click", (e) => {
  ipcRenderer.send("resetBoard");
  ipcRenderer.send("setMode", "eraser");
  ipcRenderer.send("eraserMode");
  $(".tool-item.sticker.main").toggleClass("main");
  $(e.target).toggleClass("main");
  $(".selected").toggleClass("selected");
  $(e.target).toggleClass("selected");
});

$(".tool-item.tick").on("click", () => {
  ipcRenderer.send("drawTick");
});
$(".tool-item.cross").on("click", () => {
  ipcRenderer.send("drawCross");
});
$(".tool-item.star").on("click", () => {
  ipcRenderer.send("drawStar");
});
$(".tool-item.pen").on("click", () => {
  ipcRenderer.send("drawFreehand");
});

$(".tool-item.mouse, .tool-item.drag, .tool-item.laser").on("click", (e) => {
  ipcRenderer.send("resetBoard");
  $(".tool-item.win-controls.main").toggleClass("main");
  $(e.target).toggleClass("main");
  $(".selected").toggleClass("selected");
  $(e.target).toggleClass("selected");
});

$(".tool-item.mouse").on("click", () => {
  ipcRenderer.send("setMode", "mouse");
});
$(".tool-item.drag").on("click", () => {
  ipcRenderer.send("dragMode");
});

$(".tool-item.visibility").on("click", (e) => {
  ipcRenderer.send($(e.target).hasClass("visible") ? "hideBoard" : "showBoard");
  $(e.target).toggleClass("visible");
  $(e.target).toggleClass("invisible");
});

$(".tool-item.exit").on("click", () => {
  ipcRenderer.send("closeWin");
});
$(".tool-item.minimize").on("click", () => {
  ipcRenderer.send("minimizeWin");
});

$(".tool-item.bg").on("click", () => {
  ipcRenderer.send("bgSelect")
})
ipcRenderer.on("bgUpdate", (e, arg) => {
  $(".tool-item.bg").css("background", arg )
  $(".tool-item.bg").css("background-size", "400% 400%")
})