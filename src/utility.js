import { NotificationManager } from "react-notifications";

const rows = [0, 1, 2, 3, 4, 5];
const cols = [0, 1, 2, 3, 4, 5];

export const pieceSelected = (
  side,
  type,
  activeSide,
  setActivePiece,
  p1,
  p2,
  setCatChoosen,
) => {
  if (side !== activeSide)
    return NotificationManager.warning(
      "Forgot your colour already? not a cat person ig :("
    );
  const pool = side === "p1" ? p1 : p2;
  let pieceAvailable = false;
  for (const onePiece of pool) {
    if (onePiece.piece[0] === type && onePiece.position === "") {
      pieceAvailable = onePiece;
      break;
    }
  }
  if (pieceAvailable) {
    setActivePiece({ piece: pieceAvailable.piece, type });
    setCatChoosen(type==="c"?1:0)
  } else {
    return NotificationManager.error("pool empty oh nooo....");
    //more code for that later
  }
};

export const boardClicked = (
  row,
  col,
  activePiece,
  setActivePiece,
  activeSide,
  setActiveSide,
  p1,
  p2,
  setP1,
  setP2,
  setPlayerWon,
  setPromotableArray,
  setDisableBoard
) => {
  if (!activePiece)
    return NotificationManager.warning(
      `${activeSide} please select a cat first`
    );
  const filledSpots = [];
  p1.forEach((piece) => filledSpots.push(piece.position));
  p2.forEach((piece) => filledSpots.push(piece.position));
  if (filledSpots.includes(`${row}${col}`))
    return NotificationManager.warning(
      `Cats don't like other cats sitting on them :(`
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

  for (const movablePiece of piecesOnThosePositions) {
    const direction = [
      (Number(movablePiece[0]) - row) * 2,
      (Number(movablePiece[1]) - col) * 2,
    ];
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
        if (activePiece.type === "c") {
          if (legalPositions.includes(updatedPos.new))
            p1Piece.position = updatedPos.new;
          else p1Piece.position = "";
        } else {
          if (p1Piece.piece[0] === "k") {
            if (legalPositions.includes(updatedPos.new))
              p1Piece.position = updatedPos.new;
            else p1Piece.position = "";
          }
        }
      }
    }
    for (const p2Piece of p2Copy) {
      if (updatedPos.original === p2Piece.position) {
        if (activePiece.type === "c") {
          if (legalPositions.includes(updatedPos.new))
            p2Piece.position = updatedPos.new;
          else p2Piece.position = "";
        } else {
          if (p2Piece.piece[0] === "k") {
            if (legalPositions.includes(updatedPos.new))
              p2Piece.position = updatedPos.new;
            else p2Piece.position = "";
          }
        }
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


  setP1(p1Copy);
  setP2(p2Copy);
  setActivePiece();

  // logic to check for upgrades

  const {p1BoardUpdate,p2BoardUpdate} = checkForUpgrade(p1Copy,p2Copy);

  if (
    p1BoardUpdate.existingSetsOfThreeCats.length &&
    !p2BoardUpdate.existingSetsOfThreeCats.length
  )
    setPlayerWon("Grey Cats WON !!!");
  else if (
    !p1BoardUpdate.existingSetsOfThreeCats.length &&
    p2BoardUpdate.existingSetsOfThreeCats.length
  )
    setPlayerWon("Orange Cats WON !!!");
  else if (
    p1BoardUpdate.existingSetsOfThreeCats.length &&
    p2BoardUpdate.existingSetsOfThreeCats.length
  )
    setPlayerWon("It was a DRAW !!!");

          
  if (activeSide === "p1" && p1BoardUpdate.existingSetsOfThreeAny.length) {
    setDisableBoard(true);
    return setPromotableArray(p1BoardUpdate.existingSetsOfThreeAny);
  } else if (
    activeSide === "p2" &&
    p2BoardUpdate.existingSetsOfThreeAny.length
  ) {
    setDisableBoard(true);
    return setPromotableArray(p2BoardUpdate.existingSetsOfThreeAny);
  }

  const newActiveSide = activeSide === "p1" ? "p2" : "p1";

  setActiveSide(newActiveSide);

  setDisableBoard(false);
};

export const checkForUpgrade = (p1Copy, p2Copy) => {

    const setsOfThree = [
        [0, -1],
        [0, +1],
        [-1, +0],
        [+1, +0],
        [-1, -1],
        [+1, +1],
        [+1, -1],
        [-1, +1],
      ];
    
      const calculateNewPosFromOld = (current, posArray) => {
        return `${Number(current[0]) + posArray[0]}${
          Number(current[1]) + posArray[1]
        }`;
      };
    
      const checkBoardUpdate = (allPiecesOneSide) => {
        const activeKittenPos = [];
        const activeCatPos = [];
    
        allPiecesOneSide.forEach((piece) => {
          if (piece.position !== "") {
            if (piece.piece[0] === "k") activeKittenPos.push(piece.position);
            else activeCatPos.push(piece.position);
          }
        });
    
        const existingSetsOfThreeAny = [];
        const existingSetsOfThreeCats = [];
    
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
            const toTop = calculateNewPosFromOld(onePiece.position, setsOfThree[2]);
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
    
            const checkIfSetExists = (oneSide, otherSide, pieceType) => {
              if (
                pieceType === "c" &&
                activeCatPos.includes(oneSide) &&
                activeCatPos.includes(otherSide)
              ) {
                existingSetsOfThreeCats.push([
                  oneSide,
                  onePiece.position,
                  otherSide,
                ]);
              } else if (
                [...activeKittenPos, ...activeCatPos].includes(oneSide) &&
                [...activeKittenPos, ...activeCatPos].includes(otherSide)
              ) {
                existingSetsOfThreeAny.push([
                  oneSide,
                  onePiece.position,
                  otherSide,
                ]);
              }
            };
    
            checkIfSetExists(toLeft, toRight, onePiece.piece[0]);
            checkIfSetExists(toTop, toBottom, onePiece.piece[0]);
            checkIfSetExists(toTopLeft, toBottomRight, onePiece.piece[0]);
            checkIfSetExists(toTopRight, toBottomLeft, onePiece.piece[0]);
          }
        }
    
        return {
          existingSetsOfThreeCats,
          existingSetsOfThreeAny,
        };
      };
    
      const p1BoardUpdate = checkBoardUpdate(p1Copy);
      const p2BoardUpdate = checkBoardUpdate(p2Copy);

      return {p1BoardUpdate, p2BoardUpdate}
    

}

export const upgrade = (
  activeSide,
  setActiveSide,
  p1,
  p2,
  setP1,
  setP2,
  highlightedBlocks,
  p1PoolIdx,
  setP1PoolIdx,
  p2PoolIdx,
  setP2PoolIdx,
  setPromotableArray,
  setShowPromotionBlock,
  setPromotableArrayRenderIdx,
  setHighlightedBlocks,
  setDisableBoard
) => {
  //highlightedBlocks
  const activePlayerPosCopy =
    activeSide === "p1"
      ? p1.map((item) => ({ ...item }))
      : p2.map((item) => ({ ...item }));

  const newPosArray = [];
  let newCats = activeSide === "p1" ? p1PoolIdx.cats : p2PoolIdx.cats;
  let catCount = 0;
  for (const onePiece of activePlayerPosCopy) {
    if (highlightedBlocks.includes(onePiece.position)) {
      if (onePiece.piece[0] === "k") {
        newPosArray.push({
          piece: `cat${newCats + 1}`,
          image: `${activeSide === "p1" ? "grey" : "orange"}_cat.png`,
          position: "",
        });
        newCats++;
        catCount++;
      } else {
        newPosArray.push({
          ...onePiece,
          position: "",
        });
      }
    } else {
      newPosArray.push(onePiece);
    }
  }
  activeSide === "p1"
    ? setP1PoolIdx({ ...p1PoolIdx, cats: p1PoolIdx.cats + catCount })
    : setP2PoolIdx({ ...p2PoolIdx, cats: p2PoolIdx.cats + catCount });
  activeSide === "p1" ? setP1(newPosArray) : setP2(newPosArray);
  setPromotableArray([]);
  setActiveSide(activeSide === "p1" ? "p2" : "p1");
  setShowPromotionBlock(false);
  setPromotableArrayRenderIdx(0);
  setHighlightedBlocks([]);
  setDisableBoard(false);
};

export  const tactical = (activeSide, setActiveSide,  p1, setP1, p2, setP2, highlightedTacticalBlock, p1PoolIdx, setP1PoolIdx, p2PoolIdx, setP2PoolIdx, setHighlightedTacticalBlock, setTacticalRenderIdx, setShowTacticalBlock, setDisableBoard) => {
    let activePlayerPosCopy =
      activeSide === "p1"
        ? p1.map((item) => ({ ...item }))
        : p2.map((item) => ({ ...item }));

    const targetPiece = activePlayerPosCopy.findIndex(
      (piece) => piece.position === highlightedTacticalBlock
    );

    if (activePlayerPosCopy[targetPiece].piece[0] === "c") {
      activePlayerPosCopy[targetPiece].position = "";
    } else {
      activePlayerPosCopy[targetPiece] = {
        piece: `cat${
          activeSide === "p1" ? p1PoolIdx.cats + 1 : p2PoolIdx.cats + 1
        }`,
        image: `${activeSide === "p1" ? "grey" : "orange"}_cat.png`,
        position: "",
      };
      activeSide === "p1"
        ? setP1PoolIdx({ ...p1PoolIdx, cats: p1PoolIdx.cats + 1 })
        : setP2PoolIdx({ ...p2PoolIdx, cats: p2PoolIdx.cats + 1 });
    }

    activeSide === "p1"
      ? setP1(activePlayerPosCopy)
      : setP2(activePlayerPosCopy);

    setHighlightedTacticalBlock();
    setTacticalRenderIdx(0);
    setShowTacticalBlock(false);
    setActiveSide(activeSide === "p1" ? "p2" : "p1");
    setDisableBoard(false);
  };
