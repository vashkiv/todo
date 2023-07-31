class Task {
    description: string;
    status: string;

    constructor(description: string) {
        this.description = description;
        this.status = 'todo';
    }

    markDone(): void {
        this.status = 'done';
    }

    markTodo(): void {
        this.status = 'todo';
    }

    static fromObject(taskObj: { description: string, status: string }): Task {
        const task: Task = new Task(taskObj.description);
        task.status = taskObj.status;
        return task;
    }
}

class TodoList {
    tasks: Task[];

    constructor() {
        const tasksFromStorage: string | null = localStorage.getItem('tasks');
        this.tasks = tasksFromStorage ? JSON.parse(tasksFromStorage).map(Task.fromObject) : [];
    }

    addTask(description: string): void {
        const task: Task = new Task(description);
        this.tasks.push(task);
        this.saveTasks();
    }

    deleteTask(index: number): void {
        this.tasks.splice(index, 1);
        this.saveTasks();
    }

    saveTasks(): void {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }
}

function renderTasks(todoList: TodoList): void {
    const taskList: HTMLLIElement = document.getElementById('taskList') as HTMLLIElement | null;
    taskList.innerHTML = '';
    const btnClassName: string = 'todo-app__task-btn';

    todoList.tasks.forEach((task: Task, index: number): void => {
        const li: HTMLLIElement = document.createElement('li');
        li.classList.add('todo-app__task-item');
        if (task.status === 'done') li.classList.add('todo-app__task-item--done');

        const descDiv: HTMLDivElement = document.createElement('div');
        descDiv.classList.add('todo-app__task-desc');
        if (task.status === 'done') descDiv.classList.add('todo-app__task-desc--done');
        descDiv.textContent = task.description;

        const btnGroupDiv: HTMLDivElement = document.createElement('div');
        btnGroupDiv.classList.add('todo-app__task-btn-group');

        const doneBtn: HTMLButtonElement = document.createElement('button');
        doneBtn.classList.add(btnClassName);
        doneBtn.classList.add(`${btnClassName}--done`);
        if (task.status === 'done') doneBtn.classList.add(`${btnClassName}--disabled`);
        doneBtn.textContent = 'Done';
        doneBtn.addEventListener('click', (): void => {
            task.markDone();
            renderTasks(todoList);
        });

        const todoBtn: HTMLButtonElement = document.createElement('button');
        todoBtn.classList.add(btnClassName);
        todoBtn.classList.add(`${btnClassName}--todo`);
        if (task.status === 'todo') todoBtn.classList.add(`${btnClassName}--disabled`);
        todoBtn.textContent = 'To Do';
        todoBtn.addEventListener('click', (): void => {
            task.markTodo();
            renderTasks(todoList);
        });

        const deleteBtn: HTMLButtonElement = document.createElement('button');
        deleteBtn.classList.add(btnClassName);
        deleteBtn.classList.add(`${btnClassName}--delete`);
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', (): void => {
            todoList.deleteTask(index);
            renderTasks(todoList);
        });

        btnGroupDiv.appendChild(doneBtn);
        btnGroupDiv.appendChild(todoBtn);
        btnGroupDiv.appendChild(deleteBtn);
        li.appendChild(descDiv);
        li.appendChild(btnGroupDiv);
        taskList.appendChild(li);
    });

    todoList.saveTasks();
}

const todoList: TodoList = new TodoList();

const addTaskBtn: HTMLElement = document.getElementById('addTaskBtn');
addTaskBtn.addEventListener('click', (): void => {
    const taskInput: HTMLInputElement = document.getElementById('taskInput') as HTMLInputElement | null;
    const description: string = taskInput.value.trim();
    if (description !== '') {
        todoList.addTask(description);
        taskInput.value = '';
        renderTasks(todoList);
    }
});

const mobHamBtn: HTMLElement = document.getElementById('mobHam');
mobHamBtn.addEventListener('click', function (): void {
    this.classList.toggle('active');
});

renderTasks(todoList);
