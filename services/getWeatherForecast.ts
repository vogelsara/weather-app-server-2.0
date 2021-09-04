import axios from "axios"
import { baseUrl, API_KEY } from './weatherService'

type ForecastHourlyData = {
    dt: number,
    main: {
        temp: number
    }
  }

export type ApiForecastResponse = {
    list: ForecastHourlyData[];
  }

export default async function getWeatherForecast(lat: number, lon: number): Promise<ApiForecastResponse> {

  const response = await axios.get<ApiForecastResponse>(`${baseUrl}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`)

  return response.data
}

