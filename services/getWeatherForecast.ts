import axios from "axios"

type ForecastHourlyData = {
    dt: number,
    main: {
        temp: number
    }
  }

export type ApiForecastResponse = {
    list: ForecastHourlyData[];
  }

const API_KEY = 'ded5bd16eed0f94476ad6420e0bf3455'

export default async function getWeatherForecast(lat: number, lon: number): Promise<ApiForecastResponse> {

  const response = await axios.get<ApiForecastResponse>(`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`)

  return response.data
}

