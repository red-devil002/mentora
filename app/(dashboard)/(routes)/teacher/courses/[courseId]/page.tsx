const CourseIdPage = ({params}:{
    params: { courseId: String }
}) => {
  return (
    <div>
      Course Id: {params.courseId}
    </div>
  )
}

export default CourseIdPage
