import React, { useContext, useState } from "react";
import { GameContext, useAnimation } from "./gameContext";
import { Button } from "~/components/ui/button";

export default function ScoreBoard() {
  const gameContext = useContext(GameContext);
  const [playing, setPlaying] = useState(true);
  const [animationGameContext, setAnimationGameContext] = useState(gameContext);

  useAnimation((value: React.ContextType<typeof GameContext>) => {
    setAnimationGameContext({ ...value }); // Ensure a new object is set to trigger re-render
  });

  return (
    <div className="absolute top-0 left-0 z-40 w-screen flex justify-between items-center bg-black/50 h-20 p-4">
      <div className="flex items-center">
        <span className="text-white text-xl mr-4">Lives:</span>
        {Array.from({ length: animationGameContext.lives.current }).map(
          (_, index) => (
            <div
              key={index}
              className="w-4 h-4 bg-red-500 rounded-full mr-2"
            ></div>
          ),
        )}
      </div>
      <div className="flex flex-row flex-nowrap gap-4 justify-center items-center">
        <div className="text-white text-xl">
          Hits: {animationGameContext.creatureHitCount.current}
        </div>
        <Button
          onClick={() => {
            gameContext.updatePaused();
            setPlaying(!playing);
          }}
          className="rounded-none bg-green-800 hover:bg-green-600 hover:text-black border-white border-2"
        >
          {playing ? "Pause" : "Play"}
        </Button>
      </div>
    </div>
  );
}
