// const input = require("./sampleInput").split("\n");
const input = require("./input").split("\n");

const dividerPackets = [[[2]], [[6]]];
const isDividerPacket = (packet) =>
  Array.isArray(packet) &&
  packet.length === 1 &&
  Array.isArray(packet[0]) &&
  packet[0].length === 1 &&
  !Array.isArray(packet[0][0]) &&
  [2, 6].includes(packet[0][0]);

let pairs = [],
  pairIdx = 0;

while (input[pairIdx]) {
  pairs.push([JSON.parse(input[pairIdx]), JSON.parse(input[pairIdx + 1])]);
  pairIdx += 3;
}

function isPacketsOrderCorrect(a, b) {
  if (typeof a === "number" && typeof b === "number") {
    return a > b ? false : a < b ? true : undefined;
  } else if (Array.isArray(a) !== Array.isArray(b)) {
    return isPacketsOrderCorrect(
      Array.isArray(a) ? a : [a],
      Array.isArray(b) ? b : [b]
    );
  }

  for (let i = 0, end = Math.max(a.length, b.length); i < end; i++) {
    if (a[i] === undefined) return true;
    if (b[i] === undefined) return false;
    const result = isPacketsOrderCorrect(a[i], b[i]);
    if (result !== undefined) return result;
  }
  return undefined;
}

const [_, __, puzzlePart] = process.argv;

if (puzzlePart === "1") {
  const correctIndices = [];

  for (let pairIdx = 0; pairIdx < pairs.length; pairIdx++) {
    if (isPacketsOrderCorrect(...pairs[pairIdx])) correctIndices.push(pairIdx);
  }
  console.log(
    "correct indices sum",
    correctIndices.reduce((sum, idx) => sum + (idx + 1), 0)
  );
} else if (puzzlePart === "2") {
  const allPackets = dividerPackets
    .concat(
      pairs.reduce((arr, pair) => {
        pair.forEach((packet) => arr.push(packet));
        return arr;
      }),
      []
    )
    .sort((a, b) => (isPacketsOrderCorrect(a, b) ? -1 : 1));

  let product = 1;
  for (let i = 0; i < allPackets.length; i++)
    if (isDividerPacket(allPackets[i])) product *= i + 1;

  console.log("decoder key", product);
}
