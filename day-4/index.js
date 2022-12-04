// const input = require("./sampleInput").split("\n");
const input = require("./input").split("\n");

const [_, __, puzzlePart] = process.argv;

const parseSection = (sectionStr) => {
  const [from, to] = sectionStr.split("-").map((s) => parseInt(s, 10));
  return { from, to };
};

if (puzzlePart === "1") {
  const fullyCoveredPairsSum = input.reduce((sum, line) => {
    const [section1, section2] = line.split(",").map(parseSection);
    const covered =
      (section1.from <= section2.from && section1.to >= section2.to) ||
      (section1.from >= section2.from && section1.to <= section2.to);
    return covered ? sum + 1 : sum;
  }, 0);
  console.log("fully covered pairs", fullyCoveredPairsSum);
} else if (puzzlePart === "2") {
  const overlappingPairsSum = input.reduce((sum, line) => {
    const [section1, section2] = line.split(",").map(parseSection);
    const overlap =
      (section1.from <= section2.from && section1.to >= section2.from) ||
      (section2.from <= section1.from && section2.to >= section1.from);
    return overlap ? sum + 1 : sum;
  }, 0);
  console.log("overlapping pairs", overlappingPairsSum);
}
