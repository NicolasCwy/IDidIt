import { taskDb } from './taskDb'

export type Task = {
    id: taskId
    name: string
}

export type taskId = string

export async function createTask(name: string): Promise<void> {
    const task = { id: crypto.randomUUID(), name }
    await taskDb.createTask(task)
}

export function getTasks(): Promise<Task[]> {
    return taskDb.getTasks()
}

export function getTask(id: string): Promise<Task> {
    return taskDb.getTask(id)
}

export async function filterTasks(keyword: string): Promise<Task[]> {
    const tasks = await getTasks()
    return tasks.filter((task: Task) => task.name.startsWith(keyword))
}
