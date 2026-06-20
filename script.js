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
const optimusImageElement = new Image();

const entities = [
    {
        name: 'Optimus Prime',
        imageElement: optimusImageElement,
        position: { col: 11, row: 12 },
    }
];

const DIRECTIONAL_BUTTON_SIZE_PX = 34;
const ACTION_BUTTON_SIZE_PX = 45;
const leftButtonXPosPx = 14;
const leftButtonYPosPx = 352;
const rightButtonXPosPx = 84;
const rightButtonYPosPx = 352;
const topButtonXPosPx = 49;
const topButtonYPosPx = 316;
const bottomButtonXPosPx = 49;
const bottomButtonYPosPx = 388;
const B_BUTTON_X_POS_PX = 138;
const B_BUTTON_Y_POS_PX = 375;
const A_BUTTON_X_POS_PX = 197;
const A_BUTTON_Y_POS_PX = 375;

const GRID_SIZE_PX = 16; // Grid is 16 cells across and 15 cells down.
const NES_WIDTH_PX = 256;
const NES_HEIGHT_PX = 240;
const numCols = NES_WIDTH_PX / GRID_SIZE_PX;
const numRows = NES_HEIGHT_PX / GRID_SIZE_PX;
const cursorPos = {
    col: 8,
    row: 8,
}

function renderGrid() {
    canvasContext.save();
    canvasContext.strokeStyle = '#473c7e';
    canvasContext.lineWidth = 1;
    canvasContext.setLineDash([1, 1]);
    for (let x = GRID_SIZE_PX; x < CANVAS_DRAWING_BUFFER_WIDTH_PX; x += GRID_SIZE_PX) {
        canvasContext.beginPath();
        canvasContext.moveTo(x + 0.5, 0);
        canvasContext.lineTo(x + 0.5, CANVAS_DRAWING_BUFFER_HEIGHT_PX);
        canvasContext.stroke();
    }

    for (let y = GRID_SIZE_PX; y < CANVAS_DRAWING_BUFFER_HEIGHT_PX; y += GRID_SIZE_PX) {
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

    // Draw entities.
    for (const entity of entities) {
        canvasContext.drawImage(entity.imageElement, backgroundXPosPx + entity.position.col * GRID_SIZE_PX, backgroundYPosPx + entity.position.row * GRID_SIZE_PX);
    }

    // Draw cursor.
    canvasContext.drawImage(cursorImageElement,
        backgroundXPosPx + cursorPos.col * GRID_SIZE_PX + GRID_SIZE_PX / 2,
        backgroundYPosPx + cursorPos.row * GRID_SIZE_PX + GRID_SIZE_PX / 2
    );

    // draw semi-transparent rectangle for the clickable button areas on top
    canvasContext.save();
    canvasContext.fillStyle = 'rgba(0, 255, 115, 0.25)';
    canvasContext.fillRect(leftButtonXPosPx, leftButtonYPosPx, DIRECTIONAL_BUTTON_SIZE_PX, DIRECTIONAL_BUTTON_SIZE_PX);
    canvasContext.fillRect(rightButtonXPosPx, rightButtonYPosPx, DIRECTIONAL_BUTTON_SIZE_PX, DIRECTIONAL_BUTTON_SIZE_PX);
    canvasContext.fillRect(topButtonXPosPx, topButtonYPosPx, DIRECTIONAL_BUTTON_SIZE_PX, DIRECTIONAL_BUTTON_SIZE_PX);
    canvasContext.fillRect(bottomButtonXPosPx, bottomButtonYPosPx, DIRECTIONAL_BUTTON_SIZE_PX, DIRECTIONAL_BUTTON_SIZE_PX);

    canvasContext.fillRect(B_BUTTON_X_POS_PX, B_BUTTON_Y_POS_PX, ACTION_BUTTON_SIZE_PX, ACTION_BUTTON_SIZE_PX);
    canvasContext.fillRect(A_BUTTON_X_POS_PX, A_BUTTON_Y_POS_PX, ACTION_BUTTON_SIZE_PX, ACTION_BUTTON_SIZE_PX);

    canvasContext.restore();
}

// Load images; when all required images are available, initialize cursor and handlers
let loadedImageCount = 0;
const cursorMoveDistancePx = GRID_SIZE_PX;
function initAfterAllImagesLoaded() {
    loadedImageCount++;
    if (loadedImageCount === 4) {
        const backgroundXPosPx = 0;
        const backgroundYPosPx = CANVAS_DRAWING_BUFFER_HEIGHT_PX - controllerImageElement.height - backgroundImageElement.height;
        render();

        let holdDelayTimeoutId = null;
        let holdRepeatIntervalId = null;
        let activeTouchId = null;

        const liftButton = () => {
            if (holdDelayTimeoutId !== null) {
                clearTimeout(holdDelayTimeoutId);
                holdDelayTimeoutId = null;
            }
            if (holdRepeatIntervalId !== null) {
                clearInterval(holdRepeatIntervalId);
                holdRepeatIntervalId = null;
            }
            activeTouchId = null;
        };

        const moveCursorLeft = () => {
            cursorPos.col = Math.max(0, cursorPos.col - 1);
            render();
        };

        const moveCursorRight = () => {
            cursorPos.col = Math.min(numCols - 1, cursorPos.col + 1);
            render();
        };

        const moveCursorUp = () => {
            cursorPos.row = Math.max(0, cursorPos.row - 1);
            render();
        };

        const moveCursorDown = () => {
            cursorPos.row = Math.min(numRows - 1, cursorPos.row + 1);
            render();
        };

        const pressBButton = () => {
            // For demonstration, move cursor to top-left when B button is pressed.
            cursorPos.col = 0;
            cursorPos.row = 0;
            render();
        }

        const pressAButton = () => {
            const isCursorOverOptimusPrime =
                cursorPos.col * GRID_SIZE_PX >= entities[0].position.col * GRID_SIZE_PX &&
                cursorPos.col * GRID_SIZE_PX < entities[0].position.col * GRID_SIZE_PX + entities[0].imageElement.width &&
                cursorPos.row * GRID_SIZE_PX >= entities[0].position.row * GRID_SIZE_PX &&
                cursorPos.row * GRID_SIZE_PX < entities[0].position.row * GRID_SIZE_PX + entities[0].imageElement.height;

            if (isCursorOverOptimusPrime) {
                alert('You pressed the A button while the cursor was over Optimus Prime!');
                // Show character stats and possible actions.
            } else {
                alert('No op');
            }
            render();
        }

        const pauseBeforeRepeatMs = 500;
        const repeatIntervalMs = 50;
        canvasElement.addEventListener('pointerdown', (event) => {
            if (activeTouchId !== null) {
                return;
            }

            const canvasBoundingRect = canvasElement.getBoundingClientRect();
            const canvasScaleX = canvasElement.width / canvasBoundingRect.width;
            const canvasScaleY = canvasElement.height / canvasBoundingRect.height;

            const touchXPosPx = (event.clientX - canvasBoundingRect.left) * canvasScaleX;
            const touchYPosPx = (event.clientY - canvasBoundingRect.top) * canvasScaleY;

            const isTouchOverLeftButton = touchXPosPx >= leftButtonXPosPx && touchXPosPx < leftButtonXPosPx + DIRECTIONAL_BUTTON_SIZE_PX && touchYPosPx >= leftButtonYPosPx && touchYPosPx < leftButtonYPosPx + DIRECTIONAL_BUTTON_SIZE_PX;

            const isTouchOverRightButton = touchXPosPx >= rightButtonXPosPx && touchXPosPx < rightButtonXPosPx + DIRECTIONAL_BUTTON_SIZE_PX && touchYPosPx >= rightButtonYPosPx && touchYPosPx < rightButtonYPosPx + DIRECTIONAL_BUTTON_SIZE_PX;

            const isTouchOverUpButton = touchXPosPx >= topButtonXPosPx && touchXPosPx < topButtonXPosPx + DIRECTIONAL_BUTTON_SIZE_PX && touchYPosPx >= topButtonYPosPx && touchYPosPx < topButtonYPosPx + DIRECTIONAL_BUTTON_SIZE_PX;

            const isTouchOverBottomButton = touchXPosPx >= bottomButtonXPosPx && touchXPosPx < bottomButtonXPosPx + DIRECTIONAL_BUTTON_SIZE_PX && touchYPosPx >= bottomButtonYPosPx && touchYPosPx < bottomButtonYPosPx + DIRECTIONAL_BUTTON_SIZE_PX;

            const isTouchOverBButton = touchXPosPx >= B_BUTTON_X_POS_PX && touchXPosPx < B_BUTTON_X_POS_PX + ACTION_BUTTON_SIZE_PX && touchYPosPx >= B_BUTTON_Y_POS_PX && touchYPosPx < B_BUTTON_Y_POS_PX + ACTION_BUTTON_SIZE_PX;

            const isTouchOverAButton = touchXPosPx >= A_BUTTON_X_POS_PX && touchXPosPx < A_BUTTON_X_POS_PX + ACTION_BUTTON_SIZE_PX && touchYPosPx >= A_BUTTON_Y_POS_PX && touchYPosPx < A_BUTTON_Y_POS_PX + ACTION_BUTTON_SIZE_PX;

            if (isTouchOverLeftButton) {
                activeTouchId = event.pointerId;
                moveCursorLeft();
                holdDelayTimeoutId = setTimeout(() => {
                    holdRepeatIntervalId = setInterval(moveCursorLeft, repeatIntervalMs);
                }, pauseBeforeRepeatMs);
            } else if (isTouchOverRightButton) {
                activeTouchId = event.pointerId;
                moveCursorRight();
                holdDelayTimeoutId = setTimeout(() => {
                    holdRepeatIntervalId = setInterval(moveCursorRight, repeatIntervalMs);
                }, pauseBeforeRepeatMs);
            } else if (isTouchOverUpButton) {
                activeTouchId = event.pointerId;
                moveCursorUp();
                holdDelayTimeoutId = setTimeout(() => {
                    holdRepeatIntervalId = setInterval(moveCursorUp, repeatIntervalMs);
                }, pauseBeforeRepeatMs);
            } else if (isTouchOverBottomButton) {
                activeTouchId = event.pointerId;
                moveCursorDown();
                holdDelayTimeoutId = setTimeout(() => {
                    holdRepeatIntervalId = setInterval(moveCursorDown, repeatIntervalMs);
                }, pauseBeforeRepeatMs);
            } else if (isTouchOverBButton) {
                activeTouchId = event.pointerId;
                pressBButton();
            } else if (isTouchOverAButton) {
                activeTouchId = event.pointerId;
                pressAButton();
            }
        });

        canvasElement.addEventListener('pointerup', (ev) => {
            if (ev.pointerId === activeTouchId) {
                liftButton();
            }
        });

        canvasElement.addEventListener('pointercancel', (ev) => {
            if (ev.pointerId === activeTouchId) {
                liftButton();
            }
        });

        canvasElement.addEventListener('pointerleave', (ev) => {
            if (ev.pointerId === activeTouchId) {
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
cursorImageElement.src = 'triangle-cursor.png';
optimusImageElement.onload = initAfterAllImagesLoaded;
optimusImageElement.src = 'optimus-prime.png';
