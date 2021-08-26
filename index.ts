import express from 'express';

import getWeatherData from './services/getWeatherData'

import {
  createRows,
  extractTemperatures,
  getDate
} from './functions/utils'

import cors from 'cors';

const app = express();
const PORT = 8000;
const GOTHENBURG_COORD = {
  lat: 57.71,
  lon: 11.97,
}

type TemperatureData = {
  [key: string]: number[];
}

function queryParamToNumber(x: any): number | undefined {
  if (typeof x === "string") {
    const parsedX = parseFloat(x)
    if (typeof parsedX === 'number') {
      if (!isNaN(parsedX)) {
        return parsedX
      }
    }
  }
  return undefined
}

app.use(cors());

app.get('/history', async (req,res) => {
  const lat: number = queryParamToNumber(req.query.lat) ?? GOTHENBURG_COORD.lat
  const lon: number = queryParamToNumber(req.query.lon) ?? GOTHENBURG_COORD.lon

  const promises = [1,2,3,4].map(day => getWeatherData(lat, lon, day))
  const allResponses = await Promise.all(promises);

  let temperatures: TemperatureData = {}
  allResponses.forEach((response, index) => {
    temperatures[getDate(index+1)] = extractTemperatures(response)
  });

  const rows = createRows(temperatures)
  res.send(rows)
})

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});

