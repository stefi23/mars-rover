const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const getUserInput = (question) => {
  return new Promise((resolve, reject) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
};

const main = async () => {
  const platauCoordinates = await getUserInput(
    "Specify the size of the Mars plateau (e.g. 5 5):"
  );

  if (!arePlateauCoordinatesCorrect(platauCoordinates)) return rl.close();
  let responsePlateau = platauCoordinates.split(" ");

  let plateau = {
    x: parseInt(responsePlateau[0]),
    y: parseInt(responsePlateau[1]),
  };

  const roverPositionAndDirection = await getUserInput(
    "Specify the initial coordinates and orientation of the mars rover (e.g. 1 2 N):"
  );

  if (!isMarsPositionCorrect(roverPositionAndDirection)) return rl.close();

  let roverPosition = roverPositionAndDirection.split(" ");

  if (!isRoverPositionCorrect(roverPosition, plateau)) return rl.close();

  let roverOrientation = roverPosition[2].toUpperCase();

  if (!isRoverOrientationCorrect(roverOrientation)) return rl.close();

  let rover = {
    x: parseInt(roverPosition[0]),
    y: parseInt(roverPosition[1]),
    orientation: roverPosition[2],
  };
  console.log("rover: ", rover);
  const directions = await getUserInput(
    "Specify the instructions for the mars rover (e.g. LMLMLMLMM):"
  );

  if (!areDirectionCorrect(directions)) return rl.close();

  moveRover(rover, directions, plateau);

  rl.close();
};

function turnRoverLeft(rover) {
  switch (rover.orientation) {
    case "N":
      rover.orientation = "W";
      break;
    case "W":
      rover.orientation = "S";
      break;
    case "S":
      rover.orientation = "E";
      break;
    case "E":
      rover.orientation = "N";
      break;
  }
  // console.log(`The rover turned left and is now facing ${rover.orientation}.`);
}

function turnRoverRight(rover) {
  switch (rover.orientation) {
    case "N":
      rover.orientation = "E";
      break;
    case "E":
      rover.orientation = "S";
      break;
    case "S":
      rover.orientation = "W";
      break;
    case "W":
      rover.orientation = "N";
      break;
  }
  // console.log(`The rover turned right and is now facing ${rover.orientation}.`);
}

function moveRoverForward(rover) {
  switch (rover.orientation) {
    // Assume that the square directly North from (x, y) is (x, y+1).
    case "N":
      rover.y++;
      break;
    case "E":
      rover.x++;
      break;
    case "S":
      rover.y--;
      break;
    case "W":
      rover.x--;
      break;
  }
  // console.log(
  //   `The rover moved forward and is now in:\n x: ${rover.x} \n y: ${rover.y}`
  // );
  let newPosition = { x: rover.x, y: rover.y };
  // console.log(newPosition);
}

function moveRover(rover, directions, plateau) {
  /* Uses the supplied operations and moves the rover according to the string of operations. */
  for (let i = 0; i < directions.length; i++) {
    let orientation = directions[i];
    switch (orientation) {
      case "L":
        turnRoverLeft(rover);
        break;
      case "R":
        turnRoverRight(rover);
        break;
      case "M":
        moveRoverForward(rover);
        break;
    }
  }

  if (
    rover.x < 0 ||
    rover.y < 0 ||
    rover.x > plateau.x ||
    rover.y > plateau.y
  ) {
    console.log("The rover left Mars. Congratulations!");
  } else {
    // console.log(`The rover ended in: x: ${rover.x} y: ${rover.y}`);
    console.log(`${rover.x} ${rover.y} ${rover.orientation}`);
  }
}

function arePlateauCoordinatesCorrect(input) {
  let regexX = /^(\d+ \d+)/;
  if (!regexX.test(input)) {
    console.log("Wrong plateau coordindates entered");
    return false;
  }
  return true;
}

function isMarsPositionCorrect(input) {
  let regexY = /^(\d+ \d+ \w{1})/;
  if (!regexY.test(input)) {
    console.log("The position given for the Rover is incorrect");
    return false;
  }
  return true;
}

function isRoverPositionCorrect(input, plateau) {
  if (
    parseInt(input[0]) < 0 ||
    parseInt(input[0]) > plateau.x ||
    parseInt(input[1]) < 0 ||
    parseInt(input[1]) > plateau.y
  ) {
    console.log("You positioned the Mars outside of the Plateau");
    return false;
  }
  return true;
}

function isRoverOrientationCorrect(roverOrientation) {
  if (
    roverOrientation !== "N" &&
    roverOrientation !== "S" &&
    roverOrientation !== "W" &&
    roverOrientation !== "E"
  ) {
    console.log(
      `You've entered ${roverOrientation} which is not a correct coordinate`
    );
    return false;
  }
  return true;
}

function areDirectionCorrect(directions) {
  let regexZ = /^[LMR]*$/;
  if (!regexZ.test(directions)) {
    console.log("Wrong directions. Only values 'L', 'M' or 'R' accepted!");
    return false;
  }
  return true;
}

main();
