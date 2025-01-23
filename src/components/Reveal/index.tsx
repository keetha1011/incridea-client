import React, { useState, useEffect } from "react";
import Image from "next/image";
import CatGif from "./catGif";
import Explosion from "./explosion";

function Reveal() {
  const [rotate, setRotate] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [message, setMessage] = useState("Hatch the egg to reveal the theme!"); // Initial message state
  const [messageVisible, setMessageVisible] = useState(false);
  const [showEgg, setShowEgg] = useState(true);
  const [showGif, setShowGif] = useState(false);
  const [splinterVisible, setSplinterVisible] = useState(false);
  const [finalmsg, setFinalmsg] = useState(false); // Controls visibility of the message
  const images = [
    "/reveal/egg1.png",
    "/reveal/egg2.png",
    "/reveal/egg3.png",
    "/reveal/egg4.png",
    "/reveal/egg5.png",
  ];
  const messages: string[] = [
    "Hatch the egg to reveal the theme!",
    "Keep going, you're almost there!",
    "You're doing great, click more!",
    "Let's see what you uncover!",
    "You're getting closer to the theme!",
    "Just a little more, almost there!",
    "Wow, you're fast! Keep clicking!",
    "The egg is cracking, keep it up!",
    "Amazing progress, keep going!",
    "I can feel the hatch coming!",
  ];

  useEffect(() => {
    const savedData = localStorage.getItem("gameState");
    if (savedData) {
      // Extract the clickCount (all but the last character) and imageIndex (last character)
      const savedClickCount = savedData.slice(0, -1); // All characters except the last one
      const savedImageIndex = savedData.slice(-1); // Last character
      if (savedClickCount && savedImageIndex) {
        setClickCount(Number(savedClickCount)); // Set saved click count
        setImageIndex(Number(savedImageIndex)); // Set saved image index
      }
    }

    setMessageVisible(true);
    setTimeout(() => setMessageVisible(false), 5000); // Hide the message after 1 second
  }, []);

  const handleClick = () => {
    const gameState = `${clickCount}${imageIndex}`;

    // Save the combined state as a string in localStorage

    if (clickCount === 212) {
      setImageIndex(images.length - 1);
      setMessageVisible(true);
      setShowVideo(true);
      setTimeout(() => {
        setShowVideo(false);
      }, 2000);
      setTimeout(() => {
        setShowEgg(false);
        setShowGif(true);
      }, 1000);
      setMessage(
        "Congratulations! You just wasted your time... or did you? 👀",
      );
      setTimeout(() => {
        setMessageVisible(false);
      }, 10000);
      return;
    }
    setClickCount((prevCount) => prevCount + 1);
    if (
      clickCount % 27 === 0 &&
      clickCount !== 0 &&
      imageIndex != images.length - 2
    ) {
      const message: string =
        messages[Math.floor(Math.random() * messages.length)] ??
        "Keep hatching";
      setMessage(message);
      setMessageVisible(true);
      setTimeout(() => setMessageVisible(false), 5000);
    }

    if (clickCount % 53 === 0 && clickCount !== 0) {
      setSplinterVisible(true);
      if (navigator.vibrate) {
        navigator.vibrate(100);
      }
      setImageIndex((prevIndex) => (prevIndex + 1) % images.length);
      console.log(imageIndex);
      setTimeout(() => {
        setShowVideo(false);
      }, 2100);
    }

    // Vibration effect on every click
    setRotate(true);
    setTimeout(() => {
      setRotate(false);
      setSplinterVisible(false);
    }, 300);

    localStorage.setItem("gameState", gameState);
  };

  return (
    <div className="relative w-full flex items-center justify-center h-screen">
      {!showVideo && (
        <div className="absolute inset-0">
          <Image
            src="/reveal/background.jpg"
            alt="loginBG"
            layout="fill"
            objectFit="cover"
            quality={100}
            priority
            className="opacity-50"
          />
        </div>
      )}

      {showVideo && (
        <div>
          <video
            className="absolute top-0 left-0 w-full h-full object-cover z-50"
            autoPlay
            muted
          >
            <source src="/reveal/blast-1.mp4" type="video/mp4" />
          </video>
          <Explosion />
        </div>
      )}

      {!showVideo && (
        <div className="flex items-center justify-center z-10">
          {showEgg && (
            <Image
              src={images[imageIndex] ?? "reveal/egg.png"}
              alt="An egg"
              width={160}
              height={160}
              className={`transition-transform duration-100 ease-in-out ${rotate ? "animate-vibrate" : ""} transform origin-bottom`}
              onClick={handleClick}
            />
          )}
          <Image
            src="/reveal/duck.png"
            alt="Cat"
            width={130}
            height={130}
            className="absolute bottom-0 right-10 transform translate-x-1/3 "
          />
          {splinterVisible && (
            <div className="absolute">
              <Image
                src="/reveal/Particle1.png"
                alt="Particle"
                width={30}
                height={30}
                className="animate-splatter1"
              />
              <Image
                src="/reveal/Particle2.png"
                alt="Particle"
                width={20}
                height={20}
                className="animate-splatter2"
              />
              <Image
                src="/reveal/Particle3.png"
                alt="Particle"
                width={30}
                height={30}
                className="animate-splatter3"
              />
              <Image
                src="/reveal/Particle4.png"
                alt="Particle"
                width={20}
                height={20}
                className="animate-splatter4"
              />
              <Image
                src="/reveal/Particle5.png"
                alt="Particle"
                width={30}
                height={30}
                className="animate-splatter5"
              />
              <Image
                src="/reveal/Particle6.png"
                alt="Particle"
                width={20}
                height={20}
                className="animate-splatter6"
              />
            </div>
          )}

          {showGif && (
            <div className="flex flex-col text-center w-full items-center justify-center">
              <p className="text-2xl mb-8 text-white px-6">
                You really thought we would reveal it??
              </p>
              <div className="flex size-64">
                <CatGif />
              </div>
            </div>
          )}

          {messageVisible && (
            <div className="absolute bottom-[100px] p-3 right-[110px] z-20">
              <h1 className="relative text-xl font-semibold text-center py-1 px-3 border-1 border-black bg-white rounded-tr-[20px] rounded-bl-[30px] animate-text-fade">
                {message}
                <span className="absolute bottom-0 left-0 w-0 h-0 border-l-8 border-b-8 border-l-transparent border-b-black"></span>
              </h1>
            </div>
          )}

          {/* Click counter */}
          <div className="absolute top-4 right-4 z-20 bg-black text-white py-2 px-4 rounded-lg">
            <span className="text-lg font-bold">Clicks: {clickCount}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default Reveal;
