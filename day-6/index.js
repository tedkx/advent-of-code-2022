// const input = Array.from(require("./sampleInput"));
const input = Array.from(require("./input"));

const [_, __, puzzlePart] = process.argv;

const getStartMarkerChars = (uniqueCharsCount) => {
  let charIndex = 0;
  const sequence = [];
  while (charIndex <= input.length) {
    if (sequence.length == uniqueCharsCount) {
      sequence.shift();
    }
    charIndex++;

    sequence.push(input[charIndex]);
    if (sequence.length == uniqueCharsCount) {
      const occurrences = sequence.reduce((obj, char) => {
        if (!obj[char]) obj[char] = 0;
        obj[char]++;
        return obj;
      }, {});
      // console.log(sequence, occurrences);
      if (Object.values(occurrences).every((item) => item == 1)) break;
    }
  }
  return charIndex + 1;
};

if (puzzlePart === "1") {
  console.log(getStartMarkerChars(4));
} else if (puzzlePart === "2") {
  console.log(getStartMarkerChars(14));
}
