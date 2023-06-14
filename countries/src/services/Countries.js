import axios from 'axios'
const listUrl = 'https://studies.cs.helsinki.fi/restcountries/api/all'
const countryUrl = 'https://studies.cs.helsinki.fi/restcountries/api/name/'
const api_key = process.env.REACT_APP_API_KEY
const weatherURL = 'https://api.openweathermap.org/data/2.5/weather'


const getAll = () => {
    const request = axios.get(listUrl)
    return request.then(response => response.data)
  }

const getCountry = (name) => {
    const request = axios.get(countryUrl+name)
    return request.then(response => response.data)
}

const getWeather = (lat,lon) => {
  const request = axios.get(weatherURL+`?lat=${lat}&lon=${lon}&appid=${api_key}`)
  return request.then(response => response.data)
}

export default { getAll, getCountry, getWeather }
 