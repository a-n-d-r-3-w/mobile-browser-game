const rootElement = document.documentElement;
const canvasElement = document.getElementById("canvas");

const CANVAS_RENDERED_WIDTH_PX = 375;
const CANVAS_RENDERED_HEIGHT_PX = 634;
rootElement.style.setProperty('--canvas-width', `${CANVAS_RENDERED_WIDTH_PX}px`);
rootElement.style.setProperty('--canvas-height', `${CANVAS_RENDERED_HEIGHT_PX}px`);

// Internal drawing buffer (logical resolution)
const CANVAS_BUFFER_WIDTH_PX = 256;
const CANVAS_BUFFER_HEIGHT_PX = CANVAS_RENDERED_HEIGHT_PX * (CANVAS_BUFFER_WIDTH_PX / CANVAS_RENDERED_WIDTH_PX); // Match aspect ratio of rendered size.


canvasElement.width = CANVAS_BUFFER_WIDTH_PX;
canvasElement.height = CANVAS_BUFFER_HEIGHT_PX;

const canvasContext = canvasElement.getContext("2d");
canvasContext.imageSmoothingEnabled = false;

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
canvasContext.fillStyle = "#ffffff"; // white
canvasContext.fillRect(0, 0, CANVAS_BUFFER_WIDTH_PX, CANVAS_BUFFER_HEIGHT_PX);

const controllerImageElement = new Image();
const backgroundImageElement = new Image();
const cursorImageElement = new Image();

// State for cursor position (in canvas logical pixels)
let cursorXPosPx = 0;
let cursorYPosPx = 0;

const buttonWidthPx = 26;
const buttonHeightPx = 26;
const leftButtonXPosPx = 19;
const leftButtonYPosPx = CANVAS_BUFFER_HEIGHT_PX - buttonHeightPx - 51;
const rightButtonXPosPx = 89;
const rightButtonYPosPx = leftButtonYPosPx;

function redrawScene() {
    // clear
    canvasContext.fillStyle = "#ffffff";
    canvasContext.fillRect(0, 0, CANVAS_BUFFER_WIDTH_PX, CANVAS_BUFFER_HEIGHT_PX);

    // compute positions
    const controllerYPosPx = CANVAS_BUFFER_HEIGHT_PX - controllerImageElement.height;
    const backgroundXPosPx = 0;
    const backgroundYPosPx = CANVAS_BUFFER_HEIGHT_PX - controllerImageElement.height - backgroundImageElement.height;

    // draw background, cursor, controller in order
    canvasContext.drawImage(backgroundImageElement, backgroundXPosPx, backgroundYPosPx);
    if (cursorImageElement.complete && cursorImageElement.naturalWidth) {
        canvasContext.drawImage(cursorImageElement, cursorXPosPx, cursorYPosPx);
    }
    canvasContext.drawImage(controllerImageElement, 0, controllerYPosPx);

    // draw semi-transparent rectangle for the clickable button areas on top
    canvasContext.save();
    canvasContext.fillStyle = 'rgba(0, 255, 115, 0.25)';
    canvasContext.fillRect(leftButtonXPosPx, leftButtonYPosPx, buttonWidthPx, buttonHeightPx);
    canvasContext.restore();

    canvasContext.save();
    canvasContext.fillStyle = 'rgba(0, 255, 115, 0.25)';
    canvasContext.fillRect(rightButtonXPosPx, rightButtonYPosPx, buttonWidthPx, buttonHeightPx);
    canvasContext.restore();
}

// Load images; when all required images are available, initialize cursor and handlers
let loadedImageCount = 0;
const cursorMoveDistancePx = 2;
function checkInit() {
    loadedImageCount++;
    if (loadedImageCount === 3) {
        // center cursor over background by default
        const backgroundXPosPx = 0;
        const backgroundYPosPx = CANVAS_BUFFER_HEIGHT_PX - controllerImageElement.height - backgroundImageElement.height;
        cursorXPosPx = backgroundXPosPx + Math.floor((backgroundImageElement.width - cursorImageElement.width) / 2);
        cursorYPosPx = backgroundYPosPx + Math.floor((backgroundImageElement.height - cursorImageElement.height) / 2);
        redrawScene();

        let holdDelayTimeoutId = null;
        let holdRepeatIntervalId = null;
        let activePointerId = null;

        const clearHold = () => {
            if (holdDelayTimeoutId !== null) {
                clearTimeout(holdDelayTimeoutId);
                holdDelayTimeoutId = null;
            }
            if (holdRepeatIntervalId !== null) {
                clearInterval(holdRepeatIntervalId);
                holdRepeatIntervalId = null;
            }
            activePointerId = null;
        };

        const moveCursorLeft = () => {
            cursorXPosPx = Math.max(0, cursorXPosPx - cursorMoveDistancePx);
            redrawScene();
        };

        const moveCursorRight = () => {
            cursorXPosPx = Math.min(CANVAS_BUFFER_WIDTH_PX - cursorImageElement.width, cursorXPosPx + cursorMoveDistancePx);
            redrawScene();
        };

        canvasElement.addEventListener('pointerdown', (ev) => {
            const canvasBoundingRect = canvasElement.getBoundingClientRect();
            const canvasScaleX = canvasElement.width / canvasBoundingRect.width;
            const canvasScaleY = canvasElement.height / canvasBoundingRect.height;
            const pointerXPosPx = (ev.clientX - canvasBoundingRect.left) * canvasScaleX;
            const pointerYPosPx = (ev.clientY - canvasBoundingRect.top) * canvasScaleY;

            if (pointerXPosPx >= leftButtonXPosPx && pointerXPosPx < leftButtonXPosPx + buttonWidthPx && pointerYPosPx >= leftButtonYPosPx && pointerYPosPx < leftButtonYPosPx + buttonHeightPx) {
                activePointerId = ev.pointerId;
                moveCursorLeft();
                holdDelayTimeoutId = setTimeout(() => {
                    holdRepeatIntervalId = setInterval(moveCursorLeft, 50);
                }, 500);
            } else if (pointerXPosPx >= rightButtonXPosPx && pointerXPosPx < rightButtonXPosPx + buttonWidthPx && pointerYPosPx >= rightButtonYPosPx && pointerYPosPx < rightButtonYPosPx + buttonHeightPx) {
                activePointerId = ev.pointerId;
                moveCursorRight();
                holdDelayTimeoutId = setTimeout(() => {
                    holdRepeatIntervalId = setInterval(moveCursorRight, 50);
                }, 500);
            }
        });

        canvasElement.addEventListener('pointerup', (ev) => {
            if (ev.pointerId === activePointerId) {
                clearHold();
            }
        });

        canvasElement.addEventListener('pointercancel', (ev) => {
            if (ev.pointerId === activePointerId) {
                clearHold();
            }
        });

        canvasElement.addEventListener('pointerleave', (ev) => {
            if (ev.pointerId === activePointerId) {
                clearHold();
            }
        });
    }
}

controllerImageElement.onload = checkInit;
controllerImageElement.src = 'controller.png';
backgroundImageElement.onload = checkInit;
backgroundImageElement.src = 'background.png';
cursorImageElement.onload = checkInit;
cursorImageElement.src = 'blue-cursor.png';

