import { useState } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [city, setCity] = useState('')
  const [weather, setWeather] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const API_KEY = '4aadde9595d6939d527d394eb553fd3d'
  
  const fetchWeather = async () => {
    if (!city.trim()) {
      setError('Please enter a city name')
      return
    }
    
    try {
      setLoading(true)
      setError(null)
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      )
      setWeather(response.data)
      setCity('')
    } catch (err) {
      setError('City not found. Please check the spelling and try again.')
      setWeather(null)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    fetchWeather()
  }

  const getWeatherEmoji = (condition) => {
    const conditions = {
      Clear: '☀️',
      Clouds: '☁️',
      Rain: '🌧️',
      Snow: '❄️',
      Thunderstorm: '⛈️',
      Drizzle: '🌦️',
      Mist: '🌫️',
      Smoke: '🌫️',
      Haze: '🌫️',
      Dust: '🌫️',
      Fog: '🌫️',
    }
    return conditions[condition] || '🌍'
  }

  return (
    <div className="weather-app">
      <h1>Weather Forecast {getWeatherEmoji(weather?.weather[0]?.main)}</h1>
      
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name..."
          className="search-input"
          disabled={loading}
        />
        <button type="submit" className="search-button" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && <div className="error">{error}</div>}
      
      {weather && (
        <div className="weather-info">
          <h2>{weather.name}, {weather.sys.country}</h2>
          <div className="temperature">
            {Math.round(weather.main.temp)}°C
          </div>
          <div className="weather-condition">
            {weather.weather[0].main}
            <img 
              src={`https://openweathermap.org/img/w/${weather.weather[0].icon}.png`}
              alt={weather.weather[0].description}
            />
          </div>
          <div className="weather-details">
            <div>
              <span>Humidity</span>
              <div>{weather.main.humidity}%</div>
            </div>
            <div>
              <span>Wind Speed</span>
              <div>{weather.wind.speed} m/s</div>
            </div>
            <div>
              <span>Feels Like</span>
              <div>{Math.round(weather.main.feels_like)}°C</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App