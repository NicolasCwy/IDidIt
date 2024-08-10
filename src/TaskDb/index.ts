type Task = {
    id: string
    name: string
}

type Id = string

type Tasks = Record<Id, Task>

class TaskArray {
    tasks: Tasks = {}
    constructor() {}

    createTask(name: string) {
        return { id: crypto.randomUUID(), name }
    }

    addTask(task: Task) {
        const id = task.id
        if (id in this.tasks) {
            throw new Error('Task exists')
        }
        this.tasks[id] = task
    }

    getTasks(): Task[] {
        return Object.values(this.tasks)
    }
}

export const taskArray = new TaskArray()

export function addTask(name: string) {
    const newTask: Task = taskArray.createTask(name)
    taskArray.addTask(newTask)
}
