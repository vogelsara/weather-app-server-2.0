import express from 'express';

import {
  createRows,
  extractHistoricTemperatures,
  extractForecastTemperatures,
  getDate
} from './functions/utils'

import cors from 'cors';
import getWeatherHistory from './services/getWeatherHistory';
import getWeatherForecast from './services/getWeatherForecast'

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

  const promises = [1,2,3,4].map(day => getWeatherHistory(lat, lon, day))
  const allResponses = await Promise.all(promises);

  let temperatures: TemperatureData = {}
  allResponses.forEach((response, index) => {
    temperatures[getDate(index+1)] = extractHistoricTemperatures(response)
  });

  const rows = createRows(temperatures)
  res.send(rows)
})

app.get('/forecast', async (req,res) => {
  const lat: number = queryParamToNumber(req.query.lat) ?? GOTHENBURG_COORD.lat
  const lon: number = queryParamToNumber(req.query.lon) ?? GOTHENBURG_COORD.lon

  const response = await getWeatherForecast(lat, lon);

  let temperatures: TemperatureData = extractForecastTemperatures(response)

  const rows = createRows(temperatures)
  res.send(rows)
}
)

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});
