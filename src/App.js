import { useEffect, useState } from "react";
import "./App.css";
import "react-notifications/lib/notifications.css";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";

import Modal from "react-modal";

function App() {
  const rows = [0, 1, 2, 3, 4, 5];
  const cols = [0, 1, 2, 3, 4, 5];

  const [activeSide, setActiveSide] = useState("p1");
  const [activePiece, setActivePiece] = useState();

  const [p1Pool, setP1Pool] = useState({ kittens: 8, cats: 0 });

  const [p2Pool, setP2Pool] = useState({ kittens: 8, cats: 0 });

  const [playerWon, setPlayerWon] = useState();

  const [p1, setP1] = useState([
    { piece: "kitten1", image: "gray_kitten.png", position: "" },
    { piece: "kitten2", image: "gray_kitten.png", position: "" },
    { piece: "kitten3", image: "gray_kitten.png", position: "" },
    { piece: "kitten4", image: "gray_kitten.png", position: "" },
    { piece: "kitten5", image: "gray_kitten.png", position: "" },
    { piece: "kitten6", image: "gray_kitten.png", position: "" },
    { piece: "kitten7", image: "gray_kitten.png", position: "" },
    { piece: "kitten8", image: "gray_kitten.png", position: "" },
  ]);

  const [p2, setP2] = useState([
    { piece: "kitten1", image: "orange_kitten.png", position: "" },
    { piece: "kitten2", image: "orange_kitten.png", position: "" },
    { piece: "kitten3", image: "orange_kitten.png", position: "" },
    { piece: "kitten4", image: "orange_kitten.png", position: "" },
    { piece: "kitten5", image: "orange_kitten.png", position: "" },
    { piece: "kitten6", image: "orange_kitten.png", position: "" },
    { piece: "kitten7", image: "orange_kitten.png", position: "" },
    { piece: "kitten8", image: "orange_kitten.png", position: "" },
  ]);

  useEffect(() => {
    const pieceName = [];
    const pieceLocation = [];
    for (const onePiece of p1) {
      pieceName.push(onePiece.image);
      pieceLocation.push(onePiece.position);
    }
    for (const onePiece of p2) {
      pieceName.push(onePiece.image);
      pieceLocation.push(onePiece.position);
    }
    for (const rowVal of rows) {
      for (const colsVal of cols) {
        const targetDiv = document.getElementById(`${rowVal}${colsVal}`);
        targetDiv.innerHTML = "";
        const index = pieceLocation.findIndex(
          (idCheck) => idCheck === `${rowVal}${colsVal}`
        );
        if (index !== -1) {
          targetDiv.innerHTML = `<img className="h-20 w-20" src="/assets/${pieceName[index]}" alt="${pieceName[index]}"/>`;
        }
      }
    }

    let playableP1Kittens = 0,
      playableP2Kittens = 0;

    p1.forEach((piece) => {
      if (piece.position === "") {
        playableP1Kittens++;
      }
    });

    p2.forEach((piece) => {
      if (piece.position === "") {
        playableP2Kittens++;
      }
    });

    setP1Pool({
      kittens: playableP1Kittens,
      cats: 0,
    });

    setP2Pool({
      kittens: playableP2Kittens,
      cats: 0,
    });
  }, [p1, p2]);

  const boardClicked = (row, col) => {
    if (!activePiece)
      return NotificationManager.warning(
        `${activeSide} please select a cat first`
      );
    const filledSpots = [];
    p1.forEach((piece) => filledSpots.push(piece.position));
    p2.forEach((piece) => filledSpots.push(piece.position));
    if (filledSpots.includes(`${row}${col}`))
      return NotificationManager.warning(
        `Cats don't like other cats sitting on them :()`
      );
    const p1Copy = p1.map((item) => ({ ...item }));
    const p2Copy = p2.map((item) => ({ ...item }));

    const surroundingPosArray = [];
    const movementBluePrint = [
      [+1, -1],
      [+1, +0],
      [+1, +1],
      [+0, -1],
      [+0, +1],
      [-1, -1],
      [-1, +0],
      [-1, +1],
    ];
    movementBluePrint.forEach((movement) =>
      surroundingPosArray.push(
        `${Number(row) + movement[0]}${Number(col) + movement[1]}`
      )
    );

    const piecesOnThosePositions = [];

    filledSpots.forEach((oneSpot) => {
      if (surroundingPosArray.includes(oneSpot)) {
        piecesOnThosePositions.push(oneSpot);
      }
    });

    const definitelyMovablePieces = [];

    console.log("piecesOnThosePositions", piecesOnThosePositions);

    for (const movablePiece of piecesOnThosePositions) {
      const direction = [
        (Number(movablePiece[0]) - row) * 2,
        (Number(movablePiece[1]) - col) * 2,
      ];
      console.log(direction);
      if (
        !filledSpots.includes(
          `${Number(row) + direction[0]}${Number(col) + direction[1]}`
        )
      ) {
        definitelyMovablePieces.push({
          original: movablePiece,
          new: `${Number(row) + direction[0]}${Number(col) + direction[1]}`,
        });
      }
    }

    const legalPositions = [];

    for (const oneRow of rows) {
      for (const oneCol of cols) {
        legalPositions.push(`${oneRow}${oneCol}`);
      }
    }

    for (const updatedPos of definitelyMovablePieces) {
      for (const p1Piece of p1Copy) {
        if (updatedPos.original === p1Piece.position) {
          if (legalPositions.includes(updatedPos.new))
            p1Piece.position = updatedPos.new;
          else p1Piece.position = "";
        }
      }
      for (const p2Piece of p2Copy) {
        if (updatedPos.original === p2Piece.position) {
          if (legalPositions.includes(updatedPos.new))
            p2Piece.position = updatedPos.new;
          else p2Piece.position = "";
        }
      }
    }

    const pool = activeSide === "p1" ? p1Copy : p2Copy;

    for (const piece of pool) {
      if (piece.piece === activePiece.piece) {
        piece.position = `${row}${col}`;
        break;
      }
    }

    const setsOfThree = [
      [0, -1],
      [0, +1],
      [-1, +0],
      [+1, +0],
      [-1, -1],
      [+1, +1],
      [+1, -1],
      [+1, -1],
    ];

    const calculateNewPosFromOld = (current, posArray) => {
      return `${Number(current[0]) + posArray[0]}${
        Number(current[1]) + posArray[1]
      }`;
    };

    const checkIfWin = (allPiecesOneSide) => {
      const activeSidePos = [];

      allPiecesOneSide.forEach((piece) =>
        piece.position !== "" ? activeSidePos.push(piece.position) : undefined
      );

      const existingSetsOfThree = [];

      for (const onePiece of allPiecesOneSide) {
        if (onePiece.position !== "") {
          const toLeft = calculateNewPosFromOld(
            onePiece.position,
            setsOfThree[0]
          );
          const toRight = calculateNewPosFromOld(
            onePiece.position,
            setsOfThree[1]
          );
          const toTop = calculateNewPosFromOld(
            onePiece.position,
            setsOfThree[2]
          );
          const toBottom = calculateNewPosFromOld(
            onePiece.position,
            setsOfThree[3]
          );
          const toTopLeft = calculateNewPosFromOld(
            onePiece.position,
            setsOfThree[4]
          );
          const toBottomRight = calculateNewPosFromOld(
            onePiece.position,
            setsOfThree[5]
          );
          const toTopRight = calculateNewPosFromOld(
            onePiece.position,
            setsOfThree[6]
          );
          const toBottomLeft = calculateNewPosFromOld(
            onePiece.position,
            setsOfThree[7]
          );

          const checkIfSetExists = (oneSide, otherSide) => {
            if (
              activeSidePos.includes(oneSide) &&
              activeSidePos.includes(otherSide)
            ) {
              existingSetsOfThree.push([oneSide, onePiece.position, otherSide]);
            }
          };

          checkIfSetExists(toLeft, toRight);
          checkIfSetExists(toTop, toBottom);
          checkIfSetExists(toTopLeft, toBottomRight);
          checkIfSetExists(toTopRight, toBottomLeft);
        }
      }

      if (existingSetsOfThree.length) return true;
    };

    const didP1Win = checkIfWin(p1Copy);
    const didP2Win = checkIfWin(p2Copy);

    if (didP1Win && !didP2Win) setPlayerWon("p1");
    else if (!didP1Win && didP2Win) setPlayerWon("p2");
    else if (didP1Win && didP2Win) setPlayerWon("draw");

    setP1(p1Copy);
    setP2(p2Copy);

    setActiveSide(activeSide === "p1" ? "p2" : "p1");
    setActivePiece();
  };

  const pieceSelected = (side, type) => {
    if (side !== activeSide)
      return NotificationManager.warning(
        "Forgot your colour already? not a cat person ig :("
      );
    if (type === "cat")
      return NotificationManager.warning(
        "Cats are not in the mood rn. Please play with the kittens :("
      );
    const pool = side === "p1" ? p1 : p2;
    let pieceAvailable = false;
    for (const onePiece of pool) {
      if (onePiece.position === "") {
        pieceAvailable = onePiece;
        break;
      }
    }
    if (pieceAvailable) {
      setActivePiece({ piece: pieceAvailable.piece });
    } else {
      return NotificationManager.error("pool empty oh nooo....");
      //more code for that later
    }
  };

  return (
    <div className="relative">
      {playerWon ? (
        <div className="absolute w-screen flex items-center justify-center text-3xl font-bold bg-sky-500/50 p-4 text-white">
          {playerWon === "p1"
            ? "Grey Cats WON!!!"
            : playerWon === "p2"
            ? "Orange Cats WON!!!"
            : "T'was a DRAW!!!"}
        </div>
      ) : (
        <div></div>
      )}
      <div className="h-screen w-screen flex items-center justify-between">
        <div className="ml-10">
          <div
            onClick={() => pieceSelected("p1", "kitten")}
            className="flex items-center justify-center cursor-pointer"
          >
            <img
              className="h-20 w-20"
              src={`/assets/gray_kitten.png`}
              alt="yeet"
            />{" "}
            <span className="text-3xl font-bold bg-sky-500/50 p-4 text-white rounded-lg">
              x {p1Pool.kittens}
            </span>
          </div>
          <div
            onClick={() => pieceSelected("p1", "cat")}
            className="flex items-center justify-center cursor-pointer"
          >
            <img
              className="h-20 w-20"
              src={`/assets/gray_cat.png`}
              alt="yeet"
            />{" "}
            <span className="text-3xl font-bold bg-sky-500/50 p-4 text-white rounded-lg">
              x {p1Pool.cats}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-center">
          {cols.map((colVal, colIndex) => (
            <div className="flex flex-col bg-blue-100">
              {rows.map((rowVal, rowIndex) => (
                <div
                  className={`h-24 w-24 ${
                    rowIndex % 2 === 0 && colIndex % 2 === 0
                      ? "bg-blue-300"
                      : ""
                  } 
              ${rowIndex % 2 !== 0 && colIndex % 2 !== 0 ? "bg-blue-300" : ""} 
                flex`}
                >
                  <div
                    onClick={() => {
                      boardClicked(rowVal, colVal);
                    }}
                    className={`flex items-center justify-center h-full w-full`}
                    id={`${rowVal}${colVal}`}
                  >
                    {rowVal}
                    {colVal}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="mr-10">
          <div
            onClick={() => pieceSelected("p2", "kitten")}
            className="flex items-center justify-center cursor-pointer"
          >
            <img
              className="h-20 w-20"
              src={`/assets/orange_kitten.png`}
              alt="yeet"
            />{" "}
            <span className="text-3xl font-bold bg-sky-500/50 p-4 text-white rounded-lg">
              x {p2Pool.kittens}
            </span>
          </div>
          <div
            onClick={() => pieceSelected("p2", "cat")}
            className="flex items-center justify-center cursor-pointer"
          >
            <img
              className="h-20 w-20"
              src={`/assets/orange_cat.png`}
              alt="yeet"
            />{" "}
            <span className="text-3xl font-bold bg-sky-500/50 p-4 text-white rounded-lg">
              x {p2Pool.cats}
            </span>
          </div>
        </div>
        <NotificationContainer />
      </div>
    </div>
  );
}

export default App;
