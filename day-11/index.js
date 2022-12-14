// const input = require("./sampleInput").split("\n");
const input = require("./input").split("\n");

const operationRegex = /new = (.+) ([*+]) (.+)/;

const monkeys = [];

let config = { rounds: null, relief: null, minimumProduct: null };

function createMonkey(inputLines) {
  const idx = parseInt(inputLines[0].split(" ")[1].split(":")[0]);
  const startingItems = inputLines[1]
    .split(":")[1]
    .trim()
    .split(",")
    .map((item) => parseInt(item.trim()));
  const [_, param1, operation, param2] = inputLines[2]
    .split(":")[1]
    .trim()
    .match(operationRegex);
  const divisor = parseInt(inputLines[3].split(": divisible by ")[1].trim());
  const throwIfTrue = parseInt(inputLines[4].split("monkey")[1].trim());
  const throwIfFalse = parseInt(inputLines[5].split("monkey")[1].trim());

  monkeys[idx] = {
    divisor,
    idx,
    inspectedItems: 0,
    items: startingItems,
    operation: (old) => {
      const value1 = param1 === "old" ? old : parseInt(param1);
      const value2 = param2 === "old" ? old : parseInt(param2);
      return operation === "*" ? value1 * value2 : value1 + value2;
    },
    test: (value) => {
      const throwMonkeyIdx = value % divisor === 0 ? throwIfTrue : throwIfFalse;
      monkeys[throwMonkeyIdx].items.push(value % config.minimumProduct);
    },
  };
}

function formatInput() {
  let inputLines = [];

  while (input.length > 0) {
    const line = input.shift();
    if (line.replace(/ /g, "").length === 0) {
      createMonkey(inputLines);
      inputLines = [];
    } else {
      inputLines.push(line);
    }
  }

  createMonkey(inputLines);

  config.minimumProduct = monkeys.reduce(
    (product, monkey) => product * monkey.divisor,
    1
  );
}

function monkeyMove(idx) {
  const { items, operation, test } = monkeys[idx];
  while (items.length > 0) {
    const item = items.shift();
    monkeys[idx].inspectedItems++;

    const reliefDivisor = config.relief ? 3 : 1;
    const worryLevel = Math.floor(operation(item) / reliefDivisor);
    test(worryLevel);
  }
}

formatInput(input);

const [_, __, puzzlePart] = process.argv;

if (puzzlePart === "1") {
  config.rounds = 20;
  config.relief = true;
} else if (puzzlePart === "2") {
  config.rounds = 10000;
  config.relief = false;
}

for (let ri = 1; ri <= config.rounds; ri++)
  for (let i = 0; i < monkeys.length; i++) monkeyMove(i);

monkeys.sort((a, b) => (a.inspectedItems > b.inspectedItems ? -1 : 1));
console.log(
  "monkey biz",
  monkeys,
  monkeys[0].inspectedItems * monkeys[1].inspectedItems
);
