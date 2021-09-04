import axios from "axios"
import {
    getTimestampDaysBeforeToday,
    getLastSecondOfDay,
  } from '../functions/dateHelpers'

import { baseUrl, API_KEY } from './weatherService'

type HistoryHourlyData = {
    temp: number
  }

export type ApiHistoryResponse = {
    hourly: HistoryHourlyData[];
  }

export default async function getWeatherHistory(lat: number, lon: number, day: number): Promise<ApiHistoryResponse> {
  const timestamp = getTimestampDaysBeforeToday(day)
  const timestampEndOfDay = getLastSecondOfDay(timestamp)

  const response = await axios.get<ApiHistoryResponse>(`${baseUrl}/onecall/timemachine?lat=${lat}&lon=${lon}&dt=${timestampEndOfDay}&units=metric&appid=${API_KEY}`)

  return response.data
}