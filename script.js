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

// Draw a base background color.
canvasContext.fillStyle = "#cccccc";
canvasContext.fillRect(0, 0, CANVAS_DRAWING_BUFFER_WIDTH_PX, CANVAS_DRAWING_BUFFER_HEIGHT_PX);

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

    canvasContext.strokeStyle = '#000000';
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
    renderGrid();
}

const cursorMoveDistancePx = GRID_SIZE_PX;

function init() {
    render();

    canvasElement.addEventListener('pointerdown', (event) => {
        const canvasBoundingRect = canvasElement.getBoundingClientRect();
        const canvasScaleX = canvasElement.width / canvasBoundingRect.width;
        const canvasScaleY = canvasElement.height / canvasBoundingRect.height;

        const touchXPosPx = (event.clientX - canvasBoundingRect.left) * canvasScaleX;
        const touchYPosPx = (event.clientY - canvasBoundingRect.top) * canvasScaleY;

        // Check if touch is over any button.
        // const isTouchOverLeftButton = touchXPosPx >= leftButtonXPosPx && touchXPosPx < leftButtonXPosPx + DIRECTIONAL_BUTTON_SIZE_PX && touchYPosPx >= leftButtonYPosPx && touchYPosPx < leftButtonYPosPx + DIRECTIONAL_BUTTON_SIZE_PX;

        // if (isTouchOverLeftButton) {
        // do something
        // } else if (isTouchOverRightButton) {
        // }
    });

    canvasElement.addEventListener('pointerup', (ev) => {
    });

    canvasElement.addEventListener('pointercancel', (ev) => {
    });

    canvasElement.addEventListener('pointerleave', (ev) => {
    });
}

init();