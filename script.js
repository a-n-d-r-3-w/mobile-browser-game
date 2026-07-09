// Initialize canvas.
const rootElement = document.documentElement;
const mapCanvasElement = document.getElementById("map-canvas");
const uiCanvasElement = document.getElementById("ui-canvas");

// Set canvas rendered size.
const CANVAS_RENDERED_WIDTH_PX = 375;
const CANVAS_RENDERED_HEIGHT_PX = 634;
rootElement.style.setProperty('--canvas-width', `${CANVAS_RENDERED_WIDTH_PX}px`);
rootElement.style.setProperty('--canvas-height', `${CANVAS_RENDERED_HEIGHT_PX}px`);

// Set canvas drawing buffer size.
const CANVAS_DRAWING_BUFFER_WIDTH_PX = 256;
const CANVAS_DRAWING_BUFFER_HEIGHT_PX = CANVAS_RENDERED_HEIGHT_PX * (CANVAS_DRAWING_BUFFER_WIDTH_PX / CANVAS_RENDERED_WIDTH_PX); // Match aspect ratio of rendered size.
mapCanvasElement.width = CANVAS_DRAWING_BUFFER_WIDTH_PX;
mapCanvasElement.height = CANVAS_DRAWING_BUFFER_HEIGHT_PX;
uiCanvasElement.width = CANVAS_DRAWING_BUFFER_WIDTH_PX;
uiCanvasElement.height = CANVAS_DRAWING_BUFFER_HEIGHT_PX;

const mapCanvasContext = mapCanvasElement.getContext("2d");
mapCanvasContext.imageSmoothingEnabled = false;
const uiCanvasContext = uiCanvasElement.getContext("2d");
uiCanvasContext.imageSmoothingEnabled = false;

// Grid
const grid = [
    [{}, {}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}, {}],
]

// Teams
const TEAM_RED = [
    { name: 'Maroon', color: '#800000' },
    { name: 'Ruby', color: '#e0115f' },
    { name: 'Burgundy', color: '#900020' },
    { name: 'Cardinal', color: '#c41e3a' },
    { name: 'Scarlet', color: '#ff2400' },
];

const TEAM_PURPLE = [
    { name: 'Fuchsia', color: '#ff00ff' },
    { name: 'Orchid', color: '#da70d6' },
    { name: 'Magenta', color: '#ff00ff' },
    { name: 'Amethyst', color: '#9966cc' },
    { name: 'Mauve', color: '#e0b0ff' },
];

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
mapCanvasContext.fillStyle = "#cccccc";
mapCanvasContext.fillRect(0, 0, CANVAS_DRAWING_BUFFER_WIDTH_PX, CANVAS_DRAWING_BUFFER_HEIGHT_PX);

const GRID_SIZE_PX = 32;
const numCols = CANVAS_DRAWING_BUFFER_WIDTH_PX / GRID_SIZE_PX;
const numRows = Math.floor(CANVAS_DRAWING_BUFFER_HEIGHT_PX / GRID_SIZE_PX);

// Set initial position of team members.
for (teamMember of TEAM_RED) {
    teamMember.row = Math.floor(Math.random() * numRows);
    teamMember.col = Math.floor(Math.random() * numCols);
}

for (teamMember of TEAM_PURPLE) {
    teamMember.row = Math.floor(Math.random() * numRows);
    teamMember.col = Math.floor(Math.random() * numCols);
}

console.log('TEAM_RED:', TEAM_RED);
console.log('TEAM_PURPLE:', TEAM_PURPLE);

function renderGrid() {
    mapCanvasContext.save();

    mapCanvasContext.strokeStyle = '#000000';
    mapCanvasContext.lineWidth = 1;
    mapCanvasContext.setLineDash([1, 1]);

    // Draw vertical grid lines.
    for (let x = GRID_SIZE_PX; x < CANVAS_DRAWING_BUFFER_WIDTH_PX; x += GRID_SIZE_PX) {
        mapCanvasContext.beginPath();
        mapCanvasContext.moveTo(x + 0.5, 0);
        mapCanvasContext.lineTo(x + 0.5, CANVAS_DRAWING_BUFFER_HEIGHT_PX);
        mapCanvasContext.stroke();
    }

    // Draw horizontal grid lines.
    for (let y = GRID_SIZE_PX; y < CANVAS_DRAWING_BUFFER_HEIGHT_PX; y += GRID_SIZE_PX) {
        mapCanvasContext.beginPath();
        mapCanvasContext.moveTo(0, y + 0.5);
        mapCanvasContext.lineTo(CANVAS_DRAWING_BUFFER_WIDTH_PX, y + 0.5);
        mapCanvasContext.stroke();
    }

    mapCanvasContext.restore();
}

function renderTeamMembers() {
    for (teamMember of TEAM_RED) {
        mapCanvasContext.fillStyle = teamMember.color;
        mapCanvasContext.fillRect(teamMember.col * GRID_SIZE_PX, teamMember.row * GRID_SIZE_PX, GRID_SIZE_PX, GRID_SIZE_PX);
    }
    for (teamMember of TEAM_PURPLE) {
        mapCanvasContext.fillStyle = teamMember.color;
        mapCanvasContext.fillRect(teamMember.col * GRID_SIZE_PX, teamMember.row * GRID_SIZE_PX, GRID_SIZE_PX, GRID_SIZE_PX);
    }
}

function render() {
    renderGrid();
    renderTeamMembers();

    // Load optimus-prime-32.png and render at a random location.
    const optimusPrimeImage = new Image();
    optimusPrimeImage.onload = () => {
        const randomRow = Math.floor(Math.random() * numRows);
        const randomCol = Math.floor(Math.random() * numCols);
        mapCanvasContext.drawImage(optimusPrimeImage, randomCol * GRID_SIZE_PX, randomRow * GRID_SIZE_PX, GRID_SIZE_PX, GRID_SIZE_PX);
    };
    optimusPrimeImage.src = 'optimus-prime-32.png';

    // Load megatron-32.png and render at a random location.
    const megatronImage = new Image();
    megatronImage.onload = () => {
        const randomRow = Math.floor(Math.random() * numRows);
        const randomCol = Math.floor(Math.random() * numCols);
        mapCanvasContext.drawImage(megatronImage, randomCol * GRID_SIZE_PX, randomRow * GRID_SIZE_PX, GRID_SIZE_PX, GRID_SIZE_PX);
    };
    megatronImage.src = 'megatron-32.png';

    // Load rodimus-prime-32.png and render at a random location.
    const rodimusPrimeImage = new Image();
    rodimusPrimeImage.onload = () => {
        const randomRow = Math.floor(Math.random() * numRows);
        const randomCol = Math.floor(Math.random() * numCols);
        mapCanvasContext.drawImage(rodimusPrimeImage, randomCol * GRID_SIZE_PX, randomRow * GRID_SIZE_PX, GRID_SIZE_PX, GRID_SIZE_PX);
    };
    rodimusPrimeImage.src = 'rodimus-prime-32.png';

    // Load galvatron-32.png and render at a random location.
    const galvatronImage = new Image();
    galvatronImage.onload = () => {
        const randomRow = Math.floor(Math.random() * numRows);
        const randomCol = Math.floor(Math.random() * numCols);
        mapCanvasContext.drawImage(galvatronImage, randomCol * GRID_SIZE_PX, randomRow * GRID_SIZE_PX, GRID_SIZE_PX, GRID_SIZE_PX);
    };
    galvatronImage.src = 'galvatron-32.png';

    // Load brainstorm-32.png and render at a random location.
    const brainstormImage = new Image();
    brainstormImage.onload = () => {
        const randomRow = Math.floor(Math.random() * numRows);
        const randomCol = Math.floor(Math.random() * numCols);
        mapCanvasContext.drawImage(brainstormImage, randomCol * GRID_SIZE_PX, randomRow * GRID_SIZE_PX, GRID_SIZE_PX, GRID_SIZE_PX);
    };
    brainstormImage.src = 'brainstorm-32.png';

    // Load apeface-32.png and render at a random location.
    const apefaceImage = new Image();
    apefaceImage.onload = () => {
        const randomRow = Math.floor(Math.random() * numRows);
        const randomCol = Math.floor(Math.random() * numCols);
        mapCanvasContext.drawImage(apefaceImage, randomCol * GRID_SIZE_PX, randomRow * GRID_SIZE_PX, GRID_SIZE_PX, GRID_SIZE_PX);
    };
    apefaceImage.src = 'apeface-32.png';
}

const cursorMoveDistancePx = GRID_SIZE_PX;

function init() {
    render();

    mapCanvasElement.addEventListener('pointerdown', (event) => {
        const canvasBoundingRect = mapCanvasElement.getBoundingClientRect();
        const canvasScaleX = mapCanvasElement.width / canvasBoundingRect.width;
        const canvasScaleY = mapCanvasElement.height / canvasBoundingRect.height;

        const touchXPosPx = (event.clientX - canvasBoundingRect.left) * canvasScaleX;
        const touchYPosPx = (event.clientY - canvasBoundingRect.top) * canvasScaleY;

        const touchRow = Math.floor(touchYPosPx / GRID_SIZE_PX);
        const touchCol = Math.floor(touchXPosPx / GRID_SIZE_PX);

        alert(`Touched row ${touchRow}, col ${touchCol}`);

        // Check if touch is over any button.
        // const isTouchOverLeftButton = touchXPosPx >= leftButtonXPosPx && touchXPosPx < leftButtonXPosPx + DIRECTIONAL_BUTTON_SIZE_PX && touchYPosPx >= leftButtonYPosPx && touchYPosPx < leftButtonYPosPx + DIRECTIONAL_BUTTON_SIZE_PX;

        // if (isTouchOverLeftButton) {
        // do something
        // } else if (isTouchOverRightButton) {
        // }
    });

    mapCanvasElement.addEventListener('pointerup', (ev) => {
    });

    mapCanvasElement.addEventListener('pointercancel', (ev) => {
    });

    mapCanvasElement.addEventListener('pointerleave', (ev) => {
    });
}

init();