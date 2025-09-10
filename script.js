// TaskFlow - Modern To-Do Manager JavaScript

let tasks = [];
let taskIdCounter = 1;

// Save tasks to localStorage
function saveTasksToStorage() {
    try {
        localStorage.setItem('taskflow_tasks', JSON.stringify(tasks));
        localStorage.setItem('taskflow_counter', taskIdCounter.toString());
        console.log('Tasks saved to localStorage');
    } catch (e) {
        console.warn('Could not save tasks to localStorage:', e);
    }
}

// Load tasks from localStorage
function loadTasksFromStorage() {
    try {
        const savedTasks = localStorage.getItem('taskflow_tasks');
        const savedCounter = localStorage.getItem('taskflow_counter');
        
        if (savedTasks) {
            tasks = JSON.parse(savedTasks);
            console.log('Loaded tasks from localStorage:', tasks);
        }
        
        if (savedCounter) {
            taskIdCounter = parseInt(savedCounter, 10);
            console.log('Loaded counter from localStorage:', taskIdCounter);
        }
    } catch (e) {
        console.warn('Could not load tasks from localStorage:', e);
        tasks = [];
        taskIdCounter = 1;
    }
}

// Load tasks from localStorage on page load
function init() {
    loadTasksFromStorage();
    updateStats();
    renderTasks();
}

// Add new task
function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();
    
    if (taskText === '') {
        taskInput.focus();
        return;
    }

    const newTask = {
        id: taskIdCounter++,
        text: taskText,
        completed: false,
        createdAt: new Date().toISOString()
    };

    tasks.push(newTask);
    taskInput.value = '';
    
    saveTasksToStorage();
    updateStats();
    renderTasks();
    taskInput.focus();
}

// Toggle task completion
function toggleTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        saveTasksToStorage();
        updateStats();
        renderTasks();
    }
}

// Delete task
function deleteTask(taskId) {
    tasks = tasks.filter(t => t.id !== taskId);
    saveTasksToStorage();
    updateStats();
    renderTasks();
}

// Update statistics
function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;

    document.getElementById('totalTasks').textContent = total;
    document.getElementById('completedTasks').textContent = completed;
    document.getElementById('pendingTasks').textContent = pending;
}

// Render tasks list
function renderTasks() {
    const tasksList = document.getElementById('tasksList');
    const emptyState = document.getElementById('emptyState');
    
    if (tasks.length === 0) {
        emptyState.style.display = 'block';
        tasksList.innerHTML = '';
        return;
    }

    emptyState.style.display = 'none';
    
    tasksList.innerHTML = tasks.map(task => `
        <div class="task-item ${task.completed ? 'completed' : ''}">
            <div class="task-checkbox ${task.completed ? 'checked' : ''}" 
                 onclick="toggleTask(${task.id})"></div>
            <div class="task-text ${task.completed ? 'completed' : ''}">${escapeHtml(task.text)}</div>
            <button class="delete-btn" onclick="deleteTask(${task.id})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
}

// Utility function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Handle Enter key press
document.addEventListener('DOMContentLoaded', function() {
    const taskInput = document.getElementById('taskInput');
    if (taskInput) {
        taskInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                addTask();
            }
        });
    }
    
    // Initialize the app
    init();
});