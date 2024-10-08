
import { getChapter } from "@/actions/getChapters";
import { Banner } from "@/components/Banner";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { VideoPlayer } from "./_components/VideoPlayer";
import { CourseEnrollButton } from "./_components/CourseEnrollButton";
import { Separator } from "@/components/ui/separator";
import { Preview } from "@/components/preview";
import { File } from "lucide-react";
import { CourseProgressButton } from "./_components/CourseProgressButton";

const ChapterIdPage = async ({
    params,
}: {
    params: { courseId: string; chapterId: string }
}) => {

    const { userId } = auth()

    if(!userId) {
        return redirect("/")
    }

    const {
        chapter,
        course,
        muxData, 
        attachments, 
        nextChapter, 
        userProgress, 
        purchase,
    } = await getChapter({
        userId,
        chapterId: params.chapterId,
        courseId: params.courseId
    })

    if (!chapter || !course) {
        return redirect("/")
    }

    const isLocked = !chapter.isFree && !purchase;
    const completeOnEnd = !!purchase && !userProgress?.isCompleted;

    return ( 
        <div>
            {userProgress?.isCompleted && (
                <Banner
                    label="You already completed this chapter"
                    variant="success"
                />
            )}
            {isLocked && (
                <Banner 
                    label="You need to purchase this course to see the remaining chapters"
                    variant="warning"
                />
            )}
            <div className="flex flex-col max-w-4xl mx-auto pb-20">
                <div className="p-4">
                    <VideoPlayer 
                        chapterId = {params.chapterId}
                        title = {chapter.title}
                        courseId = {params.courseId}
                        nextChapterId = {nextChapter?.id}
                        playbackId = {muxData?.playbackId!}
                        isLocked = {isLocked}
                        completeOnEnd  = {completeOnEnd}
                    />
                </div>
                <div>
                    <div className="p-4 flex flex-col md:flex-row items-center justify-between">
                        <h2 className="text-2xl font-semibold mb-2">
                            {chapter.title}
                        </h2>
                        {purchase ? (
                            <CourseProgressButton
                                transcript={chapter.transcript} 
                                chapterId={params.chapterId}
                                courseId={params.courseId}
                                isCompleted={!!userProgress?.isCompleted}
                                nextChpterId={nextChapter?.id}
                            />
                        ) : (
                            <CourseEnrollButton 
                                courseId = {params.courseId}
                                price = {course.price!}
                            />
                        )}
                    </div>
                    <Separator />
                    <div>
                        <Preview 
                            value={chapter.description!}
                        />
                    </div>
                    {!!attachments.length && (
                        <>
                            <Separator />
                            <div className="p-4">
                                {attachments.map((attachment) => (
                                    <a 
                                        href={attachment.url}
                                        key={attachment.id}
                                        target="_blank"
                                        className="flex items-center w-full bg-sky-200 p-3 border text-sky-700 rounded-md hover:underline"
                                    >
                                        <File />
                                        <p className="line-clamp-1 ">
                                            {attachment.name}
                                        </p>
                                    </a>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div> 
    );
}
 
export default ChapterIdPage;