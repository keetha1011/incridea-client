/* eslint-disable @typescript-eslint/no-empty-function */
import { useMutation } from "@apollo/client";
import { createContext, useContext, useEffect, useRef } from "react";
import { AddXpDocument } from "~/generated/generated";

export enum GameStatus {
  "ongoing",
  "win",
  "lose",
}

const levelId = "1";

const GameContext = createContext({
  spearPos: { current: { x: 0, y: 0 } },
  lives: { current: 5 },
  creaturePos: { current: { x: 0, y: 0 } },
  creatureAttack: { current: false },
  creatureHitCount: { current: 0 },
  creatureHit: { current: false },
  angle: { current: 0 },
  paused: { current: true },
  gameStatus: { current: GameStatus.ongoing },
  updateSpear: (x: number, y: number) => {},
  updateLives: () => {},
  updateCreature: (x: number, y: number) => {},
  updateCreatureAttack: (attack: boolean) => {},
  updateCreatureHitCount: (count: number) => {},
  updateCreatureHit: (hit: boolean) => {},
  updateAngle: (angle: number) => {},
  updatePaused: () => {},
  gameWin: () => {},
  gameLose: () => {},
});

function GameProvider({ children }: { children: React.ReactNode }) {
  const spear = useRef({ x: 0, y: 0 });
  const creature = useRef({ x: 0, y: 0 });
  const creatureAttack = useRef(false);
  const creatureHitCount = useRef(0);
  const creatureHit = useRef(false);
  const lives = useRef(5);
  const angle = useRef(0);
  const isPause = useRef(true);
  const gameStatus = useRef(GameStatus.ongoing);

  const [addXp] = useMutation(AddXpDocument);

  return (
    <GameContext.Provider
      value={{
        spearPos: spear,
        lives: lives,
        creaturePos: creature,
        creatureAttack: creatureAttack,
        creatureHitCount: creatureHitCount,
        creatureHit: creatureHit,
        angle: angle,
        paused: isPause,
        gameStatus: gameStatus,
        updateAngle: (newAngle: number) => (angle.current = newAngle),
        updateLives: () => (lives.current -= 1),
        updateSpear: (x: number, y: number) => (spear.current = { x, y }),
        updateCreature: (x: number, y: number) => {
          creature.current = { x, y };
        },
        updateCreatureAttack: (attack: boolean) =>
          (creatureAttack.current = attack),
        updateCreatureHitCount: (count: number) =>
          (creatureHitCount.current = count),
        updateCreatureHit: (hit: boolean) => (creatureHit.current = hit),
        updatePaused: () => {
          isPause.current = !isPause.current;
        },
        gameWin: () => {
          isPause.current = !isPause.current;
          gameStatus.current = GameStatus.win;
          if (
            typeof window !== "undefined" &&
            window.localStorage.getItem("throw-spear-game") === "win"
          ) {
            console.log("You have won the game twice");
          } else {
            // query the server to update the user's score
            void addXp({
              variables: {
                levelId: levelId,
              },
            });
          }
          window.localStorage.setItem("throw-spear-game", "win");
        },
        gameLose: () => {
          isPause.current = !isPause.current;
          gameStatus.current = GameStatus.lose;
        },
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

function useAnimation(
  callback: (value: React.ContextType<typeof GameContext>) => void,
) {
  const animation = useRef<number>(0);
  const gameContext = useContext(GameContext);

  const animate = () => {
    callback({ ...gameContext }); // Ensure a new object is passed to trigger re-render
    animation.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    animation.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animation.current);
    };
  }, []);
}

export { GameContext, GameProvider, useAnimation };
