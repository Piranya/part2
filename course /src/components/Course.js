const Course = ({ course }) => {
  const initialValue = 0;
  const total = course.parts.reduce(
  (accumulator, currentValue) => accumulator + currentValue.exercises,
  initialValue);
  console.log(total)

    return (
    <div>
      <h2>{course.name}</h2>
      <ul>
        {course.parts.map(part => {
            return <li key={part.id}> {part.name} {part.exercises}</li>
        }         
        )}
      </ul>
      <b>Total of {total} exercises</b>
      </div>
    )
  }
  
  export default Course