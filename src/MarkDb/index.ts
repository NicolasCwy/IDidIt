import moment, { Moment } from 'moment'
import { taskId } from '../TaskDb'

type DateStr = string
type Tasks = Record<DateStr, Set<taskId>>

function getCurrentDate() {
    return formatMoment(getCurrentMoment())
}

function getCurrentMoment() {
    return moment()
}

function formatMoment(m: Moment) {
    return m.format('L')
}

function getDatesInPrevious(daysSubstract: number): Moment[] {
    const dates: Moment[] = []
    let newMoment
    for (let remDays = daysSubstract; remDays >= 0; remDays--) {
        newMoment = getCurrentMoment().subtract(remDays, 'days')
        dates.push(newMoment)
    }

    return dates
}

// Inclusive of start and end date
function getDatesBetween(startDate: Moment, endDate: Moment): Moment[] {
    const currDate = startDate.startOf('day')
    endDate = endDate.startOf('day')
    const dates: Moment[] = []

    while (currDate.diff(endDate) <= 0) {
        dates.push(currDate.clone())
        currDate.add(1, 'days')
    }

    return dates
}

class MarkedTasks {
    dateMap: Tasks = {}
    constructor() {}

    addMarkedTask(id: taskId) {
        const today = getCurrentDate()
        this.dateMap[today] = this.dateMap[today] || new Set()

        this.dateMap[today].add(id)
    }

    getMarkedTaskInInterval(startDate: Moment, endDate: Moment): Set<taskId> {
        const intervalDates = getDatesBetween(startDate, endDate)
        const markedTasks: Set<taskId> = new Set()
        intervalDates.forEach((date) =>
            this.getMarkedTaskOnDate(date).forEach((task) =>
                markedTasks.add(task)
            )
        )
        return markedTasks
    }

    getMarkedTaskOnDate(dateMoment: Moment) {
        const date = formatMoment(dateMoment)
        if (!(date in this.dateMap)) {
            return new Set<taskId>()
        }

        return this.dateMap[date]
    }
}

export const markedTaskArray = new MarkedTasks()

export function addMarkedTask(id: taskId) {
    markedTaskArray.addMarkedTask(id)
}

export function getTodaysMarkedTasks() {
    const today = moment()
    return markedTaskArray.getMarkedTaskOnDate(today)
}

export function getMarkedTaskInInterval(startDate: Moment, endDate: Moment) {
    return markedTaskArray.getMarkedTaskInInterval(startDate, endDate)
}
