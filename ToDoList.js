const addButton = document.getElementById("add-btn");
const taskInput = document.getElementById("task-id");
const editLabel = document.createElement("input");

let tasks = [];
let nextID = 1;

addButton.addEventListener("click", () => {
    addTask()
})

taskInput.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") {
        return;
    }

    addTask();
})

function renderTasks() {

    const taskList = document.getElementById("task-list");
    taskList.innerHTML = "";

    let index = 0;

    while (index < tasks.length) {

        const currentTask = tasks[index];

        const container = document.createElement("div");
        container.classList.add("input-ctn");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.classList.add("task-status");
        checkbox.dataset.id = currentTask.id;

        const label = document.createElement("label");
        label.classList.add("checkbox-label");
        label.textContent = currentTask.taskName;

        if (currentTask.completed) {
            checkbox.checked = true;
            label.style.textDecoration = "line-through white 4px";
        }

        checkbox.addEventListener("change", (event) => {
            let clickedID = Number(event.target.dataset.id);
            let index = 0;
            while (index < tasks.length) {

                if (tasks[index].id === clickedID) {
                    tasks[index].completed = event.target.checked;
                    saveTasks();
                    break;
                }
                index++
            }
            renderTasks();

        })

        const deleteButton = document.createElement("button");
        deleteButton.classList.add('del-btn');
        deleteButton.innerHTML = "<img src='bin.jpeg' class='del-img'/> Delete";
        deleteButton.dataset.id = currentTask.id;

        label.addEventListener("dblclick", () => {
            
            editLabel.classList.add("edit-label");
            editLabel.value = currentTask.taskName;
            label.replaceWith(editLabel);
            editLabel.focus();
            
            editLabel.addEventListener("keydown", (event) => {
                if (event.key !== "Enter") {
                    return;
                }

                else if (editLabel.value === "" || editLabel.value.trim() === "") {
                    return
                }

                else {
                    currentTask.taskName = editLabel.value;
                    saveTasks();
                    renderTasks();
                }
            })
        })

        deleteButton.addEventListener("click", (event) => {

            let clickedID = Number(event.target.dataset.id)
            let index = 0;

            while (index < tasks.length) {
                if (tasks[index].id === clickedID) {
                    tasks.splice(index, 1);
                    saveTasks();
                    break;
                }

                index++
            }
            renderTasks();
        })

        container.appendChild(checkbox);
        container.appendChild(label);
        container.appendChild(deleteButton);
        taskList.appendChild(container);

        index++;
    }
}

function saveTasks() {
    const allTasks = JSON.stringify(tasks);
    localStorage.setItem("tasks", allTasks);
}

function loadTasks() {
    const getTasks = localStorage.getItem("tasks");

    if (getTasks !== null) {
        tasks = JSON.parse(getTasks);
    }

    else {
        return;
    }

    let largestID = 0;
    let index = 0;

    while (index < tasks.length) {
        if (tasks[index].id > largestID) {
            largestID = tasks[index].id
        }
        index++
    }
    nextID = largestID + 1;
}

function addTask() {
    if (taskInput.value === "" || taskInput.value.trim() === "") {
        return;
    }

    let task = {
        id: nextID,
        taskName: taskInput.value,
        completed: false
    }

    tasks.push(task);
    saveTasks();
    nextID++

    taskInput.value = "";
    taskInput.focus();

    renderTasks();
}

loadTasks();
renderTasks();