// const input = require("./sampleInput").split("\n");
const input = require("./input").split("\n");

const part1Choices = {
  A: {
    name: "rock",
    score: 1,
    paper: "loss",
    scissors: "win",
  },
  B: {
    name: "paper",
    score: 2,
    rock: "win",
    scissors: "loss",
  },
  C: {
    name: "scissors",
    score: 3,
    rock: "loss",
    paper: "win",
  },
};
part1Choices.X = part1Choices.A;
part1Choices.Y = part1Choices.B;
part1Choices.Z = part1Choices.C;

const part2Choices = {
  A: {
    name: "rock",
    score: 1,
    loss: "C",
    win: "B",
    draw: "A",
  },
  B: {
    name: "paper",
    score: 2,
    win: "C",
    loss: "A",
    draw: "B",
  },
  C: {
    name: "scissors",
    score: 3,
    loss: "B",
    win: "A",
    draw: "C",
  },
};
const desiredResultTypes = {
  X: "loss",
  Y: "draw",
  Z: "win",
};

const [_, __, puzzlePart] = process.argv;

if (puzzlePart === "1") {
  const strategyGuideScore = input.reduce((score, game) => {
    const [opponent, me] = game.split(" ");
    const result = part1Choices[me][part1Choices[opponent].name];
    const resultScore = result === "win" ? 6 : result === "loss" ? 0 : 3;
    return score + resultScore + part1Choices[me].score;
  }, 0);
  console.log("Strategy guide score", strategyGuideScore);
} else if (puzzlePart === "2") {
  const correctStrategyGuideScore = input.reduce((score, game) => {
    const [opponent, desiredResult] = game.split(" ");
    const result = desiredResultTypes[desiredResult];
    const resultScore = result === "win" ? 6 : result === "loss" ? 0 : 3;
    const myChoice = part2Choices[part2Choices[opponent][result]];
    return score + resultScore + myChoice.score;
  }, 0);
  console.log("Correct strategy guide score", correctStrategyGuideScore);
}
