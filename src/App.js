import { useEffect, useState } from "react";
import "./App.css";
import "react-notifications/lib/notifications.css";
import {
  NotificationContainer,
} from "react-notifications";

import {
  pieceSelected,
  boardClicked,
  upgrade,
  checkForUpgrade,
  tactical
} from "./utility";

function App() {
  const rows = [0, 1, 2, 3, 4, 5];
  const cols = [0, 1, 2, 3, 4, 5];

  const [activeSide, setActiveSide] = useState("p1");
  const [activePiece, setActivePiece] = useState();

  const [p1Pool, setP1Pool] = useState({ kittens: 8, cats: 0 });

  const [p2Pool, setP2Pool] = useState({ kittens: 8, cats: 0 });

  const [p1PoolIdx, setP1PoolIdx] = useState({ kittens: 8, cats: 0 });

  const [p2PoolIdx, setP2PoolIdx] = useState({ kittens: 8, cats: 0 });

  const [promotableArray, setPromotableArray] = useState([]);

  const [highlightedUpgradeBlocks, setHighlightedUpgradeBlocks] = useState([]);

  const [highlightedTacticalBlock, setHighlightedTacticalBlock] = useState();

  const [promotableArrayRenderIdx, setPromotableArrayRenderIdx] = useState(0);

  const [tacticalRenderIdx, setTacticalRenderIdx] = useState(0);

  const [showPromotionBlock, setShowPromotionBlock] = useState(false);

  const [showTacticalBlock, setShowTacticalBlock] = useState(false);

  const [showSubTacticalBlock, setSubShowTacticalBlock] = useState(false);

  const [playerWon, setPlayerWon] = useState();

  const [catChoosen, setCatChoosen] = useState();

  const [disableBoard, setDisableBoard] = useState(false);

  const [p1, setP1] = useState([
    { piece: "kitten1", image: "grey_kitten.png", position: "" },
    { piece: "kitten2", image: "grey_kitten.png", position: "" },
    { piece: "kitten3", image: "grey_kitten.png", position: "" },
    { piece: "kitten4", image: "grey_kitten.png", position: "" },
    { piece: "kitten5", image: "grey_kitten.png", position: "" },
    { piece: "kitten6", image: "grey_kitten.png", position: "" },
    { piece: "kitten7", image: "grey_kitten.png", position: "" },
    { piece: "kitten8", image: "grey_kitten.png", position: "" },
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
    setCatChoosen();
    const newActiveSideLatestPieceInfo = activeSide === "p1" ? p1 : p2;

    let anythingInPool = false;

    newActiveSideLatestPieceInfo.forEach((piece) => {
      if (piece.position === "") anythingInPool = true;
    });

    if (!anythingInPool) {
      setDisableBoard(true);
      setSubShowTacticalBlock(true);
      setShowTacticalBlock(true);
      setHighlightedTacticalBlock(newActiveSideLatestPieceInfo[0].position);
      const { p1BoardUpdate, p2BoardUpdate } = checkForUpgrade(p1, p2);
      if (
        p1BoardUpdate.existingSetsOfThreeCats.length &&
        !p2BoardUpdate.existingSetsOfThreeCats.length
      )
        setPlayerWon("Grey cats WON !!!");
      else if (
        !p1BoardUpdate.existingSetsOfThreeCats.length &&
        p2BoardUpdate.existingSetsOfThreeCats.length
      )
        setPlayerWon("Orange cats WON !!!");
      else if (
        p1BoardUpdate.existingSetsOfThreeCats.length &&
        p2BoardUpdate.existingSetsOfThreeCats.length
      )
        setPlayerWon("It was a draw !!!");

      if (activeSide === "p1" && p1BoardUpdate.existingSetsOfThreeAny.length) {
        return setPromotableArray(p1BoardUpdate.existingSetsOfThreeAny);
      } else if (
        activeSide === "p2" &&
        p2BoardUpdate.existingSetsOfThreeAny.length
      ) {
        return setPromotableArray(p2BoardUpdate.existingSetsOfThreeAny);
      }
    }
  }, [activeSide]);

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
      playableP2Kittens = 0,
      playableP1Cats = 0,
      playableP2Cats = 0;

    p1.forEach((piece) => {
      if (piece.position === "") {
        if (piece.piece[0] === "k") playableP1Kittens++;
        else playableP1Cats++;
      }
    });

    p2.forEach((piece) => {
      if (piece.position === "") {
        if (piece.piece[0] === "k") playableP2Kittens++;
        else playableP2Cats++;
      }
    });

    setP1Pool({
      kittens: playableP1Kittens,
      cats: playableP1Cats,
    });

    setP2Pool({
      kittens: playableP2Kittens,
      cats: playableP2Cats,
    });
  }, [p1, p2]);


  return (
    <div className="relative">
      <div className="h-screen w-screen flex flex-row">
        <div
          className={`basis-3/5 bg-[#97DECE] flex flex-col justify-between ${
            disableBoard ? "pointer-events-none" : ""
          }`}
        >
          <div className="w-full flex items-center justify-center text-3xl font-bold bg-[#439A97] p-4 text-white">
            {activeSide === "p1" ? "Grey Cat boi" : "Orange Cat boi"}'s Turn
          </div>
          <div className="flex items-center justify-center">
            {cols.map((colVal, colIndex) => (
              <div className="flex flex-col bg-yellow-100">
                {rows.map((rowVal, rowIndex) => (
                  <div
                    className={`h-24 w-24 ${
                      rowIndex % 2 === 0 && colIndex % 2 === 0
                        ? "bg-yellow-300"
                        : ""
                    } 
              ${rowIndex % 2 !== 0 && colIndex % 2 !== 0 ? "bg-yellow-300" : ""} 
              ${
                highlightedUpgradeBlocks.includes(`${rowVal}${colVal}`)
                  ? "border border-3 border-green-500 bg-green-200"
                  : ""
              }
              ${
                showSubTacticalBlock &&
                highlightedTacticalBlock === `${rowVal}${colVal}`
                  ? "border border-3 border-green-500 bg-green-200"
                  : ""
              }
                flex`}
                  >
                    <div
                      onClick={() => {
                        boardClicked(
                          rowVal,
                          colVal,
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
                        );
                      }}
                      className={`flex items-center justify-center h-full w-full hover:bg-blue-300`}
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
          {activeSide === "p1" ? (
            <div className="flex justify-center mb-10">
              <div
                onClick={() =>
                  pieceSelected(
                    "p1",
                    "k",
                    activeSide,
                    setActivePiece,
                    p1,
                    p2,
                    setCatChoosen
                  )
                }
                className={`flex items-center justify-center cursor-pointer ${
                  catChoosen === 0 ? "bg-yellow-400" : "bg-[#439A97]"
                } rounded-lg`}
              >
                <img
                  className="h-16 w-16"
                  src={`/assets/grey_kitten.png`}
                  alt="yeet"
                />{" "}
                <span className="text-3xl font-bold p-4 text-white">
                  x {p1Pool.kittens}
                </span>
              </div>
              <div
                onClick={() =>
                  pieceSelected(
                    "p1",
                    "c",
                    activeSide,
                    setActivePiece,
                    p1,
                    p2,
                    setCatChoosen
                  )
                }
                className={`flex items-center justify-center cursor-pointer ${
                  catChoosen === 1 ? "bg-yellow-400" : "bg-[#439A97]"
                } rounded-lg ml-4`}
              >
                <img
                  className="h-16 w-16"
                  src={`/assets/grey_cat.png`}
                  alt="yeet"
                />{" "}
                <span className="text-3xl font-bold p-4 text-white">
                  x {p1Pool.cats}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex justify-center mb-10">
              <div
                onClick={() =>
                  pieceSelected(
                    "p2",
                    "k",
                    activeSide,
                    setActivePiece,
                    p1,
                    p2,
                    setCatChoosen
                  )
                }
                className={`flex items-center justify-center cursor-pointer ${
                  catChoosen === 0 ? "bg-yellow-400" : "bg-[#439A97]"
                } rounded-lg`}
              >
                <img
                  className="h-16 w-16"
                  src={`/assets/orange_kitten.png`}
                  alt="yeet"
                />{" "}
                <span className="text-3xl font-bold p-4 text-white">
                  x {p2Pool.kittens}
                </span>
              </div>
              <div
                onClick={() =>
                  pieceSelected(
                    "p2",
                    "c",
                    activeSide,
                    setActivePiece,
                    p1,
                    p2,
                    setCatChoosen
                  )
                }
                className={`flex items-center justify-center cursor-pointer ${
                  catChoosen === 1 ? "bg-yellow-400" : "bg-[#439A97]"
                } rounded-lg ml-4`}
              >
                <img
                  className="h-16 w-16"
                  src={`/assets/orange_cat.png`}
                  alt="yeet"
                />{" "}
                <span className="text-3xl font-bold p-4 text-white">
                  x {p2Pool.cats}
                </span>
              </div>
            </div>
          )}
        </div>
        <div className="basis-2/5 bg-[#CBEDD5] border-l-8 border-black">
          {playerWon ? (
            <div className="flex flex-col items-center justify-center h-full">
            <span className="font-bold text-xl text-[#439A97] mb-6">
              {playerWon}
            </span>
            <button
                        className="hover:bg-[#439A97] bg-[#62B6B7] text-white font-bold py-2 px-4 rounded mr-2 h-16 text-lg"
                        onClick={() => {
                          window.location.reload(true)
                        }}
                      >
                        Start fresh
                      </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              {promotableArray.length ? (
                <div className="basis-1/2 flex flex-col justify-center items-center h-full">
                  <span className="font-bold text-xl text-[#439A97] mb-6">
                    Choose from a set of 3 of your pets in a row and Promote
                  </span>
                  {showPromotionBlock ? (
                    <div className="w-full flex items-center justify-center">
                      <button
                        className="hover:bg-[#439A97] bg-[#62B6B7] text-white font-bold py-2 px-4 rounded mr-2 h-16 text-lg"
                        onClick={() => {
                          if (
                            promotableArrayRenderIdx <
                            promotableArray.length - 1
                          ) {
                            setHighlightedUpgradeBlocks(
                              promotableArray[promotableArrayRenderIdx + 1]
                            );
                            setPromotableArrayRenderIdx(
                              promotableArrayRenderIdx + 1
                            );
                          } else {
                            setHighlightedUpgradeBlocks(promotableArray[0]);
                            setPromotableArrayRenderIdx(0);
                          }
                        }}
                      >
                        Next cats/kittens
                      </button>
                      <button
                        className="hover:bg-[#439A97] bg-[#62B6B7] text-white font-bold py-2 px-4 rounded h-16 text-lg"
                        onClick={() => {
                          upgrade(
                            activeSide,
                            setActiveSide,
                            p1,
                            p2,
                            setP1,
                            setP2,
                            highlightedUpgradeBlocks,
                            p1PoolIdx,
                            setP1PoolIdx,
                            p2PoolIdx,
                            setP2PoolIdx,
                            setPromotableArray,
                            setShowPromotionBlock,
                            setPromotableArrayRenderIdx,
                            setHighlightedUpgradeBlocks,
                            setDisableBoard
                          );
                        }}
                      >
                        Promote
                      </button>
                    </div>
                  ) : (
                    <div className="w-full flex items-center justify-center">
                      <button
                        className="hover:bg-[#439A97] bg-[#62B6B7] text-white font-bold py-2 px-4 rounded h-16 text-lg"
                        onClick={() => {
                          setHighlightedUpgradeBlocks(
                            promotableArray[promotableArrayRenderIdx]
                          );
                          setShowPromotionBlock(true);
                          setSubShowTacticalBlock(false);
                        }}
                      >
                        Show promotable Cats
                      </button>
                    </div>
                  )}
                </div>
              ) : undefined}

              <div className="basis-1/2 flex items-center justify-center">
                {showTacticalBlock ? (
                  <div className="flex flex-col items-center justify-center">
                    <span className="font-bold text-xl text-[#439A97] mb-6">
                      With no pets to place, choose a kitten to upgrade or a cat
                      to take back
                    </span>
                    {showSubTacticalBlock ? (
                      <div>
                        <button
                          className="hover:bg-[#439A97] bg-[#62B6B7] text-white font-bold py-2 px-4 rounded mr-2 h-16 text-lg"
                          onClick={() => {
                            const targetArray = activeSide === "p1" ? p1 : p2;
                            if (tacticalRenderIdx < targetArray.length - 1) {
                              setHighlightedTacticalBlock(
                                targetArray[tacticalRenderIdx + 1].position
                              );
                              setTacticalRenderIdx(tacticalRenderIdx + 1);
                            } else {
                              setHighlightedTacticalBlock(
                                targetArray[0].position
                              );
                              setTacticalRenderIdx(0);
                            }
                          }}
                        >
                          Next cat/kitten
                        </button>
                        <button
                          className="hover:bg-[#439A97] bg-[#62B6B7] text-white font-bold py-2 px-4 rounded h-16 text-lg"
                          onClick={() =>
                            tactical(
                              activeSide,
                              setActiveSide,
                              p1,
                              setP1,
                              p2,
                              setP2,
                              highlightedTacticalBlock,
                              p1PoolIdx,
                              setP1PoolIdx,
                              p2PoolIdx,
                              setP2PoolIdx,
                              setHighlightedTacticalBlock,
                              setTacticalRenderIdx,
                              setShowTacticalBlock,
                              setDisableBoard
                            )
                          }
                        >
                          Stratigic upgrade
                        </button>
                      </div>
                    ) : (
                      <button
                        className="hover:bg-[#439A97] bg-[#62B6B7] text-white font-bold py-2 px-4 rounded h-16 text-lg"
                        onClick={() => {
                          setSubShowTacticalBlock(true);
                          setShowPromotionBlock(false);
                          setHighlightedUpgradeBlocks([]);
                          const targetArray = activeSide === "p1" ? p1 : p2;
                          setHighlightedTacticalBlock(targetArray[0].position);
                          setTacticalRenderIdx(0);
                        }}
                      >
                        Show Upgradable Cat/Kitten
                      </button>
                    )}
                  </div>
                ) : undefined}
              </div>
            </div>
          )}
        </div>
      </div>

      <NotificationContainer />
    </div>
  );
}

export default App;
