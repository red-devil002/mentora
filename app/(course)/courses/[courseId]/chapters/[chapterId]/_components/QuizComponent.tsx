"use client"
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";

interface QuizQuestion {
  question: string;
  options: {
    [key: string]: string;
  };
  correctAnswer: string;
}

interface QuizComponentProps {
  transcript: string;
  onComplete: () => void;
}

const genAI = new GoogleGenerativeAI("AIzaSyD8JbyFInYCDszVGDEfAnNDEjCc2ZViXr8");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function generateQuiz(transcription: string) {
  const prompt = `Based on the following text, generate a quiz with exactly 4 multiple-choice questions. Format the questions and answers as a JSON object, where each question is an entry in an array with the following structure:
    [
      {
        "question": "<Question text>",
        "options": {
          "a": "<Option A>",
          "b": "<Option B>",
          "c": "<Option C>",
          "d": "<Option D>"
        },
        "correctAnswer": "<a, b, c, or d>"
      },
      ...
    ]
    Here is the text for the quiz: ${transcription}`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();
    const cleanResponse = text.replace(/```json|```/g, '').trim();
    console.log("cleanResponse: ",cleanResponse);
    
    return JSON.parse(cleanResponse);
  } catch (error) {
    console.error("Error generating quiz:", error);
    throw new Error("Failed to generate quiz questions.");
  }
}

const QuizComponent: React.FC<QuizComponentProps> = ({ transcript, onComplete }) => {
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [score, setScore] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const generatedQuiz = await generateQuiz(transcript);
        setQuiz(generatedQuiz);
        setUserAnswers(new Array(generatedQuiz.length).fill(""));
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching quiz:", error);
        setIsLoading(false);
      }
    };

    fetchQuiz();
  }, [transcript]);

  const handleAnswer = (answer: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = answer;
    setUserAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < quiz.length -1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    let correctAnswers = 0;
    quiz.forEach((question, index) => {
      if (userAnswers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    setScore(correctAnswers);
    setShowResults(true);
  };

  const handleClose = () => {
    if (score !== null && score === quiz.length-1) {
      onComplete();
    }
    window.location.reload()
  };

  if (isLoading) {
    return (
      <Dialog open={true}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Quiz</DialogTitle>
            <DialogDescription>Loading quiz questions...</DialogDescription>
          </DialogHeader>
          <Progress value={33} className="w-full" />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={true} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Chapter Quiz</DialogTitle>
          <DialogDescription>
            Test your knowledge to complete the chapter.
          </DialogDescription>
        </DialogHeader>
        {!showResults ? (
          <div className="mt-4">
            <h3 className="text-lg font-medium mb-2">
              Question {currentQuestion + 1} of {quiz.length}
            </h3>
            <p className="text-sm text-gray-500 mb-4">{quiz[currentQuestion]?.question}</p>
            <RadioGroup
              value={userAnswers[currentQuestion]}
              onValueChange={handleAnswer}
            >
              {Object.entries(quiz[currentQuestion]?.options || {}).map(([key, option]) => (
                <div key={key} className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value={key} id={`option-${key}`} />
                  <Label htmlFor={`option-${key}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
            <Button
              onClick={handleNext}
              className="w-full mt-4"
              disabled={!userAnswers[currentQuestion]}
            >
              {currentQuestion === quiz.length - 1 ? "Submit" : "Next"}
            </Button>
          </div>
        ) : (
          <div className="mt-4">
            <h3 className="text-lg font-medium mb-2">Quiz Results</h3>
            <p className="text-3xl font-bold text-center mb-4">
              {score} / {quiz.length}
            </p>
            {quiz.map((question, index) => (
              <div key={index} className="mb-4">
                <p className="font-medium">{question.question}</p>
                <p className="text-sm">
                  Your answer:{" "}
                  <span className={userAnswers[index] === question.correctAnswer ? "text-green-500" : "text-red-500"}>
                    {question.options[userAnswers[index]]}
                  </span>
                </p>
                {userAnswers[index] !== question.correctAnswer && (
                  <p className="text-sm text-green-500">
                    Correct answer: {question.options[question.correctAnswer]}
                  </p>
                )}
              </div>
            ))}
            <Button onClick={handleClose} className="w-full mt-4">
              {score >= quiz.length-1 ? "Complete Chapter" : "Try Again"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default QuizComponent;