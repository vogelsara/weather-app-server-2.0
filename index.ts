import express from 'express';

import {
  getTimestampDaysBeforeToday,
  getShortDateString,
  getLastSecondOfDay,
} from './functions/dateHelpers'

import {
  average,
  median
} from './functions/statisticHelpers'

import cors from 'cors';

import axios, { AxiosResponse } from 'axios';

const app = express();
const PORT = 8000;
const API_KEY = 'ded5bd16eed0f94476ad6420e0bf3455'
const GOTHENBURG_COORD = {
  lat: 57.71,
  lon: 11.97,
}

type TemperatureData = {
  [key: string]: number[];
}

type HourlyData = {
  temp: number
}

type ApiResponse = {
  hourly: HourlyData[];
}

type RowData = {
  date: string,
  meanTemperature: number,
  medianTemperature: number,
  minTemperature: number,
  maxTemperature: number
}

function createData(
    date: string,
    meanTemperature: number,
    medianTemperature: number,
    minTemperature: number,
    maxTemperature: number
): RowData {
    return {
        date,
        meanTemperature,
        medianTemperature,
        minTemperature,
        maxTemperature,
    }
}

function queryParamToNumber(x: any): number | undefined {
  if (typeof x === "string") {
    const parsedX = parseInt(x)
    if (typeof parsedX === 'number') {
      if (!isNaN(parsedX)) {
        return parsedX
      }
    }
  }
  return undefined
}

app.use(cors());

const baseUrl = 'http://api.openweathermap.org/data/2.5/onecall'

async function getWeatherData(lat: number, lon: number, day: number): Promise<AxiosResponse<ApiResponse>> {
  const timestamp = getTimestampDaysBeforeToday(day)
  const timestampEndOfDay = getLastSecondOfDay(timestamp)

  return axios.get<ApiResponse>(`${baseUrl}/timemachine?lat=${lat}&lon=${lon}&dt=${timestampEndOfDay}&units=metric&appid=${API_KEY}`)
}

function createRows(temperatures: TemperatureData): RowData[] {
  let rows: RowData[] = []

  Object.keys(temperatures).forEach((date) => {
    rows = rows.concat(
      createData(
        date,
        Math.round(average(temperatures[date]) * 100) / 100,
        Math.round(median(temperatures[date]) * 100) / 100,
        Math.min(...temperatures[date]),
        Math.max(...temperatures[date])
      )
    );
  })

  return rows
}

function extractTemperatures(weatherData: AxiosResponse<ApiResponse>): number[] {
  return weatherData.data.hourly.map(
    (hourData: HourlyData) => {
        return hourData.temp
    }
  )
}

function getDate(day: number): string {
  const timestamp = getTimestampDaysBeforeToday(day)
  return getShortDateString(timestamp)
}

app.get('/', async (req,res) => {
  const lat: number = queryParamToNumber(req.query.lat) ?? GOTHENBURG_COORD.lat
  const lon: number = queryParamToNumber(req.query.lon) ?? GOTHENBURG_COORD.lon  

  let temperatures: TemperatureData = {}

  for (let day = 1; day <= 4; day++) {
    const response = await getWeatherData(lat, lon, day)
    temperatures[getDate(day)] = extractTemperatures(response)
  }

  res.send(createRows(temperatures));
})

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});

