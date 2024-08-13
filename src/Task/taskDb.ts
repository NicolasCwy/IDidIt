import { Task, taskId } from '.'
import { db } from '../Db'

const taskPrefix = '/tasks'

class TaskDb {
    constructor() {}

    async createTask(task: Task): Promise<void> {
        if (await this.hasTask(task.id)) {
            throw new Error('Task exists')
        }

        db.push(taskPrefix, { [task.id]: task }, false)
    }

    hasTask(id: taskId): Promise<boolean> {
        return db.exists(`${taskPrefix}/${id}`)
    }

    getTask(id: taskId): Promise<Task> {
        return db.getObject<Task>(`${taskPrefix}/${id}`)
    }

    async getTasks(): Promise<Task[]> {
        const data = await db.getObject<Record<taskId, Task>>(`${taskPrefix}`)
        return Object.values(data)
    }
}

export const taskDb = new TaskDb()
