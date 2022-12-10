// const input = require("./sampleInput").split("\n");
const input = require("./input").split("\n");

const [_, __, puzzlePart] = process.argv;

const bridge = {
  visited: [[true]],
  minX: 0,
  maxX: 0,
  minY: 0,
  maxY: 0,
};

const directions = {
  R: { x: 1, y: 0 },
  L: { x: -1, y: 0 },
  U: { x: 0, y: -1 },
  D: { x: 0, y: 1 },
};

const knotPositions = [];

function markVisited() {
  knotPositions.forEach(({ x, y }) => {
    if (bridge.minX > x) bridge.minX = x;
    if (bridge.minY > y) bridge.minY = y;
    if (bridge.maxX < x) bridge.maxX = x;
    if (bridge.maxY < y) bridge.maxY = y;
  });

  const tailPos = knotPositions[knotPositions.length - 1];

  if (!bridge.visited[tailPos.y]) bridge.visited[tailPos.y] = [];
  bridge.visited[tailPos.y][tailPos.x] = true;
}

function printGrid() {
  let lines = [];
  for (let y = bridge.minY; y <= Math.max(bridge.maxY, 5); y++) {
    let str = "";
    for (let x = bridge.minX; x <= Math.max(bridge.maxX, 5); x++) {
      let knot = null;
      for (let k = 0; k < knotPositions.length; k++) {
        if (knotPositions[k].x === x && knotPositions[k].y === y) {
          knot = k;
          break;
        }
      }

      str +=
        knot === 0
          ? "H"
          : knot !== null
          ? knot
          : x === 0 && y === 0
          ? "s"
          : ".";
    }
    lines.push(str);
  }
  console.log(lines.join("\n"));
}

function getVisitedCount(print) {
  let lines = [];
  let count = 0;
  for (let y = bridge.minY; y <= bridge.maxY; y++) {
    let str = "";
    for (let x = bridge.minX; x <= bridge.maxX; x++) {
      const visited = bridge.visited[y] && bridge.visited[y][x];
      if (visited) count++;
      str += visited ? "#" : ".";
    }
    lines.push(str);
  }
  if (print) console.log(lines.join("\n"));
  return count;
}

function moveStep(frontKnot, backKnot) {
  const diffX = Math.abs(frontKnot.x - backKnot.x);
  const diffY = Math.abs(frontKnot.y - backKnot.y);

  if (diffX && diffY && (diffX > 1 || diffY > 1)) {
    backKnot.x += frontKnot.x > backKnot.x ? 1 : -1;
    backKnot.y += frontKnot.y > backKnot.y ? 1 : -1;
  } else if (diffX > 1) {
    backKnot.x += frontKnot.x > backKnot.x ? 1 : -1;
  } else if (diffY > 1) {
    backKnot.y += frontKnot.y > backKnot.y ? 1 : -1;
  }

  markVisited();
}

function move(line) {
  const [directionChar, numSteps] = line.split(" ");
  const direction = directions[directionChar];

  for (let i = 0; i < numSteps; i++) {
    knotPositions[0].x += direction.x;
    knotPositions[0].y += direction.y;

    for (let j = 1; j < knotPositions.length; j++)
      moveStep(knotPositions[j - 1], knotPositions[j]);
  }
}

const numOfKnots = puzzlePart === "1" ? 2 : 10;

for (let i = 0; i < numOfKnots; i++) knotPositions.push({ x: 0, y: 0 });

input.forEach(move);

console.log("visited count", getVisitedCount());
