import { db } from "@/lib/db_connect";
import { transcribeVideo } from "@/lib/transcript";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string; chapterId: string } }
) {
    try {
        const { userId } = auth();

        if(!userId) {
            return new NextResponse("Unauthorized", {status: 401})
        }

        const ownCourse = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId
            }
        })

        if (!ownCourse) {
            return new NextResponse("Unauthorized", {status: 401})
        }

        const chapter = await db.chapter.findUnique({
            where: {
                id: params.chapterId,
                courseId: params.courseId,
            }
        })

        const muxData = await db.muxData.findUnique({
            where: {
                chapterId: params.chapterId,
            }
        })

        if(!chapter || !muxData || !chapter.title || !chapter.description || !chapter.videoUrl) {
            return new NextResponse("Missing requied field", {status: 400})
        }

        const transcript = await transcribeVideo(chapter.videoUrl)
        // console.log(transcript);
        
        // if(transcript) {
        //     const createNew = await db.chapter.update({
        //         where:{
        //             id: params.chapterId,
        //         },
        //         data: {
        //             transcript,
        //         }
        //     })

        //     console.log("createNew: ",createNew);
        // }        
        
        const publishedChapter = await db.chapter.update({
            where: {
                id: params.chapterId,
                courseId: params.courseId,
            },
            data: {
                isPublished: true,
                transcript
            }
        })

        return NextResponse.json(publishedChapter)
    } catch (error) {
        console.log("[CHAPTERS_PUBLISH]", error);
        return new NextResponse("Internal Error", { status: 500})

    }
}