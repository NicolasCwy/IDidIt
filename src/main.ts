import { input } from '@inquirer/prompts'
import { addTask, taskArray } from './TaskDb'
import prompt from 'inquirer-interactive-list-prompt'

enum Operation {
    addTask = 'add',
    markTask = 'mark',
}

function getOperation(input: string) {
    if (input === 'add' || input == 'mark') {
        return input as Operation
    }

    throw new Error('Invalid Operation')
}

async function start() {
    while (true) {
        const operationStr: string = await prompt({
            message: 'Select an option:',
            choices: [
                { name: 'Add Task', value: 'add', key: 'a' },
                { name: 'Mark task as complete', value: 'mark', key: 'm' },
            ],
        })

        const operation = getOperation(operationStr)

        if (operation === Operation.addTask) {
            const taskName = await input({ message: 'task name' })
            addTask(taskName)
            console.log(taskArray.getTasks())
        }

        if (operation === Operation.markTask) {
            console.log('marking task')
        }
    }
}

start()
