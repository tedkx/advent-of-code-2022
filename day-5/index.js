//const input = require("./sampleInput").split("\n");
const input = require("./input").split("\n");

let inputSplitIdx = 0;
while (true) {
  if (input[inputSplitIdx].replace(/ /g, "") === "") break;
  inputSplitIdx++;
}

const instructions = input.filter((_, idx) => idx > inputSplitIdx);
const crates = input
  .filter((_, idx) => idx < inputSplitIdx)
  .reverse()
  .reduce(
    (obj, line, idx) => {
      if (idx === 0)
        return { ...obj, size: parseInt(line.match(/\d\s+$/)[0], 10) };
      Array.from(Array(obj.size)).forEach((_, arrayIdx) => {
        if (!obj.arr[arrayIdx]) obj.arr[arrayIdx] = [];
        const crate = line.substr(arrayIdx * 4 + 1, 1);
        if (crate !== " ") obj.arr[arrayIdx].push(crate);
      });
      return obj;
    },
    { arr: [], size: 0 }
  ).arr;

// console.log("inputSplitIdex", inputSplitIdx, instructions, crates);

const [_, __, puzzlePart] = process.argv;

if (puzzlePart === "1") {
  for (let instruction of instructions) {
    let [_, quantity, fromStack, toStack] = Array.from(
      instruction.match(/move (\d+) from (\d+) to (\d+)/)
    ).map((d) => parseInt(d, 10));
    while (quantity > 0) {
      const crate = crates[fromStack - 1].pop();
      crates[toStack - 1].push(crate);
      quantity--;
    }
  }
  console.log(
    "after rearrangement",
    crates.map((stack) => stack[stack.length - 1]).join("")
  );
} else if (puzzlePart === "2") {
  for (let instruction of instructions) {
    let [_, quantity, fromStack, toStack] = Array.from(
      instruction.match(/move (\d+) from (\d+) to (\d+)/)
    ).map((d) => parseInt(d, 10));
    const moved = crates[fromStack - 1].splice(
      crates[fromStack - 1].length - quantity,
      crates[fromStack - 1].length
    );
    crates[toStack - 1] = crates[toStack - 1].concat(moved);
  }
  console.log(
    "after rearrangement",
    crates.map((stack) => stack[stack.length - 1]).join("")
  );
}
