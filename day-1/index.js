// const input = require("./sampleInput").split("\n");
const input = require("./input").split("\n");

const [_, __, puzzlePart] = process.argv;

function getSortedCalories() {
  const temp = input.reduce(
    (obj, line) => {
      if (!obj.current) obj.current = 0;
      if (line.match(/\d/)) obj.current += parseInt(line);
      else {
        obj.elfs.push(obj.current);
        obj.current = null;
      }
      return obj;
    },
    { elfs: [], current: null }
  );
  return [...temp.elfs, temp.current].sort((a, b) =>
    parseInt(a) > parseInt(b) ? -1 : 1
  );
}

if (puzzlePart === "1") {
  console.log("Most calories", getSortedCalories()[0]);
} else if (puzzlePart === "2") {
  console.log(
    "Sum of 3 with the most calories",
    getSortedCalories()
      .slice(0, 3)
      .reduce((sum, num) => sum + num, 0)
  );
}
