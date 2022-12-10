// const input = require("./sampleInput");
const input = require("./input");
const forest = input.split("\n").map((line) => Array.from(line));

const [_, __, puzzlePart] = process.argv;

const directions = [
  { x: 0, y: 1 }, // east
  { x: 0, y: -1 }, // west
  { x: 1, y: 0 }, // south
  { x: -1, y: 0 }, // north
];

const visibleTrees = [];

const isTreeVisible = (x, y) => {
  if (x === 0 || y === 0 || x === forest[0].length || y === forest.length)
    return true;

  const height = forest[y][x];
  let directionsVisible = 4;

  for (let direction of directions) {
    let currentX = x + direction.x,
      currentY = y + direction.y;

    while (
      currentX >= 0 &&
      currentX <= forest[0].length - 1 &&
      currentY >= 0 &&
      currentY <= forest.length - 1
    ) {
      if (forest[currentY][currentX] >= height) {
        directionsVisible--;
        break;
      }

      currentX += direction.x;
      currentY += direction.y;
    }
  }

  return directionsVisible > 0;
};

const getDirectionScenicScore = (x, y, direction) => {
  const height = forest[y][x];
  let currentX = x + direction.x,
    currentY = y + direction.y,
    visibleTrees = 0;

  while (
    currentX >= 0 &&
    currentX <= forest[0].length - 1 &&
    currentY >= 0 &&
    currentY <= forest.length - 1
  ) {
    visibleTrees++;
    if (forest[currentY][currentX] >= height) break;
    currentX += direction.x;
    currentY += direction.y;
  }

  return visibleTrees;
};

const getScenicScore = (x, y) =>
  directions.reduce(
    (product, direction) => product * getDirectionScenicScore(x, y, direction),
    1
  );

if (puzzlePart === "1") {
  for (let y = 0; y < forest.length; y++)
    for (let x = 0; x < forest[0].length; x++)
      if (isTreeVisible(x, y)) visibleTrees.push([x, y]);
  console.log(visibleTrees.length, "visible trees");
} else if (puzzlePart === "2") {
  let highestScenicScore = 0;
  for (let y = 0; y < forest.length; y++)
    for (let x = 0; x < forest[0].length; x++)
      highestScenicScore = Math.max(highestScenicScore, getScenicScore(x, y));
  console.log("highest scenic score", highestScenicScore);
}
