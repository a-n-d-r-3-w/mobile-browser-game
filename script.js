

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

// Prevent right-click context menu from appearing.
document.addEventListener('contextmenu', event => event.preventDefault());

// Show alert if using iOS Safari.
// const isIosSafari = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
// if (isIosSafari) {
//     alert('Safari deletes a website\'s stored data after 7 days of inactivity. To help prevent data loss, add this website to your home screen and open it from there.');
// }

// Draw a base background color before the images load.
canvasContext.fillStyle = "#ffffff"; // white
canvasContext.fillRect(0, 0, CANVAS_DRAWING_BUFFER_WIDTH_PX, CANVAS_DRAWING_BUFFER_HEIGHT_PX);

const backgroundImageElement = new Image();
const controllerImageElement = new Image();
const cursorImageElement = new Image();

let cursorXPosPx = 0;
let cursorYPosPx = 0;

const DIRECTIONAL_BUTTON_SIZE_PX = 34;
const leftButtonXPosPx = 14;
const leftButtonYPosPx = 352;
const rightButtonXPosPx = 84;
const rightButtonYPosPx = 352;
const topButtonXPosPx = 49;
const topButtonYPosPx = 316;
const bottomButtonXPosPx = 49;
const bottomButtonYPosPx = 388;

const gridSizePx = 16;

function renderGrid() {
    canvasContext.save();
    canvasContext.strokeStyle = '#473c7e';
    canvasContext.lineWidth = 1;
    canvasContext.setLineDash([1, 1]);
    for (let x = gridSizePx; x < CANVAS_DRAWING_BUFFER_WIDTH_PX; x += gridSizePx) {
        canvasContext.beginPath();
        canvasContext.moveTo(x + 0.5, 0);
        canvasContext.lineTo(x + 0.5, CANVAS_DRAWING_BUFFER_HEIGHT_PX);
        canvasContext.stroke();
    }

    for (let y = gridSizePx; y < CANVAS_DRAWING_BUFFER_HEIGHT_PX; y += gridSizePx) {
        canvasContext.beginPath();
        canvasContext.moveTo(0, y + 0.5);
        canvasContext.lineTo(CANVAS_DRAWING_BUFFER_WIDTH_PX, y + 0.5);
        canvasContext.stroke();
    }

    canvasContext.restore();
}

function render() {
    // Draw background.
    const backgroundXPosPx = 0;
    const backgroundYPosPx = CANVAS_DRAWING_BUFFER_HEIGHT_PX - controllerImageElement.height - backgroundImageElement.height;
    canvasContext.drawImage(backgroundImageElement, backgroundXPosPx, backgroundYPosPx);

    renderGrid();

    // Draw white area at top.
    canvasContext.save();
    canvasContext.fillStyle = '#ffffff';
    canvasContext.fillRect(0, 0, CANVAS_DRAWING_BUFFER_WIDTH_PX, backgroundYPosPx);
    canvasContext.restore();

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
const cursorMoveDistancePx = gridSizePx;
function initAfterAllImagesLoaded() {
    loadedImageCount++;
    if (loadedImageCount === 3) {
        const backgroundXPosPx = 0;
        const backgroundYPosPx = CANVAS_DRAWING_BUFFER_HEIGHT_PX - controllerImageElement.height - backgroundImageElement.height;
        cursorXPosPx = backgroundXPosPx + 8.5 * gridSizePx;
        cursorYPosPx = backgroundYPosPx + 8.5 * gridSizePx;
        render();

        let holdDelayTimeoutId = null;
        let holdRepeatIntervalId = null;
        let activePointerId = null;

        const liftButton = () => {
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

        const pauseBeforeRepeatMs = 500;
        const repeatIntervalMs = 50;
        canvasElement.addEventListener('pointerdown', (event) => {
            if (activePointerId !== null) {
                return;
            }

            const canvasBoundingRect = canvasElement.getBoundingClientRect();
            const canvasScaleX = canvasElement.width / canvasBoundingRect.width;
            const canvasScaleY = canvasElement.height / canvasBoundingRect.height;

            const pointerXPosPx = (event.clientX - canvasBoundingRect.left) * canvasScaleX;
            const pointerYPosPx = (event.clientY - canvasBoundingRect.top) * canvasScaleY;

            const isPointerOverLeftButton = pointerXPosPx >= leftButtonXPosPx && pointerXPosPx < leftButtonXPosPx + DIRECTIONAL_BUTTON_SIZE_PX && pointerYPosPx >= leftButtonYPosPx && pointerYPosPx < leftButtonYPosPx + DIRECTIONAL_BUTTON_SIZE_PX;

            const isPointerOverRightButton = pointerXPosPx >= rightButtonXPosPx && pointerXPosPx < rightButtonXPosPx + DIRECTIONAL_BUTTON_SIZE_PX && pointerYPosPx >= rightButtonYPosPx && pointerYPosPx < rightButtonYPosPx + DIRECTIONAL_BUTTON_SIZE_PX;

            const isPointerOverUpButton = pointerXPosPx >= topButtonXPosPx && pointerXPosPx < topButtonXPosPx + DIRECTIONAL_BUTTON_SIZE_PX && pointerYPosPx >= topButtonYPosPx && pointerYPosPx < topButtonYPosPx + DIRECTIONAL_BUTTON_SIZE_PX;

            const isPointerOverBottomButton = pointerXPosPx >= bottomButtonXPosPx && pointerXPosPx < bottomButtonXPosPx + DIRECTIONAL_BUTTON_SIZE_PX && pointerYPosPx >= bottomButtonYPosPx && pointerYPosPx < bottomButtonYPosPx + DIRECTIONAL_BUTTON_SIZE_PX;

            if (isPointerOverLeftButton) {
                activePointerId = event.pointerId;
                moveCursorLeft();
                holdDelayTimeoutId = setTimeout(() => {
                    holdRepeatIntervalId = setInterval(moveCursorLeft, repeatIntervalMs);
                }, pauseBeforeRepeatMs);
            } else if (isPointerOverRightButton) {
                activePointerId = event.pointerId;
                moveCursorRight();
                holdDelayTimeoutId = setTimeout(() => {
                    holdRepeatIntervalId = setInterval(moveCursorRight, repeatIntervalMs);
                }, pauseBeforeRepeatMs);
            } else if (isPointerOverUpButton) {
                activePointerId = event.pointerId;
                moveCursorUp();
                holdDelayTimeoutId = setTimeout(() => {
                    holdRepeatIntervalId = setInterval(moveCursorUp, repeatIntervalMs);
                }, pauseBeforeRepeatMs);
            } else if (isPointerOverBottomButton) {
                activePointerId = event.pointerId;
                moveCursorDown();
                holdDelayTimeoutId = setTimeout(() => {
                    holdRepeatIntervalId = setInterval(moveCursorDown, repeatIntervalMs);
                }, pauseBeforeRepeatMs);
            }
        });

        canvasElement.addEventListener('pointerup', (ev) => {
            if (ev.pointerId === activePointerId) {
                liftButton();
            }
        });

        canvasElement.addEventListener('pointercancel', (ev) => {
            if (ev.pointerId === activePointerId) {
                liftButton();
            }
        });

        canvasElement.addEventListener('pointerleave', (ev) => {
            if (ev.pointerId === activePointerId) {
                liftButton();
            }
        });
    }
}

controllerImageElement.onload = initAfterAllImagesLoaded;
controllerImageElement.src = 'controller.png';
backgroundImageElement.onload = initAfterAllImagesLoaded;
backgroundImageElement.src = 'background.png';
cursorImageElement.onload = initAfterAllImagesLoaded;
cursorImageElement.src = 'cursor.png';

