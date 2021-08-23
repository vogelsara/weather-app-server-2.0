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

import axios from 'axios';

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

app.get('/', async (req,res) => {

  const lat: number = queryParamToNumber(req.query.lat) ?? GOTHENBURG_COORD.lat
  const lon: number = queryParamToNumber(req.query.lon) ?? GOTHENBURG_COORD.lon  

  let temperatures: TemperatureData = {}

  for (let day = 1; day <= 4; day++) {

    const timestamp = getTimestampDaysBeforeToday(day)
    const timestampEndOfDay = getLastSecondOfDay(timestamp)

    const response = await axios.get<ApiResponse>(`http://api.openweathermap.org/data/2.5/onecall/timemachine?lat=${lat}&lon=${lon}&dt=${timestampEndOfDay}&units=metric&appid=${API_KEY}`)

    temperatures[getShortDateString(timestamp)] =
              response.data.hourly.map(
                  (hourData: HourlyData) => {
                      return hourData.temp
                  }
              )
  }

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

  res.send(rows);
    
})

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});

