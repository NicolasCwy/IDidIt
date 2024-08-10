import { input } from '@inquirer/prompts'
import { addTask, tasks } from './TaskDb'

async function start() {
    while (true) {
        const taskName = await input({ message: 'task name' })

        addTask(taskName)
        console.log(tasks)
    }
}

start()
