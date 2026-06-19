const canvas = document.getElementById("canvas");

// Internal drawing buffer (logical resolution)
const INTERNAL_WIDTH = 256;
const INTERNAL_HEIGHT = 433; // matches aspect ratio of 375x634 when scaled

canvas.width = INTERNAL_WIDTH;
canvas.height = INTERNAL_HEIGHT;
canvas.style.width = '375px';
canvas.style.height = '634px';

const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

const Color = Object.freeze({
  RED_BROWN: "#a16600",
  BEIGE: "#ede791",
  ORANGE_RED: "#c04900",
  GREEN: "#00df00",
  BLUE: "#5000ff",
})

const CastleFillColor = Object.freeze({
  ORANGE: "#ff7754",
  BLUE: "#0057fd",
  RED: "#bf3e0b",
  WHITE: "#fffeff",
  BLACK: "#000000",
});

const CastleLineColor = Object.freeze({
  WHITE: "#fffeff",
  GRAY: "#9381a8",
  BLUE: "#5000ff",
})

const CommandCursorColor = "#0056ff";

// Draw background and a sample green area at logical coordinates
ctx.fillStyle = Color.BLACK;
ctx.fillRect(0, 0, INTERNAL_WIDTH, INTERNAL_HEIGHT);
ctx.fillStyle = Color.GREEN;
ctx.fillRect(0, 0, 256, 224);
