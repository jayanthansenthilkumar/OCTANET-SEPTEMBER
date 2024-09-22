document.getElementById('addTaskBtn').addEventListener('click', addTask);
document.getElementById('clearCompletedBtn').addEventListener('click', clearCompletedTasks);
document.getElementById('toggleThemeBtn').addEventListener('click', toggleTheme);
document.getElementById('allBtn').addEventListener('click', () => filterTasks('all'));
document.getElementById('activeBtn').addEventListener('click', () => filterTasks('active'));
document.getElementById('completedBtn').addEventListener('click', () => filterTasks('completed'));
document.addEventListener('DOMContentLoaded', loadTasks);

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const prioritySelect = document.getElementById('prioritySelect');
    const dueDateInput = document.getElementById('dueDateInput');
    const taskText = taskInput.value.trim();
    const priority = prioritySelect.value;
    const dueDate = dueDateInput.value;

    if (taskText === "") return;

    const li = createTaskElement(taskText, priority, dueDate);
    document.getElementById('taskList').appendChild(li);
    saveTasks();

    taskInput.value = '';
    dueDateInput.value = '';
}

function createTaskElement(taskText, priority, dueDate) {
    const li = document.createElement('li');
    li.textContent = `${taskText} (Due: ${dueDate})`;
    li.classList.add(priority);

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.className = 'edit-btn';
    editBtn.onclick = function() {
        editTask(li);
    };

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'delete-btn';
    deleteBtn.onclick = function() {
        li.remove();
        saveTasks();
    };

    li.appendChild(editBtn);
    li.appendChild(deleteBtn);
    li.onclick = function() {
        li.classList.toggle('completed');
        saveTasks();
    };

    return li;
}

function editTask(li) {
    const newTask = prompt("Edit your task:", li.childNodes[0].nodeValue);
    if (newTask) {
        li.childNodes[0].nodeValue = newTask;
        saveTasks();
    }
}

function clearCompletedTasks() {
    document.querySelectorAll('#taskList li.completed').forEach(li => li.remove());
    saveTasks();
}

function filterTasks(filter) {
    const tasks = document.querySelectorAll('#taskList li');
    tasks.forEach(task => {
        if (filter === 'all') {
            task.style.display = 'flex';
        } else if (filter === 'active') {
            task.style.display = task.classList.contains('completed') ? 'none' : 'flex';
        } else if (filter === 'completed') {
            task.style.display = task.classList.contains('completed') ? 'flex' : 'none';
        }
    });
}

function saveTasks() {
    const tasks = [];
    document.querySelectorAll('#taskList li').forEach(li => {
        tasks.push({
            text: li.childNodes[0].nodeValue,
            completed: li.classList.contains('completed'),
            priority: Array.from(li.classList).find(cls => ['low', 'medium', 'high'].includes(cls))
        });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        const li = createTaskElement(task.text, task.priority, ''); // Due date not loaded for simplicity
        if (task.completed) li.classList.add('completed');
        document.getElementById('taskList').appendChild(li);
    });
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
}
