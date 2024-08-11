import { db } from "@/lib/db_connect";


export const getProgress = async(
    userId: string,
    courseId: string,
): Promise<number> => {
    try {
        const publishedChapter = await db.chapter.findMany({
            where: {
                courseId: courseId,
                isPublished: true,
            },
            select: {
                id: true,
            }
        })

        const publishedChapterIds = publishedChapter.map((chapter) => chapter.id);

        const vaildCompletedChapters = await db.userProgress.count({
            where: {
                userId: userId,
                chapterId:{
                    in: publishedChapterIds,
                },
                isCompleted: true,
            }
        })

        const progressPercentage = (vaildCompletedChapters / publishedChapterIds.length) * 100

        return progressPercentage
    } catch (error) {
        console.log("[GET_PROGRESS]", error);
        return 0;
        
    }
}