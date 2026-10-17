export {};

const canvas = document.querySelector<HTMLCanvasElement>("#rover-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>("#rover-readout")!;
const pendingList = document.querySelector<HTMLElement>("#rover-pending")!;
const runButton = document.querySelector<HTMLButtonElement>("#rover-run")!;
const clearButton = document.querySelector<HTMLButtonElement>("#rover-clear")!;
let x = 2;
let y = 2;
let direction = 0;

type command = {
  label: string;
  execute: () => void;
};

type direction = {
  name: string;
  dx: number;
  dy: number;
};

const directions: direction[] = [
  { name: "North", dx: 0, dy: -1 },
  { name: "East", dx: 1, dy: 0 },
  { name: "South", dx: 0, dy: 1 },
  { name: "West", dx: -1, dy: 0 },
];

const commandQueue: command[] = [];

function updateQueue() {
  pendingList.replaceChildren();

  commandQueue.forEach((cmd) => {
    const item = document.createElement("li");
    item.textContent = cmd.label;
    pendingList.appendChild(item);
  });

  runButton.disabled = commandQueue.length === 0;
  clearButton.disabled = commandQueue.length === 0;
}

function drawRover() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#718881";
  for (let row = 0; row < 5; row++) {
    for (let column = 0; column < 5; column++) {
      ctx.strokeRect(10 + column * 56, 10 + row * 56, 56, 56);
    }
  }
  ctx.save();
  ctx.translate(38 + x * 56, 38 + y * 56);
  ctx.rotate(direction * Math.PI / 2);
  ctx.fillStyle = "#27766b";
  ctx.beginPath();
  ctx.moveTo(0, -20);
  ctx.lineTo(17, 16);
  ctx.lineTo(-17, 16);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  readout.textContent = `Position: (${x}, ${y}) · Facing: ${
    directions[direction].name
  }`;
}

const forwardCommand: command = {
  label: "Forward",
  execute: () => {
    const heading = directions[direction];
    x = Math.max(0, Math.min(4, x + heading.dx));
    y = Math.max(0, Math.min(4, y + heading.dy));
    drawRover();
  },
};

const rightCommand: command = {
  label: "Right",
  execute: () => {
    direction = (direction + 1) % directions.length;
    drawRover();
  },
};

document.querySelector<HTMLButtonElement>("#rover-forward")!.onclick = () => {
  commandQueue.push(forwardCommand);
  updateQueue();
};
document.querySelector<HTMLButtonElement>("#rover-right")!.onclick = () => {
  commandQueue.push(rightCommand);
  updateQueue();
};
document.querySelector<HTMLButtonElement>("#rover-reset")!.onclick = () => {
  x = 2;
  y = 2;
  direction = 0;
  commandQueue.length = 0;
  drawRover();
  updateQueue();
};
runButton.onclick = () => {
  while (commandQueue.length > 0) {
    const cmd = commandQueue.shift()!;
    cmd.execute();
  }
  updateQueue();
};
clearButton.onclick = () => {
  commandQueue.length = 0;
  updateQueue();
};

drawRover();
updateQueue();
