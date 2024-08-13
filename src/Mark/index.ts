import moment, { Moment } from 'moment'
import { taskId } from '../Task'
import { markDb } from './markDb'

export type DateStr = string

function getCurrentDate() {
    return formatMoment(getCurrentMoment())
}

function getCurrentMoment() {
    return moment()
}

function formatMoment(m: Moment) {
    return m.format('DD-MM-YYYY')
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

export async function addMarkedTask(id: taskId): Promise<void> {
    const today = getCurrentDate()
    await markDb.createMarkedTask(today, id)
}

export async function getMarkedTaskInInterval(
    startDate: Moment,
    endDate: Moment
): Promise<Set<taskId>> {
    const intervalDates = getDatesBetween(startDate, endDate)
    const markedTasks: Set<taskId> = new Set()
    for (const date of intervalDates) {
        const taskIds = await getMarkedTaskOnDate(date)
        taskIds.forEach((taskId) => markedTasks.add(taskId))
    }
    return markedTasks
}

async function getMarkedTaskOnDate(dateMoment: Moment): Promise<Set<taskId>> {
    const date = formatMoment(dateMoment)
    if (!(await markDb.hasMarkedTasksOnDate(date))) {
        return new Set<taskId>()
    }
    const tasks = await markDb.getMarkedTasksOnDate(date)
    return new Set(tasks)
}

export function getTodaysMarkedTasks() {
    const today = moment()
    return getMarkedTaskOnDate(today)
}
