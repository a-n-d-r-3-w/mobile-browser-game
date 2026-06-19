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

// Prevent pinch-to-zoom / multi-touch browser gestures on mobile
window.addEventListener('touchmove', event => {
  if (event.touches.length > 1) {
    event.preventDefault();
  }
}, { passive: false });

document.addEventListener('gesturestart', event => event.preventDefault());
document.addEventListener('gesturechange', event => event.preventDefault());
document.addEventListener('gestureend', event => event.preventDefault());

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

// Draw a base background color before the images load.
ctx.fillStyle = "#ffffff"; // white
ctx.fillRect(0, 0, INTERNAL_WIDTH, INTERNAL_HEIGHT);

const controllerImage = new Image();
const backgroundImage = new Image();
const cursorImage = new Image();

// State for cursor position (in canvas logical pixels)
let cursorX = 0;
let cursorY = 0;

function redrawScene() {
  // clear
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, INTERNAL_WIDTH, INTERNAL_HEIGHT);

  // compute positions
  const controllerY = INTERNAL_HEIGHT - controllerImage.height;
  const bgX = 0;
  const bgY = INTERNAL_HEIGHT - controllerImage.height - backgroundImage.height;
  const squareW = 26;
  const squareH = 26;
  const squareX = 19;
  const squareY = INTERNAL_HEIGHT - squareH - 51;

  // draw background, cursor, controller in order
  ctx.drawImage(backgroundImage, bgX, bgY);
  if (cursorImage.complete && cursorImage.naturalWidth) {
    ctx.drawImage(cursorImage, cursorX, cursorY);
  }
  ctx.drawImage(controllerImage, 0, controllerY);

  // draw semi-transparent rectangle for the clickable 26x26 area on top
  ctx.save();
  ctx.fillStyle = 'rgba(0, 255, 115, 0.25)';
  ctx.fillRect(squareX, squareY, squareW, squareH);
  ctx.restore();
}

// Load images; when all required images are available, initialize cursor and handlers
let imagesLoaded = 0;
function checkInit() {
  imagesLoaded++;
  if (imagesLoaded === 3) {
    // center cursor over background by default
    const bgX = 0;
    const bgY = INTERNAL_HEIGHT - controllerImage.height - backgroundImage.height;
    cursorX = bgX + Math.floor((backgroundImage.width - cursorImage.width) / 2);
    cursorY = bgY + Math.floor((backgroundImage.height - cursorImage.height) / 2);
    redrawScene();

    // pointer handling: move cursor left 1px when clicking the 26x26 bottom-left square
    canvas.addEventListener('pointerdown', (ev) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const x = (ev.clientX - rect.left) * scaleX;
      const y = (ev.clientY - rect.top) * scaleY;

      const squareW = 26;
      const squareH = 26;
      const squareX = 19; // moved right by 19px
      const squareY = INTERNAL_HEIGHT - squareH - 51; // moved up by 51px

      if (x >= squareX && x < squareX + squareW && y >= squareY && y < squareY + squareH) {
        // move cursor left one pixel, clamp to 0
        cursorX = Math.max(0, cursorX - 1);
        redrawScene();
      }
    });
  }
}

controllerImage.onload = checkInit;
controllerImage.src = 'controller.png';
backgroundImage.onload = checkInit;
backgroundImage.src = 'background.png';
cursorImage.onload = checkInit;
cursorImage.src = 'blue-cursor.png';

