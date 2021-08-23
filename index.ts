import express from 'express';

import getWeatherData from './services/getWeatherData'

import {
  getTimestampDaysBeforeToday,
  getShortDateString,
  getLastSecondOfDay,
} from './functions/dateHelpers'

import {
  average,
  median
} from './functions/statisticHelpers'

import {
  createRows,
  extractTemperatures,
  getDate
} from './functions/utils'

import cors from 'cors';

import axios, { AxiosResponse } from 'axios';

const app = express();
const PORT = 8000;
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
    const response = await getWeatherData(lat, lon, day)
    temperatures[getDate(day)] = extractTemperatures(response)
  }

  res.send(createRows(temperatures));
})

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});

