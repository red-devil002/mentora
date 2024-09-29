"use client"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import axios from "axios";
import { CheckCircle, XCircle } from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import QuizComponent from "./QuizComponent";
// import { useNavigate } from "react-router-dom";

interface CourseProgressButtonProps {
  chapterId: string;
  courseId: string;
  isCompleted?: boolean;
  nextChapterId?: string;
  transcript: string;
}

export const CourseProgressButton = ({
  chapterId,
  courseId,
  isCompleted,
  nextChapterId,
  transcript
}: CourseProgressButtonProps) => {
  const router = useRouter();
  const confetti = useConfettiStore();
  const [isLoading, setIsLoading] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
//   const navigation = useNavigate()

  const onClick = async () => {
    try {
      setIsLoading(true);

      if (!isCompleted) {
        setShowQuiz(true);
      } else {
        await updateProgress(false);
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const updateProgress = async (completed: boolean) => {
    await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`, {
      isCompleted: completed
    });

    if (completed) {
      confetti.onOpen();
    }

    toast.success("Progress updated");
    // router.refresh();

    if (completed && nextChapterId) {
        console.log("Completed");
      router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
    }
  };

  const onQuizComplete = () => {
    setShowQuiz(false);
    updateProgress(true);
    // navigation(`/courses/${courseId}/chapters/${nextChapterId}`)
  };

  const Icon = isCompleted ? XCircle : CheckCircle;

  return (
    <>
      <Button
        onClick={onClick}
        disabled={isLoading}
        type="button"
        variant={isCompleted ? "outline" : "success"}
        className="w-full md:w-auto"
      >
        {isCompleted ? "Mark as incomplete" : "Mark as complete"}
        <Icon className="h-4 w-4 ml-2" />
      </Button>
      {showQuiz && (
        <QuizComponent
          transcript={transcript}
          onComplete={onQuizComplete}
        />
      )}
    </>
  );
};