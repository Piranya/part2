import { useState, useEffect } from 'react'
import Person from './components/Person'
import axios from 'axios'
import personsService from './services/persons'
import './index.css'

const Notification = (props) => {
  if (props.message === null) {
    return null
  }

  return (
    <div className={props.class}>
      {props.message}
    </div>
  )
}

const FilterInput = (props) => {

  return (
      <div>
          filter list with <input value={props.filter} onChange={props.handleClick}/>
      </div>
  )
}

const PersonForm = (props) => {
  return (
    <form onSubmit={props.submitHandler}>
        <div>
          name: <input value={props.newName} onChange={props.handleNameChange}/>
        </div>
        <div>
          number: <input value={props.newNumber} onChange={props.handleNumberChange}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
  )
}

const App = () => {
  const [persons, setPersons] = useState(null) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [msgClass, setMsgClass] = useState('success')
  const [eventMessage, setEventMessage] = useState(null)
  const personsFiltered = persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()));

  useEffect(() => {
    personsService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])
  
  
  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }


  const containName = (person) => person.name === newName.trim()

  const addPerson = (event) => {
    event.preventDefault()
    
    if(persons.some(containName)){
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with new one?`)){
        const personObject = {
          name: newName.trim(),
          number: newNumber
        }
        var existingPerson = persons.find(n => n.name === newName.trim())
        console.log(existingPerson.id)
        personsService
        .update(existingPerson.id, personObject)
        .then(returnedPerson => {
          setPersons(persons.map(person => person.id !== existingPerson.id ? person : returnedPerson))
          setNewName('')
          setNewNumber('')
          setMsgClass('success')
          setEventMessage(`Updated ${returnedPerson.name}`)
        })
        
      } else {
        setNewName(newName.trim())
      }

    } else {
      const personObject = {
        name: newName.trim(),
        number: newNumber
      }
      personsService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
        setMsgClass('success')
        setEventMessage(`Added ${returnedPerson.name}`)
        setTimeout(() => {
          setEventMessage(null)
        }, 2000)
      })
    }
  }

  const removePerson = (id, name) => {
    if (window.confirm(`Delete ${name}?`)){
    personsService
      .remove(id)
      .then(returnedPerson => {
        setPersons(persons.filter(p => p.id !== id))
      })
      .catch(error => {
        setMsgClass('error')
        setEventMessage(
          `Information of '${name}' has already been removed from the server`
        )
        setTimeout(() => {
          setEventMessage(null)
        }, 5000)
      })
    }
      
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={eventMessage} class={msgClass}/>
      <FilterInput filter={filter} handleClick={handleFilterChange}/>
      <h2>Add New</h2>
      <PersonForm submitHandler={addPerson} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} 
        newName={newName} newNumber={newNumber}
      />
      <h2>Numbers</h2>
      <ul>
        {personsFiltered.map(person =>
          <Person 
          key={person.name} 
          person={person} 
          handleDelete={() => removePerson(person.id, person.name)}/>
        )}
      </ul>
    </div>

  )
}

export default App