import sunny from '../assets/images/sunny.png'
import cloudy from '../assets/images/cloudy.png'
import rainy from '../assets/images/rainy.png'
import snowy from '../assets/images/snowy.png'
import { useState } from 'react'

const WheatherApp = () => {

  const [data, setData] = useState([])
  const [location, setLocation] = useState("")

  const handleInputChanges = (e) => {
    setLocation(e.target.value)
  }

  // Busca latitude e longitude pelo nome da cidade
  const getCoordinates = async (cityName) => {

    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=pt&format=json`

    const response = await fetch(url)

    const data = await response.json()

    if (!data.results || data.results.length === 0) {
      throw new Error('Cidade não encontrada')
    }

    const city = data.results[0]

    return {
      latitude: city.latitude,
      longitude: city.longitude,
      name: city.name,
      country: city.country
    }
  }

  const search = async (cityName) => {

    try {

      // 1. Buscar Coordenadas
      const coordinates = await getCoordinates(cityName)

      console.log("Coordenadas:")
      console.log(coordinates)

      // 2. Pegar a Latitude e Longitude
      const { latitude, longitude } = coordinates

      // 3. Montar URL do Clima
      const url = `
        https://api.open-meteo.com/v1/forecast
        ?latitude=${latitude}
        &longitude=${longitude}
        &current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code
      `.replace(/\s/g, '')

      // 4. Buscar clima
      const response = await fetch(url)

      const weatherData = await response.json()

      console.log('Clima:')
      console.log(weatherData)

      // 5. Salvar os dados no estado data
      setData({
        ...weatherData.current,
        city: coordinates.name,
        country: coordinates.country
      })

    } catch (error) {

      console.error(error.message)

    }
  }

  return (
    <div className="container">

      <div className="weather-app">

        <div className="search">

          <div className="search-top">

            <i className="fa-solid fa-location-dot"></i>

            <div className="location">
              {data ? data.city : 'London'}
            </div>

          </div>

          <div className="search-bar">

            <input
              type="text"
              placeholder="Enter Location"
              value={location}
              onChange={handleInputChanges}
            />

            <i
              className="fa-solid fa-magnifying-glass"
              onClick={() => search(location)}
            ></i>

          </div>

        </div>

        <div className="weather">

          <img src={sunny} alt="sunny" />

          <div className="weather-type">
            Clear
          </div>

          <div className="temp">
            {data ? data.temperature_2m:'28°'}
          </div>

        </div>

        <div className="weather-date">
          <p>Sat, 15 Ago</p>
        </div>

        <div className="weather-data">

          <div className="humidity">

            <div className="data-name">
              Humidity
            </div>

            <i className="fa-solid fa-droplet"></i>

            <div className="data">
              {data
                ? `${data.relative_humidity_2m}%`
                : '35%'
              }
            </div>

          </div>

          <div className="wind">

            <div className="data-name">
              Wind
            </div>

            <i className="fa-solid fa-wind"></i>

            <div className="data">
              {data
                ? `${data.wind_speed_10m} km/h`
                : '3 km/h'
              }
            </div>

          </div>

        </div>

      </div>

    </div>
  )
}

export default WheatherApp