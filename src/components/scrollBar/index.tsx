import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function ScrollButtons() {
  const [showUpButton, setShowUpButton] = useState(false);
  const [showDownButton, setShowDownButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.body.scrollHeight;

      setShowUpButton(scrollY >= documentHeight * 0.9 - windowHeight);
      setShowDownButton(scrollY < documentHeight * 0.9 - windowHeight);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initialize state on mount

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToBottom = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  return (
    <div className="fixed bottom-10 right-10 z-20">
      {showUpButton ? (
        <button
          className="bg-white text-black bg-opacity-55 p-3 rounded-full shadow-md hover:bg-gray-800"
          onClick={scrollToTop}
        >
          <ChevronUp size={24} />
        </button>
      ) : showDownButton ? (
        <button
          className="bg-white text-black bg-opacity-55 p-3 rounded-full shadow-md hover:bg-gray-800"
          onClick={scrollToBottom}
        >
          <ChevronDown size={24} />
        </button>
      ) : null}
    </div>
  );
}
