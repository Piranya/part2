import logo from './logo.svg';
import { useState, useEffect } from 'react'
import axios from 'axios'
import './index.css'
import countryService from './services/Countries'


const Country = (params) => {
 return (
  <li key= {params.name} > 
      {params.name} 
      <button 
      onClick={(event) => params.showDetails(params.name)}>
        Show
      </button>
  </li>
 )
}

const Weather = (params) => {
  // console.log(params)
  if(params.capital!=''){
    const imgsrc = `https://openweathermap.org/img/wn/${params.img}@2x.png`
    // console.log("imgsrc",imgsrc)
        return (
          <div>
            <h1>Weather in {params.capital}</h1>
            <div>temp: {params.temp} F</div>
            <div>wind: {params.speed} m/s</div>
            <img src={imgsrc}/>
          </div>
          )
  }
   
 }

const CountryDetails = (params) => {
    return (
      <div>
          <h1>{params.name}</h1>
          <div>capital: {params.capital}</div>
          <div>area: {params.area}</div>
          <ul>Languages:
          {Object.values(params.languages).map(language =>
          <li key={language}> 
              {language}
           </li>
        )}
          </ul>
          <img src={params.flag}/>
      </div>
     )
 }

const Countries = (params) => {
  const [country, setCountry] = useState('')


  // console.log(params)
  if(params.filteredCountries.length > 9){
    return (
      <div >
        Too many matches ({params.filteredCountries.length}), specify anpther filter
      </div>
    )
  }  
  
  if (params.filteredCountries.length == 1)
 
  { 
    // console.log(params.filteredCountries[0])
    
   
    return (
      <div>
        
            <CountryDetails 
             name={params.filteredCountries[0].name.common}
             capital={params.filteredCountries[0].capital}
             area={params.filteredCountries[0].area}
             languages={params.filteredCountries[0].languages}
             flag={params.filteredCountries[0].flags.png}

            />
            

      </div>
    )
  }
  else {
    return (
    <div>
      <ul>
        {params.filteredCountries.map(country =>
          <Country 
           name={country.name.common} 
           showDetails={params.showDetails}/>
        )}
      </ul>
    </div>
  )
}
}

function App() {
  const [search, setSearch] = useState('')
  const [countries, setCountries] = useState([])
  const [filteredCountries, setFilteredCountries] = useState([])
  const [capital, setCapital] = useState('')
  const [temp, setTemp] = useState('-')
  const [speed, setSpeed] = useState('-')
  const [icon, setIcon] = useState('01d')



  const handleSearchChange = (event) => {
    // console.log(event.target.value)
    // console.log(countries.length)
    const newSearch = event.target.value
    const filteredCountries = countries.filter(
      country => 
      country.name.official.toLowerCase().includes(newSearch.toLowerCase())
    ||
    country.name.common.toLowerCase().includes(newSearch.toLowerCase())
      )
    setFilteredCountries(filteredCountries)
    // console.log(filteredCountries.length)
    setSearch(newSearch)
    setCapital('')
  }

  const showDetails = (name) => {
    // console.log("show details click",name)
    const newSearch = name
    const filteredCountries = countries.filter(
      country => 
      country.name.official.toLowerCase().includes(newSearch.toLowerCase())
    ||
    country.name.common.toLowerCase().includes(newSearch.toLowerCase())
      )
    setFilteredCountries(filteredCountries)
    // console.log(filteredCountries.length)

    
  }
  useEffect( 
    ()=>{
  // console.log('call api')
  countryService
  .getAll()
  .then(returnedCountries => {
    setCountries(returnedCountries)
  })
  .catch(error => {
    console.Console.log('Error')

  })
}, [])

  useEffect( ()=>{
    if(filteredCountries.length==1){
      setCapital(filteredCountries[0].capital)
      countryService
      .getWeather(filteredCountries[0].capitalInfo.latlng[0], filteredCountries[0].capitalInfo.latlng[1])
      .then(currentWeather => {
        // console.log(currentWeather)
        setTemp(currentWeather.main.temp)
        setSpeed(currentWeather.wind.speed)
        setIcon(currentWeather.weather[0].icon)
      })
      .catch(error => {
        console.log('Error')
      })
    }
  }
  , [filteredCountries])



  return (
    <div className="App">
        Find countries <input value={search}
         onChange={handleSearchChange} />
    <Countries filteredCountries={filteredCountries} 
      showDetails={showDetails}
    />
    <Weather 
              capital = {capital}
              temp= {temp}
              speed={speed}
              img={icon}
            />
    </div>

  );
}

export default App;
