// const input = require("./sampleInput").split("\n");
const input = require("./input").split("\n");

const ROCK = "#";
const SAND = "o";
const SANDSOURCE = { x: 500, y: 0 };
const grid = [];
const minMax = {
  maxX: 500,
  minX: 500,
  maxY: 0,
  minY: 0,
};
let infiniteX = false;

function setMinMax(point) {
  if (point.x > minMax.maxX) minMax.maxX = point.x;
  if (point.x < minMax.minX) minMax.minX = point.x;
  if (point.y > minMax.maxY) minMax.maxY = point.y;
  if (point.y < minMax.minY) minMax.minY = point.y;
  return point;
}

function toPoint(str) {
  const [x, y] = str.split(",").map((d) => parseInt(d));
  return { x, y };
}

function dropSandUnit() {
  let restPoint = SANDSOURCE;

  const step = () => {
    const y = restPoint.y + 1;
    if (infiniteX && y >= minMax.maxY) return null;

    const testPoints = [
      { x: restPoint.x, y },
      { x: restPoint.x - 1, y },
      { x: restPoint.x + 1, y },
    ];
    for (let testPoint of testPoints)
      if (!grid[testPoint.y] || !grid[testPoint.y][testPoint.x])
        return testPoint;

    return null;
  };

  while (true) {
    const temp = step();
    if (!temp) return restPoint;

    const insideBounds =
      temp.y <= minMax.maxY &&
      (infiniteX || (temp.x >= minMax.minX && temp.x <= minMax.maxX));
    if (!insideBounds) return Infinity;

    restPoint = temp;
    setMinMax(restPoint);
  }
}

function printGrid() {
  let output = [];
  for (let y = minMax.minY; y <= minMax.maxY; y++) {
    let str = "";
    for (let x = minMax.minX; x <= minMax.maxX; x++) {
      str +=
        x === SANDSOURCE.x && y === SANDSOURCE.y
          ? "+"
          : !grid[y]
          ? "."
          : grid[y][x] || ".";
    }
    output.push(str);
  }
  console.log(output.join("\n"));
}

// constuct cave grid
input.forEach((line) => {
  let current = null;
  for (let point of line.split(" -> ").map(toPoint)) {
    setMinMax(point);

    if (!current) {
      current = point;
      continue;
    }

    if (current.x !== point.x) {
      if (!grid[current.y]) grid[current.y] = [];
      for (
        let i = Math.min(current.x, point.x);
        i <= Math.max(current.x, point.x);
        i++
      )
        grid[current.y][i] = ROCK;
    } else {
      for (
        let i = Math.min(current.y, point.y);
        i <= Math.max(current.y, point.y);
        i++
      ) {
        if (!grid[i]) grid[i] = [];
        grid[i][current.x] = ROCK;
      }
    }

    current = point;
  }
});

const [_, __, puzzlePart] = process.argv;

if (puzzlePart === "1") {
} else if (puzzlePart === "2") {
  minMax.maxY += 2;
  infiniteX = true;
  grid[minMax.maxY] = [];
  for (let i = minMax.minX - 3; i <= minMax.maxX + 3; i++)
    grid[minMax.maxY][i] = ROCK;
}

let unitCount = 0;
while (true) {
  const restPoint = dropSandUnit();
  if (restPoint === Infinity && infiniteX) console.log("wtd");
  if (!restPoint || restPoint === Infinity) break;

  if (!grid[restPoint.y]) grid[restPoint.y] = [];
  grid[restPoint.y][restPoint.x] = SAND;
  unitCount++;
  if (restPoint.x === SANDSOURCE.x && restPoint.y === SANDSOURCE.y) break;
}

console.log("unit count", unitCount);
