import { db } from '../Db'
import { taskId } from '../Task'

const markTaskPrefix = '/markedTasks'

class MarkDb {
    constructor() {}

    createMarkedTask(date: string, taskId: string): Promise<void> {
        return db.push(markTaskPrefix, { [date]: [taskId] }, false)
    }
    getMarkedTasksOnDate(date: string): Promise<taskId[]> {
        return db.getObject<taskId[]>(`${markTaskPrefix}/${date}`)
    }

    hasMarkedTasksOnDate(date: string): Promise<boolean> {
        return db.exists(`${markTaskPrefix}/${date}`)
    }
}

export const markDb = new MarkDb()
