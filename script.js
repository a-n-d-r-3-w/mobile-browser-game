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
controllerImage.onload = () => {
  // Position at the bottom of the canvas, right below the background
  ctx.drawImage(controllerImage, 0, INTERNAL_HEIGHT - controllerImage.height);
};
controllerImage.src = 'controller.png';

const backgroundImage = new Image();
backgroundImage.onload = () => {
  // Position so bottom edge aligns with controller's top edge
  const bgX = 0;
  const bgY = INTERNAL_HEIGHT - controllerImage.height - backgroundImage.height;
  ctx.drawImage(backgroundImage, bgX, bgY);

  // Draw blue cursor centered over the background image
  const cursor = new Image();
  cursor.onload = () => {
    const cursorX = bgX + Math.floor((backgroundImage.width - cursor.width) / 2);
    const cursorY = bgY + Math.floor((backgroundImage.height - cursor.height) / 2);
    ctx.drawImage(cursor, cursorX, cursorY);
  };
  cursor.src = 'blue-cursor.png';
};
backgroundImage.src = 'background.png';

