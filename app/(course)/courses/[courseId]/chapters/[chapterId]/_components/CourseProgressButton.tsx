"use client"

import { Button } from "@/components/ui/button";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import axios from "axios";
import { CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface CourseProgressButtonProps {
    chapterId: string;
    courseId: string;
    isCompleted?: boolean;
    nextChpterId?: string;
}

export const CourseProgressButton = ({
    chapterId,
    courseId,
    isCompleted,
    nextChpterId,
} : CourseProgressButtonProps) => {

    const router = useRouter()
    const confetti = useConfettiStore()
    const [isLoading, setIsLoading] = useState(false)

    const onClick = async () => {
        try {
            setIsLoading(true)

            await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`, {
                isCompleted: !isCompleted
            })

            if(!isCompleted && !nextChpterId) {
                confetti.onOpen();
            }

            if(!isCompleted && nextChpterId) {
                router.push(`/courses/${courseId}/chapters/${nextChpterId}`)
            }

            toast.success("Progress updated")
            router.refresh()
        } catch {
            toast.error("Something went wrong")
        } finally{
            setIsLoading(false)
        }
    }

    const Icon = isCompleted ? XCircle : CheckCircle

    return(
        <Button
            onClick={onClick}
            type="button"
            variant={isCompleted ? "outline" : "success"}
            className="w-full md:w-auto"
        >
            {isCompleted ? "Not Completed" : "Mark as complete"}
            <Icon className="h-4 w-4 ml-2" />
        </Button>
    )
}