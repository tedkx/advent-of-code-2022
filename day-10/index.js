// const input = require("./sampleInput").split("\n");
const input = require("./input").split("\n");

const cycleDelay = 1;
const signalCycles = [20, 60, 100, 140, 180, 220];
const signalStrengths = [];
const screenWidth = 40;
const screenOutput = [];

let cycleIdx = 0;
let currentInstruction = null;
let registerX = 1;

function tick() {
  cycleIdx++;

  if (signalCycles.includes(cycleIdx))
    signalStrengths.push(cycleIdx * registerX);

  const screenVerticalPosition = Math.floor((cycleIdx - 1) / screenWidth);
  if (!screenOutput[screenVerticalPosition])
    screenOutput[screenVerticalPosition] = Array.from(Array(screenWidth)).map(
      () => null
    );
  const screenPosition = (cycleIdx - 1) % screenWidth;
  screenOutput[screenVerticalPosition][screenPosition] =
    registerX - 1 <= screenPosition && registerX + 1 >= screenPosition
      ? "#"
      : ".";

  // if (cycleIdx < 22)
  //   console.log(
  //     "cycle",
  //     cycleIdx,
  //     "crt pos",
  //     screenPosition,
  //     "vertical",
  //     screenVerticalPosition,
  //     "sprite",
  //     registerX,
  //     "->",
  //     screenOutput[screenVerticalPosition][screenPosition]
  //   );

  if (currentInstruction) {
    currentInstruction.ticksLeft--;
    if (currentInstruction.ticksLeft === 0) {
      registerX += currentInstruction.value;
      currentInstruction = null;
    }
    // console.log("cycle", cycleIdx, "register", registerX);
  } else {
    const [command, arg] = input.shift().split(" ");
    // console.log("cycle", cycleIdx, command, arg, "register", registerX);
    if (command === "addx")
      currentInstruction = { ticksLeft: 1, value: parseInt(arg) };
  }

  if (input.length > 0 || currentInstruction) setTimeout(tick, cycleDelay);
  else tickFinishCallback();
}

const [_, __, puzzlePart] = process.argv;

if (puzzlePart === "1") {
  tickFinishCallback = function () {
    console.log(
      "signal strength",
      signalStrengths.reduce((sum, strength) => sum + strength, 0)
    );
  };
  tick();
} else if (puzzlePart === "2") {
  tickFinishCallback = function () {
    console.log("screen output");
    screenOutput.forEach((arr) => console.log(arr.join("")));
  };
  tick();
}
