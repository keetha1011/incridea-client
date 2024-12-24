"use client";

import React, { useState, useEffect } from "react";
import IntroductionPage from "./introduction";
import QuizPage from "./quizpage";
import ResultsPage from "./restultpage";

const Quiz = ({ quizId }: { quizId: string }) => {
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    const storedStep = localStorage.getItem("quizStep");
    if (storedStep) {
      setCurrentStep(parseInt(storedStep, 10));
    } else {
      setCurrentStep(1);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("quizStep", currentStep.toString());
  }, [currentStep]);

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <IntroductionPage onNext={() => setCurrentStep(2)} quizId={quizId} />
        );
      case 2:
        return <QuizPage onComplete={() => setCurrentStep(3)} />;
      case 3:
        return <ResultsPage />;
      default:
        return null;
    }
  };

  return <div>{renderCurrentStep()}</div>;
};

export default Quiz;
