import axios from "axios"
import {
    getTimestampDaysBeforeToday,
    getLastSecondOfDay,
  } from '../functions/dateHelpers'

type HistoryHourlyData = {
    temp: number
  }

export type ApiHistoryResponse = {
    hourly: HistoryHourlyData[];
  }

const baseUrl = 'http://api.openweathermap.org/data/2.5/onecall'
const API_KEY = 'ded5bd16eed0f94476ad6420e0bf3455'

export default async function getWeatherHistory(lat: number, lon: number, day: number): Promise<ApiHistoryResponse> {
  const timestamp = getTimestampDaysBeforeToday(day)
  const timestampEndOfDay = getLastSecondOfDay(timestamp)

  const response = await axios.get<ApiHistoryResponse>(`${baseUrl}/timemachine?lat=${lat}&lon=${lon}&dt=${timestampEndOfDay}&units=metric&appid=${API_KEY}`)

  return response.data
}