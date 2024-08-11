import { input } from '@inquirer/prompts'
import { addTask, Task, taskArray } from './TaskDb'
import prompt from 'inquirer-interactive-list-prompt'
import { select } from 'inquirer-select-pro'
import { addMarkedTask, getTodaysMarkedTasks, markedTaskArray } from './MarkDb'

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
            ],
        })

        const operation = getOperation(operationStr)

        if (operation === Operation.addTask) {
            const taskName = await input({ message: 'task name' })
            addTask(taskName)
            console.log(taskArray.getTasks())
        }

        if (operation === Operation.markTask) {
            const taskIds = await select({
                message: 'select',
                options: async (input) =>
                    !input
                        ? getTaskOptions(taskArray.getTasks())
                        : getTaskOptions(taskArray.filterTasks(input)),
            })
            console.log(taskIds)
            taskIds.forEach((id) => addMarkedTask(id))
            console.log(getTodaysMarkedTasks())
        }
    }
}

start()
