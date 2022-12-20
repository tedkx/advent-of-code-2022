// const input = require("./sampleInput");
const input = require("./input");

let startNode = null;
let endNode = null;
const minElevationNodes = [];
const heightMap = input.split("\n").map((line, y) =>
  Array.from(line).map((char, x) => {
    if (char === "E") endNode = getNodeKey({ x, y });
    else if (char === "S") startNode = getNodeKey({ x, y });
    else if (char === "a") minElevationNodes.push(getNodeKey({ x, y }));
    return char;
  })
);

const width = heightMap[0].length;
const height = heightMap.length;
const directions = [
  { x: 1, y: 0 },
  { x: -1, y: 0 },
  { x: 0, y: 1 },
  { x: 0, y: -1 },
];

function getValue(point) {
  return (
    heightMap[point.y][point.x] === "E" || heightMap[point.y][point.x] === "S"
      ? "z"
      : heightMap[point.y][point.x]
  ).charCodeAt(0);
}

function getPossibleSteps(node) {
  const possibleSteps = [];
  const value = getValue(node);

  for (let direction of directions) {
    const point = { x: node.x + direction.x, y: node.y + direction.y };

    if (point.x >= width || point.x < 0) continue;
    if (point.y >= height || point.y < 0) continue;

    const toValue = getValue(point);
    const diff =
      value === "S" ? 0 : toValue === "E" ? "z".charCodeAt(0) : toValue - value;
    if (diff <= 1) possibleSteps.push(getNodeKey(point));
  }

  return possibleSteps;
}

function getNodeKey(node) {
  return `${node.x},${node.y}`;
}

const adjacents = heightMap.reduce((obj, line, y) => {
  line.forEach((_, x) => {
    const point = { x, y };
    obj[getNodeKey(point)] = getPossibleSteps(point);
  });
  return obj;
}, {});

function dijkstra(fromNode, toNode) {
  const distances = { [fromNode]: 0 };
  const visited = {};
  const previous = {};

  const getDistance = (node) => {
    const d = distances[node];
    return typeof d === "undefined" ? Infinity : d;
  };

  const getMinDistance = () => {
    let min = { distance: Infinity, node: null };

    for (let node of Object.keys(distances)) {
      const distance = getDistance(node);
      if (distance < min.distance && !visited[node]) min = { distance, node };
    }

    return min;
  };

  let current = getMinDistance();

  while (current.node) {
    for (let neighbor of adjacents[current.node]) {
      const totalDistance = current.distance + 1;
      const neighborDistance = getDistance(neighbor);
      if (neighborDistance > totalDistance) {
        distances[neighbor] = totalDistance;
        previous[neighbor] = current.node;
      }
    }

    visited[current.node] = true;
    current = getMinDistance();
  }

  return distances[toNode];
}

function breadthFirstTraversal(fromNode, toNode) {
  const doBfs = () => {
    const queue = [fromNode];
    const visited = { [fromNode]: true };
    const nodes = { [fromNode]: null };

    while (queue.length) {
      const node = queue.shift();

      adjacents[node].forEach((neighbor) => {
        if (!visited[neighbor]) {
          visited[neighbor] = true;
          queue.push(neighbor);
          nodes[neighbor] = node;
        }
        if (neighbor === toNode) return nodes;
      });
    }

    return nodes;
  };

  const nodes = doBfs();
  let steps = 1;
  let current = nodes[toNode];

  if (!current) return null;

  while (current !== fromNode) {
    current = nodes[current];
    steps++;
  }

  return steps;
}

const [_, __, puzzlePart] = process.argv;

if (puzzlePart === "1") {
  let minimumPathSteps = null;

  console.time("BFS");
  minimumPathSteps = breadthFirstTraversal(startNode, endNode);
  console.timeEnd("BFS");
  console.log("minimum path steps", minimumPathSteps);

  console.time("dijkstra");
  minimumPathSteps = dijkstra(startNode, endNode);
  console.timeEnd("dijkstra");
  console.log("minimum path steps", minimumPathSteps);
} else if (puzzlePart === "2") {
  let minimumPathSteps = Infinity;

  const assessCandidate = (minPathSteps, node) => {
    minimumPathSteps =
      typeof minPathSteps === "number"
        ? Math.min(minimumPathSteps, minPathSteps)
        : minimumPathSteps;
  };

  console.time("BFS");
  for (let minElevationNode of minElevationNodes)
    assessCandidate(breadthFirstTraversal(minElevationNode, endNode));
  console.timeEnd("BFS");
  console.log("minimum path steps", minimumPathSteps);

  minimumPathSteps = Infinity;
  console.time("dijkstra");
  for (let minElevationNode of minElevationNodes)
    assessCandidate(dijkstra(minElevationNode, endNode));
  console.timeEnd("dijkstra");
  console.log("minimum path steps", minimumPathSteps);
}
