type Task = {
    name: string
}

export const tasks: Task[] = []

export function addTask(name: string) {
    const newTask: Task = { name }
    tasks.push(newTask)
}
