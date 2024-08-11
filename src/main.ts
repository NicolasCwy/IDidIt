import { input } from '@inquirer/prompts'
import { addTask, filterTasks, getTask, getTasks, Task } from './TaskDb'
import prompt from 'inquirer-interactive-list-prompt'
import { select } from 'inquirer-select-pro'
import {
    addMarkedTask,
    getMarkedTaskInInterval,
    getTodaysMarkedTasks,
} from './MarkDb'
import moment from 'moment'

enum Operation {
    addTask = 'add',
    markTask = 'mark',
    generateTasksDone = 'generate',
}

function getOperation(input: string) {
    if (input === 'add' || input === 'mark' || input === 'generate') {
        return input as Operation
    }

    throw new Error('Invalid Operation')
}

function getTaskOptions(tasks: Task[]) {
    return tasks.map((task) => {
        return {
            name: task.name,
            value: task.id,
        }
    })
}

async function start() {
    while (true) {
        const operationStr: string = await prompt({
            message: 'Select an option:',
            choices: [
                { name: 'Add Task', value: 'add', key: 'a' },
                { name: 'Mark task as complete', value: 'mark', key: 'm' },
                { name: 'Generate tasks done', value: 'generate', key: 'g' },
            ],
        })

        const operation = getOperation(operationStr)

        if (operation === Operation.addTask) {
            const taskName = await input({ message: 'task name' })
            addTask(taskName)
            console.log(getTasks())
        }

        if (operation === Operation.markTask) {
            const taskIds = await select({
                message: 'select',
                options: async (input) =>
                    !input
                        ? getTaskOptions(getTasks())
                        : getTaskOptions(filterTasks(input)),
            })
            taskIds.forEach((id) => addMarkedTask(id))
            console.log(getTodaysMarkedTasks())
        }

        if (operation === Operation.generateTasksDone) {
            const today = moment()
            const startDate = today.clone().subtract(7, 'days')
            const taskIds: Set<string> = getMarkedTaskInInterval(
                startDate,
                today
            )
            const stringBuilder: string[] = []
            taskIds.forEach((id) => {
                stringBuilder.push(getTask(id).name)
            })
            console.log(stringBuilder.join('\n'))
        }
    }
}

start()
