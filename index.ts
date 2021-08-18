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

const axios = require('axios');
const app = express();
const PORT = 8000;
const API_KEY = 'ded5bd16eed0f94476ad6420e0bf3455'
const GOTHENBURG_COORD = {
    lat: 57.71,
    lon: 11.97,
}

interface RowData {
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

app.get('/', async (req,res) => {

  let temperatures: any = {}

  for (let day = 1; day <= 4; day++) {

    const timestamp = getLastSecondOfDay(getTimestampDaysBeforeToday(day))

    const response = await axios.get(`http://api.openweathermap.org/data/2.5/onecall/timemachine?lat=${GOTHENBURG_COORD.lat}&lon=${GOTHENBURG_COORD.lon}&dt=${timestamp}&units=metric&appid=${API_KEY}`)

    temperatures[getShortDateString(getTimestampDaysBeforeToday(day))] =
              response.data.hourly.map(
                  (hourData: { temp: number; }) => {
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

