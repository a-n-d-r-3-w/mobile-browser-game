const rootElement = document.documentElement;
const canvasElement = document.getElementById("canvas");

// Set canvas rendered size.
const CANVAS_RENDERED_WIDTH_PX = 375;
const CANVAS_RENDERED_HEIGHT_PX = 634;
rootElement.style.setProperty('--canvas-width', `${CANVAS_RENDERED_WIDTH_PX}px`);
rootElement.style.setProperty('--canvas-height', `${CANVAS_RENDERED_HEIGHT_PX}px`);

// Set canvas drawing buffer size.
const CANVAS_DRAWING_BUFFER_WIDTH_PX = 256;
const CANVAS_DRAWING_BUFFER_HEIGHT_PX = CANVAS_RENDERED_HEIGHT_PX * (CANVAS_DRAWING_BUFFER_WIDTH_PX / CANVAS_RENDERED_WIDTH_PX); // Match aspect ratio of rendered size.
canvasElement.width = CANVAS_DRAWING_BUFFER_WIDTH_PX;
canvasElement.height = CANVAS_DRAWING_BUFFER_HEIGHT_PX;

const canvasContext = canvasElement.getContext("2d");
canvasContext.imageSmoothingEnabled = false;

// Prevent pinch-to-zoom and multi-touch browser gestures.
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
canvasContext.fillRect(0, 0, CANVAS_DRAWING_BUFFER_WIDTH_PX, CANVAS_DRAWING_BUFFER_HEIGHT_PX);

const backgroundImageElement = new Image();
const controllerImageElement = new Image();
const cursorImageElement = new Image();

let cursorXPosPx = 0;
let cursorYPosPx = 0;

const DIRECTIONAL_BUTTON_SIZE_PX = 26;
const leftButtonXPosPx = 19;
const leftButtonYPosPx = 356;
const rightButtonXPosPx = 89;
const rightButtonYPosPx = 356;
const topButtonXPosPx = 53;
const topButtonYPosPx = 321;
const bottomButtonXPosPx = 53;
const bottomButtonYPosPx = 391;

function render() {
    // Draw background.
    const backgroundXPosPx = 0;
    const backgroundYPosPx = CANVAS_DRAWING_BUFFER_HEIGHT_PX - controllerImageElement.height - backgroundImageElement.height;
    canvasContext.drawImage(backgroundImageElement, backgroundXPosPx, backgroundYPosPx);

    // Draw controller.
    const controllerYPosPx = CANVAS_DRAWING_BUFFER_HEIGHT_PX - controllerImageElement.height;
    canvasContext.drawImage(controllerImageElement, 0, controllerYPosPx);

    // Draw cursor.
    canvasContext.drawImage(cursorImageElement, cursorXPosPx, cursorYPosPx);

    // draw semi-transparent rectangle for the clickable button areas on top
    canvasContext.save();
    canvasContext.fillStyle = 'rgba(0, 255, 115, 0.25)';
    canvasContext.fillRect(leftButtonXPosPx, leftButtonYPosPx, DIRECTIONAL_BUTTON_SIZE_PX, DIRECTIONAL_BUTTON_SIZE_PX);
    canvasContext.fillRect(rightButtonXPosPx, rightButtonYPosPx, DIRECTIONAL_BUTTON_SIZE_PX, DIRECTIONAL_BUTTON_SIZE_PX);
    canvasContext.fillRect(topButtonXPosPx, topButtonYPosPx, DIRECTIONAL_BUTTON_SIZE_PX, DIRECTIONAL_BUTTON_SIZE_PX);
    canvasContext.fillRect(bottomButtonXPosPx, bottomButtonYPosPx, DIRECTIONAL_BUTTON_SIZE_PX, DIRECTIONAL_BUTTON_SIZE_PX);
    canvasContext.restore();
}

// Load images; when all required images are available, initialize cursor and handlers
let loadedImageCount = 0;
const cursorMoveDistancePx = 2;
function initAfterAllImagesLoaded() {
    loadedImageCount++;
    if (loadedImageCount === 3) {
        // center cursor over background by default
        const backgroundXPosPx = 0;
        const backgroundYPosPx = CANVAS_DRAWING_BUFFER_HEIGHT_PX - controllerImageElement.height - backgroundImageElement.height;
        cursorXPosPx = backgroundXPosPx + Math.floor((backgroundImageElement.width - cursorImageElement.width) / 2);
        cursorYPosPx = backgroundYPosPx + Math.floor((backgroundImageElement.height - cursorImageElement.height) / 2);
        render();

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
            render();
        };

        const moveCursorRight = () => {
            cursorXPosPx = Math.min(CANVAS_DRAWING_BUFFER_WIDTH_PX - cursorImageElement.width, cursorXPosPx + cursorMoveDistancePx);
            render();
        };

        const moveCursorUp = () => {
            cursorYPosPx = Math.max(0, cursorYPosPx - cursorMoveDistancePx);
            render();
        };

        const moveCursorDown = () => {
            cursorYPosPx = Math.min(CANVAS_DRAWING_BUFFER_HEIGHT_PX - cursorImageElement.height, cursorYPosPx + cursorMoveDistancePx);
            render();
        };

        canvasElement.addEventListener('pointerdown', (ev) => {
            const canvasBoundingRect = canvasElement.getBoundingClientRect();
            const canvasScaleX = canvasElement.width / canvasBoundingRect.width;
            const canvasScaleY = canvasElement.height / canvasBoundingRect.height;
            const pointerXPosPx = (ev.clientX - canvasBoundingRect.left) * canvasScaleX;
            const pointerYPosPx = (ev.clientY - canvasBoundingRect.top) * canvasScaleY;

            const isPointerOverLeftButton = pointerXPosPx >= leftButtonXPosPx && pointerXPosPx < leftButtonXPosPx + DIRECTIONAL_BUTTON_SIZE_PX && pointerYPosPx >= leftButtonYPosPx && pointerYPosPx < leftButtonYPosPx + DIRECTIONAL_BUTTON_SIZE_PX;

            const isPointerOverRightButton = pointerXPosPx >= rightButtonXPosPx && pointerXPosPx < rightButtonXPosPx + DIRECTIONAL_BUTTON_SIZE_PX && pointerYPosPx >= rightButtonYPosPx && pointerYPosPx < rightButtonYPosPx + DIRECTIONAL_BUTTON_SIZE_PX;

            const isPointerOverUpButton = pointerXPosPx >= topButtonXPosPx && pointerXPosPx < topButtonXPosPx + DIRECTIONAL_BUTTON_SIZE_PX && pointerYPosPx >= topButtonYPosPx && pointerYPosPx < topButtonYPosPx + DIRECTIONAL_BUTTON_SIZE_PX;

            const isPointerOverBottomButton = pointerXPosPx >= bottomButtonXPosPx && pointerXPosPx < bottomButtonXPosPx + DIRECTIONAL_BUTTON_SIZE_PX && pointerYPosPx >= bottomButtonYPosPx && pointerYPosPx < bottomButtonYPosPx + DIRECTIONAL_BUTTON_SIZE_PX;

            if (isPointerOverLeftButton) {
                activePointerId = ev.pointerId;
                moveCursorLeft();
                holdDelayTimeoutId = setTimeout(() => {
                    holdRepeatIntervalId = setInterval(moveCursorLeft, 50);
                }, 500);
            } else if (isPointerOverRightButton) {
                activePointerId = ev.pointerId;
                moveCursorRight();
                holdDelayTimeoutId = setTimeout(() => {
                    holdRepeatIntervalId = setInterval(moveCursorRight, 50);
                }, 500);
            } else if (isPointerOverUpButton) {
                activePointerId = ev.pointerId;
                moveCursorUp();
                holdDelayTimeoutId = setTimeout(() => {
                    holdRepeatIntervalId = setInterval(moveCursorUp, 50);
                }, 500);
            } else if (isPointerOverBottomButton) {
                activePointerId = ev.pointerId;
                moveCursorDown();
                holdDelayTimeoutId = setTimeout(() => {
                    holdRepeatIntervalId = setInterval(moveCursorDown, 50);
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

controllerImageElement.onload = initAfterAllImagesLoaded;
controllerImageElement.src = 'controller.png';
backgroundImageElement.onload = initAfterAllImagesLoaded;
backgroundImageElement.src = 'background.png';
cursorImageElement.onload = initAfterAllImagesLoaded;
cursorImageElement.src = 'blue-cursor.png';

