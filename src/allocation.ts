export {};

const canvas = document.querySelector<HTMLCanvasElement>("#allocation-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>(
  "#allocation-readout",
)!;
let numCrew = 2;

function calculateSupplies(crew: number): shiftResults {
  const production = crew * 3;
  const consumption = 6;
  const balance = production - consumption;
  return { production, consumption, balance };
}

type shiftResults = {
  production: number;
  consumption: number;
  balance: number;
};

function renderCanvas(results: shiftResults) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < 6; i++) {
    ctx.fillStyle = i < numCrew ? "#27766b" : "#c9d2c9";
    ctx.fillRect(18 + i * 45, 16, 36, 36);
    ctx.fillStyle = i < numCrew ? "#ffffff" : "#233e43";
    ctx.font = "16px system-ui";
    ctx.fillText(String(i + 1), 31 + i * 45, 40);
  }

  ctx.fillStyle = "#233e43";
  ctx.font = "14px system-ui";
  ctx.fillText(`Producers: ${numCrew} / 6`, 18, 76);
  ctx.fillText(`Production: ${results.production}`, 18, 102);

  ctx.fillStyle = "#27766b";
  ctx.fillRect(18, 110, results.production * 14, 20);

  ctx.fillStyle = "#233e43";
  ctx.fillText(`Consumption: ${results.consumption}`, 18, 154);

  ctx.fillStyle = "#a44d23";
  ctx.fillRect(18, 162, results.consumption * 14, 20);
}

function renderReadout(results: shiftResults) {
  readout.textContent =
    `Assigned: ${numCrew}/6 · Production: ${results.production} · Consumption: ${results.consumption} · Balance: ${
      results.balance > 0 ? "+" : ""
    }${results.balance}`;
}

function update() {
  const results = calculateSupplies(numCrew);
  renderCanvas(results);
  renderReadout(results);
}

document.querySelector<HTMLButtonElement>("#allocation-less")!.onclick = () => {
  numCrew = Math.max(0, numCrew - 1);
  update();
};

document.querySelector<HTMLButtonElement>("#allocation-more")!.onclick = () => {
  numCrew = Math.min(6, numCrew + 1);
  update();
};

document.querySelector<HTMLButtonElement>("#allocation-reset")!.onclick =
  () => {
    numCrew = 2;
    update();
  };
update();
