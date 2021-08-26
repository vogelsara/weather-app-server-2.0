import { getShortDateString, getTimestampDaysBeforeToday } from "./dateHelpers"
import { average, median } from "./statisticHelpers"

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

type HourlyData = {
    temp: number
}
  
  type ApiResponse = {
    hourly: HourlyData[];
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
  
export function extractTemperatures(weatherData: ApiResponse): number[] {
return weatherData.hourly.map(
    (hourData) => {
        return hourData.temp
    }
)
}

export function getDate(day: number): string {
const timestamp = getTimestampDaysBeforeToday(day)
return getShortDateString(timestamp)
}