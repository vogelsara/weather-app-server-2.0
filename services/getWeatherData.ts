import axios, { AxiosResponse } from "axios"
import {
    getTimestampDaysBeforeToday,
    getShortDateString,
    getLastSecondOfDay,
  } from '../functions/dateHelpers'

type HourlyData = {
    temp: number
  }

type ApiResponse = {
    hourly: HourlyData[];
  }

const baseUrl = 'http://api.openweathermap.org/data/2.5/onecall'
const API_KEY = 'ded5bd16eed0f94476ad6420e0bf3455'

export default async function getWeatherData(lat: number, lon: number, day: number): Promise<AxiosResponse<ApiResponse>> {
  const timestamp = getTimestampDaysBeforeToday(day)
  const timestampEndOfDay = getLastSecondOfDay(timestamp)

  return axios.get<ApiResponse>(`${baseUrl}/timemachine?lat=${lat}&lon=${lon}&dt=${timestampEndOfDay}&units=metric&appid=${API_KEY}`)
}