document.addEventListener('DOMContentLoaded', (event) => {
    const LOCAL_STORAGE_KEY = 'todoListTasks';

    // Initialize with empty tasks array 
    let tasks = [];

    // Save tasks to local storage
    function saveTasks() {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
    }

    // Load tasks from local storage
    function loadTasks() {
        const storedTasks = localStorage.getItem(LOCAL_STORAGE_KEY);
        return storedTasks ? JSON.parse(storedTasks) : [
            { id: 1, name: 'Finish the project by Tuesday at 1pm', status: 'pending' }
        ];
    }

    // Restore tasks from localStorage 
    window.restoreTasks = function() {
        tasks = loadTasks();
        renderTasks();
    };

    // Render tasks in the table
    window.renderTasks = function() {
        const tableBody = document.getElementById('taskTableBody');
        tableBody.innerHTML = '';

        const categorizedTasks = {
            pending: [],
            inProgress: [],
            completed: [],
            deleted: []
        };

        tasks.forEach(task => {
            if (task.status === 'pending') {
                categorizedTasks.pending.push(task);
            } else if (task.status === 'inProgress') {
                categorizedTasks.inProgress.push(task);
            } else if (task.status === 'completed') {
                categorizedTasks.completed.push(task);
            } else if (task.status === 'deleted') {
                categorizedTasks.deleted.push(task);
            }
        });

        const maxRows = Math.max(
            categorizedTasks.pending.length,
            categorizedTasks.inProgress.length,
            categorizedTasks.completed.length,
            categorizedTasks.deleted.length
        );

        for (let i = 0; i < maxRows; i++) {
            const row = tableBody.insertRow();

            // Task Column
            const taskCell = row.insertCell();
            if (categorizedTasks.pending[i]) {
                taskCell.innerHTML = `
                    <span>${categorizedTasks.pending[i].name}</span>
                    <div class="task-buttons">
                        <button class="delete-btn" onclick="deleteTask(${categorizedTasks.pending[i].id})">Delete</button>
                        <button class="progress-btn" onclick="moveToInProgress(${categorizedTasks.pending[i].id})">In Progress</button>
                    </div>
                `;
            } else {
                taskCell.innerHTML = '';
            }

            // In Progress Column
            const inProgressCell = row.insertCell();
            if (categorizedTasks.inProgress[i]) {
                inProgressCell.innerHTML = `
                    <span>${categorizedTasks.inProgress[i].name}</span>
                    <div class="task-buttons">
                        <button class="delete-btn" onclick="deleteTask(${categorizedTasks.inProgress[i].id})">Delete</button>
                        <button class="complete-btn" onclick="markAsCompleted(${categorizedTasks.inProgress[i].id})">Complete</button>
                    </div>
                `;
            } else {
                inProgressCell.innerHTML = '';
            }

            // Completed Task Column
            const completedCell = row.insertCell();
            if (categorizedTasks.completed[i]) {
                completedCell.innerHTML = `<span class="completed-task">${categorizedTasks.completed[i].name}</span>`;
            } else {
                completedCell.innerHTML = '';
            }

            // Deleted Task Column
            const deletedCell = row.insertCell();
            if (categorizedTasks.deleted[i]) {
                deletedCell.innerHTML = `<span class="completed-task">${categorizedTasks.deleted[i].name}</span>`;
            } else {
                deletedCell.innerHTML = '';
            }
        }
    };

    // Function to add a new task
    window.addTask = function() {
        const newTaskInput = document.getElementById('newTaskInput');
        const taskName = newTaskInput.value.trim();

        if (taskName) {
            if (tasks.length === 0) {
                const storedTasks = loadTasks();
                const newId = storedTasks.length > 0 ? Math.max(...storedTasks.map(t => t.id)) + 1 : 1;
                tasks.push({ id: newId, name: taskName, status: 'pending' });
            } else {
                const newId = Math.max(...tasks.map(t => t.id)) + 1;
                tasks.push({ id: newId, name: taskName, status: 'pending' });
            }
            
            newTaskInput.value = '';
            saveTasks(); 
            renderTasks();
        } else {
            alert('Please enter a task!');
        }
    };

    // Move task to 'In Progress'
    window.moveToInProgress = function(id) {
        const taskIndex = tasks.findIndex(task => task.id === id);
        if (taskIndex !== -1) {
            tasks[taskIndex].status = 'inProgress';
            saveTasks(); 
            renderTasks();
        }
    };

    // Mark task as 'Completed'
    window.markAsCompleted = function(id) {
        const taskIndex = tasks.findIndex(task => task.id === id);
        if (taskIndex !== -1) {
            tasks[taskIndex].status = 'completed';
            saveTasks(); 
            renderTasks();
        }
    };

    // Delete task
    window.deleteTask = function(id) {
        const taskIndex = tasks.findIndex(task => task.id === id);
        if (taskIndex !== -1) {
            tasks[taskIndex].status = 'deleted';
            saveTasks(); 
            renderTasks();
        }
    };

    // Function to clear localStorage data
    window.clearStoredTasks = function() {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        tasks = [];
        renderTasks();
    };

    // Initial render when the page loads
    renderTasks();
});