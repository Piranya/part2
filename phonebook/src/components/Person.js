const Person = ({ person, handleDelete }) => {
    return (
      <li>{person.name} {person.number}
       <button onClick={handleDelete}> Delete</button>
      </li>
    )
  }
  
  export default Person