import { NavbarRoutes } from "@/components/NavbarRoutes";
import { Chapter, Course, UserProgress } from "@prisma/client"
import { CourseMobileSidebar } from "./CourseMobileSidebar";

interface CourseNavbarProps {
    course: Course & {
        chapters: (Chapter & {
            userProgress: UserProgress[] | null;
        })[];
    }
    progressCount: number
}

export const CourseNavbar = ({
    course,
    progressCount
} : CourseNavbarProps) => {
    return(
        <div className="p-4 border-b h-hul flex items-center bg-white shadow-sm">
            <CourseMobileSidebar 
                course={course}
                progressCount={progressCount}
            />
            <NavbarRoutes />
        </div>
    )
}