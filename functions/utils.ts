import { getShortDateString, getTimestampDaysBeforeToday } from "./dateHelpers"
import { average, median } from "./statisticHelpers"
import { ApiHistoryResponse } from "../services/getWeatherHistory"
import { ApiForecastResponse } from "../services/getWeatherForecast"

type TemperatureData = {
    [key: string]: number[];
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

export function createRows(temperatures: TemperatureData): RowData[] {
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
  
export function extractHistoricTemperatures(weatherData: ApiHistoryResponse): number[] {
return weatherData.hourly.map(
    (hourData) => {
        return hourData.temp
    }
)
}

export function extractForecastTemperatures(forecastData: ApiForecastResponse): TemperatureData {
    let temperatures: TemperatureData = {}
    forecastData.list.forEach(hourlyData => {
        const date = getShortDateString(new Date(hourlyData.dt * 1000))
        if (date in temperatures) {
            temperatures[date].push(hourlyData.main.temp)
        } else {
            temperatures[date] = [hourlyData.main.temp]
        }
    });
    return temperatures
}

export function getDate(day: number): string {
const timestamp = getTimestampDaysBeforeToday(day)
return getShortDateString(timestamp)
}