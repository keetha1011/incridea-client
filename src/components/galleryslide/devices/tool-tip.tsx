import React, { useState } from "react";

const ToolTip = ({
  text,
  classValue,
}: {
  text: string;
  classValue: string;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const handleMouseEnter = () => {
    if (!isVisible && !isClicked) {
      setIsVisible(true);
    }
  };

  const handleMouseLeave = () => {
    if (isVisible && !isClicked) {
      setIsVisible(false);
    }
  };

  const handleClick = () => {
    setIsClicked(true);
    setIsVisible(false);
  };

  return (
    <div
      className={`group absolute top-0 z-50 flex h-full w-full items-center justify-center tracking-wide ${isVisible ? "invisible" : ""} `}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <p
        className={`${
          isVisible ? "visible" : "invisible"
        } absolute z-50 w-[60px] rounded-md px-2 py-2 text-center font-bold text-white md:w-[130px] ${classValue}`}
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        {text.toUpperCase()}
      </p>
    </div>
  );
};

export default ToolTip;
