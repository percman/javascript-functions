function seed() {
  return Array.from(arguments);
}

function same([x, y], [j, k]) {
  return x == j && y == k;
}

// The game state to search for `cell` is passed as the `this` value of the function.
function contains(cell) {
  return this.some((c) => same(cell, c));
}

const printCell = (cell, state) => {
  if (contains.call(state, cell)) {
    return "\u25A3";
  }
  return "\u25A2";
};

const corners = (state = []) => {
  let topRight;
  let bottomLeft;

  if (state.length == 0) {
    topRight = [0, 0];
    bottomLeft = [0, 0];
  } else {
    xValues = state.map(([x, _]) => x);
    yValues = state.map(([_, y]) => y);

    topRight = [Math.max(...xValues), Math.max(...yValues)];
    bottomLeft = [Math.min(...xValues), Math.min(...yValues)];
  }

  return { topRight, bottomLeft };
};

const printCells = (state) => {
  const { topRight, bottomLeft } = corners(state);

  let cells = "";
  for (let y = topRight[1]; y >= bottomLeft[1]; y--) {
    for (let x = bottomLeft[0]; x <= topRight[0]; x++) {
      cells += printCell([x, y], state);
      if (x != topRight[0]) cells += " ";
    }
    cells += "\n";
  }
  return cells;
};

const getNeighborsOf = ([x, y]) => {
  const neighbors = [];
  for (let i = x - 1; i <= x + 1; i++) {
    for (let j = y - 1; j <= y + 1; j++) {
      if (i != x || j != y) neighbors.push([i, j]);
    }
  }
  return neighbors;
};

const getLivingNeighbors = (cell, state) => {
  return getNeighborsOf(cell).filter((neighbor) =>
    contains.bind(state)(neighbor)
  );
};

const willBeAlive = (cell, state) => {
  return (
    getLivingNeighbors(cell, state).length == 3 ||
    (getLivingNeighbors(cell, state).length == 2 && contains.call(state, cell))
  );
};

const calculateNext = (state) => {
  const { topRight, bottomLeft } = corners(state);
  let newTopRight = [topRight[0] + 1, topRight[1] + 1];
  let newBottomLeft = [bottomLeft[0] - 1, bottomLeft[1] - 1];

  const newGameState = [];
  for (let y = newTopRight[1]; y >= newBottomLeft[1]; y--) {
    for (let x = newBottomLeft[0]; x <= newTopRight[0]; x++) {
      if (willBeAlive([x, y], state)) newGameState.push([x, y]);
    }
  }
  return newGameState;
};

const iterate = (state, iterations) => {
  const states = [state];
  for (let i = 0; i < iterations; i++) {
    state = calculateNext(state);
    states.push(state);
  }
  return states;
};

const main = (pattern, iterations) => {
  iterate(startPatterns[pattern], iterations).forEach((state) => {
    console.log(printCells(state));
  });
};

const startPatterns = {
  rpentomino: [
    [3, 2],
    [2, 3],
    [3, 3],
    [3, 4],
    [4, 4],
  ],
  glider: [
    [-2, -2],
    [-1, -2],
    [-2, -1],
    [-1, -1],
    [1, 1],
    [2, 1],
    [3, 1],
    [3, 2],
    [2, 3],
  ],
  square: [
    [1, 1],
    [2, 1],
    [1, 2],
    [2, 2],
  ],
};

const [pattern, iterations] = process.argv.slice(2);
const runAsScript = require.main === module;

if (runAsScript) {
  if (startPatterns[pattern] && !isNaN(parseInt(iterations))) {
    main(pattern, parseInt(iterations));
  } else {
    console.log("Usage: node js/gameoflife.js rpentomino 50");
  }
}

exports.seed = seed;
exports.same = same;
exports.contains = contains;
exports.getNeighborsOf = getNeighborsOf;
exports.getLivingNeighbors = getLivingNeighbors;
exports.willBeAlive = willBeAlive;
exports.corners = corners;
exports.calculateNext = calculateNext;
exports.printCell = printCell;
exports.printCells = printCells;
exports.startPatterns = startPatterns;
exports.iterate = iterate;
exports.main = main;
