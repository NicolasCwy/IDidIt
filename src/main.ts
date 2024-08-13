import { input } from '@inquirer/prompts'
import {
    taskId,
    Task,
    createTask,
    filterTasks,
    getTask,
    getTasks,
} from './Task'
import prompt from 'inquirer-interactive-list-prompt'
import { select } from 'inquirer-select-pro'
import {
    addMarkedTask,
    getMarkedTaskInInterval,
    getTodaysMarkedTasks,
} from './Mark'
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

type TaskOption = {
    name: string
    value: string
}

function getTaskOptions(tasks: Task[]): TaskOption[] {
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
                {
                    name: 'Generate tasks done',
                    value: 'generate',
                    key: 'g',
                },
            ],
        })

        const operation = getOperation(operationStr)

        if (operation === Operation.addTask) {
            const taskName = await input({ message: 'task name' })
            await createTask(taskName)
            const tasks = await getTasks()
            console.log(tasks)
        }

        if (operation === Operation.markTask) {
            const taskIds = await select({
                message: 'select',
                options: async (input) => {
                    if (!input) {
                        const tasks = await getTasks()
                        return getTaskOptions(tasks)
                    } else {
                        const tasks = await filterTasks(input)
                        console.log(tasks)
                        return getTaskOptions(tasks)
                    }
                },
            })
            for (const id of taskIds) {
                await addMarkedTask(id)
            }

            const taskNames: string[] = []
            for (const id of taskIds.values()) {
                const name = (await getTask(id)).name
                taskNames.push(name)
            }

            console.log(`Marked tasks\n${taskNames.join('\n')}`)
        }

        if (operation === Operation.generateTasksDone) {
            const today = moment()
            const startDate = today.clone().subtract(7, 'days')
            const taskIds: Set<taskId> = await getMarkedTaskInInterval(
                startDate,
                today
            )
            const stringBuilder: string[] = []
            for (const id of taskIds) {
                stringBuilder.push((await getTask(id)).name)
            }
            console.log(stringBuilder.join('\n'))
        }

        console.log('\n')
    }
}

start()
