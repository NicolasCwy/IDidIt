import { input } from '@inquirer/prompts'
import { addTask, taskArray } from './TaskDb'

async function start() {
    while (true) {
        const taskName = await input({ message: 'task name' })

        addTask(taskName)
        console.log(taskArray.getTasks())
    }
}

start()
