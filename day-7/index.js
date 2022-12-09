// const input = require("./sampleInput").split("\n");
const input = require("./input").split("\n");

const directoriesDic = {};

const diskCapacity = 70000000;
const requiredSpace = 30000000;

function addDirectoryContents(node, outputLines) {
  outputLines.forEach((line) => {
    const [fileSize, childName] = line.split(" ");
    if (fileSize === "dir") {
      node.subdirectories.push(`${node.name}/${childName}`);
    } else {
      node.files.push(childName);
      node.size += parseInt(fileSize);
    }
  });
}

function createDirectory(path, outputLines) {
  const pathStr = path.join("/");

  const node = {
    name: pathStr,
    files: [],
    root: pathStr === "/",
    size: 0,
    subdirectories: [],
    totalSize: 0,
  };

  if (outputLines) addDirectoryContents(node, outputLines);

  directoriesDic[pathStr] = node;
  return node;
}

function runCommand(command, path) {
  const { text: commandText, outputLines } = command;
  const [cmd, arg] = commandText.split(" ");

  if (cmd === "cd") {
    if (arg === "..") return path.length > 1 && path.slice(0, path.length - 1);

    const newPath = [...path, arg];
    if (!directoriesDic[arg]) createDirectory(newPath);
    return newPath;
  }

  addDirectoryContents(directoriesDic[path.join("/")], outputLines);
  return path;
}

function getCommands(input) {
  const commands = [];
  let current = { text: null, outputLines: [] };

  input.forEach((line) => {
    if (line[0] === "$") {
      if (current.text) commands.push(current);
      current = { text: line.substr(2), outputLines: [] };
    } else {
      current.outputLines.push(line);
    }
  });

  return commands.concat(current);
}

function getTotalSize(directoryName) {
  const { size, subdirectories, totalSize } = directoriesDic[directoryName];
  if (!totalSize)
    directoriesDic[directoryName].totalSize =
      size +
      subdirectories.reduce(
        (sum, subdirectory) => sum + getTotalSize(subdirectory),
        0
      );
  return directoriesDic[directoryName].totalSize;
}

const [_, __, puzzlePart] = process.argv;

let path = [];
getCommands(input).forEach((command) => {
  path = runCommand(command, path);
});

if (puzzlePart === "1") {
  const under100kSum = Object.keys(directoriesDic).reduce(
    (sum, directoryName) => {
      const totalSize = getTotalSize(directoryName);
      return totalSize <= 100000 ? sum + totalSize : sum;
    },
    0
  );
  console.log("Under 100K sum", under100kSum);
} else if (puzzlePart === "2") {
  const freeSpace = diskCapacity - getTotalSize("/");
  const neededSpace = requiredSpace - freeSpace;

  let leastRequiredDirectorySize = Infinity;
  Object.keys(directoriesDic).forEach((directoryPath) => {
    const { totalSize } = directoriesDic[directoryPath];
    if (totalSize > neededSpace && leastRequiredDirectorySize > totalSize)
      leastRequiredDirectorySize = totalSize;
  });

  console.log("Least total size required", leastRequiredDirectorySize);
}
