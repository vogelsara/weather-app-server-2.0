export function getShortDateString(timestamp: number): string {
    return new Date(timestamp).toISOString().substring(0, 10)
}

export function getTimestampDaysBeforeToday(days: number): number {
    const now = new Date()
    const todaysDate = now.getDate()
    const pastDaysDate = todaysDate - days
    return new Date().setDate(pastDaysDate)
}

export function getLastSecondOfDay(timestamp: number | Date): number {
    const day = new Date(timestamp)
    const daysLastMilliSecond = day.setHours(23, 59, 59, 999)
    return Math.floor(daysLastMilliSecond / 1000)
}