import moment, { Moment } from 'moment'

type DateStr = string
type Tasks = Record<DateStr, Set<string>>

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

class MarkedTasks {
    dateMap: Tasks = {}
    constructor() {}

    addMarkedTask(id: string) {
        const today = getCurrentDate()
        this.dateMap[today] = this.dateMap[today] || new Set()

        this.dateMap[today].add(id)
    }

    // Todo allow for custom start and end dates
    getMarkedTaskInInterval(): Set<string> {
        const intervalDates = getDatesInPrevious(7)
        const markedTasks: Set<string> = new Set()
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
            return []
        }

        return this.dateMap[date]
    }
}

export const markedTaskArray = new MarkedTasks()

export function addMarkedTask(id: string) {
    markedTaskArray.addMarkedTask(id)
}

export function getTodaysMarkedTasks() {
    const today = moment()
    return markedTaskArray.getMarkedTaskOnDate(today)
}
