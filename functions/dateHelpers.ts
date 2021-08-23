export function getShortDateString(timestamp: Date): string {
    return new Date(timestamp).toISOString().substring(0, 10)
}

export function getTimestampDaysBeforeToday(days: number): Date {
    const now = new Date()
    const todaysDate = now.getDate()
    const pastDaysInMs = todaysDate - days
    const pastDaysDate = new Date().setDate(pastDaysInMs)
    return new Date(pastDaysDate)
}

export function getLastSecondOfDay(timestamp: Date): number {
    const day = new Date(timestamp)
    const daysLastMilliSecond = day.setHours(23, 59, 59, 999)
    return Math.floor(daysLastMilliSecond / 1000)
}