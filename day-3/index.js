// const input = require("./sampleInput").split("\n");
const input = require("./input").split("\n");

const lowerCaseOffset = "a".charCodeAt(0) - 1;
const upperCaseOffset = "A".charCodeAt(0) - 27;

const [_, __, puzzlePart] = process.argv;

function getPriority(itemType) {
  const charCode = itemType.charCodeAt(0);
  const isUppercase = charCode <= "a".charCodeAt(0);
  return charCode - (isUppercase ? upperCaseOffset : lowerCaseOffset);
}

function findGroupItemTypePriority(rucksacks) {
  const itemType = rucksacks.reduce(
    (arr, rucksack) =>
      arr
        ? Array.from(rucksack).filter((itemType) => arr.includes(itemType))
        : Array.from(rucksack),
    null
  )[0];
  return getPriority(itemType);
}

if (puzzlePart === "1") {
  const priorities = input.reduce((sum, input) => {
    const arr = Array.from(input);
    const compartment1 = arr
      .filter((_, i) => i < arr.length / 2)
      .reduce((obj, char) => ({ ...obj, [char]: true }), {});
    const duplicate = arr
      .filter((_, i) => i >= arr.length / 2)
      .find((char) => compartment1[char] === true);
    return sum + getPriority(duplicate);
  }, 0);

  console.log("part1 sum of priorities", priorities);
} else if (puzzlePart === "2") {
  const priorities = input.reduce(
    (sum, _, idx) =>
      idx % 3 === 0
        ? sum + findGroupItemTypePriority(input.slice(idx, idx + 3))
        : sum,
    0
  );
  console.log("part2 sum of priorities", priorities);
}
