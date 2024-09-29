'use client'
import React, { useEffect } from 'react'
import toast from "react-hot-toast";


export default function CourseQuiz({chapter}) {
    useEffect(() => {
        const fetchTranscript = async()=>{
            try {
                console.log("StartPage")
    
                // Calling transcript APi
                const res = await fetch(`/api/transcript`,{
                    method:"POST",
                    body:JSON.stringify({
                        chapterID: chapter.id
                    })
                })
                const data = await res.json()
                console.log("data",data.transcript)
                console.log("quiz:",data.Quiz);
                
                // if(!isCompleted && nextChpterId) {
                //     router.push(`/courses/${courseId}/chapters/${nextChpterId}`)
                // }
    
                
            } catch {
                toast.error("Something went wrong")
            }
        }
        fetchTranscript();
    },[chapter])

  return (
    <div>
      This is transcript
    </div>
  )
}
